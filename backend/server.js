const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require("multer");
const app = express();
const port = 1999;
const port_question_service = 2000;
const storage = multer.memoryStorage();
const upload = multer({ storage });
const mysql = require('mysql2');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

const bcrypt = require('bcryptjs');
const { type } = require('os');

app.use(express.static('public'));
app.use(express.json());

app.set("views", 'public/views');
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

question_creator_service = process.env.QUESTIONCREATOR;
question_creator_service = "127.0.0.1";
mailjet_public_key = process.env.PUBLICMAIL;
mailjet_private_key = process.env.PRIVATEMAIL;
mailjet_public_key = "6a2924e64b4c454bbcdf6580e44e9ca2";
mailjet_private_key = "9b2b92a8e47833cfaeb1488d47dc1790";
backend = "127.0.0.1"

//microservices
emailService = process.env.EMAILSERVICE || "localhost";
emailPort = process.env.EMAILPORT || 1001;

userManagementService = process.env.USERSERVICE || "localhost";
userManagementPort = process.env.USERPORT || 1000;

jwtService = process.env.JWTSERVICE || "localhost";
jwtPort = process.env.JWTPORT || 1002;

questionService = process.env.QUESTIONSERVICE || "localhost";
questionPort = process.env.JWTPORT || 1003;


//common functions
const axios = require('axios');
const { send } = require('process');

const makePutRequest = async (url, data = {}, headers = { 'Content-Type': 'application/json' }) => {
  try {
    const response = await axios.put(url, data, { headers });
    return { data: response.data, status: response.status };
  } catch (error) {
    return {
      error: true,
      data: error.response ? error.response.data : error.message,
      status: error.response ? error.response.status : 500
    };
  }
};

const makeGetRequest = async (url, headers = { 'Content-Type': 'application/json' }) => {
  try {
    const response = await axios.get(url, { headers });
    return { data: response.data, status: response.status };
  } catch (error) {
    return {
      error: true,
      data: error.response ? error.response.data : error.message,
      status: error.response ? error.response.status : 500
    };
  }
};

const makePostRequest = async (url, data = {}, headers = { 'Content-Type': 'application/json' }) => {
  try {
    const response = await axios.post(url, data, { headers });
    return { data: response.data, status: response.status };
  } catch (error) {
    return {
      error: true,
      data: error.response ? error.response.data : error.message,
      status: error.response ? error.response.status : 500
    };
  }
};


const config_mysql = {
  user: "admin",
  password: "admin",
  host: "127.0.0.1",
  database: "clashOfStudents"
};

app.use((req, res, next) => {
  if (!req.isAuthenticated() && req.method === 'GET' && !req.path.includes('reset-password') && req.path !== '/favicon.ico' && req.path !== '/log-in-prof' && req.path !== '/sign-up-prof' && req.path !== '/sign-up-student' && req.path !== '/log-in-student' && req.path !== '/') {
    req.session.returnTo = req.originalUrl;
  }
  next();
});

const con = mysql.createConnection(config_mysql);


passport.use('stud',
  new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
    try {
      const account = await makeGetRequest(`http://${userManagementService}:${userManagementPort}/accounts/email/${email}`);
      if (account.error) {
        return done(null, false, { message: "Email not found" });
      }

      if (account.data.isVerified === 0) {
        return done(null, false, { message: "Email not verified" });
      }

      if (account.data.role !== 'student') {
        return done(null, false, { message: "No access for professors" });
      }

      const firstname = account.data.firstname;
      const lastname = account.data.lastname;
      const emailAccount = account.data.email;
      const passwordAccount = account.data.password;
      const user_id = account.data.user_id;

      const match = await bcrypt.compare(password, passwordAccount);
      if (!match) {
        return done(null, false, { message: "Incorrect password" })
      }

      let query_score = "SELECT score FROM scores WHERE user_id =?";
      const id_account = [user_id];

      con.query(query_score, id_account, (err, accountScore) => {
        if (err) {
          return done(err);
        }
        const score = accountScore[0].score;
        let user = {
          user_id: user_id,
          firstname: firstname,
          lastname: lastname,
          email: emailAccount,
          score: score,
        };
        return done(null, user);
      });

    } catch (err) {
      return done(err);
    }
  })
);

