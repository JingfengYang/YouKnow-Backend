var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlParser = bodyParser.urlencoded();
var jwt = require('jwt-simple');

var secret = 'jwtTokenSecret';
var database = require('../database')


// /login?userid=[userid]&passwd=[passwd]
router.post('/Login', urlParser, function(req, res){
    if(!req.body) return res.sendStatus(400);
    
    var userid = req.body.userid;
    var passwd = req.body.passwd;
    var result=database.sign_in(userid, passwd)
    // Retrieve derived password with respect to the userid

    if(result==0){ 
            // Verification succeeded
        var expires = Date.now() + 7*24*60*60*1000;
        var token = jwt.encode({
                iss: userid, // issuer 表明请求的实体
                exp: expires, // expires token的生命周期
                aud: 'jser'
            }, secret);

        res.json({
                "code": 0,
                "msg": "Succeeded",
                "token": token
        });

    }
    else if(result==-1){
            // Verification failed
        res.json({
                "code": -1,
                "msg": "Password incorrect",
                "token": ""
        });

    }
    else if(result==-2){
        res.json({
                "code": -2,
                "msg": "User deos not exist",
                "token": ""
        });
    }
    else{
        res.json({
                "code": -3,
                "msg": "Error",
                "token": ""
        });
    }

    /*let decoded = jwt.decode(token, secret);
    if(decoded.exp <= Date.now() || decoded.aud !== 'jser') {
      res.sendStatus(401)
    } else {
      res.sendStatus(200)
    }*/


});


module.exports = router;