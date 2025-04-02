const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/paytm')
//basic solution
// const userSchema = mongoose.Schema({
//     username:String,
//     password:String,
//     firstName:String,
//     lastName:String
// })

//elegant solution
const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:3,
        maxLength:30
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    firstName:{
        type:String,
        required:true,
        trim:true,
        maxLength:50
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        maxLength:50
    }
})

const User = mongoose.model("user",userSchema)

module.exports={User}
