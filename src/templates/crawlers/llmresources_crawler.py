from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import csv
import os
import re
from bs4 import BeautifulSoup
from urllib.parse import urlparse

def sanitize_filename(filename):
    return re.sub(r'[\/:*?"<>|]', '_', filename)

def get_favicon_url(url):
    domain = urlparse(url).netloc
    return f"https://{domain}/favicon.ico"

options = Options()
options.add_argument("--headless")
options.add_argument("--disable-gpu")
options.add_argument("--window-size=1920x1080")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=options)

driver.get('https://llmresourceshub.vercel.app/')

WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.TAG_NAME, 'h3')))
WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.TAG_NAME, 'ul')))
WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'li.flex.items-center')))

page_source = driver.page_source
driver.quit()

soup = BeautifulSoup(page_source, 'html.parser')

output_folder = 'llm_resources'
os.makedirs(output_folder, exist_ok=True)

csv_files = {}

target_class_parts = ["space-y-2", "sm:space-y-2.5", "max-h-[240px]", "sm:max-h-[280px]", "overflow-y-auto", "pr-2", "custom-scrol"]

for h3 in soup.find_all('h3'):
    section_title = sanitize_filename(h3.text.strip())
    csv_files[section_title] = csv_files.get(section_title, -1) + 1
    if csv_files[section_title] > 0:
        section_title = f"{section_title}_{csv_files[section_title]}"
    csv_filename = os.path.join(output_folder, f"{section_title}.csv")

    parent_div = h3.parent
    section_container = None

    for ul in parent_div.find_all('ul', recursive=True):
        if any(part in ul.get('class', []) for part in target_class_parts):
            section_container = ul
            break

    if not section_container:
        next_elem = h3.parent.find_next_sibling()
        while next_elem and (next_elem.name != 'div' or not next_elem.find('h3')):
            if next_elem.name == 'ul' and any(part in next_elem.get('class', []) for part in target_class_parts):
                section_container = next_elem
                break
            next_elem = next_elem.find_next_sibling()

    if not section_container:
        continue

    data = []
    for li in section_container.find_all('li', class_='flex'):
        link = li.find('a', href=True)
        if not link:
            continue
        link_title = link.text.strip() or "No Title"
        href = link['href']

        img_tag = li.find('img')
        svg_tag = li.find('svg')
        icon_url = img_tag['src'] if img_tag and img_tag.get('src') else ('SVG Icon' if svg_tag else get_favicon_url(href))

        data.append([link_title, href, icon_url])

    if data:
        with open(csv_filename, 'w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(['Link Title', 'URL', 'Icon'])
            writer.writerows(data)