passport.use('prof',
  new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
    try {
      const account = await makeGetRequest(`http://${userManagementService}:${userManagementPort}/accounts/email/${email}`);
      if (account.error) {
        return done(null, false, { message: "Email not found" });
      }

      if (account.data.isVerified === 0) {
        return done(null, false, { message: "Email not verified" });
      }

      if (account.data.role !== 'professor') {
        return done(null, false, { message: "No access for students" });
      }

      const firstname = account.data.firstname;
      const lastname = account.data.lastname;
      const emailAccount = account.data.email;
      const passwordAccount = account.data.password;
      const user_id = account.data.user_id;

      const match = await bcrypt.compare(password, passwordAccount);
      if (!match) {
        return done(null, false, { message: "Incorrect password" })
      }

      let user = {
        user_id: user_id,
        firstname: firstname,
        lastname: lastname,
        email: emailAccount
      };
      return done(null, user);


    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  try {
    const account = await makeGetRequest(`http://${userManagementService}:${userManagementPort}/accounts/email/${email}`);
    if (account.error) {
      return res.status(account.status).send(account.data.error);
    }

    const user_id = account.data.user_id;
    const firstname = account.data.firstname;
    const lastname = account.data.lastname;
    const emailAccount = account.data.email;
    const role = account.data.role;
    if (role === "student") {
      const query_score = "SELECT score FROM scores WHERE user_id = ?";
      const account_id = [user_id];
      con.query(query_score, account_id, (err, accountScore) => {
        if (err) {
          return done(err);
        }

        const score = accountScore.length > 0 ? accountScore[0].score : 0;
        let user = { user_id: user_id, firstname: firstname, lastname: lastname, email: emailAccount, score: score };
        return done(null, user);
      });
    }
    let user = { user_id: user_id, firstname: firstname, lastname: lastname, email: emailAccount, score: null };
    return done(null, user);

  } catch (err) {
    done(err);
  }
});


app.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    const account = await makeGetRequest(`http://${userManagementService}:${userManagementPort}/accounts/token/${token}`);
    if (account.error) {
      return res.status(account.status).send(account.data.error);
    }
    const setVerifiedResponse = await makePutRequest(`http://${userManagementService}:${userManagementPort}/accounts/${account.data.user_id}/set-verified`)
    if (setVerifiedResponse.error) {
      return res.status(setVerifiedResponse.status).send(setVerifiedResponse.data.error);
    }
    if (account.data.role == "professor") {
      return res.render("login", { user: req.user, error: undefined, target: "professor", verification: undefined });
    } else if (account.data.role == "student") {
      return res.render("login", { user: req.user, error: undefined, target: "student", verification: undefined });
    }
  } catch (error) {
    next(error);
  }
});



app.delete('/delete-member', (req, res) => {
  const { course_id, user_email } = req.body;
  const query = `DELETE FROM course_members WHERE course_id = ? AND user_email = ?`;

  con.query(query, [course_id, user_email], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database query error' });
    }
    res.status(200).json({ message: 'Member deleted successfully' });
  });
});

app.get('/course-members', (req, res) => {
  const courseId = req.query.id;
  const email = req.user.email;
  const query = `SELECT * FROM course_members WHERE course_id = ?`;

  con.query(query, [courseId, email], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results);
  });
});


app.put('/rename-course', (req, res) => {
  const { course_id, new_course_name } = req.body;
  //console.log(course_id, new_course_name);

  if (!req.session.passport.user) {
    return res.status(401).send('No User signed in!');
  }

  const userId = req.user.email;

  // Update the course name in the course table
  const query_update_course = 'UPDATE course SET course_name = ? WHERE id = ? AND user = ?';
  const values_course = [new_course_name, course_id, userId];

  con.query(query_update_course, values_course, (err, result) => {
    if (err) {
      console.error('Error renaming course:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Course not found or not authorized to rename this course');
    }

    // Update the course name in the questions table
    const query_update_questions = 'UPDATE questions SET course = ? WHERE course = (SELECT course_name FROM course WHERE id = ?) and program = (Select program_name from course where id = ?)';
    const values_questions = [new_course_name, course_id, course_id];

    con.query(query_update_questions, values_questions, (err, result) => {
      if (err) {
        console.error('Error updating course name in questions:', err);
        return res.status(500).send('Internal Server Error');
      }

      return res.status(200).send('Course renamed and questions updated successfully');
    });
  });
});


