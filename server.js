/*
    Name : Artsiom Skarakhod
    Project : Homework 2
    Description : Web API salfolding for Movie API
 */

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var passport = require('passport');
db = require('./db')();
var jwt = require('jsonwebtoken');
var cors = require('cors');

var authController = require('./auth');
var authJwtController = require('./auth_jwt');


var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended : false}));

app.use(passport.initialize());

var router = express.Router();


// using the input to create response json
function  getJSONObjectMovieRequirement(req, msg, stat)
{
    // these are the basics
    var json ={
        status:"unknown",
        message: "No message",
        headers: "No Headers",
        query: "No query",
        env: process.env.Unique_Key,
        body: "No body"
    };

    // if any of the variables in request are null then we don't repalce our json in this function with request's
        // values
    
    if(req.body != null)
    {
        json.body = req.body;
    }

    if(req.headers != null)
    {
        json.headers = req.headers;
    }
    if(msg != null)
    {
        json.message = msg;
    }
    if(req.query !=null)
    {
        json.query = req.query;
    }
    if(stat != null)
    {
        json.status = stat;
    }
    return json;
}

router.post('/signup', function (req,res) {
    // if the user did not put in username or password then don't let them sign up
    if(!req.body.username || !req.body.password)
    {
        res.json({success:false, msg:'Password or username missing.'});
    }
    // if the user signed up add them to the database
    else{
        var newUser = {
            username: req.body.username,
            password: req.body.password
        };

        db.save(newUser); // we are not duplicate checking here
        // return that sign up was successful
        res.json({success:true, msg:'Successful created new user.'});
    }
});

router.post('/signin',function (req,res){
    var user = db.findOne(req.body.username);
    // looks for the user
    // if user not found then return user not found
    if (!user){
        res.status(401).send({success: false, msg: "Authentication failure, user not found"});
    }
    // if the user was found then we have to authenticate them
    else
    {
        // compare users and request password
        if(req.body.password == user.password)
        {
            // let the user login and give the token
            var userToken = {id: user.id, username: user.username};
            var token = jwt.sign(userToken, process.env.SECRET_KEY)
            res.json({success: true, token: 'JWT '+token});
            
            // if passwords didn't match then don't let the user log in
        }else{
            res.status(401).send({success: false, msg: "wrong password"});
        }
    }
});

router.route('/testcollection')
    // does the delete command
    .delete(authController.isAuthenticated,function(req,res)
    {
        console.log(req.body);
        var status = 200;
        res = res.status(status);
        if(req.get('Content-Type')){
            res = res.type(req.get('Content-Type'));
        }
        // this is where we connect the response with request, msg and status
        var o = getJSONObjectMovieRequirement(req, "movie deleted", status);
        // this is our response
        res.json(o);
    })
    // does the put command
    .put(authJwtController.isAuthenticated,function(req,res)
    {
        console.log(req.body);
        var status = 200;
        res = res.status(status);
        if(req.get('Content-Type')){
            res = res.type(req.get('Content-Type'));
        }
        // this is where we connect the response with request, msg and status
        var o = getJSONObjectMovieRequirement(req, "movie updated", status);
        res.json(o);
    })
    // does the post command
    .post(function (req,res)
    {
        console.log(req.body);
        var status = 200;
        res = res.status(status);
        if(req.get('Content-Type')){
            res = res.type(req.get('Content-Type'));
        }
        // this is where we connect the response with request, msg and status
        var o = getJSONObjectMovieRequirement(req, "movie saved", status);
        res.json(o);
    })
    // does the get command
    .get(function (req,res)
    {
        console.log(req.body);
        var status = 200;
        res = res.status(status);
        // this is where we connect the response with request, msg and status
        var o = getJSONObjectMovieRequirement(req, "GET movie", status);

        res.json(o);
    });

app.use('/',router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only
