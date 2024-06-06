const express = require('express');
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2');
const app = express();
const port = 80;
const storage = multer.memoryStorage();
const upload = multer({ storage });
const Minio = require('minio');
app.use(express.json());

mysqlHost = process.env.DB;
minHost = process.env.BLOB;

const config_mysql = {
  user: "admin",
  password: "admin",
  host: process.env.DB,
  database: "clashOfStudents"
};

const minioClient = new Minio.Client({
  endPoint: minHost,
  port: 9000,
  useSSL: false,
  accessKey: 'IQ8WmkoR6EoyZtWIH4Pc',
  secretKey: 'c7SiP3sIexrTxQH8yTak5zSxBYdIpLTCuxA1qsSk',
})

const con = mysql.createConnection(config_mysql);

function getAfterLastSlash(str) {
  const lastSlashIndex = str.lastIndexOf('/');
  if (lastSlashIndex !== -1) {
    return str.substring(lastSlashIndex + 1);
  }
  return str;
}



app.post('/upload_min', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  let fileending = getAfterLastSlash(req.body.mimetype);
  let uuid = uuidv4();
  let filename = uuid + '.' + fileending;
  let bucket = 'images-questions-bucket';

  minioClient.putObject(bucket, filename, req.file.buffer, (err, objInfo) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).send('Error uploading file');
    }
    let json_object = JSON.parse(req.body.json);
    let query = "INSERT INTO questions (user, frage, question_type, answer_a, answer_b, answer_c, answer_d, correct_answer, program, course, lection, position, image_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
    const values = [
      json_object.user,
      json_object.question.frage,
      json_object.question.type,
      json_object.question.a,
      json_object.question.b,
      json_object.question.c,
      json_object.question.d,
      json_object.question.correct_answer,
      json_object.question.program,
      json_object.question.course,
      json_object.question.lection,
      json_object.question.position,
      filename
    ];

    con.query(query, values, (err) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Database error');
      }
      
      res.status(200).send("Image and question stored");
    });
  });
});



app.post('/change-img', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }


  let fileending = getAfterLastSlash(req.body.mimetype);
  let uuid = uuidv4();
  let filename = uuid + '.' + fileending;
  let bucket = 'images-questions-bucket';

  minioClient.putObject(bucket, filename, req.file.buffer, (err, objInfo) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).send('Error uploading file');
    }
    console.log(`http://${minHost}:9000/${bucket}/${filename}`);
    let json_object = JSON.parse(req.body.json);
    
    let query = "UPDATE questions SET frage = ?, question_type = ?, answer_a = ?, answer_b = ?, answer_c = ?, answer_d = ?, correct_answer = ?, program = ?, course = ?, lection = ?, position = ?, image_url = ? WHERE id = ? AND user = ?;"
  const values = [
    
    json_object.question.frage,
    json_object.question.type,
    json_object.question.a, 
    json_object.question.b, 
    json_object.question.c, 
    json_object.question.d, 
    json_object.question.correct_answer,
    json_object.question.program, 
    json_object.question.course, 
    json_object.question.lection, 
    json_object.question.position, 
    filename,
    json_object.question.id,
    json_object.user
  ];

    con.query(query, values, (err) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Database error');
      }
      
      res.status(200).send("Row updated");
    });
  });
});




app.post('/change', (req, res) => {
  let json_object = req.body;
  
  let query = "UPDATE questions SET frage = ?, question_type = ?, answer_a = ?, answer_b = ?, answer_c = ?, answer_d = ?, correct_answer = ?, program = ?, course = ?, lection = ?, position = ?, image_url = ? WHERE id = ? AND user = ?;"
  const values = [
    json_object.question.frage,
    json_object.question.type,
    json_object.question.a, 
    json_object.question.b, 
    json_object.question.c, 
    json_object.question.d, 
    json_object.question.correct_answer,
    json_object.question.program, 
    json_object.question.course, 
    json_object.question.lection, 
    json_object.question.position, 
    null,
    json_object.question.id,
    json_object.user

  ];

  con.query(query, values, (err, result) => {
  if (err) {
    console.log(err);
    res.status(500).send('SERVER_ERROR');
  }
  res.status(200).send('Row updated');
  
  });
  

})

app.post('/send', (req, res) => {
  let json_object = req.body;
  
  let query = "INSERT INTO questions (user, frage, question_type, answer_a, answer_b, answer_c, answer_d, correct_answer, program, course, lection, position, image_url) VALUES (?, ?,?, ?,?,?,?,?,?,?,?,?,?)";
  const values = [
    json_object.user,
    json_object.question.frage,
    json_object.question.type,
    json_object.question.a, 
    json_object.question.b, 
    json_object.question.c, 
    json_object.question.d, 
    json_object.question.correct_answer,
    json_object.question.program, 
    json_object.question.course, 
    json_object.question.lection, 
    json_object.question.position, 
    null
  ];
  con.query(query, values, (err, result) => {
  if (err) {
    console.log(err);
    res.status(500).send({ msg:'SERVER_ERROR' });
  }
  res.status(200).send({ id:result.insertId });
  
  });
  
});

app.post('/add_course', (req, res) => {
  let json_object = req.body;
  
  let query = "INSERT INTO course (course_name, program_name, user) VALUES (?,?,?)";
  const values = [
    json_object.course,
    json_object.program,
    json_object.user
  ];
  con.query(query, values, (err, result) => {
  if (err) {
    console.log(err);
    res.status(500).send({ msg:'SERVER_ERROR' });
  }
  res.status(200).send({ id:result.insertId });
  
  });
  
});

app.get("/all_entrys", async (req, res) => {
  let user = req.headers['user'];
  if (!user) {
    return res.status(400).send({ msg: 'USER_REQUIRED' });
  }
  let query_retrieve = "select * from questions WHERE user = ?;"
  let values = [user];
  con.query(query_retrieve, values, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ msg:'SERVER_ERROR' });
    }
    res.status(200).send(result);
    });

})

app.get("/programs", async (req, res) => {
  let query_retrieve = "select * from programs;"
  con.query(query_retrieve, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ msg:'SERVER_ERROR' });
    }
    res.status(200).send(result);
    });
})


app.get('/get_question', (req, res) => {
  let course = req.query.course
  let lection = req.query.lection
  let position = req.query.position

  let query_retrieve = `select * from questions where course = ? AND lection = ? AND position = ?;`
  const values = [course, lection, position]
  con.query(query_retrieve, values, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ msg:'SERVER_ERROR' });
    }
    res.status(200).json(result);
    });
});


app.get('/get_courses', (req, res) => {
  let user = req.query.user
  let program = req.query.program

  let query_retrieve = `select course_name from course where user = ? and program_name = ?;`
  const values = [user, program]
  con.query(query_retrieve, values, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ msg:'SERVER_ERROR' });
    }
    res.status(200).json(result);
    });
});

 
app.get('/get_positions', (req, res) => {
  let user = req.query.user;
  let program = req.query.program
  let course = req.query.course
  let lection = req.query.lection

  let query_retrieve = `select position from questions where program = ? AND course = ? AND lection = ? AND USER = ?;`
  const values = [program, course, lection, user];
  con.query(query_retrieve, values, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ msg:'SERVER_ERROR' });
    }
    const existingValues = result.map(row => row.position);
    const allValues = Array.from({ length: 10 }, (_, i) => i + 1);
    const missingValues = allValues.filter(value => !existingValues.includes(value));
    res.status(200).send(missingValues);
    });
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