app.put('/move-course', (req, res) => {
  const { course_id, new_program } = req.body;

  if (!req.session.passport.user) {
    return res.status(401).send('No User signed in!');
  }

  const userId = req.user.email;

  // Update the program in the course table
  const query_update_course = 'UPDATE course SET program_name = ? WHERE id = ? AND user = ?';
  const values_course = [new_program, course_id, userId];

  con.query(query_update_course, values_course, (err, result) => {
    if (err) {
      console.error('Error moving course:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Course not found or not authorized to move this course');
    }

    // Update the program in the questions table
    const query_update_questions = 'UPDATE questions SET program = ? WHERE course = (SELECT course_name FROM course WHERE id = ?)';
    const values_questions = [new_program, course_id];
    console.log(values_questions);

    con.query(query_update_questions, values_questions, (err, result) => {
      if (err) {
        console.error('Error updating program in questions:', err);
        return res.status(500).send('Internal Server Error');
      }

      return res.status(200).send('Course moved and questions updated successfully');
    });
  });
});




app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get('/questions', async (req, res) => {
  if (!req.user) {
    return res.render("questions", { user: undefined, programs: undefined })
  }
  const programs = await makeGetRequest(`http://${questionService}:${questionPort}/programs`);
  if (programs.error) {
    return res.status(programs.status).send(programs.data.error);
  }
  return res.render("questions", { user: req.user, programs: programs.data })
});


app.get('/manage-questions', async (req, res) => {
  if (!req.user) {
    return res.render("show-manage-questions", { user: undefined, questions: undefined })
  }
  const questions = await makeGetRequest(`http://${questionService}:${questionPort}/questions/${req.user.user_id}`);
  if (questions.error) {
    return res.status(questions.status).send(questions.data.error);
  }
  console.log(questions);
  return res.render("show-manage-questions", { user: req.user, questions: questions.data })
});

app.get('/courses', (req, res) => {
  if (!req.user) {
    return res.render("courses", {
      user: req.user,
      nonEnrolledCourses: [],
      enrolledCourses: []
    });
  }

  const query_courses = 'SELECT * FROM courses';
  const query_enrolled_courses = `
    SELECT c.*, cm.progress, cm.course_score 
    FROM courses c 
    JOIN course_members cm 
    ON c.course_id = cm.course_id 
    WHERE cm.user_id = ?`;

  con.query(query_courses, (err, courses) => {
    if (err) {
      console.error('Error fetching courses:', err);
      return res.status(500).send('Internal Server Error');
    }

    const promises_unenroll = courses.map(course => {
      if (course.user) {
        const emailParts = course.user.split('@')[0].split('.');
        course.lastname = emailParts.length > 1 ? emailParts[emailParts.length - 1] : '';
        course.lastname = course.lastname.charAt(0).toUpperCase() + course.lastname.slice(1);
      }
    });

    con.query(query_enrolled_courses, [req.user.email], (err, enrolledCourses) => {
      if (err) {
        console.error('Error fetching enrolled courses:', err);
        return res.status(500).send('Internal Server Error');
      }

      const getLectionsForCourse = (program, course) => {
        return new Promise((resolve, reject) => {
          const query = `SELECT DISTINCT lection FROM questions WHERE program = ? AND course = ?`

          con.query(query, [program, course], (err, results) => {
            if (err) {
              return reject(err);
            }
            resolve(results.map(r => r.lection));
          });
        });
      };

      const promises_enroll = enrolledCourses.map(course => {
        if (course.user) {
          const emailParts = course.user.split('@')[0].split('.');
          course.lastname = emailParts.length > 1 ? emailParts[emailParts.length - 1] : '';
          course.lastname = course.lastname.charAt(0).toUpperCase() + course.lastname.slice(1);
        }

        return getLectionsForCourse(course.program_name, course.course_name).then(lections => {
          course.lections = lections;
        });
      });

      Promise.all(promises_enroll, promises_unenroll).then(() => {
        return res.render("courses", {
          user: req.user,
          nonEnrolledCourses: courses,
          enrolledCourses: enrolledCourses
        });
      }).catch(err => {
        console.error('Error fetching lections:', err);
        return res.status(500).send('Internal Server Error');
      });
    });
  });
});

