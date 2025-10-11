const express = require("express")
const router = new express.Router()
const favController = require("../controllers/favoritesController")
const utilities = require('../utilities/')

router.get('/', utilities.requireLogin, utilities.handleErrors(favController.index))
router.post('/:invId', utilities.requireLogin, utilities.handleErrors(favController.create))
router.post('/delete/:invId', utilities.requireLogin, utilities.handleErrors(favController.delete))

module.exports = router
