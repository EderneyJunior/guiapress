const express = require('express')
const app = express()
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')
const usersController = require('./users/usersController')
const session = require('express-session')

app.use(session({
    secret: "qualquercoisa",
    cookie: {
        maxAge: 30000000
    },
    resave: true,
    saveUninitialized: true

}))

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Rotas
app.use(categoriesController)
app.use(articlesController)
app.use(usersController)

app.listen(8080, () => {
    console.log('App rodando na porta 8080!')
})