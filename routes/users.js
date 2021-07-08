const express = require('express');
const Users = require('../database/Users');
const router = express.Router();
const bcrypt = require('bcryptjs')

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', (req, res) => {
    
    // Validation
    var errors = []

    if(!req.body.username || typeof req.body.username == undefined || req.body.username == null || req.body.username.length < 4){
        errors.push({message: 'Your username must have at least 4 characters'})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        errors.push({message: 'Invalid email'})
    }

    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null || req.body.password.length < 4){
        errors.push({message: 'Your password must have at least 4 charachters'})
    }

    if(req.body.password != req.body.password2){
        errors.push({message: 'Your passwords must match'})
    }

    // Showing errors

    if(errors.length > 0){
        res.send('deu erro')
    }else{
        // Existing user
        Users.findOne({where: {email: req.body.email}}).then((user) => {
            if(user){
                res.send('email já registrado')
            }else{
                const newUser = new Users({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if(error){
                            res.send('erro bcrypt')
                        }else{
                            newUser.password = hash

                            newUser.save().then(() => {
                                res.send('registered')
                            }).catch((err) => {
                                res.send('erro')
                            })

                        }
                    })
                })

            }
        }).catch((err) => {
            res.send('erro interno')
        })
    }

})



module.exports = router