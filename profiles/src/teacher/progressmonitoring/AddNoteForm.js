import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'
import { firebase, db } from '../../firebase/Firebase'
import ColType from '../.././Types'
import { Button, Form, Input, message, Rate } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input

const successMessage = (description) => {
  message.success(description)
}

const errorMessage = (description) => {
  message.error(description)
}

// Using this to add students until the step form for adding students is done.
class AddNoteForm extends Component {
  state = {
    teacherId: '',
    teacher: [],
    student: null,
    submitting: false,
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    // Clear form when iep id changes
    if (this.props.iep.id !== nextProps.iep.id) this.props.form.resetFields()
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

          db.collection(ColType.notes)
            .add({
              iepId: this.props.iep.id,
              teacherId: this.props.teacher.id,
              schoolId: this.props.teacher.schoolId,
              districtId: this.props.teacher.districtId,
              timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
              message: values.message,
              rating: values.rating,
            })
            .then(() => {
              console.log('Document updated')
              successMessage('Note added successfully.')
              this.props.form.resetFields()
              this.setState({
                submitting: false
              })
            })
            .catch((error) => {
              console.error('Error adding document: ', error)
              this.props.form.resetFields()
              this.setState({
                submitting: false
              })
              errorMessage("Something went wrong when adding the note.")
            })
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 20 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 30 },
        sm: { span: 17 },
      },
    }

    return (
      <Form onSubmit={this.handleSubmit} className="login-form text-align-left w-500">
        <FormItem {...formItemLayout} label="Message">
          {getFieldDecorator('message', {
            rules: [{ required: true, message: 'Message is required.' }],
          })(
            <TextArea 
              placeholder="A message of how today went." 
              autosize={{ minRows: 2 }} 
            />

          )}
        </FormItem>
        
        <FormItem {...formItemLayout} label="How was today?">
          {getFieldDecorator('rating', {
            rules: [{ required: true, message: 'Required field.' }],
          })(
            <Rate />
          )}
        </FormItem>

        <FormItem className="mb-0">
          <Button
            type="primary"
            size={'large'}
            htmlType="submit"
            className="login-form-button text-align-center float-right"
            disabled={this.state.submitting}
          >
            Add Note
          </Button>
        </FormItem>
      </Form>

    )
  }
}

export default Form.create()(AddNoteForm)
