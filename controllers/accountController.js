const utilities = require("../utilities/")
const accountModel = require('../models/account-model')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    console.log(error)
    throw new Error('Access Forbidden')
  }
}

async function buildManagement(req, res) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

async function buildEdit(req, res) {
  let nav = await utilities.getNav()
  res.render("account/edit", {
    title: "Edit Account Details",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process details update
* *************************************** */
async function updateAccountDetails(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email } = req.body

  const regResult = await accountModel.updateAccountDetails(
    res.locals.accountData.account_id,
    account_firstname,
    account_lastname,
    account_email,
  )

  if (regResult) {
    res.locals.accountData = regResult
    const accessToken = jwt.sign(regResult, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    if(process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    } else {
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }
    req.flash(
      'notice',
      'Updated account details successfully'
    )
    res.status(200).render("account/management", {
      title: "Account Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the account update failed.")
    res.status(501).render("account/edit", {
      title: "Edit Account Details",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Process password update
* *************************************** */
async function updateAccountPassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password } = req.body

  const regResult = await accountModel.updateAccountPassword(
    res.locals.accountData.account_id,
    account_password
  )

  if (regResult) {
    res.locals.accountData = regResult
    const accessToken = jwt.sign(regResult, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    if(process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    } else {
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }
    req.flash(
      'notice',
      'Updated account password successfully'
    )
    res.status(200).render("account/management", {
      title: "Account Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.status(501).render("account/edit", {
      title: "Edit Account Details",
      nav,
      errors: null,
    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, buildEdit, updateAccountDetails, updateAccountPassword }
