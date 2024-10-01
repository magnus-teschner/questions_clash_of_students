const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require("multer");
const app = express();
const port = 80;
const cors = require('cors');
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
app.use(cors());

app.set("views", 'public/views');
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));


//microservices
emailService = process.env.EMAILSERVICE || "localhost";
emailPort = process.env.EMAILPORT || 80;

userManagementService = process.env.USERSERVICE || "localhost";
userManagementPort = process.env.USERPORT || 80;

jwtService = process.env.JWTSERVICE || "localhost";
jwtPort = process.env.JWTPORT || 80;

questionService = process.env.QUESTIONSERVICE || "localhost";
questionPort = process.env.JWTPORT || 80;

courseService = process.env.COURSESERVICE || "localhost";
coursePort = process.env.COURSEPORT || 80;

scoreService = process.env.SCORESERVICE || "localhost";
scorePort = process.env.SCOREPORT || 80;

rankingService = process.env.RANKINGSERVICE || 'localhost';
rankingPort = process.env.RANKINGPORT || 80;


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

const makeDeleteRequest = async (url, data = {}, headers = { 'Content-Type': 'application/json' }) => {
  try {
    const response = await axios.delete(url, data, { headers });
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
  host: process.env.DB,
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
      const score = await makeGetRequest(`http://${scoreService}:${scorePort}/score/user/${user_id}`, {});
      if (score.error) {
        return done(null, false, { message: score.data.error })
      }
      let retrieved_score = score.data.totalScore;
      let user = {
        user_id: user_id,
        firstname: firstname,
        lastname: lastname,
        email: emailAccount,
        score: retrieved_score,
      };
      return done(null, user);
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
      const score = await makeGetRequest(`http://${scoreService}:${scorePort}/score/user/${user_id}`, {});
      if (score.error) {
        return done(score.data.error)
      }
      let retrieved_score = score.data.totalScore;
      let user = {
        user_id: user_id,
        firstname: firstname,
        lastname: lastname,
        email: emailAccount,
        score: retrieved_score,
      };
      return done(null, user);
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


app.put('/rename-course', (req, res) => {
  const user_id = req.user.user_id;
  const course_id = req.body.course_id;
  const new_course_name = req.body.new_course_name;

  let url = `http://${courseService}:${coursePort}/rename-course`;

  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id, course_id, new_course_name }),  // Übergabe der Daten
  })
    .then(response => {
      console.log(response);
      if (response.ok) {
        return res.status(200).send('Course renamed successfully');
      } else {
        return response.text().then(text => res.status(response.status).send(text));
      }
    })
    .catch(error => {
      console.error('Error renaming course:', error);
      return res.status(500).send('Internal Server Error');
    });
});

app.put('/move-course', async (req, res) => {
  const { course_id, new_program } = req.body;

  if (!req.session.passport.user) {
    return res.status(401).send('No User signed in!');
  }

  const userId = req.user.user_id;
  const sendMoveData = {
    userId: userId,
    courseId: course_id,
    programId: new_program
  }

  const courseMove = await makePutRequest(`http://${courseService}:${coursePort}/course/move`, sendMoveData)
  if (courseMove.error) {
    return res.status(courseMove.status).send(courseMove.data.error)
  }
  return res.status(200).send('Course moved successfully');
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
  if (questions.status === 404) {
    return res.render("show-manage-questions", { user: req.user, questions: [] })
  }
  if (questions.error) {
    return res.status(questions.status).send(questions.data.error);
  }
  return res.render("show-manage-questions", { user: req.user, questions: questions.data })
});


