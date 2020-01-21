import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import { db } from '../firebase/Firebase'
import ColType from '.././Types'
import { Icon, message, Form, Button, Input, Modal, Tooltip } from 'antd'
const FormItem = Form.Item

const successMessage = (description) => {
  message.success(description)
}

const errorMessage = (description) => {
  message.error(description)
}

class EditSchoolNameForm extends Component {
  state = {
    visible: false,
    submitting: false,
  }

  componentDidMount() {
    if (this.props.school) {
      this.props.form.setFieldsValue({
        schoolName: this.props.school.schoolName
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
          db.collection(ColType.school)
            .doc(this.props.school.id)
            .update({
              schoolName: values.schoolName,
            })
            .then(() => {
              this.setState({ submitting: false, visible: false })
              successMessage("School name edited successfully.")
            })
            .catch((error) => {
              this.setState({ submitting: false, visible: false })
              errorMessage("School name could not be updated.")
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
      <div className="inline-block ml-2">
        <Tooltip title="Edit school name">
         <Button className="transparent-btn inline-block text-more-muted font-20"
         onClick={this.showModal}>
          <Icon type="edit" />
          </Button>
        </Tooltip>
        <Modal
          title="Edit School Name"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
            <div>
              <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem {...formItemLayout} label="School name">
                  {getFieldDecorator('schoolName', {
                    rules: [{ required: true, message: 'Please input the school name.' }],
                  })(
                    <Input size={"large"} placeholder="School name..." />
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

export default Form.create()(EditSchoolNameForm)
