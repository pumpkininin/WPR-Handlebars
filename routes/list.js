const express = require('express');
const list_route = express.Router();

list_route.get("/", (req, res)=>{
    res.redirect('/questions')
  })
list_route.get("/questions", async (req, res) => {
    let questionBank = await req.dbs.collection("questions").find({}).toArray();
    let response = [];
    for(index in questionBank){
        response[index]= 
        {
            "_id":questionBank[index]._id,
            "text":questionBank[index].text,
            "correctAnswer":questionBank[index].answers[questionBank[index].correctAnswer]
        }
    }
    res.render("index",{ questions: response});
  })
  list_route.post("/search", async(req, res) => {
    const keyword = req.body.keyword;
    let result = await dbs.collection("questions").find({"text": {"$regex": keyword, "$options":"i"}}).toArray();
    let response = []
    for(index in result){
      response[index]= 
      {
          "_id":result[index]._id,
          "text":result[index].text,
          "correctAnswer":result[index].answers[result[index].correctAnswer]
      }
  }
    res.render("index", {questions: response})
})
module.exports = list_route;