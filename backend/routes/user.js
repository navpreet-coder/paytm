const express = require('express')
const zod = require('zod')
const { User, Account } = require('../db')
const router = express.Router()
const jwt = require('jsonwebtoken')
const JWT_SECRET = require('../config')
const { authMiddleware } = require('../middleware')
const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),//.minLength(6),
    firstName: zod.string(),
    lastName: zod.string()
})

const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()//.minLength(6)
})

const updateBody = zod.object({
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
    password: zod.string().optional(),
})
router.post("/signup", async (req, res) => {
    try{

    
    const body = req.body;
    const { success } = signupSchema.safeParse(body);
    // console.log('req', body);

    if (!success) {
        return res.status(411).json({
            message: 'E-mail already taken / wrong inputs!'
        })
        // return
    }

    const user = User.findOne({
        username: body.username
    })
    // const userId = ;
    if (user._id) {
        return res.status(411).json({
            message: 'E-mail already taken / wrong inputs!'
        })

    }
    // console.log('user id for user ',userId);
    
    const dbUser = await User.create(body)
    // const token = jwt.sign({
    //     userId: dbUser._id
    // }, JWT_SECRET)
    await Account.create({
        userId:dbUser._id,
        balance: 1 + Math.random() * 10000
    })
    res.json({
        message: "user created successfully!",
        // token: token
    })
}
catch(e){
    console.log('exception in signup',e);
    res.status(411).json({
        message:"wrong inputs!"
    })
    
}

})

router.post('/signin', (req, res) => {
    const body = req.body;
    const { success } = signinSchema.safeParse(body);

    if (!success) {
        return res.status(411).json({
            message: "Error while logging in"
        })
    }
    const foundUser = User.findOne({
        username: body.username,
        password: body.password
    })

    if (foundUser) {
        const token = jwt.sign({
            userId: foundUser._id
        }, JWT_SECRET)
        res.status(200).json({
            token: token
        })
    }
    else {
        res.status(411).json({
            message: "Error while logging in"
        })
    }

})

router.put('/', authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne({
        _id: req.userId
    }, req.body)
    res.json({
        message: "Updated successfully"
    })
})

router.get('/bulk',async(req,res)=>{
    const filter = req.query.filter || '';

    const users = await User.find({
        $or:[{
            firstName:filter
        },
        {
            lastName:filter
        }
    ]
    })

    res.json({
        user: users.map(user=>({
            username:user.username,
            password:user.password,
            lastName:user.lastName,
            _id:user._id
        }))
    })
})
module.exports = router