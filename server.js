// Import Express.js
const express = require("express");

// Import built-in Node.js package 'path' to resolve path of files that are located on the server
const path = require("path");
const {
  readFromFile,
  readAndAppend,
} = require("./helpers/fsUtils.js");
const uuid = require("./helpers/uuid.js")
//for POST route: match from db.json

// Initialize an instance of Express.js
const app = express();

// Specify on which port the Express.js server will run
const PORT = process.env.PORT || 3001;

// Static middleware pointing to the public folder
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//create two more routes: GET for db.json; POST for sending to db.json
app.get("/api/notes", (req, res) => 
  // try 
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
); 
// res.status(200).json('GET route from notes');
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json(error);
  // }

// ENTRY DATA
    // {
    //     "id": 1,
    //     "title":"Test Title",
    //     "text":"Test text"
    // }
app.post("/api/notes", (req, res) => {
  console.log(req.body);
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      id: uuid(),
      title,
      text,
    };
  
    readAndAppend(newNote, "./db/db.json");
  
    const response = {
      status: 'POSTed to database',
      body: newNote,
    };
    res.json(response);
  } else {
    res.json('Error in POSTing to database!')
  }
});
    // console.log(req.body);
    // res.status(200).json(`POSTed to notes`);
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json(error);
  // }


app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

// listen() method is responsible for listening for incoming connections on the specified port
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
