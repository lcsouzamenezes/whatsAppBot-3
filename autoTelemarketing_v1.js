const prompt = require('prompt-sync')({ sigint: true })
const { sendText, sendFile, replyLastMessage } = require('./components/chatAPI.js')
const { randomDelayMs } = require('./components/utils.js')
const msgConfig = require('./configs/v1_msgConfig.json')
const botConfig = require('./configs/botsConfig.json')
const contactList = require('./configs/contactList.json')

const contactsArray = contactList.contacts
const msgsPerMinRange = botConfig.msgsPerMinuteRange
const verifyNewMsgsPeriod = botConfig.verifyNewMsgsPeriod

const reply = msgConfig.reply
const msg = msgConfig.msg
const personalizedMsg = msgConfig.personalizedMsg

const firstFileLink = msgConfig.firstFileLink
const firstFileName = msgConfig.firstFileName
const secondFileLink = msgConfig.secondFileLink
const secondFileName = msgConfig.secondFileName

function sendMsgAndFiles (bodies) {
  sendText(bodies[0])
  for (let i = 1; i < bodies.length; i++) {
    sendFile(bodies[i])
  }
}

const expectedBotreply = prompt('* Type the expected bot reply (1file, 2files, text): ')
if (expectedBotreply !== '1file' && expectedBotreply !== '2files' && expectedBotreply !== 'text') {
  console.log('')
  console.error('* Unkown command. Valid commands: 1file, 2files, text.')
  process.exit(1)
}

const initialMsgBody = []
const replyBody = []
const fileOneBody = []
const fileTwoBody = []
const alreadyreplied = []

let totalMsgDelay = 0

console.log('# Sending inital messages...')
console.log('# Preparing to verify new messeges and send replies...')
console.log('')

contactsArray.forEach((contact, i) => {
  initialMsgBody[i] = {
    phone: contact.phone,
    body: Object.prototype.hasOwnProperty.call(contact, 'name') ? `${personalizedMsg.begin}${contact.name}${personalizedMsg.end}` : msg
  }
  replyBody[i] = {
    phone: contact.phone,
    body: reply
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
  alreadyreplied[i] = false

  const randomDelay = i ? randomDelayMs(msgsPerMinRange) : 0
  totalMsgDelay += randomDelay
  setTimeout(body => {
    console.log(`## Sending msg to ${body.phone}...`)
    sendText(body)
  }, totalMsgDelay, initialMsgBody[i])
})

setInterval((contactsArr, already, ansBody, file1Body, file2Body) => {
  console.log('## Verifying if there is any new message...')
  contactsArr.forEach(async (contact, i) => {
    if (!already[i]) {
      switch (expectedBotreply) {
        case 'text':
          replyLastMessage(contact.phone, already, i, sendText, ansBody[i])
          break
        case '1file':
          replyLastMessage(contact.phone, already, i, sendMsgAndFiles, [ansBody[i], file1Body[i]])
          break
        case '2files':
          replyLastMessage(contact.phone, already, i, sendMsgAndFiles, [ansBody[i], file1Body[i], file2Body[i]])
          break
      }
    }
  })
  const state = already.filter(alreadySent => { return !alreadySent })
  if (!state.length) {
    console.log('# Finished!')
    process.exit(1)
  }
}, verifyNewMsgsPeriod * 1000, contactsArray, alreadyreplied, replyBody, fileOneBody, fileTwoBody)
