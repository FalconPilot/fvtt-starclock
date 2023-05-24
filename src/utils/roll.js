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

export const getRollNums = num => roll =>
  extractMatrix(roll)
    .flat()
    .filter(dice => dice === num)
    .length

export const onlyHasOnes = roll =>
  getRollNums(1)(roll) === extractMatrix(roll).flat().length

export const getLowest = roll =>
  extractMatrix(roll)
    .flat()
    .reverse()[0]

export const getHighest = roll =>
  extractMatrix(roll)
    .flat()[0]

export const getBestRoll = roll =>
  extractMatrix(roll)
    .reduce((best, arr) =>
      arr.length > best.length
        ? arr
        : arr.length === best.length
        ? (Math.max(...arr) > Math.max(...best) ? arr : best)
        : best
    , [])

export const checkFumble = roll =>
  Math.max(...getBestRoll(roll)) === 1
