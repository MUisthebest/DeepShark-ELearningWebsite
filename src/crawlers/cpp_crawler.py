import pandas as pd
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
import urllib3

urllib3.disable_warnings()

url = "https://cplusplus.com/doc/tutorial/"
headers = {"User-Agent": "Mozilla/5.0"}
response = requests.get(url, headers=headers, verify=False)  # Disable SSL verification

driver = webdriver.Chrome()
soup = BeautifulSoup(response.text, "html.parser")
topics = soup.select(".C_doc h4")

data = pd.DataFrame(columns=["topic", "title", "content"])
for topic in topics:
    topic_text = topic.text.strip()
    print(f"Processing topic: {topic_text}")

    ul = topic.find_next_sibling("ul")
    links = [(a.text.strip(), a["href"]) for a in ul.find_all("a", href=True)] if ul else []

    for title, link in links:
        driver.get(url + link)
        page_soup = BeautifulSoup(driver.page_source, "html.parser")
        content = page_soup.select_one(".C_doc")
        if content:
            for table in content.find_all("table", recursive=False):
                table.decompose()
            for a in content.find_all("a", class_="inner"):
                a.decompose()
        data.loc[len(data)] = [topic_text, title, content]
    
# Print results
data.to_csv("courses_data/cplusplus_tutorial.csv", index=False)
