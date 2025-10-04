const utilities = require('.')
const { body, validationResult } = require("express-validator")

const validate = {}

validate.creationRules = () => {
  return [
    body('inv_make')
    .trim()
    .escape()
    .notEmpty(),

    body('inv_model')
    .trim()
    .escape()
    .notEmpty(),

    body('inv_year')
    .trim()
    .escape()
    .notEmpty()
    .isInt(),

    body('inv_description')
    .trim()
    .escape()
    .notEmpty(),

    body('inv_image')
    .trim()
    .escape()
    .notEmpty(),

    body('inv_thumbnail')
    .trim()
    .escape()
    .notEmpty(),

    body('inv_price')
    .trim()
    .escape()
    .notEmpty()
    .isNumeric(),

    body('inv_miles')
    .trim()
    .escape()
    .notEmpty()
    .isNumeric(),

    body('inv_color')
    .trim()
    .escape()
    .notEmpty(),
  ]
}

validate.checkCreationData = async (req, res, next) => {
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

  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)

    res.render('inventory/new', {
      errors,
      title: 'Add Inventory Item',
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classificationList,
    })
    return
  }
  next()
}

validate.checkUpdateData = async (req, res, next) => {
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
    inv_id,
    classification_id
  } = req.body

  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`

    res.render('inventory/edit', {
      errors,
      title: "Edit " + itemName,
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classificationList,
      inv_id,
    })
    return
  }
  next()
}

module.exports = validate
