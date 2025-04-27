from api.models.user import CategoryEmbedding, ArxivPaper
# from api.ai_models.calculate_embedding import calculate_cosine_similarity
import numpy as np

# Hàm tìm category gần nhất với câu truy vấn
def calculate_cosine_similarity(vector1, vector2):
    vector1 = np.array(vector1)
    vector2 = np.array(vector2)
    dot_product = np.dot(vector1, vector2)
    norm_vector1 = np.linalg.norm(vector1)
    norm_vector2 = np.linalg.norm(vector2)
    
    if norm_vector1 == 0 or norm_vector2 == 0:
        return 0.0  # Tránh chia cho 0
    return dot_product / (norm_vector1 * norm_vector2)


# Hàm tìm category gần nhất với câu truy vấn
def find_best_category(query_embedding):
    # Chuyển query_embedding thành numpy array để sử dụng trong tính toán
    query_embedding = np.array(query_embedding)
    
    # Tìm tất cả các category embeddings
    category_embeddings = CategoryEmbedding.query.all()
    
    best_category = None
    best_similarity = -1  # Mặc định là không có sự tương đồng

    for category_embedding in category_embeddings:
        # Chuyển avg_embedding thành numpy array
        category_embedding_vector = np.array(category_embedding.avg_embedding)
        
        # Tính cosine similarity giữa câu truy vấn và category embedding
        similarity = calculate_cosine_similarity(query_embedding, category_embedding_vector)
        
        if similarity > best_similarity:
            best_similarity = similarity
            best_category = category_embedding.category  # Lưu lại category có similarity cao nhất

    return best_category


# Hàm tìm các bài báo có vector_embedding gần nhất với câu truy vấn
def find_top_papers(query_embedding, best_category):
    # Chuyển query_embedding thành numpy array để sử dụng trong tính toán
    query_embedding = np.array(query_embedding)
    
    # Lọc bài báo theo category
    papers_in_category = ArxivPaper.query.filter_by(category=best_category).all()
    
    similarities = []
    for paper in papers_in_category:
        # Chuyển vector_embedding của bài báo thành numpy array
        paper_embedding = np.array(paper.vector_embedding)
        
        # Tính cosine similarity giữa câu truy vấn và vector_embedding của bài báo
        similarity = calculate_cosine_similarity(query_embedding, paper_embedding)
        similarities.append((paper, similarity))

    similarities.sort(key=lambda x: x[1], reverse=True)
    top_20_papers = [paper for paper, _ in similarities[:20]]

    return top_20_papers