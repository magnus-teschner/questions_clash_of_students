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
  
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `scores` (
  `account_id` int(11) NOT NULL,
  `score` int(11),
  PRIMARY KEY (`account_id`),
  FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE
);