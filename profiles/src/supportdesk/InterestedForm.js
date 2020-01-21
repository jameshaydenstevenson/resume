import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import { db } from '../firebase/Firebase'
import ColType from '.././Types'
import { Icon, Form, Button, Input, message, Alert } from 'antd'
const FormItem = Form.Item

const errorMessage = (description) => {
  message.destroy()
  message.error(description)
}

class InterestedForm extends Component {
  state = {
    submitting: false,
    submitted: false,
  }

  componentDidMount() {
   
  }

  handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()

    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        values.title = 'Interested in dot it'
        values.message = 'None'

        this.setState({
          submitting: true,
        }, () => {
          db.collection(ColType.supportDesk).add(values)
          .then((docRef) => {
            console.log('Contact us document written with ID: ', docRef.id)
            this.setState({
              submitted: true,
              submitting: false,
            })
          })
          .catch((error) => {
            console.error('Error adding document: ', error)
            errorMessage("We could not send your contact information, please try again soon.")
            this.setState({
              submitting: false,
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
        xs: { span: 24 },
        sm: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    }

    return (
      <div>
        {this.state.submitted ?
            <Alert
            message={<h2 style={{marginTop: -6}}>Contact information received</h2>}
            description={<div>
            <div className="flex mb-1">
              <Icon type="info-circle-o" className="mr-2 font-24 mt-05" 
              style={{color: '#1890ff'}} />
              <h3>Our email response may appear in your <strong>spam folder</strong>.</h3>
            </div>
            <h3>Thank you for your interest in dot it! 
              We will respond via email.</h3></div>}
            type="success"
          />
          :
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem {...formItemLayout} label="First name" className="block-label">
              {getFieldDecorator('firstName', {
                rules: [{ required: true, message: 'Please input your school name.' }],
              })(
                <Input size={"large"} 
                prefix={<Icon type="user" 
                style={{ color: 'rgba(0,0,0,.25)' }} />} 
                placeholder="First name..." />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="Last name" className="block-label">
              {getFieldDecorator('lastName', {
                rules: [{ required: true, message: 'Please input your school name.' }],
              })(
                <Input size={"large"} 
                prefix={<Icon type="user" 
                style={{ color: 'rgba(0,0,0,.25)' }} />} 
                placeholder="Last name..." />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="Email address" className="block-label">
              {getFieldDecorator('emailAddress', {
                rules: [{ required: true, message: 'Please input an email address.' }],
              })(
                <Input 
                  size={"large"} 
                  prefix={<Icon type="mail" 
                  style={{ color: 'rgba(0,0,0,.25)' }} />} 
                  placeholder="Email address..." />
              )}
            </FormItem>

            <FormItem className="mb-0 mt-4">
              <Button 
              disabled={this.state.submitting} 
              size={"large"} type="primary" 
              htmlType="submit" 
              className="float-right">
              {!this.state.submitting ?
                <span>
                  Submit
                </span> :
                <span><Icon type="loading" className="mr-8"/>Submitting...</span>
              }
              </Button>
            </FormItem>
        </Form>
        }
      </div>
    )
  }
}

export default Form.create()(InterestedForm)
