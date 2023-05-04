-- \ls
-- \dt
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


SELECT * FROM todos;
SELECT * FROM todos WHERE user_email = $1
SELECT * FROM todos WHERE todo_id = $1

INSERT INTO todos (id, user_email, title) VALUES($1, $2, $3) RETURNING *
UPDATE todos SET title = $1 WHERE id = $2;
DELETE FROM todos WHERE id = $1





--INSERT INTO todos(id, user_email, title) VALUES ('0', 'ale@test.com', 'First todo');

-- 'UPDATE todos SET user_email = $1, title = $2 WHERE id = $3;', [user_email, title, id]

