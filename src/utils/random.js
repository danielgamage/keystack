export const generateID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

//
//
//

export const getRandomChild = (array, seed) => {
  seed = seed || Math.random()

  const index = Math.min(
    Math.round(seed * array.length),
    array.length - 1
  )

  return array[index]
}

//
//
//

export const getRandomBoolean = (likelihood = 50) => {
  const random = Math.random() * 100

  return random < likelihood
}

//
// getRandomNumberWithBias adapted from https://ayrton.sparling.us/index.php/finally-a-bias-random-number-generator/
// @arg bias: 0 ≤ bias ≤ 1
// @arg influence: 0 ≤ influence ≤ 100
//

export const getRandomNumberWithBias = (bias = 0.5, influence = 50) => {
  influence = Math.pow((100 - influence) / 30, 1.5)
  var random = Math.random()
  var difference = random - bias
  var mixer = Math.pow(Math.random(), influence)
  return random - (difference * mixer)
}

export const getRandomNumberInRange = (min, max) => {
  return conformValueToRange(Math.random(), 0, 1, min, max)
}

export const getRandomIntegerInRange = (min, max) => {
  return Math.floor(
    Math.random() * (max + 1 - min) + min
  )
}

export const conformValueToRange = (value, inMin, inMax, outMin, outMax) => {
  return outMin + ((value - inMin) * (outMax - outMin) / (inMax - inMin))
}
