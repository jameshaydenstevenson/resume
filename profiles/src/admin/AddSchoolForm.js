import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import { db } from '../firebase/Firebase'
import { getNumShards, compress, getEmptySchoolOrDistrictSummary } from '.././Util'
import ColType from '.././Types'
import { Icon, message, Form, Button, Input, Radio } from 'antd'
const FormItem = Form.Item
const RadioGroup = Radio.Group

const successMessage = (description) => {
  message.success(description)
}

const errorMessage = (description) => {
  message.error(description)
}

class AddSchoolForm extends Component {
  state = {
    admin: this.props.admin,
    submitting: false,
  }

  componentDidMount() {
    
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
          db.collection(ColType.school).add({
            schoolName: values.schoolName,
            schoolType: values.schoolType,
            districtId: this.state.admin.districtId,
          })
          .then((docRef) => {
            console.log('School written with ID: ', docRef.id)

            var batch = db.batch()

            for (var i = 0; i < getNumShards(); i++) {
              var shardIndex = i
              var newDoc = db.collection(ColType.schoolSummary).doc()
              batch.set(newDoc, {
                districtId: this.state.admin.districtId,
                schoolId: docRef.id,
                shardIndex: shardIndex,
                // school shard does not need schoolSummary field
                summary: compress({
                  summary: getEmptySchoolOrDistrictSummary(),
                })
              })
            }

            batch.commit().then(() => {
              successMessage("School has been created successfully.")
              this.setState({
                submitting: false,
              })
            })
            .catch((error) => {
              errorMessage("School could not be added. Please try again.")
              this.setState({
                submitting: false,
              })
            })
          })
          .catch((error) => {
            console.error('Error adding document: ', error)
            errorMessage("School could not be added. Please try again.")
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
        xs: { span: 25 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 25 },
        sm: { span: 16 },
      },
    }

    return (
      <div>
        {this.state.admin ?
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem {...formItemLayout} label="School name">
              {getFieldDecorator('schoolName', {
                rules: [{ required: true, message: 'Please input the school name.' }],
              })(
                <Input size={"large"} placeholder="School name..." />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label={<span>School type</span>}>
              {getFieldDecorator('schoolType', {
                rules: [{ required: true, message: 'Please input the school type.' }],
              })(
                <RadioGroup
                  size={'large'}
                >
                  <Radio value={'elementarySchool'} className="block mb-05">
                    Elementary School
                  </Radio>
                  <Radio value={'k8School'} className="block mb-05">
                    K-8 School
                  </Radio>
                  <Radio value={'middleSchool'} className="block mb-05">
                    Middle School
                  </Radio>
                  <Radio value={'highSchool'} className="block mb-05">
                    High School
                  </Radio>
                </RadioGroup>
              )}
            </FormItem>
            
            <FormItem className="mb-0">
              <Button disabled={this.state.submitting} 
                type="primary" 
                size={'large'}
                htmlType="submit" 
                className="login-form-button text-align-center w-100"
              >
                {this.state.submitting ? 
                <span><Icon type="loading" className="mr-1"/>Adding school...</span> : 
                <span><Icon type="plus"/> Add school</span>}
              </Button>
            </FormItem>
        </Form>
      : ''}
    </div>
    )
  }
}

export default Form.create()(AddSchoolForm)
