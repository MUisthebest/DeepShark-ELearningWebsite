import requests

HUGGINGFACE_API_TOKEN = "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"

API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/BanhMiKepThit015/Deepshark-Paraphrase-MiniLM-v2"

headers = {
    "Authorization": f"Bearer {HUGGINGFACE_API_TOKEN}"
}

def get_query_embedding(query):
    payload = {
        "inputs": query
    }
    response = requests.post(API_URL, headers=headers, json=payload)
    response.raise_for_status()  # Nếu lỗi API sẽ raise Exception
    return response.json()  # Đây chính là embedding (list số)