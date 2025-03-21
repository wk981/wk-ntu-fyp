# API Endpoints Documentations
### Auth Endpoints

| Method  | Endpoint             | Description                                      | Request Body                                              | Response                      |
|---------|----------------------|--------------------------------------------------|-----------------------------------------------------------|-------------------------------|
| POST    | `/api/login`        | Login into the app                               | ```{username: string, password: string}```                 | "Sucess" or "Bad credental"  |
| POST    | `/api/register`     | Register into the app                            | ```{username: string,email: string, password: string}```   | "Sucess" or "Bad credental"  |
| GET     | `/api/me`           | Get logged in user information                   | -                                                          | UserDTO object                |

### Career Endpoints
#### CRUD for career

| Method | Endpoint                | Description                    | Query Params         | Request Body | Response         |
|--------|-------------------------|--------------------------------|----------------------|--------------|------------------|
| GET    | `/api/v1/career/`       | Get paginated list of careers | See below            | -            | List of careers  |
| GET    | `/api/v1/career/:id`    | Get specific career by ID     | -                    | -            | Career object    |
| POST    | `/api/v1/career/`    | Add a new career    | -                    | ```{title: string, sector: string, responsibility: string, careerLevel: string}```    Must be admin         | "Sucess" or "Bad request"    |
| PUT    | `/api/v1/career/:id`    | Edit a career    | -                    | ```{title: string, sector: string, responsibility: string, careerLevel: string}```      Must be admin       | "Sucess" or "Bad request"    |
| DELETE    | `/api/v1/career/:id`    | Delete a career    | -                    |    Must be admin          | "Sucess" or "Bad request"    |

### Query Params for /api/v1/career/:

1. pageNumber (number) – Page number to retrieve. Default: 1, Minimum: 1

2. pageSize (number) – Number of items per page. Default: 10, Minimum: 1

3. title (string) – Filter by career title

4. sector (string) – Filter by sector

5. careerLevel (string) – Filter by career level: Beginner, Intermediate, Advanced

6. skillFilters (string) – Filter by skills and proficiency in the format:

7. skillFilters (string) – Filter by required skills and proficiency level. Format: skillId:Proficiency. Example: skillFilters=5:Advanced,6:Intermediate .You can omit proficiency to match any level: skillFilters=5:,6:Intermediate

### Career Skills Association Endpoints
#### CRUD for career-skills joint table and other functionality

| Method | Endpoint                | Description                    | Query Params         | Request Body | Response         |
|--------|-------------------------|--------------------------------|----------------------|--------------|------------------|
| POST    | `/api/v1/career-skill-association/`    | Add a new career-skill into    | -                    | ```{skillId: number, careerId: number, careerLevel: string}```  Must be admin           | "Sucess" or "Bad request"    |
| PUT    | `/api/v1/career-skill-association/`    | Edit a career-skill's profiency    | -                    |  ```{skillId: number, careerId: number, careerLevel: string}```  Must be admin          | "Sucess" or "Bad request"    |
| DELETE    | `/api/v1/career-skill-association/`    | Delete a career-skill    | -                    |  ```{skillId: number, careerId: number, careerLevel: string}```     Must be admin       | "Sucess" or "Bad request"    |
| GET    | `/api/v1/career-skill-association/career/:id`    | Get career along with skills    | -                    |  -           | "Sucess" or "Bad request"    |
| GET    | `/api/v1/career-skill-association/career/recommendations`    | Recommend career    | -                    |  ```{type: string, sector: string, careerLevel: string, pageSize: number, pageNumber: number}```  Must be logged in          | "Sucess" or "Bad request"    |
| GET    | `/api/v1/career-skill-association/career/recommendation-exploration`    | Explore more Careers   | -                    |  ```{pageSize: number, pageNumber: number}```  Must be logged in          | "Sucess" or "Bad request"    |
| POST    | `/api/v1/career-skill-association/career/preference/:career_id`    | Mark a career as preference career   | -                    |  Must be logged in           | "Sucess" or "Bad request"    |
| GET    | `/api/v1/career-skill-association/career/preference/`    | Get current user preference   | -                    |  Must be logged in         | "Sucess" or "Bad request"    |

