import pandas as pd
import requests
from bs4 import BeautifulSoup
import urllib3

HOST = 'https://nodejs.org'
url = 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs'

response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')
topics = soup.find_all('section', class_='ProgressionSidebarGroup_group__6Kmnd') 

records = []
for topic in topics:
    topic_text = topic.find(string=True, recursive=False).strip()
    titles = topic.find_all('a')
    
    for title in titles:
        title_text = title.text.strip()
        link = title['href']
        suburl = HOST + link
        print(suburl)
        subres = requests.get(suburl)
        sub_soup = BeautifulSoup(subres.text, 'html.parser')
        content = sub_soup.find('main')
        if content:
            for button in content.find_all('button'):
                button.decompose()
            content.find('div', class_='mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2').decompose()
        record = {
            'topic': topic_text,
            'title': title_text,
            'content': sub_soup.find('main').prettify()
        }
        
        records.append(record)
df = pd.DataFrame(records)
df.to_csv('courses_data/nodejs_tutorial.csv', index=False)