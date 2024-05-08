const express = require('express');
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2');
const app = express();
const port = 81;
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

    let file_url = `http://${minHost}:9000/${bucket}/${filename}`;
    let json_object = JSON.parse(req.body.json);
    let query = "INSERT INTO questions (frage, question_type, answer_a, answer_b, answer_c, answer_d, correct_answer, course, lection, position, image_url) VALUES (?,?, ?,?,?,?,?,?,?,?,?)";
    const values = [
      json_object.question.frage,
      json_object.question.type,
      json_object.question.a,
      json_object.question.b,
      json_object.question.c,
      json_object.question.d,
      json_object.question.correct_answer,
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
      
      res.status(200).send({ id: file_url });
    });
  });
});

app.post('/send', (req, res) => {
  let json_object = req.body;
  console.log(json_object);
  
  let query = "INSERT INTO questions (frage, question_type, answer_a, answer_b, answer_c, answer_d, correct_answer, course, lection, position, image_url) VALUES (?,?, ?,?,?,?,?,?,?,?,?)";
  const values = [
    json_object.question.frage,
    json_object.question.type,
    json_object.question.a, 
    json_object.question.b, 
    json_object.question.c, 
    json_object.question.d, 
    json_object.question.correct_answer, 
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

app.get("/all_entrys", async (req, res) => {
  let query_retrieve = "select * from questions;"
  con.query(query_retrieve, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ msg:'SERVER_ERROR' });
    }
    res.status(200).send(result);
    });

})

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
