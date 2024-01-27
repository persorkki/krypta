CREATE TABLE files (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    original_file_url varchar(255) UNIQUE,
    compressed_file_url varchar(255) UNIQUE,
    md5_hash char(32) UNIQUE
);

CREATE TABLE messages (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    message varchar(2000),
    url varchar(255),
    isOnline tinyint(1)
);
