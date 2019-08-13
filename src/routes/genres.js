const express = require('express')
const route = express.Router()

const genreController = require('../controllers/genres')

route
    .post('/', genreController.insertGenres)
    .get('/', genreController.getAllGenres)
    .get('/:id', genreController.getOneGenre)
    .patch('/', genreController.updateGenres)
    .delete('/', genreController.deleteGenres)
    module.exports = route