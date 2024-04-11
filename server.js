const express = require('express');
const path = require('path');
const multer = require("multer");
const { GridFSBucket } = require('mongodb');
const { GridFsStorage } = require("multer-gridfs-storage")
const { ObjectId } = require("mongodb");
const MongoClient = require("mongodb").MongoClient
const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage });
const url = 'mongodb://root:password@localhost:27017/images?authSource=admin';
const mongoClient = new MongoClient(url)



// Serve static files from the "public" directory
app.use(express.static('public'));

// Send "questions.html" when the "/questions" route is accessed
app.get('/questions', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views', 'questions.html'));
});

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
      return res.status(400).send('No file uploaded');
  }
  
  const bucket = new GridFSBucket(mongoClient.db("images"), {
      bucketName: 'images'
  });

  const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype
  });

  // Since req.file.buffer is a Buffer, we can directly write it to the upload stream
  uploadStream.end(req.file.buffer);

  uploadStream.on('error', (error) => {
      return res.status(500).send(error);
  });

  uploadStream.on('finish', (file) => {
      return res.status(201).send({
          message: 'File uploaded successfully',
          id: uploadStream.id.toString()
      });
  });
});

app.get("/images", async (req, res) => {
try {
  await mongoClient.connect()

  const database = mongoClient.db("images")
  const images = database.collection("images.files")
  const cursor = images.find({})
  const count = await cursor.count()
  if (count === 0) {
    return res.status(404).send({
      message: "Error: No Images found",
    })
  }

  const allImages = []

  await cursor.forEach(item => {
    allImages.push(item)
  })

  res.send({ files: allImages })
} catch (error) {
  console.log(error)
  res.status(500).send({
    message: "Error Something went wrong",
    error,
  })
}
})

app.get("/download", async (req, res) => {
try {
  await mongoClient.connect()

  const database = mongoClient.db("images");

  const imageBucket = new GridFSBucket(database, {
    bucketName: "images",
  })

  let downloadStream = imageBucket.openDownloadStream(new ObjectId(req.query.id)
  )

  downloadStream.on("data", function (data) {
    return res.status(200).write(data)
  })


  downloadStream.on("end", () => {
    return res.end()
  })
} catch (error) {
  console.log(error)
  res.status(500).send({
    message: "Error Something went wrong",
    error,
  })
}
})


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
