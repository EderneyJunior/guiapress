const express = require('express')
const router = express.Router()
const knex = require('../database/database')
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/articles', adminAuth, (req, res) => {
    
    knex('articles')
        .innerJoin('categories', 'articles.category_id', 'categories.id')
        .select('articles.id', 'articles.title', 'articles.slug', 'articles.body', 'categories.title as category_title')
        .orderBy('id', 'desc')
        .then(articles => {
            res.render('admin/articles/index', { articles })
        })
})

router.get('/admin/articles/new', adminAuth, (req, res) => {

    knex('categories')
        .select('*')
        .then(categories => {
            res.render('admin/articles/new', { categories })
        })
})

router.post('/articles/save', adminAuth, (req, res) => {
    const { title, body, category } = req.body

    const slug = title.split(' ').join('-')

    knex('articles')
        .insert({ title, slug, body, category_id: category })
        .then(() => {
            res.redirect('/admin/articles')
        })
})

router.post('/articles/delete', adminAuth, (req, res) => {
    const { id } = req.body

    if(!id || isNaN(id)) {
        res.redirect('/admin/articles')
    }

    knex('articles')
        .where({ id })
        .delete()
        .then(() => {
            res.redirect('/admin/articles')
        })
})

router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
    const { id } = req.params

    if(isNaN(id)) {
        res.redirect('/admin/articles')
    }

    knex('articles')
        .where({ id })
        .select('*')
        .first()
        .then(article => {
            if(!article) {
                res.redirect('/admin/articles')
            }
            knex('categories')
            .select('*')
            .then(categories => {
                res.render('admin/articles/edit', { article, categories })
            })
        })
        .catch((error) => {
            res.redirect('/admin/articles')
        })
})

router.post('/articles/update', adminAuth, (req, res) => {
    const { id, title, body, category_id } = req.body

    const slug = title.split(' ').join('-')

    knex('articles')
    .where({ id })
    .update({ title, slug, body, category_id })
    .then(() => {
        res.redirect('/admin/articles')
    })
})

router.get('/articles/page/:page' ,(req, res) => {
    const { page } = req.params
    let offset
    if(isNaN(page) || page == 1) {
        offset = 0
    } else {
        offset = (parseInt(page) - 1) * 4
    }

    knex('articles')
    .select('*')
    .orderBy('id', 'desc')
    .limit(4)
    .offset(offset)
    .orderBy('id', 'asc')
    .then((articles) => {
        knex('articles')
            .count({ count: 'id'})
            .then(count => {
                knex('categories')
                .select('*')
                .then(categories => {
                    let next = true
                    if((offset + 4) >= parseInt(count[0].count)) {
                        next = false
                    }
                    const result = {
                        page: parseInt(page),
                        next
                    }
                    res.render('admin/articles/page', { articles, result, categories })
                })
            })
    })
})

router.get('/', (req, res) => {
    knex('articles')
    .limit(4)
        .select('*')
        .orderBy('id', 'desc')
        .then(articles => {
            knex('categories')
            .select('*')
            .then(categories => {
                res.render('index', { articles, categories })
            })
        })
})

router.get('/:slug', (req, res) => {
    const { slug } = req.params
 
    knex('articles')
        .where({ slug })
        .select('*')
        .first()
        .then(article => {
            if(article == undefined) {
                res.redirect('/')
            } else {
                knex('categories')
                .select('*')
                .then(categories => {
                    res.render('article', { article, categories })
                })
            }
        })
        .catch(() => {
            res.redirect('/')
        })
})

module.exports = router