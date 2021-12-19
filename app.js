const express = require("express");
const { body, validationResult } = require("express-validator");
const mongodb = require("mongodb");
const bodyparser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
const { ObjectID } = require("bson");
const { response } = require("express");
const router = express.Router();
const app = express();
const DB_NAME = "wpr-quiz";
const DB_URL = "mongodb://localhost:27017/";
let dbs = null;

var hbs = exphbs.create({
  helpers: {
    inc: function (value, options) {
      return parseInt(value) + 1;
    },
    ifEqual: function (value1, value2) {
      return parseInt(value1) === parseInt(value2);
    },
    toInt: function (value) {
      return parseInt(value);
    },
  },
  extname: ".hbs",
});
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static(path.join(__dirname, "/public")));
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

async function startServer() {
  const client = await mongodb.MongoClient.connect(
    "mongodb://localhost:27017/wpr-quiz"
  ); //connect to dbs
  dbs = client.db(DB_NAME); // client is note defined (promise)
  app.listen(3000, () => {
    //start server in port 3000
    console.log("Listening on port 3000");
  });
}
startServer();
app.get("/questions", async (req, res) => {
  let questionBank = await dbs.collection("questions").find({}).toArray();
  let response = [];
  console.log(questionBank);
  for (index in questionBank) {
    response[index] = {
      _id: questionBank[index]._id,
      text: questionBank[index].text,
      correctAnswer:
        questionBank[index].answers[questionBank[index].correctAnswer],
    };
  }
  res.render("index", { questions: response });
});
app.post("/search", async (req, res) => {
  const keyword = req.body.keyword;
  let result = await dbs
    .collection("questions")
    .find({ text: { $regex: keyword, $options: "i" } })
    .toArray();
  let response = [];
  for (index in result) {
    response[index] = {
      _id: result[index]._id,
      text: result[index].text,
      correctAnswer: result[index].answers[result[index].correctAnswer],
    };
  }
  res.render("index", { questions: response });
});
app.get("/edit-form", async (req, res) => {
  let reqiestId = req.query.id;
  let editQues = await dbs
    .collection("questions")
    .findOne({ _id: ObjectID(reqiestId) });
  let response = {};
  response["_id"] = editQues._id;
  response["text"] = editQues.text;
  response["answers"] = [];
  for (index in editQues.answers) {
    response["answers"][index] = {
      answer: editQues.answers[index],
      isCorrect:
        parseInt(index) === parseInt(editQues.correctAnswer) ? "checked" : "",
    };
  }
  res.render("edit", { question: response });
});
// app.get("/add-answer", async(req, res) => {
//   let reqiestId = req.query.id;
//   let editQues = await dbs.collection("questions").findOne({"_id":ObjectID(reqiestId)});
//   let response = {};
//   response["_id"]=editQues._id;
//   response["text"]=editQues.text;
//   response["answers"] = []
//   let i = 0;
//   for(index in editQues.answers){
//     response["answers"][index]=
//     {
//       "answer":editQues.answers[index],
//       "isCorrect": (parseInt(index) === parseInt(editQues.correctAnswer)) ? "checked" : ""
//     }
//     i++;
//   }
//   response["answers"][i+1]=
//     {
//       "answer":"",
//       "isCorrect": ""
//     }
//     errors = {};
//   res.render("edit", {question: response},  {errors: errors});
// })
app.post("/update", async (req, res) => {
  let text = req.body.text;
  let requestId = req.body.questionId;
  let answers = req.body.answers;
  let correctAnswer = req.body.correctAnswer;
  await dbs
    .collection("questions")
    .updateOne(
      { _id: ObjectID(requestId) },
      {
        $set: {
          text: text,
          answers: answers,
          correctAnswer: correctAnswer - 1,
        },
      },
      { upsert: true }
    );
  let questionBank = await dbs.collection("questions").find({}).toArray();
  let response = [];
  for (index in questionBank) {
    response[index] = {
      _id: questionBank[index]._id,
      text: questionBank[index].text,
      correctAnswer:
        questionBank[index].answers[questionBank[index].correctAnswer],
    };
  }
  res.render("index", { questions: response });
});
app.get("/add-question-form", async (req, res) => {
  res.render("add");
});
app.post("/add-question", async (req, res) => {
  let text = req.body.text;
  let answers = req.body.answers;
  let correctAnswer = req.body.correctAnswer;
  await dbs
    .collection("questions")
    .insertOne({
      text: text,
      answers: answers,
      correctAnswer: correctAnswer ,
    });

  res.redirect("/questions");
});
app.get("/delete-question", async(req, res) => {
  deleteId = req.query.id;
  await dbs.collection("questions").deleteOne({"_id": ObjectID(deleteId)})
  res.redirect("/questions");
})