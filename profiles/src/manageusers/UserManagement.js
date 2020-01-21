import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import { firebase, db } from '../firebase/Firebase'
import { flattenDoc, getQueryStringParam, linkAfterLogin } from '.././Util'
import ColType from '.././Types'
import { Icon, Form, Input, Button, message } from 'antd'
const FormItem = Form.Item

const successMessage = (description) => {
    message.success(description)
}

const errorMessage = (description) => {
    message.error(description)
}

// Handles verify email, password resets, and recover email for users.
// This is the page users get redirected to from emails.
class UserManagement extends Component {
  state = {
    mode: '',
    actionCode: '',
    continueUrl: '',
    resettingPassword: false,
  }

  componentDidMount() {
    // for reset password only, after resetting password they are logged in and
    // then redirected using linkAfterLogin func. VerifyEmail logs them in on that
    // page so there is no conflict. Also, on this page they are not logged in when
    // they get here so there is also no conflict.
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
          // User is signed in.
          console.log("signed in user", user)
          db.collection(ColType.users)
          .doc(user.uid)
          .onSnapshot((doc) => {
            var userInfo = flattenDoc(doc)
            console.log("userinfo", userInfo)
            db.collection(userInfo.accessLevel)
              .doc(userInfo.refId)
              .onSnapshot((doc) => {
                var userJobInfo = flattenDoc(doc)
                console.log(userInfo, userJobInfo)
                linkAfterLogin(userInfo, userJobInfo)
              })
          })
      } else {
          console.log("signed out user", user)
          // User is signed out.
      }
    })  

    var auth = firebase.auth()
    // Get the action to complete.
    var mode = getQueryStringParam('mode')
    // Get the one-time code from the query parameter.
    var actionCode = getQueryStringParam('oobCode')
    // (Optional) Get the continue URL from the query parameter if available.
    var continueUrl = getQueryStringParam('continueUrl')

    this.setState({
      mode: mode,
      actionCode: actionCode,
      continueUrl: continueUrl,
    }, () => {
      // Handle the user management action.
      switch (mode) {
        case 'resetPassword':
          // User will see a form and will reset their password, on success they will be redirected.
          break
        case 'recoverEmail':
          // Display email recovery handler and UI.
          this.handleRecoverEmail(auth, actionCode)
          break
        case 'verifyEmail':
          // Display email verification handler and UI.
          this.handleVerifyEmail(auth, actionCode, continueUrl)
          break
        default:
          console.log("mode not found.")
      }
    })
  }

  handleResetPassword = (auth, actionCode, continueUrl, newPassword) => {
    // Verify the password reset code is valid.
    auth.verifyPasswordResetCode(actionCode).then(function(email) {
      var accountEmail = email
  
      // Save the new password.
      auth.confirmPasswordReset(actionCode, newPassword).then(function(resp) {
        // Password reset has been confirmed and new password updated.
        successMessage("Your password has been successfully changed.")
        // sign the user in with the new password, 
        // when auth changes they will be redirected to the correct page.
        firebase.auth().signInWithEmailAndPassword(accountEmail, newPassword).catch((error) => {
          // Handle Errors here.
          var errorCode = error.code
          var errorText = error.message
          console.log(errorCode, errorText)
        })
  
        // TODO: Display a link back to the app, or sign-in the user directly
        // if the page belongs to the same domain as the app:
        // auth.signInWithEmailAndPassword(accountEmail, newPassword)
  
        // TODO: If a continue URL is available, display a button which on
        // click redirects the user back to the app via continueUrl with
        // additional state determined from that URL's parameters.
      }).catch(function(error) {
        console.log(error)
        errorMessage("Something went wrong, please try again.")
        // Error occurred during confirmation. The code might have expired or the
        // password is too weak.
      })
    }).catch(function(error) {
      console.log(error)
      errorMessage("Something went wrong, please try again.")
      // Invalid or expired action code. Ask user to try to reset the password
      // again.
    })
  }

  handleRecoverEmail = (auth, actionCode) => {
    var restoredEmail  = null
    // Confirm the action code is valid.
    auth.checkActionCode(actionCode).then(function(info) {
      // Get the restored email address.
      restoredEmail = info['data']['email']
  
      // Revert to the old email.
      return auth.applyActionCode(actionCode)
    }).then(function() {
      // Account email reverted to restoredEmail
  
      // TODO: Display a confirmation message to the user.
  
      // You might also want to give the user the option to reset their password
      // in case the account was compromised:
      auth.sendPasswordResetEmail(restoredEmail).then(function() {
        // Password reset confirmation sent. Ask user to check their email.
      }).catch(function(error) {
        // Error encountered while sending password reset code.
      })
    }).catch(function(error) {
      // Invalid code.
    })
  }
  

  handleVerifyEmail = (auth, actionCode, continueUrl) => {
    console.log("Handle verify email.")
    
    // Try to apply the email verification code.
    auth.applyActionCode(actionCode).then(function(resp) {
      // Email address has been verified.
      console.log("Email address has been verified.")
      // Redirect user to the continue URL
      window.location.href = continueUrl
      // TODO: Display a confirmation message to the user.
      // You could also provide the user with a link back to the app.
  
      // TODO: If a continue URL is available, display a button which on
      // click redirects the user back to the app via continueUrl with
      // additional state determined from that URL's parameters.
    }).catch(function(error) {
      // Code is invalid or expired. Ask the user to verify their email address
      // again.
      errorMessage("Email address could not be verified. Please contact your administrator.")
    })
  }

  // adding directly here, in the future it will send an email.
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      message.destroy() // destroy previous error messages on form submit.
      if (!err) {
        console.log('Received values of form: ', values)

        this.setState({
          resettingPassword: true,
        }, () => {
           this.handleResetPassword(firebase.auth(), 
           this.state.actionCode, this.state.continueUrl, values.password)
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 25 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 25 },
        sm: { span: 17 },
      },
    }

    return (
      <div className="w-100 h-100">
        {this.state.mode !== "resetPassword" ? 
        <div className="w-100 pt-200 flex flex-v-center flex-h-center">
          <div className="font-34 text-cyan">
            <div className="block w-100 m-lr-auto mb-4 text-center">
              <img src='/logo.png' alt='logo' height='64' />
            </div>
            <div className="w-100 m-lr-auto">
              <Icon type="loading" className="mr-3 text-cyan"/>
              <span>Please wait...</span>
            </div>
          </div>
        </div>
         :
         <div className="g-col large-form-padding w-500 m-lr-auto mt-4">
            <div>
                <h2 className="mb-4 text-center">Reset your password</h2>
                <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem {...formItemLayout} label="Password">
                      {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input a password.' }],
                      })(
                        <Input 
                          size={"large"} 
                          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                          type="password" 
                          placeholder="Password" />
                      )}
                </FormItem>
                <FormItem className="mb-0">
                    <Button 
                      disabled={this.state.resettingPassword} 
                      size={"large"} 
                      type="primary" 
                      htmlType="submit" 
                      className="login-form-button text-align-center w-100">
                      {!this.state.resettingPassword ?
                        <span>Confirm new password</span> :
                        <span><Icon type="loading" className="mr-8"/>Resetting...</span>
                      }
                    </Button>
                </FormItem>
            </Form>
            </div>
        </div> }
      </div>
    )
  }
}

export default Form.create()(UserManagement)