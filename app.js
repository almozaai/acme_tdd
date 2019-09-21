const express = require('express');
const app = express();
const db = require('./db');
const { Product, Category } = db.models; 

module.exports = app;

app.use(express.json());

app.get('/api/products', (req, res, next) => {
    Product.findAll()
        .then(products => res.send(products))
        .catch(next);
});

app.post('/api/products', (req, res, next) => {
    Product.create(req.body)
        .then(product => res.status(201).send(product))
        .catch(next);
});
app.put('/api/products/:id', (req, res, next) => {
    Product.findByPk(req.params.id)
        .then(product => product.update(req.body))
        .then( product => res.send(product))
        .catch(next);
});
app.delete('/api/products/:id', (req, res, next) => {
    Product.findByPk(req.params.id)
        .then(product => product.destroy())
        .then( () => res.sendStatus(204))
        .catch(next);
});