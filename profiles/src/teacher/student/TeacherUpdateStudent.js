import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'
import { db } from '../../firebase/Firebase'
import ColType from '../.././Types'
import CustomFooter from '../../login/CustomFooter'
import { flattenDoc, getIDFromURL, getQueryStringParam } from '../.././Util'
import { Layout, Button, Form, Input, Select, message } from 'antd'
const { Content } = Layout
const FormItem = Form.Item
const Option = Select.Option

const successMessage = (description) => {
  message.success(description)
}

const errorMessage = (description) => {
  message.error(description)
}

// Using this to add students until the step form for adding students is done.
class UpdateStudent extends Component {
  state = {
    teacherId: '',
    teacher: [],
    student: null,
    submitting: false,
  }

  componentDidMount() {
    var teacherId = getIDFromURL(window.location)
    var studentId = getQueryStringParam('student')
    console.log(teacherId, studentId)
    
    this.setState({
      teacherId: teacherId,
      studentId: studentId,
    })

    db.collection(ColType.teacher)
      .doc(teacherId)
      .get()
      .then((doc) => {
        var teacher = flattenDoc(doc)
        this.setState({
          teacher: teacher
        })
      })

    db.collection(ColType.student)
      .doc(studentId)
      .get()
      .then((doc) => {
        var student = flattenDoc(doc)
        this.props.form.setFieldsValue(student)

        this.setState({
          student: student,
        })
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

          db.collection(ColType.student)
          .doc(this.state.student.id)
          .update(values)
          .then(() => {
            console.log('Document updated')
            successMessage('Student updated successfully.')
            this.props.history.push(
              {
                pathname: '/teacher/student/' + 
                          this.state.teacherId + '?student=' +
                          this.state.studentId
              }
            )
          })
          .catch((error) => {
            console.error('Error adding document: ', error)
            this.setState({
              submitting: false
            })
            errorMessage("Something went wrong, please try again or contact your administrator.")
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

    const formItemBlockLayout = {
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
      <Layout className="content layout-header-mt">
          <Layout>
          <Content className="layout-content">
            <div className={"w-500 m-lr-auto" + 
              (!this.state.student ? ' invisible' : '')}
            >
              <h1 className="mb-1 text-center">Update Student</h1>
              <div className="p-4 pl-0 pr-0">
              <Form onSubmit={this.handleSubmit} className="login-form text-align-left">
                  <FormItem {...formItemLayout} label="First Name">
                      {getFieldDecorator('firstName', {
                          rules: [{ required: true, message: 'First name is required.' }],
                        })(
                          <Input size={'large'} placeholder="First Name..."/>
                      )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="Middle Name">
                      {getFieldDecorator('middleName', {
                          rules: [{ required: true, message: 'Middle name is required.' }],
                        })(
                          <Input size={'large'} placeholder="Middle Name..."/>
                      )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="Last Name">
                      {getFieldDecorator('lastName', {
                          rules: [{ required: true, message: 'Last name is required.' }],
                        })(
                          <Input size={'large'} placeholder="Last Name..."/>
                      )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="Grade">
                      {getFieldDecorator('grade', {
                          rules: [{ required: true, message: 'Grade is required.' }],
                        })(
                        <Select size={'large'} placeholder="Grade...">
                          <Option value="K">K</Option>
                          <Option value="1">1</Option>
                          <Option value="2">2</Option>
                          <Option value="3">3</Option>
                          <Option value="4">4</Option>
                          <Option value="5">5</Option>
                          <Option value="6">6</Option>
                          <Option value="7">7</Option>
                          <Option value="8">8</Option>
                          <Option value="9">9</Option>
                          <Option value="10">10</Option>
                          <Option value="11">11</Option>
                          <Option value="12">12</Option>
                        </Select>
                      )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="Gender">
                      {getFieldDecorator('gender', {
                          rules: [{ required: true, message: 'Gender is required.' }],
                        })(
                          <Select size={'large'} placeholder="Gender...">
                            <Option value="Male">Male</Option>
                            <Option value="Female">Female</Option>
                          </Select>
                      )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="Race">
                      {getFieldDecorator('race', {
                          rules: [{ required: true, message: 'Race is required.' }],
                        })(
                          <Select size={'large'} placeholder="Race...">
                            <Option value="Native American or Alaska Native">
                            Native American or Alaska Native
                            </Option>
                            <Option value="Asian">Asian</Option>
                            <Option value="Black or African American">
                              Black or African American
                            </Option>
                            <Option value="Native Hawaiian or Other Pacific Islander">
                              Native Hawaiian or Other Pacific Islander
                            </Option>
                            <Option value="White">White</Option>
                          </Select>
                      )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="Ethnicity">
                      {getFieldDecorator('ethnicity', {
                          rules: [{ required: true, message: 'Ethnicity is required.' }],
                        })(
                          <Select size={'large'} placeholder="Ethnicity...">
                            <Option value="Hispanic or Latino">Hispanic or Latino</Option>
                            <Option value="Not Hispanic or Latino">Not Hispanic or Latino</Option>
                          </Select>
                      )}
                  </FormItem>
                  
                  <div className="pl-3">
                   <FormItem {...formItemBlockLayout} label={"The student qualifies for special " +
                   "education services under the category of"} className="block-label">
                      {getFieldDecorator('disability', {
                          rules: [{ required: true, message: 'Required.' }],
                        })(
                          <Select size={'large'} placeholder="Select...">
                            <Option value="Autism">Autism</Option>
                            <Option value="Deaf-Blindness">Deaf-Blindness</Option>
                            <Option value="Deafness">Deafness</Option>
                            <Option value="Developmental Delay">Developmental Delay</Option>
                            <Option value="Emotional Disability">Emotional Disability</Option>
                            <Option value="Hearing Impairment">Hearing Impairment</Option>
                            <Option value="Intellectual Disability">Intellectual Disability</Option>
                            <Option value="Multiple Disabilities">Multiple Disabilities</Option>
                            <Option value="Orthopedic Impairment">Orthopedic Impairment</Option>
                            <Option value="Other Health Impairment">Other Health Impairment</Option>
                            <Option value="Specific Learning Disability">
                            Specific Learning Disability</Option>
                            <Option value="Speech or Language Impairment">
                            Speech or Language Impairment</Option>
                            <Option value="Traumatic Brain Injury">Traumatic Brain Injury</Option>
                            <Option value="Visual Impairment including Blindness">
                            Visual Impairment including Blindness</Option>
                          </Select>
                      )}
                  </FormItem>
                  </div>
                  
                  <FormItem className="mb-0">
                    <Button 
                      type="primary" 
                      size={'large'} 
                      htmlType="submit" 
                      className="login-form-button text-align-center float-right"
                    >
                      Update Student
                    </Button>
                  </FormItem>
              </Form>
            </div>
            </div>
            </Content>
            </Layout>
        </Layout>
        <CustomFooter />
    </div>
    )
  }
}

export default Form.create()(UpdateStudent)
