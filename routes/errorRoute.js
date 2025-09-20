// Needed Resources
const express = require("express")
const router = new express.Router()
const errController = require("../controllers/errController");

router.get('/', errController.throwError);

module.exports = router;
