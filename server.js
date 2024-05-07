const express = require('express');
const path = require('path');
const multer = require("multer");
const { GridFSBucket } = require('mongodb');
const { GridFsStorage } = require("multer-gridfs-storage");
const { ObjectId } = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const { v4: uuidv4 } = require('uuid');
const sql = require('mysql');
const app = express();
const port = 3000;
const storage = multer.memoryStorage();
const upload = multer({ storage });
const Minio = require('minio');
app.use(express.static('public'));
app.use(express.json());

const url = 'mongodb://root:password@localhost:27017/images?authSource=admin';
const mongoClient = new MongoClient(url);

const config_mysql = {
  user: "root",
  password: "my-secret-pw",
  host: "localhost",
  database: "questions"
};

const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'i3MOJsFCDZsKvKq7fgoH',
  secretKey: 'DF9mgBxirqGzJ622lSv2s5RG2mHlgrInUlvKB0IY',
})

const con = sql.createConnection(config_mysql);


app.get('/questions', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views', 'questions.html'));
});

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

  let fileending = getAfterLastSlash(req.file.mimetype);
  let uuid = uuidv4();
  let filename = uuid + '.' + fileending;
  let bucket = 'images-questions-bucket';

  minioClient.putObject(bucket, filename, req.file.buffer, (err, objInfo) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).send('Error uploading file');
    }

    let file_url = `http://localhost:9000/${bucket}/${filename}`;
    let json_object = JSON.parse(req.body.json);
    let query = "INSERT INTO questions.final_questions (frage, answer_a, answer_b, answer_c, answer_d, correct_answer, course, lection, position, image) VALUES (?,?,?,?,?,?,?,?,?,?)";
    const values = [
      json_object.question.frage,
      json_object.question.a,
      json_object.question.b,
      json_object.question.c,
      json_object.question.d,
      json_object.question.correct_answer,
      json_object.question.course,
      json_object.question.lection,
      json_object.question.position,
      file_url
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
  
  let query = "INSERT INTO questions.final_questions (frage, answer_a, answer_b, answer_c, answer_d, correct_answer, course, lection, position, image) VALUES (?,?,?,?,?,?,?,?,?,?)";
  const values = [json_object.question.frage, json_object.question.a, json_object.question.b, json_object.question.c, json_object.question.d, json_object.question.correct_answer, json_object.question.course, json_object.question.lection, json_object.question.position, null];
  con.query(query, values, (err, result) => {
  if (err) {
    console.log(err);
    res.status(500).send({ msg:'SERVER_ERROR' });
  }
  res.status(200).send({ id:result.insertId });
  
  });
  
});

app.get("/all_entrys", async (req, res) => {
  let query_retrieve = "select * from questions.final_questions;"
  con.query(query_retrieve, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ msg:'SERVER_ERROR' });
    }
    res.status(200).send(result);
    });

})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
