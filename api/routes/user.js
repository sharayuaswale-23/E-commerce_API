const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const CounterSchema = mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', CounterSchema);

async function generateUniqueId() {
    const counter = await Counter.findOneAndUpdate(
        { _id: 'userId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return `User${counter.seq}`;
}



router.get('/all', async (req, res) => {
    try {
        const user = await User.find({}, '-password'); 
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ 
            error: err.message 
        });
    }
});

router.post('/signup', async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists. Please log in.",
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const uniqueId = await generateUniqueId();

        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            userId: uniqueId,
            email: req.body.email,
            password: hashedPassword,
        });

        const result = await user.save();
        res.status(201).json({
            message: "User created successfully",
            new_user: result,
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});


router.post('/login',(req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length<1){
            return res.status(401).json({
                message:"User not exist"
            })
        }
            bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
              if(!result){
                return res.status(401).json({
                    msg:"Password matching failed"
                })
              } 
             
            })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})


module.exports = router;