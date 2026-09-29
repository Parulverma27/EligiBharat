"""Download the scheme dataset CSV into data/raw/."""
import urllib.request
import config

config.DATA_CSV.parent.mkdir(parents=True, exist_ok=True)
if config.DATA_CSV.exists():
    print(f"Already downloaded: {config.DATA_CSV}")
else:
    print("Downloading dataset (about 16 MB)...")
    urllib.request.urlretrieve(config.DATASET_URL, config.DATA_CSV)
    print(f"Saved to {config.DATA_CSV}")
