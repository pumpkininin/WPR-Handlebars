const express = require('express');
const add_route = express.Router();
const { ObjectID } = require('bson');
const bodyparser = require('body-parser');
const { response } = require('express');
const { redirect } = require('express/lib/response');
app = express();
let dbs = app.get("dbs")
add_route.get("/add-question-form", (req, res) => {
    res.render("add")
  })
add_route.post("/add-question", async(req, res) => {
    let text = req.body.text;
      let answers = req.body.answers;
      let correctAnswer = req.body.correctAnswer;
      newQuestion = {
        "text":text,
        "answers":answers,
        "correctAnswer": correctAnswer
      }
      await req.dbs.collection("questions").insertOne(newQuestion)
      res.redirect('/questions')
  })
  module.exports = add_route;