// Endpoint to handle course enrollment
app.post('/enroll-course', (req, res) => {
  if (!req.user) {
    return res.status(401).send('No User signed in!');
  }

  const courseId = req.body.course_id;
  const userEmail = req.user.email;

  const query_enroll = 'INSERT INTO course_members (user_email, course_id, progress, course_score) VALUES (?, ?, 0, 0)';

  con.query(query_enroll, [userEmail, courseId], (err, result) => {
    if (err) {
      console.error('Error enrolling in course:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.status(200).send('Enrolled successfully');
  });
});

app.get('/course-progress', (req, res) => {
  if (!req.user) {
    return res.status(401).send('No User signed in!');
  }

  const userEmail = req.user.email;

  const query_progress = 'SELECT course_id, progress, course_score FROM course_members WHERE user_email = ?';

  con.query(query_progress, [userEmail], (err, results) => {
    if (err) {
      console.error('Error fetching course progress:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.status(200).json(results);
  });
});

// Endpoint to handle course unenrollment
app.post('/unenroll-course', (req, res) => {
  if (!req.user) {
    return res.status(401).send('No User signed in!');
  }

  const courseId = req.body.course_id;
  const userEmail = req.user.email;

  const query_unenroll = 'DELETE FROM course_members WHERE user_email = ? AND course_id = ?';

  con.query(query_unenroll, [userEmail, courseId], (err, result) => {
    if (err) {
      console.error('Error unenrolling from course:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.status(200).send('Unenrolled successfully');
  });
});

app.get('/ranking', (req, res) => {
  const rankingQuery = `
    SELECT a.id, a.firstname, a.lastname, s.score
    FROM accounts a
    JOIN scores s ON a.id = s.account_id
  `;

  con.query(rankingQuery, [], (err, rows) => {
    if (err) {
      return next(err);
    }

    const sortedData = rows.sort((a, b) => {
      if (b.score === a.score) {
        return a.firstname.localeCompare(b.firstname);
      }
      return b.score - a.score;
    });

    let currentRank = 1;
    let currentScore = sortedData[0].score;
    sortedData.forEach((user, index) => {
      if (user.score < currentScore) {
        currentRank = index + 1;
        currentScore = user.score;
      }
      user.rank = currentRank;
    });

    const rankingList = sortedData.map(user => ({
      rank: user.rank,
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      score: user.score
    }));

    res.render('ranking', { user: req.user, rankingList: rankingList });
  });
});

app.get('/manage-courses', async (req, res) => {
  try {
    const user = req.user;
    const programsUrl = `http://${question_creator_service}:${port_question_service}/programs`;

    const programsResponse = await fetch(programsUrl, { method: 'GET' });
    const programs = await programsResponse.json();

    const coursesPromises = programs.map(program => {
      console.log(user);
      const queryParams = new URLSearchParams({
        user: user.email,
        program: program.program_name
      });
      const coursesUrl = `http://${question_creator_service}:${port_question_service}/get_courses/?${queryParams}`;
      return fetch(coursesUrl, { method: 'GET' }).then(response => response.json());
    });

    const allCourses = await Promise.all(coursesPromises);

    const programsWithCourses = programs.map((program, index) => ({
      program_name: program.program_name,
      courses: allCourses[index]
    }));


    res.render("manage-courses", { user: req.user, programsWithCourses });
  } catch (error) {
    console.error('Error:', error);
    res.render("manage-courses", { user: req.user, programsWithCourses: [] });
  }
});

app.delete('/delete-course', (req, res) => {
  if (!req.session.passport.user) {
    return res.status(401).send('No User signed in!');
  }

  const userId = req.user.email;
  const courseId = req.query.id;

  const query_delete = 'DELETE FROM course WHERE id = ? AND user = ?';
  const values = [courseId, userId];
  //console.log(values);

  con.query(query_delete, values, (err, result) => {
    if (err) {
      console.error('Error deleting course:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Course not found or not authorized to delete this course');
    }

    return res.status(200).send('Course deleted successfully');
  });
});



app.get("/log-in-prof", (req, res) => {
  if (req.session.messages) {
    const error = req.session.messages.length > 0 ? req.session.messages[req.session.messages.length - 1] : undefined;
    return res.render("login", { user: req.user, error: error, target: "professor", verification: undefined });
  } else {
    return res.render("login", { user: req.user, error: undefined, target: "professor", verification: undefined });
  }

});

app.get("/log-in-student", (req, res) => {
  if (req.session.messages) {
    const error = req.session.messages.length > 0 ? req.session.messages[req.session.messages.length - 1] : undefined;
    return res.render("login", { user: req.user, error: error, target: "student", verification: undefined });
  } else {
    return res.render("login", { user: req.user, error: undefined, target: "student", verification: undefined });
  }
});


app.get('/', (req, res) => {
  return res.render("login", { user: req.user, error: undefined, target: undefined, verification: undefined });
});

app.post("/log-in-student", (req, res, next) => {
  let return_to_req = req.session.returnTo;
  console.log(return_to_req);
  passport.authenticate("stud", (err, user, info) => {
    if (err) {
      return next(err);
    }
    console.log(user);
    if (!user) {
      req.session.messages = [info ? info.message : 'Invalid credentials'];
      console.log("redirect")
      return res.redirect("/log-in-student");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const redirectTo = return_to_req || '/courses';
      delete req.session.returnTo;
      return res.redirect(redirectTo);
    });
  })(req, res, next);
});

app.post("/log-in-prof", (req, res, next) => {
  const return_to_req = req.session.returnTo;
  console.log(return_to_req);
  passport.authenticate("prof", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.session.messages = [info ? info.message : 'Invalid credentials'];
      return res.redirect("/log-in-prof");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const redirectTo = return_to_req || '/questions';
      delete req.session.returnTo;
      return res.redirect(redirectTo);
    });
  })(req, res, next);
});



app.get('/sign-up-student', (req, res) => {
  return res.render("sign-up-student", { error: undefined });
});

app.get('/sign-up-prof', (req, res) => {
  return res.render("sign-up-prof", { error: undefined });
});

app.post("/sign-up", async (req, res, next) => {
  const dataAccountCreation = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  };
  const { role } = req.body;
  const accountCreationResponse = await makePostRequest(`http://${userManagementService}:${userManagementPort}/accounts`, dataAccountCreation);

  if (accountCreationResponse.error) {
    if (role === "professor") {
      return res.render("sign-up-prof", { error: accountCreationResponse.data.error });
    } else if (role === "student") {
      return res.render("sign-up-student", { error: accountCreationResponse.data.error });
    }
  }

  const dataVerificationEmail = {
    firstname: req.body.fname,
    lastname: req.body.lname,
    email: req.body.email,
    token: accountCreationResponse.data.token
  };
  console.log(`http://${emailService}:${emailPort}/send-verification`);
  const sendEmailResponse = await makePostRequest(`http://${emailService}:${emailPort}/email/send-verification`, dataVerificationEmail);
  if (sendEmailResponse.error) {
    res.status(sendEmailResponse.status).send(sendEmailResponse.data.error);
  }
  const user_id = accountCreationResponse.data.user_id;
  //TODO: insert score entry in db
  // @ luca kannst für deinen microservice aufruf zum score eintragen den wert aus user_id nehmen
  if (role === "professor") {
    return res.render("login", { user: req.user, error: undefined, target: "professor", verification: 1 });
  } else if (role === "student") {
    return res.render("login", { user: req.user, error: undefined, target: "student", verification: 1 });
  }
});


app.post('/question', async (req, res) => {
  if (!req.user) {
    return res.status(500).send('No User signed in!')
  }

  const contentType = req.headers['content-type'];
  if (contentType.includes('multipart/form-data')) {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'Image upload failed' });
      }

      questionData = JSON.parse(req.body.questionData);
      imageFile = req.file;

      const {
        question_type,
        frage,
        answer_a,
        answer_b,
        answer_c,
        answer_d,
        correct_answer,
        position,
        lection_id
      } = questionData;

      const sendQuestionData = {
        user_id: req.user.user_id,
        question_type: question_type,
        frage: frage,
        answer_a: answer_a,
        answer_b: answer_b,
        answer_c: answer_c,
        answer_d: answer_d,
        correct_answer: correct_answer,
        position: position,
        lection_id: lection_id,
      }

      const formData = new FormData();
      formData.append('image', new Blob([req.file.buffer], { type: req.file.mimetype }));
      formData.append('questionData', JSON.stringify(sendQuestionData));

      const questionCreationResponse = await makePostRequest(`http://${questionService}:${questionPort}/question`, formData, {
        'Content-Type':
          "multipart/form-data"
      })
      if (questionCreationResponse.error) {
        return res.status(questionCreationResponse.status).send(questionCreationResponse.data.error);
      }
      return res.status(201).send(questionCreationResponse.data.message);
    });
  } else if (contentType.includes('application/json')) {
    const {
      question_type,
      frage,
      answer_a,
      answer_b,
      answer_c,
      answer_d,
      correct_answer,
      position,
      lection_id
    } = req.body;

    const sendQuestionData = {
      user_id: 2,
      question_type: question_type,
      frage: frage,
      answer_a: answer_a,
      answer_b: answer_b,
      answer_c: answer_c,
      answer_d: answer_d,
      correct_answer: correct_answer,
      position: position,
      lection_id: lection_id,
    }

    const questionCreationResponse = await makePostRequest(`http://${questionService}:${questionPort}/question`, sendQuestionData)
    if (questionCreationResponse.error) {
      return res.status(questionCreationResponse.status).send(questionCreationResponse.data.error);
    }
    return res.status(201).send(questionCreationResponse.data.message);
  }
})

