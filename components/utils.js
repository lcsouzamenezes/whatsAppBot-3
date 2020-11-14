/* eslint-disable no-undef */
function getRandomInt (_max) {
  const max = Math.floor(_max)
  return (Math.floor(Math.random() * max))
}

function randomDelayMs (range) {
  const min = !range[0] ? 1 : Math.ceil(60 * 1000 / range[1])
  const max = !range[0] ? 60 : Math.floor(60 * 1000 / range[0])

  return (Math.floor(Math.random() * (max - min)) + min)
}

function json2URLSearchParams (json) {
  const urlParams = new URLSearchParams()
  for (key in json) {
    urlParams.append(key, json[key])
  }
  return urlParams
}

function strIsNumeric (str) {
  if (typeof str !== 'string') {
    return false
  }
  return !isNaN(str) && !isNaN(parseFloat(str))
}

module.exports = {
  getRandomInt,
  randomDelayMs,
  json2URLSearchParams,
  strIsNumeric
}
