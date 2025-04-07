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

const accountSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
})
const User = mongoose.model("user",userSchema)
const Account = mongoose.model("account",accountSchema)

module.exports={User,Account}
