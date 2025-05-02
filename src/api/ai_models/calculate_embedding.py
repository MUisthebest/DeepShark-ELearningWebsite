from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import os

finetuned_modelSBERT = None

def load_model():
    global finetuned_modelSBERT 
    if finetuned_modelSBERT is None:
        finetuned_modelSBERT  = SentenceTransformer("BanhMiKepThit015/Deepshark-Paraphrase-MiniLM-v2")
    return finetuned_modelSBERT

def get_query_embedding(query):
    finetuned_modelSBERT = load_model()
    query_embedding = finetuned_modelSBERT.encode(query)
    return query_embedding

