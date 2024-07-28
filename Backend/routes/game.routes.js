const express = require('express')
const router = express.Router()
const { getGames, getGameGenres, getSimilarGames } = require('../controllers/game.controller.js')

router.get('/games', getGames)
router.get('/genres', getGameGenres)
router.get('/similar-games', getSimilarGames)

module.exports = router