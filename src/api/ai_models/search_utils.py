from api.models.user import CategoryEmbedding, ArxivPaper, StackOverflowQuestion
from api.settings import db
import numpy as np
from sqlalchemy import text



def calculate_cosine_similarity(vector1, vector2):
    vector1 = np.array(vector1)
    vector2 = np.array(vector2)
    dot_product = np.dot(vector1, vector2)
    norm_vector1 = np.linalg.norm(vector1)
    norm_vector2 = np.linalg.norm(vector2)
    
    if norm_vector1 == 0 or norm_vector2 == 0:
        return 0.0 
    return dot_product / (norm_vector1 * norm_vector2)


def find_best_category(query_embedding):
    query_embedding = np.array(query_embedding)
    category_embeddings = CategoryEmbedding.query.all()
    
    best_category = None
    best_similarity = -1 

    for category_embedding in category_embeddings:
        category_embedding_vector = np.array(category_embedding.avg_embedding)
        
        similarity = calculate_cosine_similarity(query_embedding, category_embedding_vector)
        
        if similarity > best_similarity:
            best_similarity = similarity
            best_category = category_embedding.category 

    return best_category


# def find_top_papers(query_embedding, best_category):
#     query_embedding = np.array(query_embedding)
#     papers_in_category = ArxivPaper.query.filter_by(category=best_category).all()
    
#     similarities = []
#     for paper in papers_in_category:
#         paper_embedding = np.array(paper.vector_embedding)
        
#         similarity = calculate_cosine_similarity(query_embedding, paper_embedding)
#         similarities.append((paper, similarity))
#     similarities.sort(key=lambda x: x[1], reverse=True)
#     top_20_papers = [paper for paper, _ in similarities[:20]]
#     return top_20_papers




def find_top_papers(query_embedding, best_category):
    if isinstance(query_embedding, np.ndarray):
        query_embedding = query_embedding.tolist()

    stmt = text("""
        SELECT
            title,
            link,
            abstract
        FROM arxiv_papers
        WHERE category = :category
        ORDER BY vector_embedding <-> (:emb)::vector
        LIMIT 20
    """)
    
    rows = db.session.execute(stmt, {
        "category": best_category,
        "emb": query_embedding
    }).fetchall()

    return rows