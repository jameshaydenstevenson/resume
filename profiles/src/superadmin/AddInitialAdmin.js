import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import { secondaryFirebaseRef, db } from '../firebase/Firebase'
import { getAvatarColor, getNumShards, compress, getEmptySchoolOrDistrictSummary } from '.././Util'
import ColType from '.././Types'
import { Icon, Select, Form, Input, Button, message } from 'antd'
const FormItem = Form.Item
const Option = Select.Option

const successMessage = (description) => {
  message.success(description)
}

const errorMessage = (description) => {
  message.error(description)
}

// This page can only be accessed by us, it is how you add admins that then can add other users.
class AddInitialAdmin extends Component {
  state = {

  }

  componentDidMount() {

  }

  randomString = (length) => {
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    var i
    var result = ""
    if (window.crypto && window.crypto.getRandomValues) {
      var values = new Uint32Array(length)
      window.crypto.getRandomValues(values)
      for (i = 0; i < length; i++) {
        result += charset[values[i] % charset.length]
      }
      return result
    } else {
      alert("This browser does not have crypto and cannot create random passwords.")
      return ''
    }
  }

  addUser = (formValues) => {
    // Use the secondaryFirebaseRef here, so that the admin 
    // creating these accounts does not get signed out.
    // if only 'firebase' were used to create these, the admin 
    // user would be signed into the newly created account each time.
    var email = formValues.emailAddress
    // initial password, user will change it when they click on the verification email.
    var password = this.randomString(10)

    secondaryFirebaseRef.auth().createUserWithEmailAndPassword(email, password)
      .then(function (user) {
        console.log("User created successfuly", user)
        successMessage('User added successfully.')

        // firestore create district
        db.collection(ColType.district).add({
          district: formValues.district, // district name from form.
          state: formValues.state,
        })
        .then((docRef) => {
          console.log('District written with ID: ', docRef.id)
          successMessage('New district created successfully.')
          var districtId = docRef.id
          var batch = db.batch()

          for (var i = 0; i < getNumShards(); i++) {
            var shardIndex = i
            var newDoc = db.collection(ColType.districtSummary).doc()
            batch.set(newDoc, {
              districtId: docRef.id,
              shardIndex: shardIndex,
              summary: compress({
                summary: getEmptySchoolOrDistrictSummary(),
                schoolSummary: {
                  elementarySchool: {},
                  k8School: {},
                  middleSchool: {},
                  highSchool: {},
                }
              })
            })
          }

          batch.commit().then(() => {
            console.log('shards created successfully.')
            successMessage('Shards created successfully.')
            // create the first admin for this district, this admin in turn will
            // create other users for the district.
            db.collection(ColType.admin).add({
              firstName: formValues.firstName,
              lastName: formValues.lastName,
              districtId: districtId,
              emailAddress: email,
              avatarColor: getAvatarColor(),
            })
            .then((docRef) => {
              console.log('Document written with ID: ', docRef.id)
              var adminRefId = docRef.id
              successMessage('Admin added successfully with adminRefId of ' +
                adminRefId + '.')

              // set 'users/user.uid' to the newly created admin
              db.collection(ColType.users).doc(user.uid).set({
                firstName: formValues.firstName,
                lastName: formValues.lastName,
                districtId: districtId,
                emailAddress: email,
                avatarColor: getAvatarColor(),
                accessLevel: 'admins',
                refId: adminRefId,
                accountEnabled: true,
              })
                .then(() => {
                  successMessage('User succesfully tied to the newly created admin.')
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
                  }).catch((error) => {
                    errorMessage('Could not send verification email.')
                    console.log(error)
                  })
                })
                .catch(() => {
                  errorMessage('Error setting document, connecting user to the new admin')
                  console.error('Error setting document')
                })
            })
            .catch((error) => {
              console.error('Error adding document: ', error)
            })
          })
          .catch((error) => {
            console.log('batch write failed.')
          })
        })
        .catch((error) => {
          console.error('Error adding document: ', error)
          errorMessage('Could not create a new district.')
        })
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        console.log("Create new user error", errorCode, errorMessage)
        errorMessage('User could not be added: ' + errorCode + ' ' + errorMessage + '.')
        // ...
      })
  }

  // adding directly here, in the future it will send an email.
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        this.addUser(values)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 25 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 25 },
        sm: { span: 17 },
      },
    }

    const stateNames = ['Alabama', 'Alaska', 'Arizona', 'Arkansas',
      'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia',
      'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
      'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
      'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska',
      'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
      'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
      'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
      'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
      'West Virginia', 'Wisconsin', 'Wyoming']

    return (
      <div className="mainContainer">
        <div className="w-600 m-lr-auto p-4">
          <h4 className="mt-4 border-bottom pb-4 mb-4">
            Add an initial admin to a new district
          </h4>
          <h5 className="mb-4">
            This admin will in turn create all other users for the new district
          </h5>
          <div className="g-col p-4">
            <Form onSubmit={this.handleSubmit} className="login-form">
              <FormItem {...formItemLayout} label="First name">
                {getFieldDecorator('firstName', {
                  rules: [{ required: true, message: 'Please input your school name.' }],
                })(
                  <Input
                    size={"large"}
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="First name..." />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="Last name">
                {getFieldDecorator('lastName', {
                  rules: [{ required: true, message: 'Please input your school name.' }],
                })(
                  <Input
                    size={"large"}
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Last name..." />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="District">
                {getFieldDecorator('district', {
                  rules: [{ required: true, message: 'Please input your district.' }],
                })(
                  <Input size={"large"} placeholder="District..." />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="State">
                {getFieldDecorator('state', {
                  rules: [{ required: true, message: 'Please input your state.' }],
                })(
                  <Select showSearch size={"large"} placeholder="Select a state">
                    {stateNames.map((stateName, index) => {
                      return <Option value={stateName} key={stateName}>{stateName}</Option>
                    })
                    }
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="Email address">
                {getFieldDecorator('emailAddress', {
                  rules: [{ required: true, message: 'Please input an email address.' }],
                })(
                  <Input
                    size={"large"}
                    prefix={<Icon type="home" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Email address..." />
                )}
              </FormItem>
              <FormItem className="mb-0">
                <Button
                  size={"large"}
                  type="primary"
                  htmlType="submit"
                  className="login-form-button text-align-center w-100"
                >
                  Add administrator and send verification email
                </Button>
              </FormItem>
            </Form>

          </div>
        </div>
      </div>
    )
  }
}

export default Form.create()(AddInitialAdmin)