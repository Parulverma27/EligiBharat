"""Small shared helpers: cleaning, chunking, embedding."""
import re
import pandas as pd
import ollama
import config


def clean(value) -> str:
    """Turn NaN/None into '' and tidy whitespace."""
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return ""
    text = str(value).replace("\r", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def split_text(text: str, size: int = config.CHUNK_CHARS, overlap: int = config.CHUNK_OVERLAP):
    """Split text into ~size-char chunks, preferring paragraph/sentence boundaries."""
    text = clean(text)
    if not text:
        return []
    if len(text) <= size:
        return [text]

    chunks, start = [], 0
    while start < len(text):
        end = min(start + size, len(text))
        if end < len(text):
            # look back for a natural break inside the last 30% of the window
            window_start = start + int(size * 0.7)
            cut = max(
                text.rfind("\n", window_start, end),
                text.rfind(". ", window_start, end),
            )
            if cut != -1:
                end = cut + 1
        chunks.append(text[start:end].strip())
        if end >= len(text):
            break
        start = max(end - overlap, start + 1)
    return [c for c in chunks if c]


def embed_texts(texts):
    """Embed a list of strings with the local Ollama embedding model."""
    resp = ollama.embed(model=config.EMBED_MODEL, input=list(texts))
    return resp["embeddings"]
