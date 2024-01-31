CREATE TABLE files (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    filename varchar(255) UNIQUE,
    original_file_url varchar(255) UNIQUE,
    compressed_file_url varchar(255) UNIQUE,
    md5_hash char(32) UNIQUE
);