app.put('/question', async (req, res) => {
  if (!req.user) {
    return res.status(500).send('No User signed in!')
  }

  const contentType = req.headers['content-type'];
  if (contentType.includes('multipart/form-data')) {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'Image upload failed' });
      }

      questionData = JSON.parse(req.body.questionData);
      imageFile = req.file;

      const {
        question_id,
        question_type,
        frage,
        answer_a,
        answer_b,
        answer_c,
        answer_d,
        correct_answer
      } = questionData;

      const sendQuestionData = {
        user_id: req.user.user_id,
        question_id: question_id,
        question_type: question_type,
        frage: frage,
        answer_a: answer_a,
        answer_b: answer_b,
        answer_c: answer_c,
        answer_d: answer_d,
        correct_answer: correct_answer
      }

      const formData = new FormData();
      formData.append('image', new Blob([req.file.buffer], { type: req.file.mimetype }));
      formData.append('questionData', JSON.stringify(sendQuestionData));

      const questionCreationResponse = await makePutRequest(`http://${questionService}:${questionPort}/question`, formData, {
        'Content-Type':
          "multipart/form-data"
      })
      if (questionCreationResponse.error) {
        return res.status(questionCreationResponse.status).send(questionCreationResponse.data.error);
      }
      return res.status(200).send(questionCreationResponse.data.message);
    });
  } else if (contentType.includes('application/json')) {
    const {
      question_id,
      question_type,
      frage,
      answer_a,
      answer_b,
      answer_c,
      answer_d,
      correct_answer
    } = req.body;

    const sendQuestionData = {
      user_id: req.user.user_id,
      question_id: question_id,
      question_type: question_type,
      frage: frage,
      answer_a: answer_a,
      answer_b: answer_b,
      answer_c: answer_c,
      answer_d: answer_d,
      correct_answer: correct_answer
    }

    const questionCreationResponse = await makePutRequest(`http://${questionService}:${questionPort}/question`, sendQuestionData)
    if (questionCreationResponse.error) {
      return res.status(questionCreationResponse.status).send(questionCreationResponse.data.error);
    }
    return res.status(200).send(questionCreationResponse.data.message);
  }
})

