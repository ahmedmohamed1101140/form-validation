// import package
var mongoose = require("mongoose");

// create a User schema
var UserSchema = new mongoose.Schema({
    firstname :{
        type: String,
        required: true
    },
    lastname :{
        type: String,
        required: true
    },
    country_code :{
        type: String,
        required: true
    },
    phone :{
        type: String,
        required: true,
    },
    email :{
        type: String,
        required: true
    },
    image :{
        type: String,
        required: true
    },
    gender :{
        type: String,
        required: true
    },
    birthdate :{
        type: Date,
        required: true
    },

});


// export the model
module.exports = mongoose.model("User", UserSchema);