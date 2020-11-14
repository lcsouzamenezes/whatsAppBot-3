const { sendText, getLastMessage } = require('./components/chatAPI.js')
const { randomDelayMs, strIsNumeric } = require('./components/utils.js')
const msgConfig = require('./configs/v2_msgConfig.json')
const botConfig = require('./configs/botsConfig.json')
const contactList = require('./configs/contactList.json')

const contactsArray = contactList.contacts
const msgsPerMinRange = botConfig.msgsPerMinuteRange
const verifyNewMsgsPeriod = botConfig.verifyNewMsgsPeriod

const apresentation = msgConfig.apresentation
const persApresentation = msgConfig.persApresentation
const replies = msgConfig.replyOptions
const wrongChoiceReply = msgConfig.wrongChoiceReply

console.log('# Sending apresentation messages...')
console.log('# Preparing to verify new messeges and send replies...')
console.log('')

const initialMsgBody = []
let replyBody = []

let totalMsgDelay = 0

contactsArray.forEach((contact, i) => {
  initialMsgBody[i] = {
    phone: contact.phone,
    body: Object.prototype.hasOwnProperty.call(contact, 'name') ? `${persApresentation.begin}${contact.name}${persApresentation.end}` : apresentation
  }
  replyBody[i] = {
    phone: contact.phone
  }

  const randomDelay = i ? randomDelayMs(msgsPerMinRange) : 0
  totalMsgDelay += randomDelay
  setTimeout(body => {
    console.log(`## Sending apresentation to ${body.phone}...`)
    sendText(body)
  }, totalMsgDelay, initialMsgBody[i])
})

setInterval((contactsArr, ansBody) => {
  console.log('# Verifying new messages...')
  contactsArr.forEach((contact, i) => {
    try {
      getLastMessage(contact.phone).then(response => {
        if (response !== '') {
          if (strIsNumeric(response) && Number(response) <= replies.length) {
            ansBody[i].body = replies[Number(response) - 1]
          } else {
            ansBody[i].body = wrongChoiceReply
          }
          sendText(ansBody[i])
        }
      })
    } catch (err) {
      console.log(err)
    }
  })
}, verifyNewMsgsPeriod * 1000, contactsArray, replyBody)
