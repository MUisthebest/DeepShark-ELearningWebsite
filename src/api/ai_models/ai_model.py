import os
import textwrap
import google.generativeai as genai
from IPython.display import Markdown


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# 
def summarize_text(user_message):
    try:
        return f"Summarize for {user_message}" if user_message else "No input data"
    except Exception as e:
        return "Error processing your request."





def predict(user_message):
    try:
        # model = genai.GenerativeModel('gemini-2.0-flash')  
        # response = model.generate_content(user_message)  
        # return to_markdown(response.text)  
        return user_message
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return "Error processing your request."