app.get('/courses', (req, res) => {
  if (!req.user) {
    return res.render('courses', { user: undefined, enrolledCourses: undefined, nonEnrolledCourses: undefined });
  }

  let url = `http://${courseService}:${coursePort}/courses/?user_id=${req.user.user_id}`;

  fetch(url, {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => {
      const enrolledCourses = data.enrolledCourses;
      const nonEnrolledCourses = data.nonEnrolledCourses;
      return res.render('courses', { user: req.user, enrolledCourses: enrolledCourses, nonEnrolledCourses: nonEnrolledCourses });
    })
    .catch(error => {
      console.error('Error fetching courses from microservice:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    });
});




// Endpoint to handle course enrollment
app.post('/enroll-course', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  const user_id = req.user.user_id;
  const course_id = req.body.course_id;

  console.log(user_id, course_id, 'HIEERRR')

  let url = `http://${courseService}:${coursePort}/enroll-course`;

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id, course_id }),
  })
    .then(response => {
      if (response.ok) {
        res.status(200).send('Enrolled successfully');
      } else {
        return response.text().then(text => res.status(500).send(text));
      }
    })
    .catch(error => {
      console.error('Error enrolling in course:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    });
});

// Endpoint to handle course unenrollment
app.post('/unenroll-course', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const user_id = req.user.user_id;
  const course_id = req.body.course_id;

  let url = `http://${courseService}:${coursePort}/unenroll-course`;

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id, course_id }),
  })
    .then(response => {
      if (response.ok) {
        res.status(200).send('Unenrolled successfully');
      } else {
        return response.text().then(text => res.status(500).send(text));
      }
    })
    .catch(error => {
      console.error('Error unenrolling from course:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    });
});

app.get('/course-progress', (req, res) => {
  const url = `http://${courseService}:${coursePort}/course-progress/?user_id=${req.user.user_id}`;

  fetch(url, {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      console.error('Error fetching course progress from microservice:', error);
      next(error);
    });
});

app.post('/score-submission', (req, res, next) => {
  const { user, course, lection, final_score } = req.body;
  const sendScoreSubmissionData = {
    userId: user,
    courseId: course,
    lectionName: lection,
    score: final_score
  };
  const url = `http://${scoreService}:${scorePort}/score/update-lection-score`;

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sendScoreSubmissionData)
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.message);
        });
      }
      return response.json();
    })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      console.error('Error updating lection score and course progress:', error);
      res.status(500).json({ error: 'Failed to update lection score and course progress' });
    });
});

app.get('/course-members', async (req, res) => {
  const courseId = req.query.id;
  const courseMembers = await makeGetRequest(`http://${courseService}:${coursePort}/course/${courseId}/members`, {})
  if (courseMembers.error) {
    return res.send([])
  };
  return res.send(courseMembers.data);
});

app.delete('/delete-course-member', async (req, res) => {
  const { course_id, user_id } = req.body;

  // Check if both course_id and user_id are provided
  if (!course_id || !user_id) {
    return res.status(400).json({ error: 'course_id and user_id are required' });
  }

  const courseMemberDeletion = await makeDeleteRequest(`http://${courseService}:${coursePort}/course/${course_id}/user/${user_id}`, {})
  if (courseMemberDeletion.error) {
    return res.status(courseMemberDeletion.status).send(courseMemberDeletion.data.error)
  }

  return res.status(200).send("Member deleted successfully")
});

app.get('/ranking', (req, res) => {
  const selectedCourse = req.query.course || 'all';
  const selectedLection = req.query.lection || '';

  if (!req.user) {
    return res.render('ranking', { user: undefined, rankingList: [], courses: [], lections: [] });
  }

  const url = `http://${rankingService}:${rankingPort}/ranking?course=${selectedCourse}&lection=${selectedLection}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { rankingList, courses, lections } = data;

      res.render('ranking', {
        user: req.user,
        rankingList,
        courses,
        lections,
        selectedCourse,
        selectedLection
      });
    })
    .catch(error => {
      console.error('Error fetching ranking from microservice:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

app.get('/manage-courses', async (req, res) => {
  try {
    if (!req.user) {
      return res.render("manage-courses", { user: undefined, programsWithCourses: undefined })
    }
    const userId = req.user.user_id;
    const programs = await makeGetRequest(`http://${questionService}:${questionPort}/programs`);

    if (programs.error) {
      return res.status(programs.status).send(programs.data.error);
    }

    const programsWithCourses = await Promise.all(programs.data.map(async (program) => {
      const courses = await makeGetRequest(`http://${courseService}:${coursePort}/programs/${program.program_id}/user/${userId}/courses`);

      const coursesData = courses.error ? [] : courses.data;

      return {
        program_id: program.program_id,
        program_name: program.program_name,
        courses: coursesData
      };
    }));

    res.render("manage-courses", { user: req.user, programsWithCourses });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send("Internal server error");
  }
});


