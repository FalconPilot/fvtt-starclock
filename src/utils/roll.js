const extractMatrix = roll =>
  roll.terms
    .flatMap(term => term.results)
    .map(dice => dice.result)
    .reduce((acc, dice) => {
      const newAcc = [...acc]
      newAcc[dice - 1].push(dice)
      return newAcc
    }, [[], [], [], [], [], []])
    .filter(arr => arr.length > 0)

export const getRollResults = roll =>
  extractMatrix(roll)
    .map(arr => arr.map(dice => [
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
    ][dice - 1]))
    .reverse()

export const getScore = roll =>
  extractMatrix(roll)
    .reduce((score, arr) => {
      const minScore = arr.some(dice => dice > 3) ? 1 : 0
      const lengthScore = arr.length > 1 ? arr.length : 0

      return Math.max(score, lengthScore, minScore)
    }, 0)
