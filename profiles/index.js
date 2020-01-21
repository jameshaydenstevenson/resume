const functions = require('firebase-functions')
const admin = require('firebase-admin')
const app = require('./server/build/server.bundle.js').default
const mandrill = require('mandrill-api/mandrill')
const mandrill_client = new mandrill.Mandrill('A7OAtS8ntHKIO2e6Ny7ehw')
const request = require('request')
const moment = require('moment')
const stripe = require('stripe')('sk_test_hC2O7z3NVqTUQYmUP4sosrxy')
admin.initializeApp()
const db = admin.firestore()

exports.app = functions.https.onRequest(app)

exports.payment = functions.firestore
  .document('paymentInfo/{docId}')
  .onCreate((snap, context) => {
    var data = snap.data()
    var id = snap.id
    const idempotencyKey = context.params.id
    console.log('Payment info received from ' +
    data.firstName + ' ' + data.email + ' ' + data.phone +
    ' ' + data.amount + '  paymentStatusRefId ' + data.paymentStatusRefId +
    ' token id ' + data.stripeToken.id + 
    ' -- doc id ' + id)

    return new Promise((resolve, reject) => {
      stripe.charges.create({
        amount: data.amount,
        currency: "usd",
        source: data.stripeToken.id,
        description: "Payment"
      }, {
        idempotency_key: idempotencyKey,
      })
      .then(() => {
        // charge successful
        console.log("charge successful")
        db.collection('paymentStatus').doc(data.paymentStatusRefId)
          .set({
            status: 'Success'
          })
          .then(() => {
            resolve()
          })
          .catch((e) => {
            reject()
          })
      })
      .catch((e) => {
        // charge error
        console.log("stripe paymentInfo error", e)
        db.collection('paymentStatus').doc(data.paymentStatusRefId)
          .set({
            status: 'Error'
          })
          .then(() => {
            resolve()
          })
          .catch((e) => {
            reject()
          })
      })
    })
})