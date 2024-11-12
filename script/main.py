import sys
import os
import pandas as pd
import json

# Add the parent directory (where script/ is located) to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import logging
from script.utils.DBManager import DatabaseManager
from script.utils.WebCoursesScrapperManager import WebCoursesScrapperManager


def scrape_coursera():
    web_courses_scrapper_manager = WebCoursesScrapperManager(url="https://www.coursera.org/courses?page=")
    web_courses_scrapper_manager.scrape_coursera()
    web_courses_scrapper_manager.output_df_excel()

def coursera_insert_into_db(df,db):
    for _index, row in df.iterrows():
        name = row['title'].lower()
        skill_list = row['skills'].split(',')
        rating = row['rating']
        reviews = row['reviews']
        profiency = row['difficulty']
        link = row['link'].lower()
        cleaned_skills = [skill.strip().lower() for skill in skill_list]
        logging.warning(f'Inserting {name}')
        res = db.insert("course", ["name", "link", "rating", "reviews_counts", "course_source"],[name,link,rating,reviews,'Coursera'], False, None, True)
        logging.warning(f'Successfully inserted {name}')
        db.commit()
        course_id = res[0]
        if course_id:
            for skill in cleaned_skills:
                logging.warning(f"Inserting {name}'s {skill}")
                if skill != "":
                    skill_id = db.get_skill_id(skill)[0]
                    if skill_id:
                        db.insert("course_skill", ["skill_id", "course_id", "profiency"], [skill_id,course_id,profiency])
                        db.commit()
                        logging.warning(f"Successfully inserted {name}'s {skill}")

def job_data_insertion_db(job_data, db):
    for job in job_data:
        sector = job_data[job]['sector'].lower()
        responsibility = job_data[job]['responsibility'].lower()
        career_level = job_data[job]['career_level']
        logging.warning(f'Inserting {job}')
        db.insert("career", ["title", "sector", "responsibility", "career_level"],[job.lower(),sector,responsibility,career_level])
        db.commit()
        logging.warning(f'Successfully Inserted {job}')

def insert_skills_into_db(coursera_skills_list, db):
    for skill in coursera_skills_list:
        logging.warning(f'Inserting {skill}')
        db.insert("skill", ["name"],[skill.lower()])
        db.commit()
        logging.warning(f'Successfully Inserted {skill}')

def insert_jobs_skills_profiency(skills_jobs_map_profiency, db):
    for career_title in skills_jobs_map_profiency:
        career_id = db.get_career_id(career_title.lower())[0]
        logging.warning(f"Inserting {career_title}'s skills into career_skill")
        if career_id:
            for skill in skills_jobs_map_profiency[career_title]:
                skill_id = db.get_skill_id(skill.lower())[0]
                profiency = skills_jobs_map_profiency[career_title][skill]
                db.insert("career_skill", ["career_id", "skill_id", "profiency"],[career_id, skill_id, profiency])
                db.commit()
                logging.warning(f"Successfully inserted {career_title}'s {skill} into career_skill")
            

def main():
    #scrape coursera
    if not os.path.exists("./course_data.xlsx"):
        scrape_coursera()
    else:
        db = DatabaseManager(database="wgtpivotlo-db", user="user", password="password", host="localhost", port=5432)
        try:
            db.upload_schema("./init.sql")
        except:
            logging.warning(f"schema has already uploaded")

        try:
            coursera_df = pd.read_excel('course_data.xlsx', sheet_name='Course Data')
            coursera_df = coursera_df.dropna(subset=['skills'])
            coursera_df = coursera_df.dropna(subset=['difficulty'])
            coursera_skills_list, skills_jobs_map_profiency, job_data = None, None, None
            with open("./coursera/coursera_skills_set.json", "r") as file:
                coursera_skills_list = set(json.load(file))
            with open("./coursera/skills_jobs_map_profiency.json", "r") as file:
                skills_jobs_map_profiency = json.load(file)
            with open("./coursera/job_data.json", "r") as file:
                job_data = json.load(file)

        except FileNotFoundError as error:
            logging.error("file is not found: " + str(error))

        # Files exist, insert all the data
        if len(coursera_df) > 0 and len(coursera_skills_list) > 0 and len(skills_jobs_map_profiency) > 0 and len(job_data) > 0:
            db.connect() # connect to db
            # insert job data
            job_data_insertion_db(job_data, db)
            
            # insert skills using coursera_skills_list
            insert_skills_into_db(coursera_skills_list, db)

            # insert skills_jobs_map_profiency
            insert_jobs_skills_profiency(skills_jobs_map_profiency, db)

            # insert coursera_df into course and course_skills
            coursera_insert_into_db(coursera_df, db)

main()