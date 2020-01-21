const firebase = require('firebase')
// Required for side-effects
require('firebase/firestore')
require('firebase/storage')

firebase.initializeApp({
  apiKey: 'AIzaSyCfAIiEofLUeFmiJtHC2jAl0DiFZNB0sFw',
  databaseURL: 'https://scott-b12ee.firebaseio.com',
  projectId: 'scott-b12ee',
})

// firestore
var db = firebase.firestore()

export {db}
export {firebase}

