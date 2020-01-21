import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/GlobalStyle.css'
import { db } from '../../firebase/Firebase'
import ColType from '../.././Types'
import IEPDrafts from './IEPDrafts'
import PersonAvatar from '../../customcomponents/PersonAvatar'
import NotAtThisStep from './NotAtThisStep'
import IEPFormSteps from './IEPFormSteps'
import {
  flattenDoc, getIDFromURL,
  getQueryStringParam, capitalizeFirstChar, getSpecialEducationRemovalStatement
} from '../.././Util'
import { Layout, Button, Icon, Select, Form, Row, Col, Tabs } from 'antd'
import CustomFooter from '../../login/CustomFooter'
const { Content } = Layout
const Option = Select.Option
const FormItem = Form.Item
const TabPane = Tabs.TabPane

class TeacherAddIEPGoalService extends Component {
  state = {
    teacher: null,
    student: null,
    iepDraft: null,
    students: [],
    serviceLocation: '',
    tabKey: '1',
    iepDraftMounted: false,
    stepNum: 5,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      if (this.props.form) this.props.form.resetFields()
      this.componentDidMount()
    }
  }

  componentDidMount() {
    var teacherId = getIDFromURL(window.location)
    var studentId = getQueryStringParam('student')
    var draftId = getQueryStringParam('draft')
    console.log(teacherId, studentId)

    this.setState({
      teacherId: teacherId,
      studentId: studentId,
      draftId: draftId,
      tabKey: '1',
    })

    if (draftId) {
      db.collection(ColType.iepDrafts)
      .doc(draftId)
      .get()
      .then((doc) => {
        var draft = flattenDoc(doc)
        this.setState({
          iepDraft: draft,
          iepSelections: draft.iepSelectionsNoCount,
          ieps: draft.ieps,
          iepDraftMounted: true,
        }, () => {
          var iepDraft = this.state.iepDraft
          var hasServiceProperty = false
          var serviceObj = {}
          iepDraft.ieps.map((iep, index) => {
            if (iep.hasOwnProperty('service')) {
              hasServiceProperty = true
              serviceObj[iep.id + '-servicedIn'] = iep.service.servicedIn
              serviceObj[iep.id + '-serviceDuration'] = iep.service.serviceDuration
              serviceObj[iep.id + '-days'] = iep.service.days
            }
            return false
          })

          if (hasServiceProperty) {
            if (this.state.iepDraft.step.stepNum > this.state.stepNum) 
            this.props.form.setFieldsValue(serviceObj)
          }
        })
      })
    }
    
    db.collection(ColType.teacher)
      .doc(teacherId)
      .get()
      .then((doc) => {
        var teacher = flattenDoc(doc)

        this.setState({
          teacher: teacher,
        })
      })

    db.collection(ColType.student)
      .doc(studentId)
      .get()
      .then((doc) => {
        var student = flattenDoc(doc)

        this.setState({
          student: student,
        })
      })

    db.collection(ColType.student)
      .where('teacherId', '==', teacherId)
      .get()
      .then((querySnapshot) => {
        var students = []
        var studentDict = {}
        querySnapshot.forEach((doc) => {
          //console.log(doc.id, ' => ', doc.data())
          var student = flattenDoc(doc)
          students.push(student)
          studentDict[student.id] = student
        })

        this.setState({
          students: students,
          studentDict: studentDict,
        })
      })

    db.collection(ColType.iepDrafts)
      .where('teacherId', '==', teacherId)
      .get()
      .then((querySnapshot) => {
        var iepDrafts = []

        querySnapshot.forEach((doc) => {
          iepDrafts.push(flattenDoc(doc))
        })

        this.setState({
          iepDrafts: iepDrafts,
        })
      })
  }

  // add a new event to the teacher's events
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // convert date to string to pass along, if the user 
        // navigates back here it will be converted to a moment
        //values.startTime = moment.utc(values.startTime._d).format("")
        //values.endTime = moment.utc(values.endTime._d).format("")
        var newState = this.state.iepDraft
        this.state.ieps.map((iep, index) => {
          var service = {}
          service.servicedIn = values[iep.id + '-servicedIn']
          service.serviceDuration = values[iep.id + '-serviceDuration']
          service.days = values[iep.id + '-days']
          iep.service = service

          // its always the same regardless of iep
          if (values[iep.id + '-servicedIn'] === 'Special Education') {
            newState.removalStatement = 
            getSpecialEducationRemovalStatement(this.state.student, 
              newState.category, newState.level)
          }

          return false
        })

        newState.ieps = this.state.ieps
        newState.step = {stepNum: this.state.stepNum + 1, path: 'accommodations'}

        db.collection(ColType.iepDrafts)
        .doc(this.state.draftId)
        .set(newState, { merge: true })
        .then(() => {
          this.props.history.push(
            {
              pathname: '/teacher/add-goal-accommodations/' +
                this.state.teacherId + '?student=' +
                this.state.studentId +
                '&draft=' + this.state.draftId,
              state: newState, // pass state to confirm page
            }
          )
        })
      }
    })
  }

  serviceLocationChange = (value, options) => {
    this.setState({
      serviceLocation: value,
    })
  }

  tabChange = (activeKey) => {
    this.setState({ tabKey: activeKey })
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
        <Layout className="content layout-header-mt">
          <Layout>
            <Content className="layout-content">
            {this.state.draftId && this.state.iepDraftMounted ?
                  <div>
                    <Tabs
                     activeKey={this.state.tabKey}
                     onChange={this.tabChange}
                     size={'large'}
                     tabPosition={'top'}
                     animated={false}
                    >
                      <TabPane tab={<div className="font-16 text-left">
                        <Icon type="file" className="mr-2 font-18" />
                        <span>Current Draft</span>
                      </div>
                      }
                        key="1"
                      >
                      {this.state.iepDraftMounted ?
                    this.state.iepDraft && this.state.iepDraft.step.stepNum < this.state.stepNum ?
                    <NotAtThisStep iepDraft={this.state.iepDraft} /> :
                        <Row gutter={32} className="mt-4">
                          <Col span={4} className="border-right">
    
                          <h2 className="mb-2">Steps</h2>
                  {this.state.teacher && this.state.student ?
                    <IEPFormSteps current={this.state.stepNum} />
                  : ''}
                  </Col>
                  <Col span={20}>
                        <div className="sub-menu-width m-lr-auto">
                    <div>
                      <h1 className="flex flex-v-center">
                        <span className="mr-2">Student: </span>
                        <PersonAvatar person={this.state.student} />
                      </h1>
                  <div>
                    <h2 className="mb-3">Service Time</h2>
                    <Form onSubmit={this.handleSubmit}>
                      {this.state.iepDraft.subject.map((subject, subjectIndex) => {
                        var ieps = this.state.ieps.filter(iep => iep.mainSubject === subject)
                        console.log(subject, ieps.length)
                        return <div className="mb-3" key={subject + '-' + subjectIndex}>
                          <h2 className="mb-2 pb-2 border-bottom">
                          {capitalizeFirstChar(subject)}</h2>
                          {ieps.map((iep, index) => {
                            return <Row gutter={32} className="mb-2 font-16" 
                                        key={'iep-row-' + subjectIndex + index}
                          >
                              <Col span={24} className="mb-1">
                              <h3 className="mb-2">IEP Goal</h3>
                                <div className="mb-1">
                                  {iep.iepParagraph}
                                </div>
                              </Col>
                              <Col span={8}>
                                <FormItem {...formItemLayout} 
                                label={'Service setting'} className="block-label">
                                  {getFieldDecorator(iep.id + '-servicedIn', {
                                    rules: [{ required: true, message: 'Select a service type.' }],
                                  })(
                                    <Select
                                      size={'large'}
                                      placeholder="Select service type"
                                      onChange={this.serviceLocationChange}>
                                      <Option value={'General Education'}>
                                        General Education
                                      </Option>
                                      <Option value={'Special Education'}>
                                        Special Education
                                      </Option>
                                    </Select>
                                  )}
                                </FormItem>
                              </Col>
                              <Col span={8}>
                                <FormItem {...formItemLayout} 
                                label={'Service time'} className="block-label">
                                  {getFieldDecorator(iep.id + '-serviceDuration', {
                                    rules: [{ required: true, 
                                      message: 'Select service time in minutes.' }],
                                  })(
                                    <Select
                                      size={'large'}
                                      style={{ width: '100%' }}
                                      placeholder="Select minutes"
                                    >
                                      <Option value={15} key="15 Minutes">15 Minutes</Option>
                                      <Option value={30} key="30 Minutes">30 Minutes</Option>
                                      <Option value={45} key="45 Minutes">45 Minutes</Option>
                                      <Option value={60} key="60 Minutes">60 Minutes</Option>
                                      <Option value={90} key="90 Minutes">90 Minutes</Option>
                                    </Select>
                                  )}
                                </FormItem>
                              </Col>
                              <Col span={8}>
                                <FormItem {...formItemLayout}
                                  label={'Service days per week'} className="block-label">
                                  {getFieldDecorator(iep.id + '-days', {
                                    rules: [{ required: true, 
                                      message: 'Select service days per week' }],
                                  })(
                                    <Select
                                      size={'large'}
                                      style={{ width: '100%' }}
                                      placeholder="Select days"
                                    >
                                      <Option value={1} key="1 day">1 day</Option>
                                      <Option value={2} key="2 days">2 days</Option>
                                      <Option value={3} key="3 days">3 days</Option>
                                      <Option value={4} key="4 days">4 days</Option>
                                      <Option value={5} key="5 days">5 days</Option>
                                    </Select>
                                  )}
                                </FormItem>
                              </Col>
                            </Row>
                          })}
                        </div>
                      })
                      }
                      {this.state.serviceLocation === 'Special Education' ?
                        ''
                        :
                        ''
                      }

                      <FormItem className="mb-0">
                        {this.state.teacherId && this.state.studentId && this.state.draftId ?
                          <Link 
                            to={'/teacher/add-goal-progress-monitoring/' +
                            this.state.teacherId + '?student=' +
                            this.state.studentId +
                            '&draft=' + this.state.draftId}
                            className="font-16"
                          >
                            <span className="left-hover-parent text-cyan">
                              <Icon type="arrow-left" className="mr-1 left-hover-child" />
                              <span>Previous Step</span>
                            </span>
                          </Link>
                        : ''}
                        <Button
                          type="primary"
                          size={'large'}
                          htmlType="submit"
                          className="login-form-button text-align-center float-right"
                        >
                          Continue
                      </Button>
                      </FormItem>
                    </Form>
                    </div>
                  </div>
                        </div>
                      </Col>
                    </Row>
                    : ''}
                   </TabPane>
                  <TabPane
                    tab={<div className="font-16 text-left">
                      <Icon type="folder" className="mr-2 font-18" />
                      <span>Saved Drafts</span>
                    </div>
                    }
                    key="2"
                  >
                   <div className="mt-4">
                      <h1 className="mb-1">IEP Drafts</h1>
                      <h3 className="mb-4">
                        IEP Drafts that you are working on will have their progress saved here.
                    </h3>
                      <IEPDrafts
                        draftId={this.state.draftId}
                        iepDrafts={this.state.iepDrafts}
                        studentDict={this.state.studentDict}
                      />
                    </div>
                  </TabPane>
                </Tabs>
                </div>
                : ''}
            </Content>
          </Layout>
        </Layout>
        <CustomFooter />
      </div>
    )
  }
}

export default Form.create()(TeacherAddIEPGoalService)
