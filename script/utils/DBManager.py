import psycopg2
from psycopg2 import sql
import logging
class DatabaseManager:
    def __init__(self, database, user, password, host, port=5432) -> None:
        self.database = database
        self.user = user
        self.password = password
        self.host = host
        self.port = port
        self.conn = None
        self.cursor = None

    def __str__(self):
        return f"DatabaseManager(dbname={self.database}, user={self.user}, host={self.host}, port={self.port})"
    
    def connect(self):
        try:
            self.conn = psycopg2.connect(database="wgtpivotlo-db", user="user", password="password", host="localhost", port=5432)
            self.cursor = self.conn.cursor()
            logging.warning(f"database connected successfully")
        except:
            logging.error("Failed to connect to db")

    def close(self):
        if self.conn:
            self.conn.close()
            self.cursor.close()
            logging.warning("Connection closed successfully")
    
    def commit(self):
        self.conn.commit()
        logging.warning("Transaction commit successfully")

    def rollback(self):
        self.conn.rollback()
        logging.warning("Transaction rollback successfully")

    def upload_schema(self,path):
            try:
                self.connect()
                self.cursor.execute(open(path, "r").read())
                self.commit()
            except KeyError as e:
                self.rollback()
                logging.error(f"Column {e} not found")
            
            except Exception as e:
                self.rollback()
                logging.error(f"Error: {e}")

            finally:
                self.close()
        
            logging.warning(f"schema loaded successfully")
    
    def insert(self, table_name, columns, values, skip_dup = False, conflict_columns = None, return_query = False):
        columns = [self.__process_str(s) for s in columns] # convert to lower case
        table_name = self.__process_str(table_name)

        query = sql.SQL("INSERT INTO {table} ({columns}) VALUES ({values})").format(
            table=sql.Identifier(table_name),
            columns=sql.SQL(', ').join(map(sql.Identifier, columns)),
            values=sql.SQL(', ').join(sql.Placeholder() * len(columns))
        )

        if skip_dup and conflict_columns:
            conflict_columns = [self.__process_str(col) for col in conflict_columns]  # Convert to lowercase
            query = query + sql.SQL(" ON CONFLICT ({conflict_columns}) DO NOTHING").format(
                conflict_columns=sql.SQL(', ').join(map(sql.Identifier, conflict_columns))
            )
        if return_query:
            query = query + sql.SQL(" RETURNING *")

        self.cursor.execute(query, values)
        if return_query:
            return self.cursor.fetchone()
        # logging.warning(f"sucessfully inserted into database")

    def get_career_id(self, data):
        query = """
SELECT career_id FROM careers WHERE sector LIKE %s AND track LIKE %s AND job_role LIKE %s
"""
        self.cursor.execute(query, data)
        return self.cursor.fetchone()

    def get_career_id_where_job_role(self, job_role):
        query = """
        SELECT career_id FROM careers WHERE job_role ILIKE %s
        """
        self.cursor.execute(query, (job_role,))  # Note the comma, making it a tuple
        return self.cursor.fetchone()

    def get_skill_id(self, data):        
        query = """
        SELECT skill_id 
        FROM skills 
        WHERE sector LIKE %s 
        AND category LIKE %s 
        AND title LIKE %s
        """
        
        self.cursor.execute(query, (data))
        
        return self.cursor.fetchone()
    
    def get_skill_id_where_title(self, data):        
        query = """
        SELECT skill_id 
        FROM skills 
        WHERE title ILIKE %s
        """
        
        self.cursor.execute(query, (data,))

        return self.cursor.fetchone()

    def __process_str(self,s):
        return s.lower().replace(" ", "_")

        