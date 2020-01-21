import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import { firebase, db } from '../firebase/Firebase'
import { flattenDoc, getQueryStringParam, linkAfterLogin } from '.././Util'
import ColType from '.././Types'
import { Icon, Form, Input, Button,  message } from 'antd'
const FormItem = Form.Item

const successMessage = (description) => {
    message.success(description)
}

const errorMessage = (description) => {
    message.error(description)
}

// Reset password on initial verification. This is the page the user gets
// redirected to automatically after clicking on the email to verify their
// account. Need to sign them in => change their initial password.
class VerifyEmail extends Component {
  state = {
    user: {},
    email: '',
    initialPassword: '',
  }

  componentDidMount() {
    var email = getQueryStringParam('email')
    var password = getQueryStringParam('token')

    //antd wants you to set known form values this way.
    this.props.form.setFieldsValue({
        email: email,
     })

    this.setState({
        initialPassword: password,
        email: email,
    }, () => {
        // sign them in with their email and initial password so they can reset it later.
        firebase.auth().signInWithEmailAndPassword(email, password)
            .catch(function(error) {
                // sign in error
                var errorCode = error.code
                var errorMessage = error.message
                console.log("Could not sign in.", errorCode, errorMessage)
            })
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        
        var user = firebase.auth().currentUser
        if (user === null) {
          errorMessage("User is null.")
          return
        }

        if (values.password !== values.confirmPassword) {
          errorMessage("Passwords do not match, please try again.")
          return
        }
        
        if (values.password.length < 6 || values.confirmPassword.length < 6) {
          errorMessage("Password must be at least 6 characters.")
          return
        }

        // form successfully completed, update their password to the new password.
        user.updatePassword(values.password).then(function() {
            // Update successful.
            console.log("User password updated successfully.")
            successMessage("User password has been set successfully.")
            // get the user's job and link to the appropriate page.
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
        }).catch(function(error) {
            // An error happened.
            console.log("User password could not be updated.", error)
            errorMessage("User password could not be set.")
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 25 },
        sm: { span: 9 },
      },
      wrapperCol: {
        xs: { span: 25 },
        sm: { span: 15 },
      },
    }

    return (
        <div className="w-500 m-lr-auto pt-50">
            <div className="block w-100 m-lr-auto mb-4 text-center">
              <img src='/logo.png' alt='logo' height='64' />
            </div>
                <h1 className="mt-4 mb-1 text-center">You're account is verified!</h1>
                <h2 className="mb-4 pb-1 text-center">Please set your password.</h2>
                <div className="g-col inline-block w-100 padding-25">
                  <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem {...formItemLayout} label="Email address">
                      {getFieldDecorator('email', {
                        rules: [{ required: false, message: '' }],
                      })(
                        <Input 
                          disabled={true} 
                          size={"large"} 
                          prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                        placeholder="Email address..." />
                      )}
                    </FormItem>
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
                    <FormItem {...formItemLayout} label="Confirm password">
                      {getFieldDecorator('confirmPassword', {
                        rules: [{ required: true, message: 'Please input a password.' }],
                      })(
                        <Input 
                          size={"large"} 
                          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                          type="password" 
                          placeholder="Confirm password..." />
                      )}
                    </FormItem>
                    <FormItem className="mb-0 mt-3">
                      <Button 
                        size={"large"} 
                        type="primary" 
                        htmlType="submit" 
                        className="login-form-button text-align-center w-100"
                      >
                        Confirm
                      </Button>
                    </FormItem>
                </Form>
              </div>
            </div>
    )
  }
}

export default Form.create()(VerifyEmail)