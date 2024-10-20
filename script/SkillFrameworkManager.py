import pandas as pd
import logging
import json
import traceback

sector_mapping = {
    "Early Childhood": "Early Childhood Care and Education"
}

track_mapping = {
    "Creative": "Technical Theatre & Production"
}

# When inserting skills data
skills_tsc_ccs_cat_mapping = {
    "Families and Community Partnership": "Family and Community Partnership",
    "Family & Community Partnership": "Family and Community Partnership"

}

# Inserting K&A
skill_ka_category_mapping = {
    "Early Intervention and Learning Support Development": "Learning Design and Implementation"
}

skill_ka_skill_title_mapping= {
    "Clinical Records Documentation and Management in Rehabilitation Therapy": "Clinical Incident Management in Rehabilitation Therapy",
    "Patient education in genetics": "Patient Education in Genetics"
}

# Family and Community Partnership => Families and Community Partnership, Family & Community Partnership

class SkillFrameWorkManager:

    def __init__(self, df_file_path, db):
        xls = pd.ExcelFile(df_file_path)
        self.job_role_description_df = pd.read_excel(xls, sheet_name='Job Role_Description')
        self.job_role_cwf_kt_df = pd.read_excel(xls, sheet_name='Job Role_CWF_KT')
        # self.job_role_tcs_ccs_df = pd.read_excel(xls, sheet_name='Job Role_TCS_CCS')
        self.tsc_ccs_key_df = pd.read_excel(xls, sheet_name='TSC_CCS_Key')
        self.tsc_ccs_ka_df = pd.read_excel(xls, sheet_name='TSC_CCS_K&A')
        # tsx_application_df = pd.read_excel(xls, sheet_name='TSC_Application')
        self.db = db

    def insert_into_db_initial(self):
        try:
            self.db.connect()
            self.__insert_career_or_skill("career")
            self.__insert_career_or_skill("skill")
            self.db.commit()

        except KeyError as e:
            self.db.rollback()
            logging.error(f"Column {e} not found")
        
        except Exception as e:
            self.db.rollback()
            logging.error(traceback.format_exc())
            logging.error(f"Error: {e}")
        
        finally:
            self.db.close()

    def insert_into_db_foreign_tables(self):
        try:
            self.db.connect()
            self.__insert_work_function()
            self.__insert_skill_proficiency_data()
            self.db.commit()

        except KeyError as e:
            self.db.rollback()
            logging.error(f"Column {e} not found")
        
        except Exception as e:
            self.db.rollback()
            logging.error(traceback.format_exc())
            logging.error(f"Error: {e}")
        
        finally:
            self.db.close()
    
    def __insert_career_or_skill(self, option):
        df = None
        df_columns = None
        table = None
        table_columns = None
        if option == "career":
            df = self.job_role_description_df
            df_columns = self.job_role_description_df.columns
            table = "careers"
            table_columns = df_columns
            
        elif option == "skill":
            df_columns = self.tsc_ccs_key_df.columns[:5]
            df = self.tsc_ccs_key_df
            table = "skills"
            table_columns = ["sector", "category", "title","description", "type"]
        
        for _, row in df.iterrows():
            values = []
            for col in df_columns:
                value = row[col]
                if isinstance(value, str):  # Check if the value is a string
                    value = value.strip()  # Strip leading/trailing whitespace
                if value in skills_tsc_ccs_cat_mapping:
                    value = skills_tsc_ccs_cat_mapping[value]
                
                values.append(value)

            self.db.insert(table, table_columns, values)
        logging.warning(f"Inserted into {table} successfully")

        
    def __insert_work_function(self):
        df_columns = self.job_role_cwf_kt_df.columns
        conflict_columns = ["career_id", "Critical Work Function"]
        res = 0
        missing_careers = []
        
        for _, row in self.job_role_cwf_kt_df.iterrows():
            # Strip whitespace and prepare data for case-insensitive search
            sector = row['Sector'].strip() if 'Sector' in df_columns else None
            # Normalise
            if sector in sector_mapping:
                sector = sector_mapping[sector]
                
            track = row['Track'].strip() if 'Track' in df_columns else None
            if track in track_mapping:
                track = track_mapping[track]

            job_role = row['Job Role'].strip() if 'Job Role' in df_columns else None
            critical_work_function = row['Critical Work Function']
            key_task = row['Key Tasks'] if 'Key Tasks' in df_columns else None
            
            # Get career_id from the database with case-insensitive matching
            career_id = self.db.get_career_id((sector, track, job_role))
            
            if career_id:
                values = [career_id[0], critical_work_function]
                work_function_query = self.db.insert(
                    "work_functions",
                    ["career_id", "Critical Work Function"],
                    values,
                    skip_dup=True,
                    conflict_columns=conflict_columns,
                    return_query=True
                )
                
                if work_function_query:
                    self.db.insert(
                        "key_tasks",
                        ["work_function_id", "key_task"],
                        values=[work_function_query[0], key_task]
                    )
            else:
                missing_careers_item_dict = {
                    "Sector": sector,
                    "Track": track,
                    "Job Role": job_role,
                }
                if missing_careers_item_dict not in missing_careers:
                    missing_careers.append(missing_careers_item_dict)
                logging.error(f"Career not found for Job Role: '{job_role}', Sector: '{sector}', Track: '{track}'")

        if missing_careers:
            with open('missing_career_in_work_function.json', 'w') as outfile:
                json.dump(missing_careers, outfile, indent=4)
        logging.warning("Inserted work functions successfully")

    def __insert_skill_proficiency_data(self):
        df = self.tsc_ccs_ka_df
        missing_skill_proficiency_data = []
        
        for _, row in df.iterrows():
            # Adjust category for each row
            sector = row['Sector'].strip()
            category = row['TSC_CCS Category'].strip()
            skill_title = row['TSC_CCS Title'].strip()
            proficiency_level = str(row['Proficiency Level']).strip()
            proficiency_description = row['Proficiency Description'].strip()
    
            # Handle missing values in 'Knowledge / Ability Classification' and 'Knowledge / Ability Items'
            classification = row['Knowledge / Ability Classification']
            knowledge_ability_items = row['Knowledge / Ability Items']

            # Ensure these fields are not NaN before calling .strip()
            classification = classification.strip() if pd.notna(classification) else ''
            knowledge_ability_items = knowledge_ability_items.strip() if pd.notna(knowledge_ability_items) else ''

            # if category in skill_ka_category_mapping:
            #     category = skill_ka_category_mapping[category]
            
            if skill_title in skill_ka_skill_title_mapping:
                skill_title = skill_ka_skill_title_mapping[skill_title]

            # Adjust category if the sector is 'Early Childhood'
            if sector.lower() == 'early childhood':
                if category == "Workforce Development and Engagement" and (skill_title == "Staff Communication and Engagement" or skill_title == "Staff Continuous Learning" or skill_title == "Team Management"):
                    category = "Staff Development and Engagement"
                elif category == "Early Intervention and Learning Support Development" and skill_title == "Early Intervention Curriculum Design":
                    category = "Learning Design and Implementation"

            skill_id = self.db.get_skill_id((sector, category, skill_title))

            if skill_id:
                # Merge knowledge and abilities descriptions
                merged_description = proficiency_description

                if classification == 'knowledge':
                    merged_description += f"\nKnowledge: {knowledge_ability_items}"
                elif classification == 'ability':
                    merged_description += f"\nAbilities: {knowledge_ability_items}"

                # Insert into the skill_proficiency table
                self.db.insert(
                    "skill_proficiency",
                    columns=["skill_id", "proficiency_level", "proficiency_description"],
                    values=[skill_id, proficiency_level, merged_description]
                )

            else:
                missing_skill_proficiency_data_item = {
                    "sector": sector,
                    "category": category,
                    "skill_title": skill_title
                }
                if missing_skill_proficiency_data_item not in missing_skill_proficiency_data:
                    missing_skill_proficiency_data.append(missing_skill_proficiency_data_item)

                logging.error(f"Skill not found: {sector}, {category}, {skill_title}")
        
        # Write missing data to JSON file if any skills were not found
        if missing_skill_proficiency_data:
            with open('missing_skill_proficiency_data.json', 'w') as outfile:
                json.dump(missing_skill_proficiency_data, outfile, indent=4)
        
        logging.warning("Inserted skill proficiency successfully")
