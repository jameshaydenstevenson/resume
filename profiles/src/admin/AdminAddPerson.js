import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import { firebase, secondaryFirebaseRef, db } from '../firebase/Firebase'
import { flattenDoc, getIDFromURL, getAvatarColor } from '.././Util'
import ColType from '.././Types'
import AddSchoolForm from './AddSchoolForm'
import CustomFooter from '../login/CustomFooter'
import { Icon, Select, Form, Input, Button, message, Popover } from 'antd'
import { Layout } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
const { Content } = Layout

const successMessage = (description) => {
    message.success(description)
}

const errorMessage = (description) => {
    message.error(description)
}

// This page can only be accessed by us, it is how you add admins that then can add teachers.
class AdminAddPerson extends Component {
  state = {
    user: {},
    admin: {},
    district: {},
    teachers: [],
    schools: [],
    snapshotListeners: [],
    selectedJob: '',
    submitting: false,
  }

  componentDidMount() {
    document.title = 'Add Personnel - dot it'

    if(!(window.crypto && window.crypto.getRandomValues)) {
      alert("Your browser does not support a necessary feature. " +
      "Are you using Opera? Please change to any other browser and start again.")
    }

    var adminId = getIDFromURL(window.location)

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
          // User is signed in.
          console.log("signed in user", user)
          this.setState({
              user: user,
          })
      } else {
          console.log("signed out user", user)
          // User is signed out.
          this.setState({
              user: user,
          })
      }
    })

    db.collection(ColType.admin)
      .doc(adminId)
      .get()
      .then((doc) => {
        var admin = flattenDoc(doc)
        this.setState({
          admin: admin,
        }, () => {
          db.collection(ColType.district)
            .doc(admin.districtId)
            .get()
            .then((doc) => {
              var district = flattenDoc(doc)
              this.setState({
                district: district,
              })
            })
          
          var schoolListener = db.collection(ColType.school)
            .where('districtId', '==', admin.districtId)
            .onSnapshot((querySnapshot) => {
              var schools = []
              querySnapshot.forEach((doc) => {
                console.log(doc.id, ' => ', doc.data())
                schools.push(flattenDoc(doc))
              })

              this.setState({
                schools: schools,
              })
            })
          
          this.setState({
            snapshotListeners: [schoolListener],
          })
        })
      })
  }

  componentWillUnmount() {
    // unsubscribe listeners
    this.state.snapshotListeners.map((unsubscribe, index) => {
      return unsubscribe()
    })
  }

  randomString = (length) => {
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    var i
    var result = ""
    if(window.crypto && window.crypto.getRandomValues)
    {
        var values = new Uint32Array(length)
        window.crypto.getRandomValues(values)
        for(i=0; i<length; i++)
        {
            result += charset[values[i] % charset.length]
        }
        return result
    } else {
        alert("This browser does not have crypto and cannot create random passwords.")
        return ''
    }
  }

  addUser = (formValues, personInformationObj) => {
    // Use the secondaryFirebaseRef here, so that the admin creating 
    // these accounts does not get signed out.
    // if only 'firebase' were used to create these, 
    // the admin user would be signed into the newly created account
    // each time.
    var email = formValues.emailAddress
    // initial password, user will change it when they click on the verification email.
    var password = this.randomString(10)

    secondaryFirebaseRef.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
            console.log("User created successfuly", user)
            successMessage('User account added successfully.')

            // the admin will have to set all of the persons's data, its easier that way.
            // all the person has to do is click on the email and set a new password.
            // formValues.job is the route 'admins' | 'schoolAdmins' | 'teachers'
            db.collection(formValues.job).add(personInformationObj)
            // after the new person is added, we need to tie their ref data to the new user.
            // either 'teachers' | 'schoolAdmins' | 'admins' + '/refId'
            .then((docRef) => {
                console.log('Document written with ID: ', docRef.id)
                var refId = docRef.id
                var accessLevel = formValues.job
                successMessage(accessLevel + ' added successfully with path id of ' + refId + '.')

                var userObj = personInformationObj
                userObj.accessLevel = accessLevel
                userObj.refId = refId
                userObj.accountEnabled = true

                // set 'users/user.uid' to the newly created teacher
                db.collection(ColType.users).doc(user.uid).set(userObj)
                .then(() => {
                    successMessage('User succesfully tied to the newly created person.')
                    // continueUrl is verify-email with email and password 
                    // as query string parameters.
                    var actionCodeSettings = {
                      url: 'https://dotit.app/user/verify-email?email=' + 
                      email + '&token=' + password,
                    }
                    // Send email verification
                    user.sendEmailVerification(actionCodeSettings).then(() => {
                      // Email sent.
                      successMessage('Verification email sent.')
                      this.setState({
                        submitting: false,
                      })
                    }).catch((error) => {
                      errorMessage('Could not send verification email.')
                      console.log(error)
                      this.setState({
                        submitting: false,
                      })
                    })
                })
                .catch((error) => {
                    console.error('Error adding document: ', error)
                    errorMessage('Error setting document, connecting user to the new teacher.')
                    console.error('Error setting document')
                    this.setState({
                      submitting: false,
                    })
                })
            })
            .catch((error) => {
                console.error('Error adding document: ', error)
                errorMessage("Could not create the teacher.")
                this.setState({
                  submitting: false,
                })
            })
        })
        .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code
            var errorMessageString = error.message
            console.log("Create new user error", errorCode, errorMessageString)
            errorMessage('User could not be added: ' + errorMessageString)
            this.setState({
              submitting: false,
            })
        })
  }

  // adding directly here, in the future it will send an email.
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        var personInformationObj = {}
        if (values.job === "teachers" || values.job === "schoolAdmins") {
          // teachers and schoolAdmins are tied to a school, thus they have a schoolId
          personInformationObj = {
              firstName: values.firstName,
              lastName: values.lastName,
              // the teacher's districtId is the same as the admins.
              districtId: this.state.admin.districtId,
              schoolId: values.school, // school's value is the schoolId
              emailAddress: values.emailAddress,
              avatarColor: getAvatarColor(),
          }
        } 
        else if (values.job === "admins") {
          // admins dont have a schoolId.
          personInformationObj = {
            firstName: values.firstName,
            lastName: values.lastName,
            // the teacher's districtId is the same as the admins.
            districtId: this.state.admin.districtId,
            emailAddress: values.emailAddress,
            avatarColor: getAvatarColor(),
          }
        }
        
        this.setState({
          submitting: true,
        }, () => {
          this.addUser(values, personInformationObj)
        })
      }
    })
  }

  jobSelected = (value) => {
    console.log(value)
    this.setState({
      selectedJob: value,
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
      <div>
        <Layout className="content layout-header-mt">
          <Layout>
            <Content className="layout-content">
              <div className="w-500 m-lr-auto">
                  <h1 className="mb-2 pb-3">Add New Personnel</h1>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                      <FormItem {...formItemLayout} label="Job">
                        {getFieldDecorator('job', {
                          rules: [{ required: true, message: 'Please input a job.'}],
                        })(
                          <Select size={"large"} 
                            placeholder="Select a job" 
                            onChange={this.jobSelected}
                          >
                            <Option value="teachers">Teacher</Option>
                            <Option value="schoolAdmins">School Administrator</Option>
                            <Option value="admins">District-Level Administrator</Option>
                          </Select>
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label="First name">
                        {getFieldDecorator('firstName', {
                          rules: [{ required: true, message: 'Please input your school name.' }],
                        })(
                          <Input size={"large"} 
                          prefix={<Icon type="user" 
                          style={{ color: 'rgba(0,0,0,.25)' }} />} 
                          placeholder="First name..." />
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label="Last name">
                        {getFieldDecorator('lastName', {
                          rules: [{ required: true, message: 'Please input your school name.' }],
                        })(
                          <Input size={"large"} 
                          prefix={<Icon type="user" 
                          style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Last name..." />
                        )}
                      </FormItem>
                      {this.state.selectedJob !== 'admins' ?
                      <FormItem {...formItemLayout} label="School"  extra={
                        <Popover content={<AddSchoolForm admin={this.state.admin} />} 
                        title="Add a school" trigger="click" placement="rightBottom">
                          <Button 
                            className="text-primary transparent-btn ml-minus40"
                          >
                            Do you need to add a school? Click here.
                          </Button>
                        </Popover>}>
                        {getFieldDecorator('school', {
                          rules: [{ required: true, message: 'Please input a school.'}],
                        })(
                          <Select size={"large"} placeholder="Select a School">
                            {this.state.schools.map((school, index) => {
                              return <Option 
                                        value={school.id} 
                                        key={school.id}
                                      >
                                        {school.schoolName}
                                      </Option>
                            })
                            }
                          </Select>
                        )}
                      </FormItem> : ''}
                      <FormItem {...formItemLayout} label="Email address">
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
                            <Icon type="plus" 
                            className="mr-8"/>Add person and send verification email
                          </span> :
                          <span><Icon type="loading" className="mr-8"/>Adding person...</span>
                        }
                        </Button>
                      </FormItem>
                  </Form>
                </div>
              </Content>
            </Layout>
        </Layout>
        <CustomFooter />
    </div>
    )
  }
}

export default Form.create()(AdminAddPerson)