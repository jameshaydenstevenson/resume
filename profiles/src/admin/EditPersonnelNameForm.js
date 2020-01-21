import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import { db } from '../firebase/Firebase'
import { Icon, message, Form, Button, Input, Modal, Tooltip } from 'antd'
const FormItem = Form.Item

const successMessage = (description) => {
  message.success(description)
}

const errorMessage = (description) => {
  message.error(description)
}

class EditPersonnelNameForm extends Component {
  state = {
    visible: false,
    submitting: false,
  }

  componentDidMount() {
    if (this.props.person) {
      this.props.form.setFieldsValue({
        firstName: this.props.person.firstName,
        lastName: this.props.person.lastName,
      })
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleOk = (e) => {
    console.log(e)
    this.setState({
      visible: false,
    })
  }

  handleCancel = (e) => {
    console.log(e)
    this.setState({
      visible: false,
    })
  }

  // adding directly here, in the future it will send an email.
  handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()

    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)

        this.setState({
          submitting: true,
        }, () => {
          db.collection(this.props.collectionType)
            .doc(this.props.person.id)
            .update({
              firstName: values.firstName,
              lastName: values.lastName,
            })
            .then(() => {
              if (this.props.onEditSuccessful) this.props.onEditSuccessful()
              this.setState({ submitting: false, visible: false })
              successMessage("Name edited successfully.")
            })
            .catch((error) => {
              console.log(error)
              this.setState({ submitting: false, visible: false })
              errorMessage("Name could not be updated.")
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
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 25 },
        sm: { span: 18 },
      },
    }

    return (
      <div className="inline-block">
        <Tooltip title="Edit name">
         <Button 
         className={"transparent-btn inline-block text-more-muted font-20" +
                    (this.props.btnStyles ? " " + this.props.btnStyles : "")}
         onClick={this.showModal}>
          <Icon type="edit" />
          </Button>
        </Tooltip>
        <Modal
          title="Edit Name"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
            <div>
              <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem {...formItemLayout} label="First name">
                  {getFieldDecorator('firstName', {
                    rules: [{ required: true, message: 'Please input the school name.' }],
                  })(
                    <Input size={"large"} placeholder="First name..." />
                  )}
                </FormItem>

                 <FormItem {...formItemLayout} label="Last name">
                  {getFieldDecorator('lastName', {
                    rules: [{ required: true, message: 'Please input the school name.' }],
                  })(
                    <Input size={"large"} placeholder="Last name..." />
                  )}
                </FormItem>
                
                <FormItem className="mb-0">
                  <Button disabled={this.state.submitting} 
                    type="primary" 
                    htmlType="submit" 
                    className="login-form-button text-align-center float-right"
                  >
                    OK
                  </Button>
                </FormItem>
            </Form>
          </div>
        </Modal>
        
    </div>
    )
  }
}

export default Form.create()(EditPersonnelNameForm)
