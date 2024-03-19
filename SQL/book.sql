DROP DATABASE IF EXISTS book_project;
CREATE DATABASE book_project;
USE book_project;

-- creating book table
CREATE TABLE book(
	book_id INT PRIMARY KEY NOT NULL,
    book_title VARCHAR(100) NOT NULL,
    pub_date YEAR,
    rating DECIMAL(3,2),		-- 3 total places, 2, past decimal point
    cover_img VARCHAR(300)
);

-- creating author table
CREATE TABLE author(
	author_id INT PRIMARY KEY NOT NULL,
    author_name VARCHAR(50)
);

-- creating writes table
CREATE TABLE writes(
	book_id INT NOT NULL,
    author_id INT NOT NULL,
    CONSTRAINT writes_pk PRIMARY KEY (book_id, author_id),
    CONSTRAINT writes_book_fk FOREIGN KEY(book_id) REFERENCES book(book_id),
    CONSTRAINT writes_author_fk FOREIGN KEY(author_id) REFERENCES author(author_id)
);

-- creating genre table
CREATE TABLE genre(
	genre_id INT PRIMARY KEY NOT NULL,
    genre_name VARCHAR(50) NOT NULL
);

-- creating has_genre table
CREATE TABLE has_genre(
	book_id INT NOT NULL,
    genre_id INT NOT NULL,
    CONSTRAINT has_pk PRIMARY KEY (book_id, genre_id),
    CONSTRAINT has_book_fk FOREIGN KEY(book_id) REFERENCES book(book_id),
    CONSTRAINT has_genre_fk FOREIGN KEY(genre_id) REFERENCES genre(genre_id)
);

-- creating reader table
CREATE TABLE reader(
	reader_id INT PRIMARY KEY NOT NULL,		-- autoincrement later
    reader_email VARCHAR(90) NOT NULL,		
    reader_password VARCHAR(20) NOT NULL,
    reader_start_date DATE
);

-- creating booklist table
CREATE TABLE booklist(
	booklist_id INT PRIMARY KEY NOT NULL,	-- auto increment later
    reader_id INT NOT NULL,
    book_id INT NOT NULL,
    reader_rating DECIMAL(2,1),
    add_date DATE,
    FOREIGN KEY (reader_id) REFERENCES reader(reader_id),
    FOREIGN KEY (book_id) REFERENCES book(book_id)
);

-- modifying tables
ALTER TABLE book MODIFY COLUMN rating DECIMAL(4, 2);
ALTER TABLE book MODIFY COLUMN book_title VARCHAR(1000);
ALTER TABLE reader ADD COLUMN reader_fname VARCHAR(30);
ALTER TABLE reader ADD COLUMN reader_lname VARCHAR(30);

-- setting the reader_id to autoincrement when a new reader signs up
SET FOREIGN_KEY_CHECKS = 0;
ALTER TABLE reader 
MODIFY COLUMN reader_id INT AUTO_INCREMENT, 
AUTO_INCREMENT = 1; -- autoincrement starts at 1
SET FOREIGN_KEY_CHECKS = 1;

-- setting reader_start_date to CURRENT_TIMESTAMP
ALTER TABLE reader
MODIFY COLUMN reader_start_date DATETIME DEFAULT CURRENT_TIMESTAMP;

-- setting the booklist_id to autoincrement when a reader rates a new book
ALTER TABLE booklist 
MODIFY COLUMN booklist_id INT AUTO_INCREMENT, 
AUTO_INCREMENT = 1; -- autoincrement starts at 1

-- setting add_date to CURRENT_TIMESTAMP
ALTER TABLE booklist
MODIFY COLUMN add_date DATETIME DEFAULT CURRENT_TIMESTAMP;

-- Population of tables
-- please run the files with the names of the tables in this order:
-- book
-- author
-- genre
-- writes
-- has_genre
-- reader
-- booklist

-- Queries --

-- Query 1 --
-- this query takes all books from a person's booklist that are rated high 
-- and returns how many times the genres fromm all the books appear
SELECT genre.genre_name, COUNT(genre.genre_id) AS "Appearance Count"
FROM genre
JOIN has_genre ON genre.genre_id = has_genre.genre_id
JOIN booklist ON has_genre.book_id = booklist.book_id
WHERE booklist.reader_id = 1
AND booklist.reader_rating >= 4.0
GROUP BY genre.genre_name
ORDER BY COUNT(genre.genre_id) DESC;

-- Query 2 --
-- this query provides recommendations of books based on favorite genres of user 1
SELECT DISTINCT b.book_title, b.rating, b.cover_img
FROM book b
JOIN has_genre hg ON b.book_id = hg.book_id
JOIN genre g ON hg.genre_id = g.genre_id
LEFT JOIN (
    SELECT hg_list.genre_id, COUNT(*) AS genre_count
    FROM booklist bl
    JOIN has_genre hg_list ON bl.book_id = hg_list.book_id
    WHERE bl.reader_id = 1 -- Replace with the appropriate reader ID
    AND bl.reader_rating >= 4 -- only using books the reader liked, to recommend
    GROUP BY hg_list.genre_id
    HAVING COUNT(*) > 1 -- only using genres that appear more than once 
) AS bt ON g.genre_id = bt.genre_id -- calling this table bt for book table
WHERE b.book_id NOT IN ( -- this statement makes sure the books we're suggesting are not already in booklist
    SELECT bl.book_id
    FROM booklist bl
    WHERE bl.reader_id = 1 -- Replace with the appropriate reader ID
)
AND bt.genre_id IS NOT NULL
AND b.rating > 4.5 -- only recommending books that are highly rated by others
ORDER BY b.rating DESC;

-- Query 3 -- 
-- average number of books an author writes
SELECT AVG(count_table.book_count) AS "Average Book Count"
FROM (
	SELECT author_id, COUNT(book_id) AS book_count
    FROM writes
    GROUP BY author_id
) AS count_table;

-- Query 4 --
-- lists all the romance books in order from highest to lowest rated
SELECT book.book_title
FROM book
JOIN has_genre ON book.book_id = has_genre.book_id
JOIN genre ON has_genre.genre_id = genre.genre_id
WHERE genre.genre_name = "Romance"
ORDER BY book.rating DESC; -- orders highest to lowest rated

-- Query 5 --
-- finds the author with the lowest rated book, and the rating the book has
SELECT author.author_name AS "Author With Lowest Rated Book", MIN(book.rating) AS Rating
FROM author
JOIN writes ON author.author_id = writes.author_id
JOIN book ON writes.book_id = book.book_id
GROUP BY author.author_name
ORDER BY Rating ASC -- lowest rated book is at the top
LIMIT 1; -- picks that lowest rated book from the top of the list