### Course Endpoints
#### CRUD for course

| Method | Endpoint                | Description                    | Query Params         | Request Body | Response         |
|--------|-------------------------|--------------------------------|----------------------|--------------|------------------|
| GET    | `/api/v1/course/`       | Get paginated list of courses | See below            | -            | List of courses  |
| GET    | `/api/v1/course/:id`    | Get specific course by ID     | -                    | -            | Career object    |
| POST    | `/api/v1/course/`    | Add a new course   | -                    | ```{name: string, link: string, rating: number, reviews_counts: number, courseSource: string}```    Must be admin         | "Sucess" or "Bad request"    |
| PUT    | `/api/v1/course/:id`    | Edit a course    | -                    | ```{name: string, link: string, rating: number, reviews_counts: number, courseSource: string}```      Must be admin       | "Sucess" or "Bad request"    |
| DELETE    | `/api/v1/course/:id`    | Delete a course    | -                    |    Must be admin          | "Sucess" or "Bad request"    |

### Query Params for /api/v1/course/:

1. pageNumber (number) – Page number to retrieve. Default: 1, Minimum: 1

2. pageSize (number) – Number of items per page. Default: 10, Minimum: 1

3. name (string) – Filter courses by name (supports partial match)

4. rating (float) – Filter courses by rating (e.g., 4.5)

5. reviewsCounts (float) – Filter courses by number of reviews (e.g., 5000)

6. courseSource (string) – Filter by course source. Example: Coursera, edX, Udemy

7. ratingOperator (string) – Comparison operator for rating. Accepted values: gt, lt, gte, lte,

8. reviewCountsOperator (string) – Comparison operator for reviews count. Accepted values: gt, lt, gte, lte

9. skillFilters (string) – Filter by required skills and proficiency level. Format: skillId:Proficiency. Example: skillFilters=5:Advanced,6:Intermediate .You can omit proficiency to match any level: skillFilters=5:,6:Intermediate

### Course Skills Association Endpoints
#### CRUD for course-skills joint table and other functionality

| Method | Endpoint                | Description                    | Query Params         | Request Body | Response         |
|--------|-------------------------|--------------------------------|----------------------|--------------|------------------|
| POST    | `/api/v1/course-skill-association/`       | Add a new course-skill | -            | ```{skillId: number, courseId: number, careerLevel: string}```  Must be admin            | "Sucess" or "Bad request"  |
| PUT    |  `/api/v1/course-skill-association/`    | Edit a course-skill's profiency     | -                    | ```{skillId: number, courseId: number, careerLevel: string}```  Must be admin            | "Sucess" or "Bad request"    |
| DELETE    | `/api/v1/course-skill-association/`    | Delete a course-skill   | -                    | ```{skillId: number, courseId: number, careerLevel: string}```    Must be admin         | "Sucess" or "Bad request"    |
| GET    | `/api/v1/course-skill-association/courses/:course_id`    | Get a course along with its skills    | -                    |      -      | "Sucess" or "Bad request"    |
| POST    | `/api/v1/course-skill-association/courses/change-status`    | Change a status in user's course history    | -                    |    ```{"courseStatus": "In Progress", // or "Completed", "Not Done", "courseId": 123}```        | "Sucess" or "Bad request" or "user does not have the course in history"  |
| PUT    | `/courses/delete-status/{course_id}`    | Delete course from user's history    | -                    |      Must be logged in      | "Sucess" or "Bad request"    |
| GET    | `/courses/timeline`    | Get user's learning timeline    | See below                    |      Must be logged in      | "Sucess" or "Bad request"    |
| GET    | `/courses/history`    | Get user's course history    | See below                  |     Must be logged in        | "Sucess" or "Bad request"    |


