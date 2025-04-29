from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import os

finetuned_modelSBERT = SentenceTransformer("BanhMiKepThit015/Deepshark-Paraphrase-MiniLM-v2")

def load_model():
    return finetuned_modelSBERT

# Hàm để tính toán embedding cho câu truy vấn
def get_query_embedding(query):
    global finetuned_modelSBERT 
    query_embedding = finetuned_modelSBERT.encode(query)
    return query_embedding