app.delete('/delete-course', (req, res) => {
  const user_id = req.user.user_id;
  const course_id = req.body.course_id;

  let url = `http://${courseService}:${coursePort}/delete-course`;

  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id, course_id }),
  })
    .then(response => {
      if (response.ok) {
        res.status(200).send('Course deleted successfully');
      } else {
        return response.text().then(text => res.status(response.status).send(text));
      }
    })
    .catch(error => {
      console.error('Error deleting course:', error);
      return res.status(500).send('Internal Server Error');
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
  const sendEmailResponse = await makePostRequest(`http://${emailService}:${emailPort}/email/send-verification`, dataVerificationEmail);
  if (sendEmailResponse.error) {
    return res.status(sendEmailResponse.status).send(sendEmailResponse.data.error);
  }
  const user_id = accountCreationResponse.data.user_id;

  const createScoreResponse = await makePostRequest(`http://${scoreService}:${scorePort}/score/user/${user_id}/score`, {});
  console.log(createScoreResponse);
  if (createScoreResponse.error) {
    return res.status(createScoreResponse.status).send(createScoreResponse.data.error);
  }

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

app.post('/add_course', async (req, res) => {
  if (!req.session.passport.user) {
    return res.status(500).send('No User signed in!')
  }

  const { program_id, course_name } = req.body;
  const sendCourseData = {
    userId: req.user.user_id,
    programId: program_id,
    courseName: course_name
  }
  const courseCreationResponse = await makePostRequest(`http://${courseService}:${coursePort}/course`, sendCourseData);
  if (courseCreationResponse.error) {
    return res.status(courseCreationResponse.status).send(courseCreationResponse.data.error);
  };
  const lectionCreationResponse = await makePostRequest(`http://${courseService}:${coursePort}/course/${courseCreationResponse.data.courseId}/lections`, {})
  if (lectionCreationResponse.error) {
    return res.status(lectionCreationResponse.status).send(lectionCreationResponse.data.error);
  }
  return res.status(200).send(courseCreationResponse.data);
});


app.get('/get_courses/:program_id', async (req, res) => {
  let user = req.user;
  const user_id = user.user_id;
  const { program_id } = req.params;
  const courses = await makeGetRequest(`http://${courseService}:${coursePort}/programs/${program_id}/user/${user_id}/courses`);
  console.log(courses);
  if (courses.error) {
    return res.status(courses.status).send(courses.data.message);
  }
  return res.status(200).send(courses.data)
});

app.get('/get_lections/:course_id', async (req, res) => {
  const { course_id } = req.params;
  const lections = await makeGetRequest(`http://${courseService}:${coursePort}/course/${course_id}/lections`);
  if (lections.error) {
    return res.status(lections.status).send(lections.data.message);
  }
  return res.status(200).send(lections.data)
});

app.get('/get_positions/:lection_id', async (req, res) => {
  const { lection_id } = req.params;
  const lections = await makeGetRequest(`http://${questionService}:${questionPort}/lection/${lection_id}/unused-positions`);
  if (lections.error) {
    return res.status(lections.status).send(lections.data.message);
  }
  return res.status(200).send(lections.data)
});

app.get('/api/questions/:user/:program/:course/:lection/:position', async (req, res) => {

  const { user, program, course, lection, position } = req.params;
  const question = await makeGetRequest(`http://${questionService}:${questionPort}/course/${course}/lection/${lection}/position/${position}/question/`);
  if (question.error) {
    return res.status(question.status).send(question.data.error);
  }

  return res.json(question.data)
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
  const { program, course } = req.body;
  const jwtGenerationData = {
    email: req.user.user_id,
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    program: program,
    course: course,
    professorEmail: "placeholder@gmail.com"
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