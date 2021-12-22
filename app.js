const express = require('express');
const mongodb = require('mongodb');
const exphbs  = require('express-handlebars');
const path = require('path');
const app = express();


let dbs = null;

const listRoute = require('./routes/list.js')
const editRoute = require('./routes/edit.js')
const deleteRoute = require('./routes/delete.js')
const addRoute = require('./routes/add.js')
var hbs = exphbs.create({
  helpers: {
    inc: function (value) {
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

async function start(){
    const client = await mongodb.MongoClient.connect("mongodb://localhost:27017/wpr-quiz");
    dbs = client.db("wpr-quiz");
    function setCollection(req, res, next){
      req.dbs = dbs;
      next();
    }
    app.use(setCollection);
    app.use(listRoute);
    app.use(editRoute);
    app.use(deleteRoute);
    app.use(addRoute);
    app.listen(3000, () => {
        console.log("Listening on port 3000");
    })
}
start();


