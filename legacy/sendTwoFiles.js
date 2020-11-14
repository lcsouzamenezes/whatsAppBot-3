const { sendText, sendFile } = require('../components/chatAPI.js')
const { randomDelayMs } = require('../components/utils.js')
const msgConfig = require('../configs/v1_msgConfig.json')
const botConfig = require('../configs/botsConfig.json')
const contactList = require('../configs/contactList.json')

const contactsArray = contactList.contacts
const msgsPerMinRange = botConfig.msgsPerMinuteRange

const msg = msgConfig.msg
const personalizedMsg = msgConfig.personalizedMsg

const firstFileLink = msgConfig.firstFileLink
const firstFileName = msgConfig.firstFileName
const secondFileLink = msgConfig.secondFileLink
const secondFileName = msgConfig.secondFileName

const msgsBody = []
const fileOneBody = []
const fileTwoBody = []
let totalMsgDelay = 0

console.log('# Sending messages...')

contactsArray.forEach((contact, i) => {
  msgsBody[i] = {
    phone: contact.phone,
    body: Object.prototype.hasOwnProperty.call(contact, 'name') ? `${personalizedMsg.begin}${contact.name}${personalizedMsg.end}` : msg
  }
  fileOneBody[i] = {
    phone: contact.phone,
    body: firstFileLink,
    filename: firstFileName
  }
  fileTwoBody[i] = {
    phone: contact.phone,
    body: secondFileLink,
    filename: secondFileName
  }

  const randomDelay = i ? randomDelayMs(msgsPerMinRange) : 0
  totalMsgDelay += randomDelay

  setTimeout((msg, fileOne, fileTwo) => {
    console.log(`## Sending msg and files to ${msg.phone}...`)
    sendText(msg)
    sendFile(fileOne)
    sendFile(fileTwo)
  }, totalMsgDelay, msgsBody[i], fileOneBody[i], fileTwoBody[i])
})
