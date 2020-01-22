const firebase = require('firebase')
// Required for side-effects
require('firebase/firestore')
require('firebase/storage')

firebase.initializeApp({
  apiKey: '',
  databaseURL: '',
  projectId: '',
})

// firestore
var db = firebase.firestore()

export {db}
export {firebase}

