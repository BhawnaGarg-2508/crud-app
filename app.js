const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const fs = require('fs');


app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/my_db');

var personSchema = mongoose.Schema({
    name: String,
    age: Number,
    nationality: String
 });
var Person = mongoose.model("Person", personSchema);



app.get('/', function(req, res){
    console.log("here!");

    res.render('person');
});

app.post('/', function(req, res){
   var personInfo = req.body; //Get tjuhe parsed information
   
   
   console.log(req.body);
   if(!personInfo.name || !personInfo.age || !personInfo.nationality){
      res.render('show_message', {
         message: "Sorry, you provided worng info", type: "error"});
   } else {
      var newPerson = new Person(req.body);
      console.log(newPerson);

      newPerson.save()
      .then(item => {
         res.render('show_message', {message: "New person added", type: "success", person: personInfo});
      })
      .catch(err => {
         res.render('show_message', {message: "Database error", type: "error"});
      })
      // res.render('show_message', {message: "Sorry", type: "error"});
      // newPerson.save(newPerson, (err, result)=>{
         
      //    if(err)
      //       res.render('show_message', {message: "Database error", type: "error"});
      //    else{
      //       console.log("added!");
      //       res.render('show_message', {message: "New person added", type: "success", person: personInfo});
      //    }
      // });
   }
});





app.listen(port, () =>{
   console.log(`The application started successfully on port ${port}`);
})
