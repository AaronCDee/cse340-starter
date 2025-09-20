const invModel = require("../models/inventory-model")
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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
