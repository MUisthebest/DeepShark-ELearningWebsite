import os
import textwrap
import google.generativeai as genai
import markdown
from IPython.display import Markdown
from markdown_it import MarkdownIt



GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

def summarize_text(user_message):
    model = genai.GenerativeModel('gemini-2.0-flash')  
    summarize_text = f"Summarize this text under 7 words: {user_message}"
    print(summarize_text)
    response = model.generate_content(summarize_text)  
    return response.text if response else user_message


# def to_markdown(text):
#     return 

def to_markdown(text):
    html_output = markdown.markdown(text, extensions=['tables', 'fenced_code'])
    # md = MarkdownIt()
    # html_output = md.render(text)
    return html_output





def predict(user_message):
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')  
        response = model.generate_content(user_message)  
        bot_response = response.text
        bot_response = to_markdown(bot_response)
        return bot_response if bot_response else "I'm sorry, I don't understand."
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return "Error processing your request Predict"