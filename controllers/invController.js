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

  const classificationList = await utilities.buildClassificationList()

  res.render('inventory/management', {
    title: 'Inventory Management',
    nav,
    errors: null,
    classificationList,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

invCont.buildEdit = async function (req, res, next) {
  let nav = await utilities.getNav()
  const invId = parseInt(req.params.invId)
  const itemData = await invModel.getInventoryById(invId)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  res.render('inventory/edit', {
    title: "Edit " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
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
    })
  }
}


invCont.buildDeleteConfirmation = async function (req, res, next) {
  let nav = await utilities.getNav()
  const invId = parseInt(req.params.invId)
  const itemData = await invModel.getInventoryById(invId)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render('inventory/delete-confirm', {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_price,
  } = req.body
  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult == "1") {
    const itemName = inv_make + " " + inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_price,
    })
  }
}

module.exports = invCont
