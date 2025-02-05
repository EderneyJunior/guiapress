const exppress = require('express')
const router = exppress.Router()
const knex = require('../database/database')
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/categories/new', adminAuth, (req, res) => {
    res.render('admin/categories/new')
})

router.post('/categories/save', adminAuth, (req, res) => {
    const { title } = req.body

    if(!title) {
        res.redirect('/admin/categories/new')
    }

    const slug = title.split(' ').join('-')

    knex('categories')
        .insert({ title, slug })
        .then(() => {
            res.redirect('/admin/categories')
        })
})

router.get('/admin/categories', adminAuth, (req, res) => {
    knex('categories')
        .select('*')
        .then(categories => {
            res.render('admin/categories/index', {categories})
        })
})

router.post('/categories/delete', adminAuth, (req, res) => {
    const { id } = req.body

    if(!id || isNaN(id)) {
        res.redirect('/admin/categories')
    }

    knex('categories')
        .where({ id })
        .delete()
        .then(() => {
            res.redirect('/admin/categories')
        })
})

router.get('/admin/categories/edit/:id', adminAuth, (req, res) => {
    const { id } = req.params

    if(isNaN(id)){
        res.redirect('/admin/categories')
    }

    knex('categories')
        .where({ id })
        .select('*')
        .first()
        .then(category => {
            if(!category){
                res.redirect('/admin/categories')
            }
            res.render('admin/categories/edit', {category})
        })
        .catch(error => {
            res.redirect('/admin/cotegories')
        })
})

router.post('/categories/update', adminAuth, (req, res) => {
    const { title, id } = req.body

    const slug = title.split(' ').join('-')
    
    knex('categories')
        .where({ id })
        .update({ title, slug })
        .then(() => {
            res.redirect('/admin/categories')
        })
})

router.get('/category/:slug', (req, res) => {
    const { slug } = req.params

    knex('articles')
        .innerJoin('categories', 'articles.category_id', '=', 'categories.id')
        .select(
            'articles.id',
            'articles.title',
            'articles.body',
            'categories.title as category_title',
            'articles.slug'
        )
        .where('categories.slug', slug)
        .orderBy('id', 'desc')
        .then(articles => {
            knex('categories')
            .select('*')
            .then(categories => {
                res.render('index', { articles, categories })
            })
        })
})

module.exports = router 