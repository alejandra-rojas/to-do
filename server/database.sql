CREATE DATABASE todoappbrief;
CREATE TABLE todo(
    todo_id SERIAL PRIMARY KEY,
    description VARCHAR(255)
);


-- \ls
-- \dt
-- SELECT * FROM todos;
-- INSERT INTO todo(description) VALUES ('hello')
-- \password


-- define the table and the columns for the to dos
CREATE TABLE todos (
    id VARCHAR(255) PRIMARY KEY,
    user_email VARCHAR(255),
    title VARCHAR(30)
);

-- define the table for the users
CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    hashed_password VARCHAR(255)
);

--INSERT INTO todos(id, user_email, title) VALUES ('0', 'ale@test.com', 'First todo');

-- 'UPDATE todos SET user_email = $1, title = $2 WHERE id = $3;', [user_email, title, id]