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

CREATE TABLE IF NOT EXISTS `programs` (
    `program_id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `program_name` VARCHAR(255)
);


CREATE TABLE IF NOT EXISTS `courses` (
    `course_id` INT AUTO_INCREMENT PRIMARY KEY,
    `course_name` VARCHAR(255) NOT NULL,
    `program_id` INT,
    `creator` INT,
    FOREIGN KEY (`program_id`) REFERENCES `programs`(`program_id`) ON DELETE CASCADE,
    FOREIGN KEY (`creator`) REFERENCES `accounts`(`user_id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `lections` (
  `lection_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `lection_name` VARCHAR(255) NOT NULL,
  `course_id` INT NOT NULL,
  FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
);

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


CREATE TABLE IF NOT EXISTS `course_members` (
    `user_id` INT,
    `course_id` INT,
    `progress` INT DEFAULT 0,
    `course_score` INT DEFAULT 0,
    FOREIGN KEY (`user_id`) REFERENCES `accounts`(`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS `scores` (
  `user_id` INT NOT NULL,
  `score` INT,
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `accounts` (`user_id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `lection_scores` (
  `lection_id` INT,
  `user_id` INT,
  `lection_score` INT,
  FOREIGN KEY (`user_id`) REFERENCES `accounts` (`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`lection_id`) REFERENCES `lections` (`lection_id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_lection_user` (`lection_id`, `user_id`)
);
INSERT INTO `programs`(`program_name`) VALUES ('Digital Business');
INSERT INTO `programs`(`program_name`) VALUES ('Digital Business Engineering');

INSERT INTO `accounts` (`user_id`, `firstname`, `lastname`, `email`, `password`, `role`, `isVerified`, `verificationToken`) VALUES
(1, 'Magnus', 'Teschner', 'magnus.teschner@student.reutlingen-university.de', '$2b$10$cV52Og.8a/VM/HqjLP0MCelo8ZtQV/ByxUOGLbA/6czcx5lqgx67u', 'student', 1, '01d1646d-bbc1-433d-b175-d2a347fffea3'),
(2, 'Magnus', 'Teschner', 'magnus.teschner@reutlingen-university.de', '$2b$10$pdQUfbFwiyjQywqqRqg.bu/K0kZRvj70s63EX0l1zcd78pr5rDJWe', 'professor', 1, '6bed6a10-1e46-4d4e-9429-adf8b0827c82');

INSERT INTO `courses` (`course_id`, `course_name`, `program_id`, `creator`) VALUES
(1, 'Cloud', 2, 2);

INSERT INTO `course_members` (`user_id`, `course_id`, `progress`, `course_score`) VALUES
(1, 1, 0, 0);

INSERT INTO `lections` (`lection_id`, `lection_name`, `course_id`) VALUES
(1, '1', 1),
(2, '2', 1),
(3, '3', 1),
(4, '4', 1),
(5, '5', 1),
(6, '6', 1),
(7, '7', 1),
(8, '8', 1);


INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does IaaS stand for?', 'Infrastructure as a Service', 'Internet as a Service', 'Integration as a Service', 'Instance as a Service', 'Infrastructure as a Service', 1, NULL, 1);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What is PaaS?', 'Platform as a Service', 'Project as a Service', 'Package as a Service', 'Process as a Service', 'Platform as a Service', 2, NULL, 1);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which is a popular SaaS product?', 'Google Drive', 'Docker', 'Virtual Machines', 'Operating Systems', 'Google Drive', 3, NULL, 1);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does FaaS stand for?', 'Function as a Service', 'File as a Service', 'Form as a Service', 'Framework as a Service', 'Function as a Service', 4, NULL, 1);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which service type offers virtual machines?', 'IaaS', 'SaaS', 'FaaS', 'PaaS', 'IaaS', 5, NULL, 1);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What is PaaS used for?', 'Building and deploying apps', 'Storing files', 'Running servers', 'Managing networks', 'Building and deploying apps', 6, NULL, 1);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does SaaS provide?', 'Software over the internet', 'Servers to rent', 'Cloud storage', 'Functions to run', 'Software over the internet', 7, NULL, 1);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which service type gives you full control over infrastructure?', 'IaaS', 'PaaS', 'SaaS', 'FaaS', 'IaaS', 8, NULL, 1);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which cloud service type doesnt require installation of software?', 'SaaS', 'IaaS', 'PaaS', 'FaaS', 'SaaS', 9, NULL, 1);

INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does IaaS stand for?', 'Infrastructure as a Service', 'Internet as a Service', 'Integration as a Service', 'Instance as a Service', 'Infrastructure as a Service', 1, NULL, 2);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What is PaaS?', 'Platform as a Service', 'Project as a Service', 'Package as a Service', 'Process as a Service', 'Platform as a Service', 2, NULL, 2);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which is a popular SaaS product?', 'Google Drive', 'Docker', 'Virtual Machines', 'Operating Systems', 'Google Drive', 3, NULL, 2);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does FaaS stand for?', 'Function as a Service', 'File as a Service', 'Form as a Service', 'Framework as a Service', 'Function as a Service', 4, NULL, 2);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which service type offers virtual machines?', 'IaaS', 'SaaS', 'FaaS', 'PaaS', 'IaaS', 5, NULL, 2);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What is PaaS used for?', 'Building and deploying apps', 'Storing files', 'Running servers', 'Managing networks', 'Building and deploying apps', 6, NULL, 2);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does SaaS provide?', 'Software over the internet', 'Servers to rent', 'Cloud storage', 'Functions to run', 'Software over the internet', 7, NULL, 2);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which service type gives you full control over infrastructure?', 'IaaS', 'PaaS', 'SaaS', 'FaaS', 'IaaS', 8, NULL, 2);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which cloud service type doesnt require installation of software?', 'SaaS', 'IaaS', 'PaaS', 'FaaS', 'SaaS', 9, NULL, 2);

INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does IaaS stand for?', 'Infrastructure as a Service', 'Internet as a Service', 'Integration as a Service', 'Instance as a Service', 'Infrastructure as a Service', 1, NULL, 3);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What is PaaS?', 'Platform as a Service', 'Project as a Service', 'Package as a Service', 'Process as a Service', 'Platform as a Service', 2, NULL, 3);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which is a popular SaaS product?', 'Google Drive', 'Docker', 'Virtual Machines', 'Operating Systems', 'Google Drive', 3, NULL, 3);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does FaaS stand for?', 'Function as a Service', 'File as a Service', 'Form as a Service', 'Framework as a Service', 'Function as a Service', 4, NULL, 3);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which service type offers virtual machines?', 'IaaS', 'SaaS', 'FaaS', 'PaaS', 'IaaS', 5, NULL, 3);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What is PaaS used for?', 'Building and deploying apps', 'Storing files', 'Running servers', 'Managing networks', 'Building and deploying apps', 6, NULL, 3);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does SaaS provide?', 'Software over the internet', 'Servers to rent', 'Cloud storage', 'Functions to run', 'Software over the internet', 7, NULL, 3);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which service type gives you full control over infrastructure?', 'IaaS', 'PaaS', 'SaaS', 'FaaS', 'IaaS', 8, NULL, 3);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which cloud service type doesnt require installation of software?', 'SaaS', 'IaaS', 'PaaS', 'FaaS', 'SaaS', 9, NULL, 3);

INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does IaaS stand for?', 'Infrastructure as a Service', 'Internet as a Service', 'Integration as a Service', 'Instance as a Service', 'Infrastructure as a Service', 1, NULL, 4);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What is PaaS?', 'Platform as a Service', 'Project as a Service', 'Package as a Service', 'Process as a Service', 'Platform as a Service', 2, NULL, 4);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which is a popular SaaS product?', 'Google Drive', 'Docker', 'Virtual Machines', 'Operating Systems', 'Google Drive', 3, NULL, 4);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does FaaS stand for?', 'Function as a Service', 'File as a Service', 'Form as a Service', 'Framework as a Service', 'Function as a Service', 4, NULL, 4);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which service type offers virtual machines?', 'IaaS', 'SaaS', 'FaaS', 'PaaS', 'IaaS', 5, NULL, 4);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What is PaaS used for?', 'Building and deploying apps', 'Storing files', 'Running servers', 'Managing networks', 'Building and deploying apps', 6, NULL, 4);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does SaaS provide?', 'Software over the internet', 'Servers to rent', 'Cloud storage', 'Functions to run', 'Software over the internet', 7, NULL, 4);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which service type gives you full control over infrastructure?', 'IaaS', 'PaaS', 'SaaS', 'FaaS', 'IaaS', 8, NULL, 4);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which cloud service type doesnt require installation of software?', 'SaaS', 'IaaS', 'PaaS', 'FaaS', 'SaaS', 9, NULL, 4);

INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does IaaS stand for?', 'Infrastructure as a Service', 'Internet as a Service', 'Integration as a Service', 'Instance as a Service', 'Infrastructure as a Service', 1, NULL, 5);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What is PaaS?', 'Platform as a Service', 'Project as a Service', 'Package as a Service', 'Process as a Service', 'Platform as a Service', 2, NULL, 5);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which is a popular SaaS product?', 'Google Drive', 'Docker', 'Virtual Machines', 'Operating Systems', 'Google Drive', 3, NULL, 5);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does FaaS stand for?', 'Function as a Service', 'File as a Service', 'Form as a Service', 'Framework as a Service', 'Function as a Service', 4, NULL, 5);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which service type offers virtual machines?', 'IaaS', 'SaaS', 'FaaS', 'PaaS', 'IaaS', 5, NULL, 5);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What is PaaS used for?', 'Building and deploying apps', 'Storing files', 'Running servers', 'Managing networks', 'Building and deploying apps', 6, NULL, 5);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does SaaS provide?', 'Software over the internet', 'Servers to rent', 'Cloud storage', 'Functions to run', 'Software over the internet', 7, NULL, 5);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which service type gives you full control over infrastructure?', 'IaaS', 'PaaS', 'SaaS', 'FaaS', 'IaaS', 8, NULL, 5);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which cloud service type doesnt require installation of software?', 'SaaS', 'IaaS', 'PaaS', 'FaaS', 'SaaS', 9, NULL, 5);

INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does IaaS stand for?', 'Infrastructure as a Service', 'Internet as a Service', 'Integration as a Service', 'Instance as a Service', 'Infrastructure as a Service', 1, NULL, 6);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What is PaaS?', 'Platform as a Service', 'Project as a Service', 'Package as a Service', 'Process as a Service', 'Platform as a Service', 2, NULL, 6);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which is a popular SaaS product?', 'Google Drive', 'Docker', 'Virtual Machines', 'Operating Systems', 'Google Drive', 3, NULL, 6);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does FaaS stand for?', 'Function as a Service', 'File as a Service', 'Form as a Service', 'Framework as a Service', 'Function as a Service', 4, NULL, 6);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which service type offers virtual machines?', 'IaaS', 'SaaS', 'FaaS', 'PaaS', 'IaaS', 5, NULL, 6);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What is PaaS used for?', 'Building and deploying apps', 'Storing files', 'Running servers', 'Managing networks', 'Building and deploying apps', 6, NULL, 6);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does SaaS provide?', 'Software over the internet', 'Servers to rent', 'Cloud storage', 'Functions to run', 'Software over the internet', 7, NULL, 6);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which service type gives you full control over infrastructure?', 'IaaS', 'PaaS', 'SaaS', 'FaaS', 'IaaS', 8, NULL, 6);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which cloud service type doesnt require installation of software?', 'SaaS', 'IaaS', 'PaaS', 'FaaS', 'SaaS', 9, NULL, 6);

INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does IaaS stand for?', 'Infrastructure as a Service', 'Internet as a Service', 'Integration as a Service', 'Instance as a Service', 'Infrastructure as a Service', 1, NULL, 7);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What is PaaS?', 'Platform as a Service', 'Project as a Service', 'Package as a Service', 'Process as a Service', 'Platform as a Service', 2, NULL, 7);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which is a popular SaaS product?', 'Google Drive', 'Docker', 'Virtual Machines', 'Operating Systems', 'Google Drive', 3, NULL, 7);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does FaaS stand for?', 'Function as a Service', 'File as a Service', 'Form as a Service', 'Framework as a Service', 'Function as a Service', 4, NULL, 7);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which service type offers virtual machines?', 'IaaS', 'SaaS', 'FaaS', 'PaaS', 'IaaS', 5, NULL, 7);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What is PaaS used for?', 'Building and deploying apps', 'Storing files', 'Running servers', 'Managing networks', 'Building and deploying apps', 6, NULL, 7);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does SaaS provide?', 'Software over the internet', 'Servers to rent', 'Cloud storage', 'Functions to run', 'Software over the internet', 7, NULL, 7);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which service type gives you full control over infrastructure?', 'IaaS', 'PaaS', 'SaaS', 'FaaS', 'IaaS', 8, NULL, 7);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which cloud service type doesnt require installation of software?', 'SaaS', 'IaaS', 'PaaS', 'FaaS', 'SaaS', 9, NULL, 7);

INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does IaaS stand for?', 'Infrastructure as a Service', 'Internet as a Service', 'Integration as a Service', 'Instance as a Service', 'Infrastructure as a Service', 1, NULL, 8);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What is PaaS?', 'Platform as a Service', 'Project as a Service', 'Package as a Service', 'Process as a Service', 'Platform as a Service', 2, NULL, 8);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which is a popular SaaS product?', 'Google Drive', 'Docker', 'Virtual Machines', 'Operating Systems', 'Google Drive', 3, NULL, 8);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does FaaS stand for?', 'Function as a Service', 'File as a Service', 'Form as a Service', 'Framework as a Service', 'Function as a Service', 4, NULL, 8);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which service type offers virtual machines?', 'IaaS', 'SaaS', 'FaaS', 'PaaS', 'IaaS', 5, NULL, 8);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What is PaaS used for?', 'Building and deploying apps', 'Storing files', 'Running servers', 'Managing networks', 'Building and deploying apps', 6, NULL, 8);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'What does SaaS provide?', 'Software over the internet', 'Servers to rent', 'Cloud storage', 'Functions to run', 'Software over the internet', 7, NULL, 8);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which service type gives you full control over infrastructure?', 'IaaS', 'PaaS', 'SaaS', 'FaaS', 'IaaS', 8, NULL, 8);
INSERT INTO `questions` (`user_id`, `question_type`, `frage`, `answer_a`, `answer_b`, `answer_c`, `answer_d`, `correct_answer`, `position`, `image_url`, `lection_id`) VALUES
(2, 'multiple-choice', 'Which cloud service type doesnt require installation of software?', 'SaaS', 'IaaS', 'PaaS', 'FaaS', 'SaaS', 9, NULL, 8);

INSERT INTO `scores` (`user_id`, `score`) VALUES
(1, 0),
(2, 0);
