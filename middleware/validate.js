var validator     = require("validator"),
    Joi           = require('joi'),
    countries     = require('country-list')(),
    User          = require("../models/users");
    


var middlewareObj = {};

middlewareObj.validate_user_input = function(user){
    
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
        password:""
    };
    //validate the first name
    if(validator.isEmpty(user.firstname)){
        error_message.firstname = "Blank";
        faild = true;
    }

    //validate last name
    if(validator.isEmpty(user.lastname)){
        error_message.lastname = "Blank";
        faild = true;   
    }

    //validate password
    if(validator.isEmpty(user.password)){
        error_message.password = "blank";
        faild = true;   
    }
    else if(user.password.length < 6){
        error_message.password = "Too Short Min.Length = 6";
        faild = true;
    }

    //validate country country code
    if(validator.isEmpty(user.country_code)){
        error_message.country_code = "blank";
        faild = true;    
    }
    else if(countries.getName(user.country_code) == undefined)
    {
        error_message.country_code = "inclusion EX: EG,IS,FR,AE,US";        
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
    

    //validate the email
    if(validator.isEmpty(user.email)){
        error_message.email = "blank";
        faild = true;        
    }
    else if(!validator.isEmail(user.email)){
        error_message.email = "Invalid Email";
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

    return{ faild,error_message};
    
}


module.exports = middlewareObj;