### Query Params for /courses/timeline:

1. pageNumber (number) – Page number to retrieve. Default: 1, Minimum: 1

2. pageSize (number) – Number of items per page. Default: 10, Minimum: 1

3. skillId (number) - skillId of the learning timeline

4. careerId (number) - careerId of where the skillId is from

5. skillLevelFilter - "Beginner" | "Intermediate" | "Advanced" |

### Query Params for /courses/history:

1. skillLevel - "Beginner" | "Intermediate" | "Advanced" |

2. courseStatus - "IN_PROGRESS", "COMPLETED", "NOT_DONE" | 


### Dashboard Endpoints
#### Dashboard functionality

| Method | Endpoint                | Description                    | Query Params         | Request Body | Response         |
|--------|-------------------------|--------------------------------|----------------------|--------------|------------------|
| GET    | `/api/v1/dashboard/`       | Get current user dashboard| -            |  Must be logged in          | See below  |

### Response body for dashboard/:

1. careerProgression - number

2. userSkills - SkillWithProfiencyDTO[], where skill object plus profiency

3. careerTitle - string

4. skillGap - SkillWIthCareerLevelFlowDTO[], SkillWIthCareerLevelFlowDTO -> ``` skillDTO: skill object, skillFlow: string[], inSkillset: boolean ```


### Questionaire Endpoints
#### Questionaire functionalities

| Method | Endpoint                | Description                    | Query Params         | Request Body | Response         |
|--------|-------------------------|--------------------------------|----------------------|--------------|------------------|
| GET    | `/api/v1/questionaire/sectors`       | Get all the career sectors| -            |  Must be logged in          | string[]  |
| POST    | `/api/v1/questionaire/result`       | Get questionaire results| -            | ```{sector: string, careerLevel: see below, SkillIdWithProfiencyDTO: see below} ``` Must be logged in          | see below |
| POST    | `/api/v1/questionaire/upload`       | Upload resume in docx and pdfx| -            | Use Multipart and categories under file Must be logged in          | see below |


### Request body for questionaire/result:

1. careerLevel - "Entry Level", "Mid Level", "Senior Level"

2. SkillIdWithProfiencyDTO: ```{skillId: number, profiency: string}``` and will be in a list

### Response body for questionaire/result:
1. ``` {"pathwayMatches": career with similarity score, "directMatches": career with similarity score, "aspirationMatches": career with similarity score,} ```


### Resume Endpoints
#### Generate resume

| Method | Endpoint                | Description                    | Query Params         | Request Body | Response         |
|--------|-------------------------|--------------------------------|----------------------|--------------|------------------|
| POST    | `/api/v1/resume/download`       | Generate Resume| -            |  Must be logged in          | a blob |

### Skills Endpoints
#### skills functionality

| Method | Endpoint                | Description                    | Query Params         | Request Body | Response         |
|--------|-------------------------|--------------------------------|----------------------|--------------|------------------|
| POST    | `/api/v1/skill/search`       | search skills|  q            |  Must be logged in          | skillDTO object |

### Users Endpoints
#### Update current user details

| Method | Endpoint                | Description                    | Query Params         | Request Body | Response         |
|--------|-------------------------|--------------------------------|----------------------|--------------|------------------|
| POST    | `/api/v1/user/update-profile`       | Update user's profile|  -      |  ```{userId: number, newEmail: string, newUsername: string} ```  only userId is mandatory, rest are optional   must be logged in      | "Sucess" or "Bad Reqest: Email" or "Bad Request: Username"|
| POST    | `/api/v1/user/update-password`       | Update user's password|  -       |  ```{userId: number, currentPassword: string, newPassword: string, confirmNewPassword: string} ```       | "Sucess" or "Bad Request" or "Bad request: password"|
