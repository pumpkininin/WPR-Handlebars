const express = require('express');
const mongodb = require('mongodb');
const exphbs  = require('express-handlebars');
const path = require('path');
const router =  express.Router();
const app = express();
const DB_NAME = "wpr-quiz";
const DB_URL = "mongodb://localhost:27017/"


let dbs = null;

const listRoute = require('./routes/list.js')
const editRoute = require('./routes/edit.js')
const deleteRoute = require('./routes/delete.js')
const addRoute = require('./routes/add.js')
var hbs = exphbs.create({
  helpers: {
    inc: function (value, options) {
      return parseInt(value) + 1;
    }
  },
  extname:'.hbs'
  });
app.use(express.json())
app.use(
    express.urlencoded({
      extended: true
    })
  )
app.use(express.static(path.join(__dirname, '/public')));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

async function startServer(){
    const client = await mongodb.MongoClient.connect("mongodb://localhost:27017/wpr-quiz");//connect to dbs
    dbs = client.db(DB_NAME);// client is note defined (promise)
    function setCollection(req, res, next){
      req.dbs = dbs;
      next();
    }
    app.use(setCollection);
    app.use(listRoute);
    app.use(editRoute);
    app.use(deleteRoute);
    app.use(addRoute);
    app.listen(3000, () => {//start server in port 3000
        console.log("Listening on port 3000");
    })
}
startServer();

// app.set('dbs', dbs)
// app.get("/", listRoute);
// app.get("/questions", listRoute);
// app.get("/edit-form", editRoute);
// app.post("/update", editRoute)
// app.get("/delete-question", deleteRoute);
// app.get("/add-question-form", addRoute)
// app.post("/add-question", addRoute);

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


