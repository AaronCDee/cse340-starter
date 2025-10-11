const favsModel = require('../models/inventory-favorites-model')
const utilities = require('../utilities/')

const favCont = {}

favCont.index = async function(req, res, next) {
  const nav       = await utilities.getNav()
  const favorites = await favsModel.getInventoryFavoritesByAccountId(res.locals.accountData.account_id)

  console.log(favorites)

  res.render('./favorites/index', {
    title: 'Your Favorites ❤️',
    errors: null,
    favorites,
    nav,
  })
}

favCont.create = async function(req, res, next) {
  const { invId } = req.params
  const createResult = await favsModel.createInventoryFavorite(res.locals.accountData.account_id, invId)

  if (createResult) {
    req.flash("notice", "Favorited successfully")
    res.redirect(req.get('Referrer') || '/')
  } else {
    req.flash("error", "Favorite failed. Please try again later.")
    res.redirect(req.get('Referrer') || '/')
  }
}

favCont.delete = async function(req, res, next) {
  const { invId } = req.params
  const deleteResult = await favsModel.deleteInventoryFavorite(res.locals.accountData.account_id, invId)

  if (deleteResult) {
    req.flash("notice", "Favorite removed successfully")
    res.redirect(req.get('Referrer') || '/')
  } else {
    req.flash("error", "Failed to remove favorite. Please try again later.")
    res.redirect(req.get('Referrer') || '/')
  }
}

module.exports = favCont
