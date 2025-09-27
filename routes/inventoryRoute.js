// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require('../utilities/')
const classificationValidate = require('../utilities/classification-validation')
const inventoryValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId))
router.get('/detail/:invId', utilities.handleErrors(invController.buildByInvId))
router.get('/', utilities.handleErrors(invController.buildManagement))
router.get('/classifications/new', utilities.handleErrors(invController.buildNewClassification))
router.post('/classifications/new',
  classificationValidate.creationRules(),
  classificationValidate.checkCreationData,
  utilities.handleErrors(invController.createClassification),
)
router.get('/new', utilities.handleErrors(invController.buildNew))
router.post('/new',
  inventoryValidate.creationRules(),
  inventoryValidate.checkCreationData,
  utilities.handleErrors(invController.createInventoryItem)
)


module.exports = router;
