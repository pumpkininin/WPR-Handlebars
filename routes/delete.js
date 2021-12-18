const express = require('express');
const delete_route = express.Router();
const { ObjectID } = require('bson');
const { response } = require('express');
const { redirect } = require('express/lib/response');
const bodyparser = require('body-parser');
app = express();
let dbs = app.get("dbs")
delete_route.get("/delete-question", async(req,res)=>{
    deleteId = req.query.id;
    await req.dbs.collection("questions").deleteOne({"_id": ObjectID(deleteId)});
    res.redirect("/")
})

module.exports = delete_route;