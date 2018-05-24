require("./config/db");
var express       = require("express"),
    app           = express(),
    morgan        = require("morgan"),
    bodyParser    = require("body-parser"),
    path          = require("path"),
    jwt           = require("jsonwebtoken");  
    mongoose      = require("mongoose");

const User =  require("./models/users");
var custom_validation = require('./middleware/validate');

//add static files to be accessable 
app.use(express.static(path.join(__dirname,"public")));
app.use("/node_modules",express.static(__dirname + '/node_modules'))

//setup server log 
app.use(morgan("dev"));

//setup body parser     
app.use(bodyParser.urlencoded({extended: false}));

// set up the ejs view engine
app.set("view engine", "ejs");




app.get("/",function(req,res,next){
    res.render("home");
});

app.post("/signup", function(req,res){
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        country_code: req.body.country_code,
        email: req.body.email,
        image: req.body.image,
        gender: req.body.gender,
        birthdate: req.body.birthdate,
        password: req.body.password 
    });
   let {faild,error_message} = custom_validation.validate_user_input(user);
   if(faild){
        console.log(error_message);
        res.status(500).json({
            error:error_message
        });
    }
    else{
        console.log("adsd");
        User.create(user,function(err,created_user){
            if(err){
                console.log(err.message);
                res.status(500).json({
                    error: err.message
                });
            }
            else{
                res.status(201).json({
                    User: created_user
                });
                console.log(created_user);             
            }
        });
    }
});

app.get("/task2",function(req,res){
    res.render("task2");
});

app.post("/auth",function(req,res){
    User.findOne({"phone":req.body.phone},function(err,foundUser){
        if(err){
            console.log(err.message);
            res.status(402).json({
                message:"Auth Faild"
            });
        }
        else{
            if(foundUser && foundUser.password == req.body.password){
                console.log(foundUser);               
                var token = jwt.sign(
                    {
                        firstname: foundUser.firstname,
                        email: foundUser.email,
                        phone: foundUser.phone
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                );
                res.status(200).json({
                    message:"Auth Success",
                    token: token,
                });    
            }
            else{
                res.status(402).json({
                    message: "Auth Faild",
                });
            }


        }
    });
});

app.get("/task3",function(req,res){
    res.render("task3");
});

app.post("/checktoken",function(req,res){
    try{
        const decode = jwt.verify(req.body.token,process.env.JWT_KEY);
        if(decode.phone == req.body.phone){
            res.status(200).json({
                message: "Auth Success",
                UserInfo: decode
            });
        }
        else{
            res.status(402).json({
                message: "Faild: Unauthorized Request"
            });
        }
        res.send(decode.phone);
    }
    catch(error){
        console.log(error.message);
        res.status(402).json({
            message: "Faild: Bad Request"
        });
    }
});



var server = app.listen(process.env.PORT || "8080",function (err) {
    console.log("App Running At PORT: "+ server.address().port);
});