const { sendText } = require('../components/chatAPI.js')
const { randomDelayMs } = require('../components/utils.js')
const msgConfig = require('../configs/v1_msgConfig.json')
const botConfig = require('../configs/botsConfig.json')
const contactList = require('../configs/contactList.json')

const contactsArray = contactList.contacts
const msgsPerMinRange = botConfig.msgsPerMinuteRange

const msg = msgConfig.msg
const personalizedMsg = msgConfig.personalizedMsg

const msgsBody = []
let totalMsgDelay = 0

console.log('# Sending messages...')

contactsArray.forEach((contact, i) => {
  msgsBody[i] = {
    phone: contact.phone,
    body: Object.prototype.hasOwnProperty.call(contact, 'name') ? `${personalizedMsg.begin}${contact.name}${personalizedMsg.end}` : msg
  }
  const randomDelay = i ? randomDelayMs(msgsPerMinRange) : 0
  totalMsgDelay += randomDelay
  setTimeout(body => {
    console.log(`## Sending msg to ${body.phone}...`)
    sendText(body)
  }, totalMsgDelay, msgsBody[i])
})