app.post('/add_course', (req, res) => {
  if (!req.session.passport.user) {
    return res.status(500).send('No User signed in!')
  }
  const userData = {
    user: req.session.passport.user,
    ...req.body
  };
  fetch(`http://${question_creator_service}:${port_question_service}/add_course/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  })
    .then(response => response.json())
    .then(data => res.send(data))
    .catch(error => {
      console.error('Error:', error);
      return res.status(500).send('Internal Server Error');
    });
});




app.get('/get_question', (req, res) => {

  const queryParams = new URLSearchParams({
    course: req.query.course,
    lection: req.query.lection,
    position: req.query.position
  });
  // Construct the URL with parameters
  let url = `http://${question_creator_service}:${port_question_service}/get_question/?${queryParams}`;

  // Make the GET request
  fetch(url, {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => res.send(data))
    .catch(error => {
      console.error('Error:', error);
      return res.status(500).send('Internal Server Error');
    });
});


app.get('/get_courses', (req, res) => {
  const queryParams = new URLSearchParams({
    user: req.user.email,
    program: req.query.program
  });

  // Construct the URL with parameters
  let url = `http://${question_creator_service}:${port_question_service}/get_courses/?${queryParams}`;

  // Make the GET request
  fetch(url, {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => res.send(data))
    .catch(error => {
      console.error('Error:', error);
      return res.status(500).send('Internal Server Error');
    });
});


app.get('/get_positions', (req, res) => {
  const queryParams = new URLSearchParams({
    user: req.user.email,
    program: req.query.program,
    course: req.query.course,
    lection: req.query.lection

  });

  // Construct the URL with parameters
  let url = `http://${question_creator_service}:${port_question_service}/get_positions/?${queryParams}`;

  // Make the GET request
  fetch(url, {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => res.send(data))
    .catch(error => {
      console.error('Error:', error);
      return res.status(500).send('Internal Server Error');
    });
});

app.get('/api/questions/:user/:program/:course/:lection/:position', (req, res) => {
  const { user, program, course, lection, position } = req.params;

  const query = `
    SELECT * FROM questions
    WHERE user = ? AND program = ? AND course = ? AND lection = ? AND position = ?
  `;

  console.log(user, program, course, lection, position);

  con.query(query, [user, program, course, lection, position], (err, result) => {
    if (err) {
      console.error('Error fetching question:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(result[0]);
  });
});

app.get('/reset-password-request', (req, res) => {
  res.render('request-reset', { user: req.user });
});

app.post('/send-reset-email', async (req, res, next) => {
  try {
    const email = req.body.email;
    const token = uuidv4();
    const account = await makeGetRequest(`http://${userManagementService}:${userManagementPort}/accounts/email/${email}`);
    if (account.error) {
      res.status(account.status).send(account.data.error);
    }
    const user_id = account.data.user_id;
    const setTokenResponse = await makePutRequest(`http://${userManagementService}:${userManagementPort}/accounts/${user_id}/token/${token}`);
    if (setTokenResponse.error) {
      res.status(setTokenResponse.status).send(setTokenResponse.data.error);
    }
    const dataPasswordResetEmail = {
      firstname: account.data.firstname,
      lastname: account.data.lastname,
      email: account.data.email,
      token: token
    }
    const sendEmailResponse = await makePostRequest(`http://${emailService}:${emailPort}/email/send-reset-password`, dataPasswordResetEmail);
    if (sendEmailResponse.error) {
      res.status(sendEmailResponse.status).send(sendEmailResponse.data.error);
    }
    return res.render('success');
  } catch (error) {
    return next(error);
  }
});

app.get('/reset-password/:token', async (req, res, next) => {
  try {
    const { token } = req.params;
    const account = await makeGetRequest(`http://${userManagementService}:${userManagementPort}/accounts/token/${token}`);
    if (account.error) {
      return res.status(account.status).send(account.data.status)
    }
    return res.render('reset-password', { token: req.params.token })
  } catch (error) {
    next(error)
  }
});

app.post('/reset-password', async (req, res, next) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (password !== confirmPassword) return res.status(400).send('Passwords do not match.');
    const account = await makeGetRequest(`http://${userManagementService}:${userManagementPort}/accounts/token/${token}`);
    if (account.error) {
      return res.status(account.status).send(account.data.status);
    }
    const newPasswordData = {
      newPassword: password
    }
    const resetPasswordResponse = await makePutRequest(`http://${userManagementService}:${userManagementPort}/accounts/${account.data.user_id}/password`, newPasswordData);
    if (resetPasswordResponse.error) {
      return res.status(resetPasswordResponse.status).send(resetPasswordResponse.data.error)
    }
    res.render('success_change');
  } catch (error) {
    next(error)
  }

});

app.post('/jwt', async (req, res) => {
  const { program, course, professorEmail } = req.body;
  const jwtGenerationData = {
    email: req.user.email,
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    program: program,
    course: course,
    professor_email: professorEmail
  };
  const jwt = await makePostRequest(`http://${jwtService}:${jwtPort}/jwt`, jwtGenerationData);
  if (jwt.error) {
    res.status(jwt.status).send(jwt.data.error);
  }
  res.json({ token: jwt });
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});