const Scheme = require('./scheme-model')

const checkSchemeId = async (req, res, next) => {

  const scheme = await Scheme.checkId(req.params.scheme_id)

  if(!scheme){
    res.status(404).json({
      message: `scheme with scheme_id ${req.params.scheme_id} not found`
    })
  } else {
    next()
  }
}

const validateScheme = (req, res, next) => {

  const { scheme_name } = req.body

  if(!scheme_name || typeof scheme_name !== 'string'){
    res.status(400).json({
      message: 'invalid scheme_name'
    })
  } else {
      next()
  }
}

const validateStep = (req, res, next) => {

  const { instructions, step_number } = req.body

  if(!instructions || typeof instructions !== 'string'){
    res.status(400).json({
      message: 'invalid step'
    })
  }
  if(!step_number || isNaN(step_number) || step_number < 1){
    res.status(400).json({
      message: 'invalid step'
    })
  } else {
      next()
  }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}