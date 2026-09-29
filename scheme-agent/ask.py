"""Ask questions about the indexed schemes. Baseline RAG with citations.

Examples:
    python ask.py "Which scheme gives financial help to farmers?"
    python ask.py                      # interactive mode
    python ask.py "documents needed for scholarship" --state Bihar
"""
import argparse
import sys

import chromadb
import ollama

import config
import utils

# FIX 1 (Windows): the default console encoding (cp1252) cannot print the rupee sign or Hindi.
# Forcing UTF-8 here means we no longer need to set PYTHONIOENCODING by hand.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

SYSTEM_PROMPT = """You are a careful assistant that answers questions about Indian government schemes.
Rules:
1. Use ONLY the numbered context passages below. Do not use outside knowledge.
2. If the passages do not contain the answer, say you do not have enough information and suggest checking the official link.
3. Cite the passages you used like [1], [2].
4. Never guess numbers, ages or income limits. Quote them exactly as written in the passages.
5. Keep each scheme separate: never mix conditions or documents of different schemes together. Name the scheme for every fact.
6. Reply in the same language as the question."""


def retrieve(col, question: str, top_k: int, state: str | None):
    where = {"state": state} if state else None
    q_emb = utils.embed_texts([question])
    res = col.query(query_embeddings=q_emb, n_results=top_k, where=where)
    return list(zip(res["documents"][0], res["metadatas"][0], res["distances"][0]))


def answer(col, question: str, top_k: int, state: str | None):
    hits = retrieve(col, question, top_k, state)

    # FIX 2: drop chunks that are too far from the question. Off-topic questions
    # (like "capital of France") now stop here, without wasting a slow LLM call.
    relevant = [h for h in hits if h[2] <= config.MAX_DISTANCE]
    if not relevant:
        print("\nI could not find anything relevant to this question in the indexed schemes.")
        if hits:
            print(f"(closest match had distance {hits[0][2]:.3f}, cutoff is {config.MAX_DISTANCE})")
        return
    hits = relevant

    context = "\n\n".join(f"[{i}] {doc}" for i, (doc, _, _) in enumerate(hits, 1))
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Context passages:\n{context}\n\nQuestion: {question}"},
    ]

    print("\nAnswer:\n")
    last = None
    for part in ollama.chat(
        model=config.LLM_MODEL, messages=messages, stream=True,
        options={
            "temperature": 0,
            "num_ctx": 4096,
            "num_predict": config.MAX_NEW_TOKENS,     # FIX 3: hard cap on answer length
            "repeat_penalty": config.REPEAT_PENALTY,  # FIX 4: discourage repetition loops
        },
    ):
        print(part["message"]["content"], end="", flush=True)
        last = part
    if last is not None and getattr(last, "done_reason", None) == "length":
        print("\n[answer was cut off at the length limit]", end="")

    print("\n\nSources:")
    for i, (_, meta, dist) in enumerate(hits, 1):
        print(f"  [{i}] {meta['scheme']} | {meta['section']} | {meta['state']} "
              f"(distance {dist:.3f})\n      {meta['url']}")
    print()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("question", nargs="?")
    ap.add_argument("--top-k", type=int, default=config.TOP_K)
    ap.add_argument("--state", default=None, help="exact State / UT / Ministry value to filter on")
    args = ap.parse_args()

    client = chromadb.PersistentClient(path=str(config.CHROMA_DIR))
    col = client.get_collection(config.COLLECTION_NAME)

    if args.question:
        answer(col, args.question, args.top_k, args.state)
    else:
        print("Interactive mode. Type 'exit' to quit.")
        while True:
            q = input("\nYou: ").strip()
            if q.lower() in {"exit", "quit", ""}:
                break
            answer(col, q, args.top_k, args.state)


if __name__ == "__main__":
    main()
