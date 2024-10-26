# REF: https://www.kaggle.com/code/azraimohamad/coursera-course-scraping
from bs4 import BeautifulSoup
import requests
import logging
import json
class WebCoursesScrapperManager:
    def __init__(self, url):
        self.url = url
        self.courses_dict = {}
    
    def scrape_url(self):
        logging.warning("Scraping now")
        for i in range(1,50):
            page = requests.get(self.url + str(i))
            self.__scrape_helper(page=page,html_tag='h3',course_dict_key="course_title", tag_class='cds-CommonCard-title css-6ecy9b')
        logging.warning("Scarped done")

    def get_courses_dict(self):
        return self.courses_dict
    
    def __scrape_helper(self, page, html_tag, course_dict_key, tag_class, div_class=None):
            """
            Helper function to scrape specific elements from a webpage and store the result in a dictionary.

            Parameters:
            ----------
            page: str
                Page to scrape
            html_tag : str
                The HTML tag to target, such as "h1", "h2", etc., that contains the data to be scraped.
                
            course_dict_key : str
                The key that will be created in `self.courses_dict`. The scraped data will be stored as the value for this key.

            tag_class : str
                The class name of the target HTML tag (e.g., "course-title", "course-description"). This is used to filter the elements being scraped.

            div_class : str, optional
                The class name of a specific div tag to further narrow down the target elements. If provided, the function will prioritize scraping within this div tag, and `html_tag` will be set to 'div'.

            Returns:
            -------
            None

            Example:
            -------
            If you want to scrape all h2 elements with the class "course-title" and store the data under the key "title", call:
                __scrape_helper("h2", "title", "course-title")
            If you want to scrape div elements with the class "course-details" and store the data under the key "details", call:
                __scrape_helper("div", "details", "course-details")
            """
            soup = BeautifulSoup(page.content, 'html.parser')
            name, class_ = None, None
            if div_class:
                name = 'div'
                class_ = div_class
            else:
                name = html_tag
                class_ = tag_class

            elements = soup.find_all(name,  class_ = class_)
            if (len(elements)) != 12:  
                for _ in range(0,12):    # There are 12 courses per page
                    self.__dict_helper(course_dict_key, None)
                return
            else:
                for element in elements:
                    x = element.get_text()
                    logging.warning(f"Appending into {course_dict_key}, value: {x}")
                    if x:
                        self.__dict_helper(course_dict_key, x)
                    else:
                        self.__dict_helper(course_dict_key, None)


    
    def __dict_helper(self, key, value):
        if key not in self.courses_dict:
            self.courses_dict[key] = []
        self.courses_dict[key].append(value)

    def __str__(self):
        return f"{self.courses_dict}"
    
    def output_json(self):
        with open('scraped_data.json', 'w') as outfile:
            json.dump(self.courses_dict, outfile, indent=4)