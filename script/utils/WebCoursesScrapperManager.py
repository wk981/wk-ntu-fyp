# REF: https://www.kaggle.com/code/azraimohamad/coursera-course-scraping
from bs4 import BeautifulSoup
import requests
import logging
import json
import re
import pandas as pd

learning_product_list = [
    "Guided Project",
    "Course",
    "Project",
    "Specialization",
    "Professional Certificate",
    "MasterTrack Certificate",
    "Degree",
    "Postgraduate Diploma",
    "Graduate Certificate",
    "University Certificate"
]

difficulty_list = ["Beginner", "Intermediate", "Advanced", "Mixed"]
class WebCoursesScrapperManager:
    def __init__(self, url):
        self.url = url
        self.courses_data = []

    def scrape_coursera(self):
        for i in range(1,85):
            logging.warning(f'Scraping page {i}')
            self._scrape_coursera_page(self.url+str(i))
    
    def _scrape_coursera_page(self,url):
        page = requests.get(url)
        soup = BeautifulSoup(page.content, 'html.parser')

        # Find the main container div
        logging.warning(f'Scraping course cards')
        cards = soup.find_all('div', class_='cds-CommonCard-clickArea')
        logging.warning(f'Done scraping cards')
        if cards:
            logging.warning(f'Scraping features now')
            for card in cards:
                course_data = {}
                title = card.find('h3', class_='cds-CommonCard-title')
                course_data['title'] = title.get_text(strip=True) if title else None

                skills = card.find('div', class_='cds-ProductCard-body')
                data = None
                if skills:
                    skills_list = skills.get_text(strip=True).replace('Skills you\'ll gain:', '').split(', ')
                    data = ', '.join(skills_list)  # Joining the list into a string separated by commas
                course_data['skills'] = data

                organization = card.find('p', class_="cds-ProductCard-partnerNames css-vac8rf")
                course_data['organization'] = organization.get_text(strip=True) if organization else None

                rating = card.find('span',class_='css-6ecy9b')
                course_data['rating'] = rating.get_text(strip=True) if rating else None

                reviews = card.find('div', class_='css-vac8rf')
                course_data['reviews'] = self._convert_reviews(reviews.get_text(strip=True).lower()) if reviews else None

                metadata = card.find('div', class_='cds-CommonCard-metadata')
                metadata_text = metadata.get_text(strip=True)
                metadata_list = self._clean_metadata(metadata_text)
                metadata_category = self._handle_metadata_category(metadata_list)
                course_data['difficulty'] = metadata_category.get('difficulty', None)
                course_data['learning_product'] = metadata_category.get('learning_product', None)
                course_data['duration'] = metadata_category.get('duration', None)

                course_link = card.find('a', class_='cds-CommonCard-titleLink')
                course_data['link'] = f"https://www.coursera.org{course_link['href']}" if course_link else None

                self.courses_data.append(course_data)
                logging.warning(f'Finished scraping features')

    def _convert_reviews(self,review):
        if 'k' in review:
            # Extract the number and multiply by 1000
            num = int(re.findall(r'\d+', review)[0]) * 1000
            return num
        elif review.isdigit():
            # For cases without 'K'
            return int(review)
        else:
            # For "None" or other non-numeric cases
            return None

    def _clean_metadata(self,metadata_text):
        res = []
        temp = ""
        for char in metadata_text:
            if char != "·":
                temp += char
            else:
                # Strip whitespace around each section and add to the result list
                res.append(temp.strip())
                temp = ""
        # Add the last segment after the loop ends
        if temp:
            res.append(temp.strip())
        return res


    def _handle_metadata_category(self,metadata_list):
        # Initialize course_data with None for missing values
        course_data = {
            'learning_product': None,
            'difficulty': None,
            'duration': None
        }

        for metadata in metadata_list:
            metadata_lower = metadata.lower()

            # Check for matches in lowercase lists
            if metadata_lower in [item.lower() for item in learning_product_list]:
                course_data['learning_product'] = metadata
            elif metadata_lower in [item.lower() for item in difficulty_list]:
                course_data['difficulty'] = metadata
            else:
                course_data['duration'] = metadata

        return course_data
    
    def __str__(self):
        return f"{self.courses_data}"
    
    def output_df_excel(self):
        logging.warning(f'Converting to dataframe and saving as xlsx')
        pd.DataFrame(self.courses_data).to_excel("course_data.xlsx", index=False, sheet_name="Course Data")
        logging.warning(f'Finished convertion')