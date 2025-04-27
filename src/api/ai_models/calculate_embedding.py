from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import os

model_path = os.path.join(os.path.dirname(__file__), 'finetune-model')  
finetuned_modelSBERT = SentenceTransformer(model_path)  

def load_model():
    return finetuned_modelSBERT

# Hàm để tính toán embedding cho câu truy vấn
def get_query_embedding(query):
    global finetuned_modelSBERT  # Sử dụng model đã được load từ trước
    query_embedding = finetuned_modelSBERT.encode(query)
    return query_embedding

# def calculate_cosine_similarity(query_embedding, target_embedding):
#     return cosine_similarity([query_embedding], [target_embedding])[0][0]