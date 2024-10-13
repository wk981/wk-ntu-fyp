WITH skill_insert AS (
    INSERT INTO skill (name, description, type)
    VALUES
    ('HTML', 'The standard markup language used to structure content on the web.', 'Technical'),
    ('CSS', 'A stylesheet language used to control the presentation of HTML elements, including layout, colors, and fonts.', 'Technical'),
    ('JavaScript', 'A programming language used to create interactive effects within web browsers.', 'Technical'),
    ('React', 'A popular JavaScript library for building user interfaces, especially for single-page applications.', 'Technical'),
    ('Version Control (Git)', 'A system for tracking changes to code and collaborating with other developers.', 'Technical'),
    ('Responsive Design', 'The ability to create web applications that look and work well across various device sizes and screen resolutions.', 'Technical'),
    ('Cross-browser Compatibility', 'Ensuring a web application works well across different web browsers.', 'Technical'),
    ('Web Performance Optimization', 'Techniques for improving the speed and efficiency of a website or web application.', 'Technical'),
    ('UI/UX Design Principles', 'Understanding of user interface and user experience design to create intuitive and effective applications.', 'Technical'),
    ('Debugging', 'The process of identifying and fixing errors in the code.', 'Technical')
    RETURNING skill_id, name
)

, career_insert AS (
    INSERT INTO career (name, description, sector, career_level, work_environment, goal)
    VALUES
    ('Frontend Engineer', 'A Frontend Engineer specializes in building the visual and interactive components of websites and applications, focusing on user interfaces and user experience.', 'Technology', 'Mid-Level', 'Office-based or Remote', 'To develop responsive and accessible user interfaces.')
    RETURNING career_id
)

INSERT INTO career_skill (skill_id, career_id, skill_level)
VALUES
((SELECT skill_id FROM skill_insert WHERE name = 'HTML'), (SELECT career_id FROM career_insert), 'Expert'),
((SELECT skill_id FROM skill_insert WHERE name = 'CSS'), (SELECT career_id FROM career_insert), 'Expert'),
((SELECT skill_id FROM skill_insert WHERE name = 'JavaScript'), (SELECT career_id FROM career_insert), 'Advanced'),
((SELECT skill_id FROM skill_insert WHERE name = 'React'), (SELECT career_id FROM career_insert), 'Advanced'),
((SELECT skill_id FROM skill_insert WHERE name = 'Version Control (Git)'), (SELECT career_id FROM career_insert), 'Intermediate'),
((SELECT skill_id FROM skill_insert WHERE name = 'Responsive Design'), (SELECT career_id FROM career_insert), 'Advanced'),
((SELECT skill_id FROM skill_insert WHERE name = 'Cross-browser Compatibility'), (SELECT career_id FROM career_insert), 'Intermediate'),
((SELECT skill_id FROM skill_insert WHERE name = 'Web Performance Optimization'), (SELECT career_id FROM career_insert), 'Advanced'),
((SELECT skill_id FROM skill_insert WHERE name = 'UI/UX Design Principles'), (SELECT career_id FROM career_insert), 'Intermediate'),
((SELECT skill_id FROM skill_insert WHERE name = 'Debugging'), (SELECT career_id FROM career_insert), 'Advanced');
