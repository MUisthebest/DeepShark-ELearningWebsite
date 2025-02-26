import pandas as pd
import requests
from bs4 import BeautifulSoup
import urllib3

HOST = 'https://nodejs.org/en/learn/'
url = 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs'

response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')
topics = soup.find_all('section', class_='ProgressionSidebarGroup_group__6Kmnd') 

records = []
for topic in topics:
    topic_text = topic.find(string=True, recursive=False).strip()
    titles = topic.find_all('a')
    
    for title in titles[0:1]:
        title_text = title.text.strip()
        link = title['href']
        
        subres = requests.get(HOST + link)
        subres.encoding = 'utf-8'
        sub_soup = BeautifulSoup(subres.text, 'html.parser')

        # Extract the <main> tag as raw HTML (not prettified)
        main_tag = sub_soup.find('main')
        raw_main_html = str(main_tag) if main_tag else ""
        
        print(raw_main_html)
        # record = {
        #     'topic': topic_text,
        #     'title': title_text,
        #     'content': content
        # }

        # records.append(record)
# df = pd.DataFrame(records)
# df.to_csv('courses_data/nodejs_tutorial.csv', index=False)