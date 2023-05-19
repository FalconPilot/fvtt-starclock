export const getRollResults = roll =>
  roll.terms
    .flatMap(term => term.results)
    .map(dice => dice.result)
    .reduce((acc, dice) => {
      const newAcc = [...acc]
      newAcc[dice - 1].push([
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
      ][dice - 1])
      return newAcc
    }, [[], [], [], [], [], []])
    .filter(arr => arr.length > 0)
    .reverse()
