from bs4 import BeautifulSoup
import pandas as pd
import requests
import urllib3
from selenium import webdriver

urllib3.disable_warnings()

url = "https://docs.python.org/3/tutorial/"
headers = {"User-Agent": "Mozilla/5.0"}
response = requests.get(url, headers=headers, verify=False)  # Disable SSL verification

driver = webdriver.Chrome()
soup = BeautifulSoup(response.text, "html.parser")
topics = soup.select(".toctree-l1")

data = pd.DataFrame(columns=["topic", "content"])
for topic in topics:

    links = [a["href"] for a in topic.find_all("a", href=True, recursive=False)]

    for link in links:
        driver.get(url + link)
        page_soup = BeautifulSoup(driver.page_source, "html.parser")
        content = page_soup.select_one(".document")
        
        data.loc[len(data)] = [topic.text.strip(), content]
        
data.to_csv("python_tutorial.csv", index=False)