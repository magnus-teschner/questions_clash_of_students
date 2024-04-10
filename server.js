const express = require('express');
const path = require('path');
const {MongoClient} = require('mongodb');
const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Send "questions.html" when the "/questions" route is accessed
app.get('/questions', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views', 'questions.html'));
});

async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function connect_mongo(){
  const uri = "mongodb://root:password@localhost:27017/test?authSource=admin";


  const client = new MongoClient(uri);

  try {
      // Connect to the MongoDB cluster
      await client.connect();

      // Make the appropriate DB calls
      await  listDatabases(client);

  } catch (e) {
      console.error(e);
  } finally {
      await client.close();
  }
}

connect_mongo().catch(console.error);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
