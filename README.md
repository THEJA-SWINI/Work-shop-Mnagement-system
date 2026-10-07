Build a web application that allows users to using a frontend, backend API, and SQL database.1. Database
Create two tables:
category_id
category_name
workshop_id
workshop_name
description
category_id
level
duration
trainer_name
Create a relationship between the two tables using a .
Insert at least across different categories and difficulty levels.2. Frontend
Create a workshop listing page.
Each workshop should display:
Workshop Name
Category
Level
Duration
Trainer
Description
Implement:
Search by workshop name
Filter by category
Filter by difficulty level
Sort by duration
Clear Filters option
Use JavaScript fetch() to communicate with the backend.3. Backend APIs
Create APIs such as:
Method
Endpoint
Purpose
GET /workshops --> Get all workshops
GET /workshops/search?keyword=java --> Search workshops
GET /workshops?category=Backend --> Filter by category
GET /workshops?level=Beginner --> Filter by level
GET /workshops?sort=duration --> Sort by duration
The backend should receive the request, execute the appropriate SQL query, and return the result as JSON.4. SQL Requirements
Write queries using:
INNER JOIN
WHERE
LIKE
ORDER BY
GROUP BY
COUNT()
Aggregate functions
Examples:Display all workshops with their category names.Find workshops containing "Java" in the workshop name.Find all Beginner-level workshops.Find workshops belonging to the Backend category.Display workshops from shortest to longest duration.Find the number of workshops available in each category.Find the average workshop duration for each category.Expected Flow
