// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)

var mongoose = require('mongoose');
// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/1955');
//Let's go ahead and make our first Schema that we will use to model Users. 
//Let's say that each user will have a name that is a string and an age that is a number. 
//The code to create a Schema is pretty simple as below
var UserSchema = new mongoose.Schema({ //Blueprint.  name and age in each document (row)
    name:String
})
mongoose.model('User',UserSchema); //we are settting this Schema in our Models as 'User. //User is the DB.  So you can do User.find{}
//Set the mongoose.model to the "User" variable so that we can run model-like methods on it to make all of the CRUD operations easier.
var User = mongoose.model('User'); //We are retrieving the Schema from out Models, named User. 

var bodyParser = require('body-parser');
// Integrate body-parser with our App
// app.use(bodyParser.urlencoded({ extended: true }));
// configure body-parser to correctly read JSON
app.use(bodyParser.json()); 

// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Use native promises
mongoose.Promise = global.Promise;
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
app.get('/', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    User.find({}, function(err, users) {
        if(err){
            console.log('something went wrong in FIND');
        }
        else{
            console.log('got the users!');
            //res.render('index',{users: users});
            res.json({message: "Find Success", data:users});
        }
      })
})

app.get('/new/:name',function(req,res){
    var user = new User({name: req.params.name});
    user.save
    (function(err){
        if(err){
            console.log('error creating user');
        }else{
            console.log('successfully added a user!');
            //res.json({message: "Success"});
            res.json({message: "Success"});
        }
    })
})

app.get('/new2/:name', function(req,res){
    var user = new User({name: req.params.name})
    user.save
    .then(() =>{
        console.log('successfully added a user!')
        res.json({message: "Success"})
    })
    .catch
     (console.log('error creating user'))
})

// Post.create(req.body) //create post
// .then(post => { //if created, log it and go to index.
//     console.log ('post', post);
//     res.redirect('/');
// })
// .catch(error => { //no post created, show error.
//     console.log('error', error);
// })

app.get('/:name',function(req,res){
    User.findOne({'name':req.params.name},function(err,obj){
        if (err){
            console.log('error while retreiving user');
        }else{
            console.log('got the first user from the search ');
            res.json({data:obj});
        }
    })
})

app.get('/remove/:name',function(req,res){
    User.deleteOne({'name':req.params.name},function(err,user){
        if(err){
            console.log(`error while removing ${req.params.name}`);
        }else{
            console.log(`deleted the first person nameed ${req.params.name}`)
            res.json({message: `deleted the first ${req.params.name}`});
        }
    })
})

// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})
