const formatRoll = roll =>
  roll.terms
    .flatMap(term => term.results)
    .map(dice => dice.result)

export const getRollResults = (roll, complexity, difficulty) =>
  formatRoll(roll)
    .map((result, idx) => ({
      result: result,
      success: result >= difficulty,
      mandatory: idx < complexity
    }))

export const checkSuccess = (roll, complexity, difficulty) => {
  const results = getRollResults(roll, complexity, difficulty)

  const successes = results.filter(dice => dice.success)

  return successes.length >= complexity
}

// Roll is fumble if it has no successes AND it has to have as many 1s as
// the threshold OR a full set of 1s as a result
export const checkFumble = (roll, complexity, difficulty, threshold) => {
  const results = getRollResults(roll, complexity, difficulty)
  const isSuccessful = checkSuccess(roll, complexity, difficulty)
  const mandatoryOnes = results.filter(dice => dice.result === 1 && dice.mandatory)

  return !isSuccessful && mandatoryOnes.length >= Math.min(threshold, complexity)
}

export const checkCritical = (roll, complexity, difficulty) => {
  const results = getRollResults(roll, complexity, difficulty)
  const isSuccessful = checkSuccess(roll, complexity, difficulty)

  return isSuccessful && results.filter(dice => dice.result === 10 && dice.mandatory).length >= 2
}
