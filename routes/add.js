const express = require("express");
const add_route = express.Router();
app = express();
add_route.get("/add-question-form", (req, res) => {
  res.render("add");
});
add_route.post("/add-question", async (req, res) => {
  let text = req.body.text;
  let answers = req.body.answers;
  let correctAnswer = req.body.correctAnswer;
  newQuestion = {
    "text": text,
    "answers": answers,
    "correctAnswer": correctAnswer,
  };
  await req.dbs.collection("questions").insertOne(newQuestion);
  res.redirect("/questions");
});
module.exports = add_route;
