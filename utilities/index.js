const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model
      + 'details"><img src="' + vehicle.inv_thumbnail
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View '
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildInventoryPage = async function(data) {
  title =

  page = `
    <h2 class="inv-title-mobile">${data.inv_year} ${data.inv_make} ${data.inv_model}</h2>
    <section class="inv-cont">
      <div>
        <img src="${data.inv_image}" width="100%">
        <p>${data.inv_description}</p>
      </div>

      <div class="inv-details">
        <h1 class="inv-title-desktop">${data.inv_year} ${data.inv_make} ${data.inv_model}</h1>
        <table>
          <tr>
            <td>Type</td>
            <td>${data.classification_name}</td>
          </tr>
          <tr>
            <td>Year</td>
            <td>${data.inv_year}</td>
          </tr>
          <tr>
            <td>Color</td>
            <td>${data.inv_color}</td>
          </tr>
          <tr>
            <td>Miles</td>
            <td>${Number(data.inv_miles).toLocaleString('en-US')}</td>
          </tr>
        </table>

        <div class="inv-purchase-details">
          <h2>$${Number(data.inv_price).toLocaleString('en-US')}</h2>

          <button class="btn-primary">Buy Now</button>
        </div>
      </div>
    </section>
  `

  return page
}

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select class="login-form-input" name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    if (['Employee', 'Admin'].includes(accountData.account_type)) {
      res.locals.isEmployeeOrAdmin = 1
    }
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
* Middleware to check employee or admin
**************************************** */
Util.requireEmployeeOrAdmin = (req, res, next) => {
  if (res.locals.loggedin !== 1) {
    req.flash('notice', 'Please log in to access this page.')
    return res.redirect('/account/login')
  }

  if (res.locals.isEmployeeOrAdmin !== 1) {
    req.flash('notice', 'You do not have permission to perform that action.')
    return res.redirect('/account/login')
  }

  next()
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
