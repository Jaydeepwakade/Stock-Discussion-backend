

const mongoose = require("mongoose")


const UserSchema = mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String, required:true},
    bio:{type:String},
    profilepicture:{type:String}
})
 const userModel = mongoose.model("User",UserSchema)

module.exports = userModel