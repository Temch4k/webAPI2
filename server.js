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


function  getJSONObjectMovieRequirement(req, msg, stat)
{
    var json ={
        status:"unknown",
        message: "No message",
        headers: "No Headers",
        query: "No query",
        env: process.env.Unique_Key,
        body: "No body"
    };

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
    if(!req.body.username || !req.body.password)
    {
        res.json({success:false, msg:'Password or username missing.'});
    }
    else{
        var newUser = {
            username: req.body.username,
            password: req.body.password
        };

        db.save(newUser); // we are not duplicate checking here
        res.json({success:true, msg:'Successful created new user.'});
    }
});

router.post('/signin',function (req,res){
    var user = db.findOne(req.body.username);
    if (!user){
        res.status(401).send({success: false, msg: "Authentication failure, user not found"});
    }
    else
    {
        if(req.body.password == user.password)
        {
            var userToken = {id: user.id, username: user.username};
            var token = jwt.sign(userToken, process.env.SECRET_KEY)
            res.json({success: true, token: 'JWT '+token});
        }else{
            res.status(401).send({success: false, msg: "wrong password"});
        }
    }
});

router.route('/testcollection')
    .delete(authController.isAuthenticated,function(req,res)
    {
        console.log(req.body);
        var status = 200;
        res = res.status(status);
        if(req.get('Content-Type')){
            res = res.type(req.get('Content-Type'));
        }
        var o = getJSONObjectMovieRequirement(req, "movie deleted", status);
        res.json(o);
    })
    .put(authJwtController.isAuthenticated,function(req,res)
    {
        console.log(req.body);
        var status = 200;
        res = res.status(status);
        if(req.get('Content-Type')){
            res = res.type(req.get('Content-Type'));
        }
        var o = getJSONObjectMovieRequirement(req, "movie updated", status);
        res.json(o);
    })
    .post(function (req,res)
    {
        console.log(req.body);
        var status = 200;
        res = res.status(status);
        if(req.get('Content-Type')){
            res = res.type(req.get('Content-Type'));
        }
        var o = getJSONObjectMovieRequirement(req, "movie saved", status);
        res.json(o);
    })
    .get(function (req,res)
    {
        console.log(req.body);
        var status = 200;
        res = res.status(status);
        var o = getJSONObjectMovieRequirement(req, "GET movie", status);

        res.json(o);
    });

app.use('/',router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only