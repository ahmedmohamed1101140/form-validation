require("./config/db");
var express       = require("express"),
    app           = express(),
    morgan        = require("morgan"),
    bodyParser    = require("body-parser"),
    path          = require("path"),
    validator     = require("validator"),
    Joi           = require('joi'),
    countryList  = require('country-list')(),
    mongoose      = require("mongoose");

const User =  require("./models/users")

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
        birthdate: req.body.birthdate 
    });

   validate_user_input(user);
   if(faild){
        console.log(error_message);
        res.status(500).json({
            error:error_message
        });
    }
    else{
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

var faild = false;
const error_message = {
    firstname:"",
    lastname:"",
    phone: "",
    country_code: "",
    email: "",
    gender: "",
    birthdate: "",
    image: "",
};

validate_user_input = function(user){
    //validate the first name
    if(validator.isEmpty(user.firstname)){
        error_message.firstname = "blank";
        faild = true;
    }
    //validate last name
    if(validator.isEmpty(user.lastname)){
        error_message.lastname = "blank";
        faild = true;   
    }

    //validate country country code
    if(validator.isEmpty(user.country_code)){
        error_message.country_code = "blank";
        faild = true;    
    }
    else if(countryList.getName(user.country_code) == undefined){
        error_message.country_code = "inclusion EX: EG,DZ,UK";        
        faild = true;    
    }
    //validate the phone number  
    if(user.phone.length == 0){
        error_message.phone = "Blank";        
        faild = true;    
    }
    else if(!validator.isInt(user.phone)){
        error_message.phone = "Not a Number";
        faild = true;    
    }
    else if(user.phone.length > 15){
        error_message.phone = "Too Long count 15";
        faild = true;    
    }
    else if(user.phone.length <10){
        error_message.phone = "Too short count 10";
        faild = true;        
    }
    else if(!validator.isMobilePhone(user.phone,"ar-EG")){
        error_message.phone = "Not Exist"
        faild = true;    
    }
    else{
        User.findOne({"phone":user.phone},function(err,result){
            if(err){
                console.log(err.message);
            }
            else{
                if(result == undefined){
                    error_message.phone = "Taken";
                    faild = true;                
                }
            }
        });
    }

    //validate the email
    if(validator.isEmpty(user.email)){
        error_message.email = "blank";
        faild = true;        
    }
    else if(!validator.isEmail(user.email)){
        error_message.email = "Invalid";
        faild = true;    
    }

    //validate the avatar
    if(validator.isEmpty(user.image)){
        error_message.image = "blank";
        faild = true;    
    }
    else if(!validator.contains(user.image,["jpg"]) && !validator.contains(user.image,["jpeg"]) && !validator.contains(user.image,["png"]) ){
        error_message.image = "Invalid Content Type";
        faild = true;    
    }

    //validate the gender
    if(validator.isEmpty(user.gender)){
        error_message.gender = "blank";
        faild = true;    
    }
    else if(!validator.contains(user.gender,["male"]) && !validator.contains(user.gender,["female"])){
        error_message.gender = "Inclusion";
        faild = true;   
    }

    // validate the birthdate
   
    if(user.birthdate == null){
        error_message.birthdate = "blank";        
        faild = true;    
    }
    else{
        Joi.validate({birthdate:user.birthdate},{birthdate: Joi.date().max((new Date()))},function(err,res){
            if(err){
                console.log(err.message);
                error_message.birthdate = "In The Future";
                faild = true;     
            }
        });
    }
}


var server = app.listen(process.env.PORT || "8080",function (err) {
    console.log("App Running At PORT: "+ server.address().port);
});