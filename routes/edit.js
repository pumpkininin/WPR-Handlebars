const express = require('express');
const edit_route = express.Router();
const { ObjectID } = require('bson');
const { response } = require('express');
const { redirect } = require('express/lib/response');
const bodyparser = require('body-parser');
app = express();
let dbs = app.get("dbs")
edit_route.get("/edit-form", async(req, res) => {
    let reqiestId = req.query.id;
    let editQues = await req.dbs.collection("questions").findOne({"_id":ObjectID(reqiestId)});
    let response = {};
    response["_id"]=editQues._id;
    response["text"]=editQues.text;
    response["answers"] = []
    for(index in editQues.answers){
      response["answers"][index]=
      {
        "answer":editQues.answers[index],
        "isCorrect": (parseInt(index) === parseInt(editQues.correctAnswer)) ? "checked" : ""
      }
    }
    res.render("edit", {question: response});
})
edit_route.post("/update",  async(req, res) => {
    let text = req.body.text;
    let requestId = req.body.questionId;
    let answers = req.body.answers;
    let correctAnswer = req.body.correctAnswer;
    await req.dbs.collection("questions").updateOne(
              {"_id":ObjectID(requestId)},
              {$set:{"text":text, "answers":answers, correctAnswer:correctAnswer-1}},
              {"upsert" : true })
    res.redirect("/")
})
module.exports = edit_route;