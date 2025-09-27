const invModel = require('../models/inventory-model')
const utilities = require('../utilities/')

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render('./inventory/classification', {
    title: className + ' vehicles',
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const invId = req.params.invId
  const data = await invModel.getInventoryById(invId)
  const page = await utilities.buildInventoryPage(data)
  let nav = await utilities.getNav()
  res.render('./inventory/show', {
    title: data.inv_make + ' ' + data.inv_model + ' - ' + data.inv_year,
    nav,
    page,
    errors: null,
  })
}

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render('inventory/management', {
    title: 'Manage Inventory',
    nav,
    errors: null,
  })
}

invCont.buildNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render('inventory/new-classification', {
    title: 'Add Classification',
    nav,
    errors: null,
  })
}

invCont.buildNew = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render('inventory/new', {
    title: 'Add Inventory Item',
    nav,
    classificationList,
    errors: null,
  })
}

invCont.createClassification = async function (req, res, next) {
  const { classification_name } = req.body

  const createResult = await invModel.createClassification(classification_name)
  const nav = await utilities.getNav()

  if (createResult) {
    req.flash(
      'notice',
      `Successfully added ${classification_name} classification.`
    )
    res.status(201).render('inventory/management', {
      title: 'Manage Inventory',
      nav,
    })
  } else {
    req.flash('error', 'Failed to create classification.')
    res.status(501).render('inventory/new-classification', {
      title: 'Add Classification',
      nav,
    })
  }
}

invCont.createInventoryItem = async function (req, res, next) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  const createResult = await invModel.createInventoryItem(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  const nav = await utilities.getNav()

  if (createResult) {
    req.flash(
      'notice',
      `Successfully added inventory item.`
    )
    res.status(201).render('inventory/management', {
      title: 'Manage Inventory',
      nav,
    })
  } else {
    req.flash('error', 'Failed to create inventory item.')
    res.status(501).render('inventory/new', {
      title: 'Add Inventory Item',
      nav,
    })
  }
}

module.exports = invCont
