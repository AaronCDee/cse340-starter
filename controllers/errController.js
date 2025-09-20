const errController = {}

errController.throwError = async function(req, res){
  res.render('invalidtemplate')
}

module.exports = errController
