CREATE TABLE IF NOT EXISTS `questions` (
    `question_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT,
    `question_type` ENUM('multiple-choice', 'multiple-choice-image', 'image-description', 'text-description'),
    `frage` TEXT,
    `answer_a` VARCHAR(255),
    `answer_b` VARCHAR(255),
    `answer_c` VARCHAR(255),
    `answer_d` VARCHAR(255),
    `correct_answer` VARCHAR(255),
    `position` INT,
    `image_url` VARCHAR(255),
    `lection_id` INT,
    FOREIGN KEY (`lection_id`) REFERENCES `lections` (`lection_id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `accounts` (`user_id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `lections` (
  `lection_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `lection_name` VARCHAR(255) NOT NULL,
  `course_id` INT NOT NULL,
  FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `courses` (
    `course_id` INT AUTO_INCREMENT PRIMARY KEY,
    `course_name` VARCHAR(255) NOT NULL,
    `program_id` INT,
    `creator` INT,
    FOREIGN KEY (`program_id`) REFERENCES `programs`(`program_id`),
    FOREIGN KEY (`creator`) REFERENCES `accounts`(`user_id`)
);

CREATE TABLE IF NOT EXISTS `course_members` (
    `user_id` INT,
    `course_id` INT,
    `progress` INT DEFAULT 0,
    `course_score` INT DEFAULT 0,
    FOREIGN KEY (`user_id`) REFERENCES `accounts`(`user_id`),
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`)
);

CREATE TABLE IF NOT EXISTS `programs` (
    `program_id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `program_name` VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS `accounts` (
  `user_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `firstname` VARCHAR(50) NOT NULL,
  `lastname` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('professor', 'student'),
  `isVerified` BOOLEAN DEFAULT FALSE,
  `verificationToken` VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS `scores` (
  `user_id` INT NOT NULL,
  `score` INT,
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `accounts` (`user_id`) ON DELETE CASCADE
);

INSERT INTO `programs`(`program_name`) VALUES ('Digital Business');
INSERT INTO `programs`(`program_name`) VALUES ('Digital Business Engineering');
