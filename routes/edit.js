const express = require('express');
const edit_route = express.Router();
const { ObjectID } = require('bson');

edit_route.get("/edit-form", async(req, res) => {
    let reqiestId = req.query.id;
    let editQues = await req.dbs.collection("questions").findOne({"_id":ObjectID(reqiestId)});
    let response = {};
    response["_id"]=editQues._id;
    response["text"]=editQues.text;
    response["answers"] = editQues.answers
    res.render("edit", {question: response});
})
edit_route.post("/edit",  async(req, res) => {
    let text = req.body.text;
    let requestId = req.body.questionId;
    let answers = req.body.answers;
    let correctAnswer = req.body.correctAnswer;
    await req.dbs.collection("questions").updateOne(
              {"_id":ObjectID(requestId)},
              {$set:{"text":text, "answers":answers, "correctAnswer":correctAnswer-1}},
              {"upsert" : true })
    res.redirect("/questions")
})
module.exports = edit_route;