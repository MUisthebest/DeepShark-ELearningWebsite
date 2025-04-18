import os
import textwrap
import google.generativeai as genai
from IPython.display import Markdown


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# 

def predict(user_message):
    try:
        # model = genai.GenerativeModel('gemini-2.0-flash')  
        # response = model.generate_content(user_message)  
        # return to_markdown(response.text)  
        return user_message
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return "Error processing your request."