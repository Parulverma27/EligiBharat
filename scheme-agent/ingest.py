"""Chunk the schemes, embed them, and store them in ChromaDB.

Examples:
    python ingest.py --limit 100     # random sample of 100 schemes (fast, recommended first)
    python ingest.py --all           # everything (slow on CPU, run overnight)
"""
import argparse
import chromadb
import pandas as pd
from tqdm import tqdm

import config
import utils


def build_chunks(df: pd.DataFrame):
    """Yield (id, text, metadata) for every section chunk of every scheme."""
    for _, row in df.iterrows():
        name = utils.clean(row[config.COL_NAME])
        slug = utils.clean(row[config.COL_SLUG])
        state = utils.clean(row[config.COL_STATE])
        level = utils.clean(row[config.COL_LEVEL])
        url = utils.clean(row[config.COL_URL])

        for label, column in config.SECTIONS.items():
            for i, piece in enumerate(utils.split_text(row[column])):
                # The header is part of the embedded text so the scheme name helps retrieval.
                text = f"Scheme: {name} ({state}) | Section: {label}\n{piece}"
                meta = {
                    "scheme": name, "slug": slug, "state": state,
                    "level": level, "section": label, "url": url,
                }
                yield f"{slug}::{label}::{i}", text, meta


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=100, help="number of schemes to index")
    ap.add_argument("--all", action="store_true", help="index all schemes")
    ap.add_argument("--seed", type=int, default=42)
    args = ap.parse_args()

    df = pd.read_csv(config.DATA_CSV, encoding="utf-8-sig")
    print(f"Loaded {len(df)} schemes.")
    if not args.all:
        df = df.sample(n=min(args.limit, len(df)), random_state=args.seed)
        print(f"Using a random sample of {len(df)} schemes (seed={args.seed}).")

    client = chromadb.PersistentClient(path=str(config.CHROMA_DIR))
    col = client.get_or_create_collection(
        config.COLLECTION_NAME, metadata={"hnsw:space": "cosine"}
    )
    done = set(col.get(include=[])["ids"])  # lets you stop and resume safely

    todo = [c for c in build_chunks(df) if c[0] not in done]
    print(f"{len(todo)} new chunks to embed ({len(done)} already stored).")

    for start in tqdm(range(0, len(todo), config.EMBED_BATCH), desc="Embedding"):
        batch = todo[start:start + config.EMBED_BATCH]
        ids, texts, metas = zip(*batch)
        col.add(
            ids=list(ids),
            documents=list(texts),
            metadatas=list(metas),
            embeddings=utils.embed_texts(texts),
        )
    print(f"Done. Collection now holds {col.count()} chunks.")


if __name__ == "__main__":
    main()
