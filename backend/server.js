var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var moment = require('moment');
var Message = mongoose.model("Message", {
    msg: String
});

var User = mongoose.model("User", {
    email: String,
    pwd: String
});

app.use(bodyParser.json());
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Content-Type, Authorization");
    next();

});
app.get('/api/message',GetMessage);

app.post('/api/message',function(req, res){
    console.log(req.body);
    var message = new Message(req.body);
    message.save();
    res.status(200);
});
app.post('/auth/register',function(req, res){
    console.log(req.body);
    User.findOne({email: req.body.email}, function(err, existingUser){
        if(existingUser){
            res.status(409).send({message: "Email already registered"})
        }else{
            var user = new User(req.body);
            user.save(function(err, result){
                if(err){
                    res.status(500).send({
                        message: err.message
                    });
                }
                res.status(200).send({token: createToken(result)});
            });
        }
    });
    
});
function GetMessage(req, res){
    Message.find({}).exec(function(err, result){
        res.send(result);
    });
}

mongoose.connect("mongodb://localhost:27017/test",function(err, db){
    if(!err){
        console.log("we are connected to mongo"); 
    }
})
var server = app.listen(5000, function(){
     console.log(`listening on port ${server.address().port}`);
});

function createToken(user){
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, 'secret');
}

function checkAuthenticated(req, res, next){
    if(!req.header('Authorization')){
        return res.status(401).send({message: "Please make sure your request has an authorization header"});
    }
    var token = req.header('Authorization').split('')[1];
    var payload = jwt.decode(token,'secret');
    
}