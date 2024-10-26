import sys
import os

# Add the parent directory (where script/ is located) to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import logging
from script.utils.DBManager import DatabaseManager
from script.utils.SkillFrameworkManager import SkillFrameWorkManager
from script.utils.WebCoursesScrapperManager import WebCoursesScrapperManager

def convert_skill_framework_excel_to_db(db):
    try:
        file_path = '.\SkillsFramework_Dataset_2024_06.xlsx'
        skill_framework_manager = SkillFrameWorkManager(df_file_path=file_path, db=db)
        logging.warning(f"xls sheets loaded successfully")
    except FileNotFoundError:
        logging.error(f"Skills Framework file is not found at: {file_path}")
    # db.upload_schema(".\init.sql")
    # skill_framework_manager.insert_into_db_initial()
    # skill_framework_manager.insert_into_db_foreign_tables()
    skill_framework_manager.test_public_function()

    pass

def main():
    # Load Excel file
    #db = DatabaseManager(database="wgtpivotlo-db", user="user", password="password", host="localhost", port=5432)
    # convert_skill_framework_excel_to_db
    web_courses_scrapper_manager = WebCoursesScrapperManager(url="https://www.coursera.org/courses?page=")
    web_courses_scrapper_manager.scrape_url()
    web_courses_scrapper_manager.output_json()

main()