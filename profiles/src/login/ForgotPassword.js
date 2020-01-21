import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import { firebase } from '../firebase/Firebase'
import { Icon, Form, Input, Button, message } from 'antd'
const FormItem = Form.Item

const successMessage = (description) => {
    message.success(description)
}

const errorMessage = (description) => {
  // stays permanently, I'm destroying when form is submitted.
    message.error(description, 0)
}

// This page can only be accessed by us, it is how you add admins that then can add teachers.
class ForgotPassword extends Component {
  state = {
    user: {},
    admin: {},
    sendingEmail: false,
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
          // User is signed in.
          console.log("signed in user", user)
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
          sendingEmail: true,
        }, () => {
            firebase.auth().sendPasswordResetEmail(values.email).then(() => {
                // Email sent.
                this.setState({
                    sendingEmail: false,
                }, () => {
                    successMessage("We have sent you an email to reset your password.")
                })
              }).catch((error) => {
                // An error happened.
                console.log("error")
                
                this.setState({
                    sendingEmail: false,
                }, () => {
                    errorMessage("Something went wrong, please try again. " +
                    "If this keeps happening please send us an email.")
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
        <div className="g-col large-form-padding w-500 m-lr-auto">
          <h2 className="mb-2 text-center">Forgot your password?</h2>
          <h3 className="mb-4 text-center">We'll send you an email so that you can reset it.</h3>
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
            <FormItem className="mb-0">
                <Button 
                  disabled={this.state.sendingEmail} 
                  size={"large"} 
                  type="primary" 
                  htmlType="submit" 
                  className="login-form-button text-align-center w-100">
                  {!this.state.sendingEmail ?
                            <span>Send me an email</span> :
                            <span><Icon type="loading" className="mr-8"/>Sending...</span>
                          }
                </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}

export default Form.create()(ForgotPassword)