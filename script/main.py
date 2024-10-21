import sys
import os

# Add the parent directory (where script/ is located) to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import logging
from script.DBManager import DatabaseManager
from script.SkillFrameworkManager import SkillFrameWorkManager

def main():
    # Load Excel file
    db = DatabaseManager(database="wgtpivotlo-db", user="user", password="password", host="localhost", port=5432)
    
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


main()