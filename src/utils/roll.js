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

// Roll is fumble if it has no successes AND it has at least a 1 in its results
export const checkFumble = (roll, complexity, difficulty, threshold) => {
  const results = getRollResults(roll, complexity, difficulty)

  const isSuccessful = checkSuccess(roll, complexity, difficulty)

  return !isSuccessful && results.filter(dice => dice.result <= complexity && dice.mandatory).length >= threshold
}
