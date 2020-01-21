import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'
import { db } from '../../firebase/Firebase'
import ColType from '../.././Types'
import { Button, Form, Input, message, Radio } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input
const RadioGroup = Radio.Group

const successMessage = (description) => {
  message.success(description)
}

const errorMessage = (description) => {
  message.error(description)
}

// Using this to add students until the step form for adding students is done.
class EditTitleForm extends Component {
  state = {
    teacherId: '',
    teacher: [],
    student: null,
    submitting: false,
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      title: this.props.event.title,
      duration: this.props.event.duration,
    })
  }

  // add a new event to the teacher's events
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          submitting: true,
        }, () => {
          console.log('Received values of form: ', values)

          db.collection(ColType.calendarEvents)
          .doc(this.props.event.id)
          .update({
            title: values.title,
            duration: values.duration,
          })
          .then(() => {
            console.log('Document updated')
            successMessage('Edits made successfully.')
            if (this.props.onEditSuccessful) this.props.onEditSuccessful()
            this.setState({
              submitting: false
            })
          })
          .catch((error) => {
            console.error('Error adding document: ', error)
            this.setState({
              submitting: false
            })
            errorMessage("Something went wrong when trying to edit the group.")
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
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    }

    return (
      <Form
      onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="Title">
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Title is required.' }],
          })(
            <TextArea 
              placeholder="Title..." 
              autosize={{ minRows: 2 }} 
            />

          )}
        </FormItem>

        <FormItem {...formItemLayout} label="Duration">
          {getFieldDecorator('duration', {
            rules: [{ required: true, message: 'Duration is required.' }],
          })(
            <RadioGroup>
              <Radio value={15} disabled={this.props.expandIntoWrongBlock(15)}>15 Minutes</Radio>
              <Radio value={30} disabled={this.props.expandIntoWrongBlock(30)}>30 Minutes</Radio>
              <Radio value={45} disabled={this.props.expandIntoWrongBlock(45)}>45 Minutes</Radio>
              <Radio value={60} disabled={this.props.expandIntoWrongBlock(60)}>60 Minutes</Radio>
              <Radio value={90} disabled={this.props.expandIntoWrongBlock(90)}>90 Minutes</Radio>
            </RadioGroup>
          )}
        </FormItem>
        
        <FormItem className="mb-0">
          <Button
            type="primary"
            className="float-right"
            size={'large'}
            htmlType="submit"
            disabled={this.state.submitting}
          >
            OK
          </Button>
        </FormItem>
      </Form>

    )
  }
}

export default Form.create()(EditTitleForm)
