// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require('../utilities/')
const validate = require('../utilities/account-validation')

// Route to build inventory by classification view
router.get('/login', utilities.handleErrors(accountController.buildLogin))
router.get('/register', utilities.handleErrors(accountController.buildRegister))
router.post('/register',
  validate.registrationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)
router.post("/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)
router.get('/', utilities.handleErrors(accountController.buildManagement))

router.get('/edit', utilities.handleErrors(accountController.buildEdit))

router.post('/update',
  validate.updateDetailsRules(),
  validate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccountDetails))
router.post('/updatePassword', utilities.handleErrors(accountController.updateAccountPassword))
router.post('/logout', utilities.handleErrors(accountController.accountLogout))

module.exports = router;
