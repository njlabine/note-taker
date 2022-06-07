const express = require("express");
const path = require("path");
const termData = "./db/db.json";
const PORT = 3001;
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"), (e) => {
    if (e) {
      console.log("An error has occurred " + e);
    }
  });
});

app.get("/api/getNotes", (req, res) => {
  res.sendFile(path.join(__dirname, "db/db.json"), (e) => {
    if (e) {
      console.log(`An error occurre${e}`);
    }
  });
});

app.post("/api/notes", (req, res) => {
  const title = req.body.title;
  const text = req.body.text;

  const note = {
    id: uuidv4(),
    text,
    title,
  };

  if (title && text) {
    fs.readFile("./db/db.json", "utf8", (e, data) => {
      if (e) {
        console.log(e);
      } else {
        let fileData = JSON.parse(data);
        fileData.push(note);
        fs.writeFile("./db/db.json", JSON.stringify(fileData), (e) =>
          e ? console.log(e) : console.log("Note added")
        );
      }
    });
  }
});

app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (e, data) => {
    let fileData = JSON.parse(data);
    for (let i = 0; i < fileData.length; i++) {
      console.log(typeof fileData[i].id);
      if (fileData[i].id == req.params.id) {
        fileData.splice(i);
      }
    }
    fs.writeFile("./db/db.json", JSON.stringify(fileData), (e) =>
      e ? console.log(e) : console.log("Note was deleted")
    );
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
