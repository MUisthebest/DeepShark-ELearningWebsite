import os
import textwrap
import google.generativeai as genai
import markdown
from markdown_it import MarkdownIt



GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel('gemini-2.0-flash')  



def summarize_text(user_message):
    summarize_text = f"Tóm tắt văn bản sau dưới 7 từ:\n{user_message}"
    response = model.generate_content(summarize_text)  
    return response.text if response.text else user_message

def to_markdown(text):
    html_output = markdown.markdown(text, extensions=['tables', 'fenced_code'])
    return html_output





def predict(user_message):
    try:
        response = model.generate_content(user_message)  
        bot_response = response.text
        bot_response = to_markdown(bot_response)
        return bot_response if bot_response else "I'm sorry, I don't understand."
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return "Error processing your request Predict"
    



def review_code(code, language="unknown"):
    """
    Hàm chuyên biệt để review code bằng Gemini API.
    Args:
        code (str): Đoạn code cần review.
        language (str): Ngôn ngữ lập trình của code (nếu biết).
    Returns:
        str: Kết quả review dưới dạng markdown.
    """
    try:
        prompt = f"""
        Bạn là một chuyên gia lập trình {language if language != "unknown" else ""}. 
        Hãy review đoạn code sau và đưa ra nhận xét chi tiết:
        - Kiểm tra lỗi cú pháp.
        - Đưa ra gợi ý tối ưu hóa.
        - Chỉ ra các vấn đề tiềm ẩn (nếu có).
        - Đề xuất cách cải thiện code.
        
        Đây là đoạn code:
        {code}
    """
        response = model.generate_content(prompt)
        review_result = response.text
        review_result = to_markdown(review_result)
        return review_result if review_result else "Không thể review code."
    except Exception as e:
        print(f"Error calling Gemini API in review_code: {e}")
        return "Error processing your code review request."