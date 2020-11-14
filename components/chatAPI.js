const fetch = require('node-fetch')
const botConfig = require('../configs/botsConfig.json')
const { randomDelayMs, json2URLSearchParams } = require('./utils.js')

const token = botConfig.chatApiToken
const instanceId = botConfig.chatApiInstanceId

const replyDelayRange = botConfig.replyDelayRange

function getChatApiUrl (method, inst, tok) {
  return `https://api.chat-api.com/instance${inst}/${method}?token=${tok}`
}

function sendText (textBody) {
  fetch(getChatApiUrl('sendMessage', instanceId, token), {
    method: 'POST',
    body: json2URLSearchParams(textBody)
  })
    .then(res => res.json())
    .then(jsonResp => {
      console.log('### Text requisition done! Server response:')
      console.log(`#### Sent: ${jsonResp.sent}`)
      console.log(`#### Msg: ${jsonResp.message}`)
      console.log('')
    })
    .catch(err => {
      console.warn(`### Error sending text to ${textBody.phone}: ${err}`)
      console.log('')
    })
}

function sendAudio (textBody) {
  fetch(getChatApiUrl('sendPTT', instanceId, token), {
    method: 'POST',
    body: json2URLSearchParams(textBody)
  })
    .then(res => res.json())
    .then(jsonResp => {
      console.log('### Audio requisition done! Server response:')
      console.log(`#### Sent: ${jsonResp.sent}`)
      console.log(`#### Msg: ${jsonResp.message}`)
      console.log('')
    })
    .catch(err => {
      console.warn(`### Error sending phone to ${textBody.phone}: ${err}`)
      console.log('')
    })
}

function sendFile (fileBody) {
  fetch(getChatApiUrl('sendFile', instanceId, token), {
    method: 'POST',
    body: json2URLSearchParams(fileBody)
  })
    .then(res => res.json())
    .then(jsonResp => {
      console.log('### File requisition done! Server response:')
      console.log(`#### Sent: ${jsonResp.sent}`)
      console.log(`#### Msg: ${jsonResp.message}`)
      console.log('')
    })
    .catch(err => {
      console.warn(`### Error sending file to ${fileBody.phone}: ${err}`)
      console.log('')
    })
}

function replyLastMessage (phone, controlArr, controlInd, replyFunction, replyArgs) {
  fetch(`${getChatApiUrl('messages', instanceId, token)}&last=true&chatId=${phone}%40c.us&limit=1`, {
    method: 'GET'
  })
    .then(res => res.json())
    .then(jsonResp => {
      if (jsonResp.messages.length) {
        if (!jsonResp.messages[0].fromMe) {
          console.log(`### ${phone}: "${jsonResp.messages[0].body}"`)
          console.log('### Responding...')
          controlArr[controlInd] = true
          setTimeout(replyFunction, randomDelayMs(replyDelayRange), replyArgs)
        }
      }
    })
    .catch(err => {
      console.warn(`### Error sending file: ${err}`)
      console.log('')
    })
}

async function getLastMessage (phone) {
  return new Promise((resolve, reject) => {
    fetch(`${getChatApiUrl('messages', instanceId, token)}&last=true&chatId=${phone}%40c.us&limit=1`, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(jsonResp => {
        if (jsonResp.messages.length) {
          if (!jsonResp.messages[0].fromMe) {
            console.log(`### ${phone}: "${jsonResp.messages[0].body}"`)
            return resolve(jsonResp.messages[0].body)
          }
        }
        return resolve('')
      })
      .catch(err => {
        return reject(err)
      })
  })
}

module.exports = {
  sendText,
  sendFile,
  replyLastMessage,
  getLastMessage,
  sendAudio
}
