const db = require('../../data/db-config')

function find() {

  const schemes = db
    .select('sc.*').count('st.step_id as number_of_steps')
    .from('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .groupBy('sc.scheme_id')
    .orderBy('sc.scheme_id')

  return schemes
}

async function findById(scheme_id) {

  const stepsRepeat = await db
    .select('sc.scheme_name', 'st.*')
    .from('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_number')

  if(!stepsRepeat[0]["step_id"]){
    const steps = {
      "scheme_id": scheme_id,
      "scheme_name": stepsRepeat[0]["scheme_name"],
      "steps": []
    }
    return steps

  } else {
      const stepsArray = stepsRepeat.map(stepObj => {
        return {
          "step_id": stepObj["step_id"],
          "step_number": stepObj["step_number"],
          "instructions": stepObj["instructions"]
        }
      })
      const steps = {
        "scheme_id": stepsRepeat[0]["scheme_id"],
        "scheme_name": stepsRepeat[0]["scheme_name"],
        "steps": stepsArray
      }
      return steps
  }
}

async function findSteps(scheme_id) { 

  const steps = await db
      .select('st.step_id', 'st.step_number', 'st.instructions', 'sc.scheme_name')
      .from('schemes as sc')
      .leftJoin('steps as st', 'st.scheme_id', 'sc.scheme_id')
      .where('sc.scheme_id', scheme_id)
      .orderBy('st.step_number')

  if(!steps[0]["step_id"]){
    return []
  } else return steps
}

async function add(scheme) { // EXERCISE D

  const id = await db('schemes')
    .insert({scheme_name: scheme.scheme_name})
  
  const [newScheme] = await db('schemes')
    .where('scheme_id', id)
  
  return newScheme
}

async function addStep(scheme_id, step) { // EXERCISE E

  await db('steps')
    .insert(
      {
        instructions: step.instructions, 
        step_number: step.step_number, 
        scheme_id: scheme_id
      }
    )

  const newSteps = await findSteps(scheme_id)
  return newSteps
}

async function checkId(id) {

  const [scheme] = await db('schemes')
    .where('scheme_id', id)

  return scheme
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
  checkId
}