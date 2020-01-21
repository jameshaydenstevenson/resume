import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import { firebase, db } from '../firebase/Firebase'
import { flattenDoc, linkAfterLogin } from '.././Util'
import ColType from '.././Types'
import { Helmet } from "react-helmet"
import { Icon, Form, Input, Button, message } from 'antd'
const FormItem = Form.Item

const errorMessage = (description) => {
  // stays permanently, I'm destroying when form is submitted.
  message.error(description, 0)
}

class SignIn extends Component {
  state = {
    user: {},
    admin: {},
    signingIn: false,
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
          // User is signed in.
          console.log("signed in user", user)
          this.setState({
              user: user,
          }, () => {
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
          })
      } else {
          console.log("signed out user", user)
          // User is signed out.
          this.setState({
              user: user,
          })
      }
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
          signingIn: true,
        }, () => {
          firebase.auth().signInWithEmailAndPassword(values.email, values.password)
            .then(() => {
                console.log("User was signed in successfully")
            })
            .catch((error) => {
                // Handle Errors here.
                var errorCode = error.code
                var errorMessageString = error.message
                if (errorMessageString === 'There ' +
                'is no user record corresponding to this identifier. ' +
                'The user may have been deleted.') {
                  errorMessageString = 'Email address or password is incorrect.'
                }
                else if (errorMessageString === 'The password is invalid ' +
                'or the user does not have a password.') {
                  errorMessageString = 'Email address or password is incorrect.'
                }
                errorMessage(errorMessageString)
                console.log("Could not sign in user", errorCode, errorMessageString)
                // only need to set this to false on error, 
                // make the button un-disabled again for another sign in.
                this.setState({
                  signingIn: false,
                })
            })
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 25 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 25 },
        sm: { span: 16 },
      },
    }

    return (
      <div className="mainContainer">
        <Helmet>
            <meta charSet="utf-8" />
            <title>Sign in</title>
            <meta name="description" 
                  content={"Sign in with your email address."} 
            />
            <meta name="keywords" content={"dot it,dotit,dotitapp," +
                    "dotit special education,Special Education,IEP Goals,IEPS,IEP," +
                    "dotit IEPs,standards,standard,standard based,standard based IEP," +
                    "standard based IEP goals,software,iep software,iep goal software," +
                    "iep calendar,progress monitoring,iep progress monitoring,iep charts," +
                    "iep reports,print iep reports,printable iep reports,district reports," +
                    "district summary,school reports,school summary,sign in"}
            />
        </Helmet>
        <div className="block w-100 m-lr-auto mb-4 pb-1 text-center">
          <img src='/logo.png' alt='logo' height='64' />
        </div>
        <div className="g-col large-form-padding w-500 m-lr-auto">
            <h1 className="mb-4 text-center pb-2">Sign in</h1>
            <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem {...formItemLayout} label="Email address">
                {getFieldDecorator('email', {
                rules: [{ required: true, message: 'Please input your email address.' }],
                })(
                <Input 
                  size={"large"} 
                  prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                  placeholder="Email Address..." />
                )}
            </FormItem>
            <FormItem {...formItemLayout} label="Password">
                {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input a password.' }],
                })(
                <Input 
                  size={"large"} 
                  prefix={<Icon type="lock" 
                  style={{ color: 'rgba(0,0,0,.25)' }} />} 
                  type="password" 
                  placeholder="Password..." />
                )}
            </FormItem>
            <div className="height-21">
              <a 
                href="/forgot-password" 
                className="float-right text-primary mt-0 mb-3">Forgot password?</a>
            </div>
            <FormItem className="mb-0">
                <Button 
                  disabled={this.state.signingIn} 
                  size={"large"} 
                  type="primary" 
                  htmlType="submit" 
                  className="login-form-button text-align-center w-100">
                  {!this.state.signingIn ?
                    <span>Sign in</span> :
                    <span><Icon type="loading" className="mr-8"/>Signing in...</span>
                  }
                </Button>
            </FormItem>
        </Form>
        </div>
    </div>

    )
  }
}

export default Form.create()(SignIn)