CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user VARCHAR(255),
    question_type VARCHAR(255),
    frage TEXT,
    answer_a VARCHAR(255),
    answer_b VARCHAR(255),
    answer_c VARCHAR(255),
    answer_d VARCHAR(255),
    correct_answer VARCHAR(255),
    program VARCHAR(255),
    course VARCHAR(255),
    lection VARCHAR(255),
    position  int,
    image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `isVerified` BOOLEAN DEFAULT FALSE,
  `verificationToken` VARCHAR(255),
  
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS programs (
    program_name VARCHAR(255) NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS course (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
	program_name VARCHAR(255),
    user VARCHAR(255),
    FOREIGN KEY (program_name) REFERENCES programs(program_name)
);

CREATE TABLE IF NOT EXISTS course_members (
    user_email VARCHAR(255),
    course_id INT,
    FOREIGN KEY (course_id) REFERENCES course(id)
);

INSERT INTO `programs`(`program_name`) VALUES ('Digital Business');
INSERT INTO `programs`(`program_name`) VALUES ('Digital Business Engineering');