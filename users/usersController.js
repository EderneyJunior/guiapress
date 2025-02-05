const express = require('express')
const router = express.Router()
const knex = require('../database/database')
const bcrypt = require('bcryptjs')

router.get('/admin/users', (req, res) => {
    knex('users')
    .select('*')
    .then(users => {
        res.render('admin/users/index', { users })
    })
})

router.get('/admin/users/create', (req, res) => {
    res.render('admin/users/create')
})

router.post('/users/create', (req, res) => {
    const { email, password } = req.body

    knex('users')
        .where({ email })
        .select('*')
        .first()
        .then(user => {
            if(user == undefined) {
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(password, salt)

                knex('users')
                    .insert({ email, password: hash })
                    .then(() => {
                        res.redirect('/')
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            } else {
                res.redirect('/admin/users/create')
            }
        })
})

router.get('/users/login', (req, res) => {
    res.render('admin/users/login')
})

router.post('/authenticate', (req, res) => {
    const { email, password } = req.body

    knex('users')
        .where({ email })
        .select('*')
        .first()
        .then(user => {
            if(user == undefined) {
                res.redirect('/users/login')
            } else {
                const correct = bcrypt.compareSync(password, user.password)

                if(!correct) {
                    res.redirect('/users/login')
                } else {
                    req.session.user = {
                    id: user.id,
                    email: user.email
                    }
                    res.redirect('/admin/articles')
                }
            }
        })
})

router.get('/logout', (req, res) => {
    req.session.user = undefined
    res.redirect('/')
})

module.exports = router