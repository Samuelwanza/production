// Using Express router.
const express = require('express');
const router = express.Router();
const passport = require('passport');
// Load controller.
const users = require('../controllers/users');
// Load model.
const User = require('../models/user');
const jwt=require('jsonwebtoken')

router.post('/register', (req, res) => {
    console.log('user signup');
    const { username, password } = req.body
    // ADD VALIDATION
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            console.log('User.js post error: ', err)
        } else if (user) {
            res.json({
                error: `Sorry, already a user with the username: ${username}`
            })
        }
        else {
            const newUser = new User({
                username: username,
                password: password
            })
            console.log("new user", newUser);
            newUser.save((err, savedUser) => {
                if (err) return res.json(err)

                const secret_token="Myra2022";
                const token = jwt.sign(
                    { user_id: user._id, username },
                secret_token,
                    {   
                        expiresIn: "2h",
                    }
                );
      // save user token
                savedUser.token = token;
                res.status(200).json(savedUser)
            
                //return res.json(savedUser.data)
            })
            
        }
    })
})

// router.post(
//     '/login',
//     function (req, res, next) {
//         console.log('routes/user.js, login, req.body: ');
//         console.log(req.body)
//         next()
//     },
//     passport.authenticate('local'),(res,req,next)=> {
//         //console.log('logged in', req.user);
//         var userInfo = {
//             username: req.body._id
//         }; 
//         console.log(userInfo)     
//         res.send(userInfo);
//         next()
//     }
// )

router.get('/', (req, res, next) => {
    console.log('===== user!!======')
    console.log(req.user)
    if (req.user) {
        res.json({ user: req.user })
    } else {
        res.json({ user: null })
    }
})

router.post('/logout', (req, res) => {
    if (req.user) {
        req.logout()
        res.send({ msg: 'logging out' })
    } else {
        res.send({ msg: 'no user to log out' })
    }
})
router.post('/login', (req, res) => {
    console.log('user login');
    const { username, password } = req.body
    console.log(req.body)
    // ADD VALIDATION
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            console.log('User.js post error: ', err)
        } else if (user.password===password) {

            const secret_token="Myra2022";
            const token = jwt.sign(
            { user_id: user._id, username},
            secret_token,
            {
                expiresIn: "2h",
            }
            );
  
            user.token = token;
        
            res.json({user})
            
        }
        
    })
})


module.exports = router

// OLD
// // @route [GET]: get existing user (trying login).
// router.route('/login')
//     .post(users.login)

// // @route [POST]: register new user.
// router.route('/register')
//     .post(users.register);

// router.route('/logout')
//     .get(users.logout);


// module.exports = router;