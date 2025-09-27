const utilities = require('.')
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")

const validate = {}

validate.creationRules = () => {
  return [
    body('classification_name')
    .trim()
    .escape()
    .notEmpty()
    .custom(async (classification_name) => {
      const classificationExists = await invModel.checkExistingClassification(classification_name)
      if (classificationExists){
        throw new Error("Classification exists. Please use a different name")
      }
    }),
  ]
}

validate.checkCreationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render('inventory/new-classification', {
      errors,
      title: 'Add Classification',
      nav,
      classification_name,
    })
    return
  }
  next()
}

module.exports = validate
