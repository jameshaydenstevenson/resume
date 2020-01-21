import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/GlobalStyle.css'
import { db } from '../../firebase/Firebase'
import ColType from '../.././Types'
import IEPDrafts from './IEPDrafts'
import NotAtThisStep from './NotAtThisStep'
import IEPFormSteps from './IEPFormSteps'
import {
  flattenDoc, getIDFromURL, getQueryStringParam,
} from '../.././Util'
import PersonAvatar from '../../customcomponents/PersonAvatar'
import { Layout, Button, Icon, Select, Form, DatePicker, Tabs, Row, Col } from 'antd'
import CustomFooter from '../../login/CustomFooter'
const { Content } = Layout
const Option = Select.Option
const FormItem = Form.Item
const TabPane = Tabs.TabPane
//const { TextArea } = Input
var moment = require('moment')

class TeacherAddIEPGoalInformation extends Component {
  state = {
    teacher: null,
    student: null,
    iepDraft: null,
    students: [],
    studentDict: {},
    iepDrafts: [],
    presentLevels: {},
    tabKey: '1',
    stepNum: 1,
    iepDraftMounted: false,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      if (this.props.form) this.props.form.resetFields()
      this.componentDidMount()
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    var teacherId = getIDFromURL(window.location)
    var studentId = getQueryStringParam('student')
    var draftId = getQueryStringParam('draft')
    console.log(teacherId, studentId, draftId)

    this.setState({
      teacherId: teacherId,
      studentId: studentId,
      draftId: draftId,
      tabKey: '1',
    })

    if (draftId) {
      // this step needs student for the render before the iepDraft
      // is pulled.
      db.collection(ColType.student)
      .doc(studentId)
      .get()
      .then((doc) => {
        var student = flattenDoc(doc)
        this.setState({
          student: student,
        }, () => {
        db.collection(ColType.iepDrafts)
          .doc(draftId)
          .get()
          .then((doc) => {
            console.log(doc.id, '=>', doc.data())
            this.setState({
              iepDraft: flattenDoc(doc),
              iepDraftMounted: true,
            }, () => {
              var iepDraft = this.state.iepDraft
              if (iepDraft.presentLevel &&
                !(Object.keys(iepDraft.presentLevel).length === 0 &&
                  iepDraft.presentLevel.constructor === Object)) {
                // date picker needs the date to be a moment for the form
                // convert it if its a string (its passed to the next form as a string)
                if (iepDraft.presentLevel.hasOwnProperty('elaNormDate') && 
                !(moment.isMoment(iepDraft.presentLevel.elaNormDate))) {
                  iepDraft.presentLevel.elaNormDate =
                    moment(iepDraft.presentLevel.elaNormDate)
                }
                if (iepDraft.presentLevel.hasOwnProperty('mathNormDate') && 
                  !(moment.isMoment(iepDraft.presentLevel.mathNormDate))) {
                  iepDraft.presentLevel.mathNormDate =
                    moment(iepDraft.presentLevel.mathNormDate)
                }
                console.log("passed state", iepDraft.presentLevel)
                if (this.state.iepDraft.step.stepNum > this.state.stepNum) {
                  this.props.form.setFieldsValue(iepDraft.presentLevel)
                }
              }
            })
          })
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
        if (values.hasOwnProperty('elaNormDate')) {
          values.elaNormDate = moment.utc(values.elaNormDate._d).format("YYYY-MM-DD")
        }
        if (values.hasOwnProperty('mathNormDate')) {
          values.mathNormDate = moment.utc(values.mathNormDate._d).format("YYYY-MM-DD")
        }
        console.log(values)

        var newState = this.state.iepDraft
        newState.presentLevel = values
        newState.presentLevel.subject = newState.subject
        newState.step = {stepNum: this.state.stepNum + 1, path: 'select'}

        db.collection(ColType.iepDrafts)
          .doc(this.state.draftId)
          .set(newState, { merge: true })
          .then(() => {
            this.props.history.push(
              {
                pathname: '/teacher/add-goal-select/' +
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

  tabChange = (activeKey) => {
    this.setState({ tabKey: activeKey })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    console.log(this.state.iepDraftMounted, this.state.student)

    const formItemLayout = {
      labelCol: {
        xs: { span: 20 },
        sm: { span: 11 },
      },
      wrapperCol: {
        xs: { span: 30 },
        sm: { span: 13 },
      },
    }

    return (
      <div>
        <Layout className="content layout-header-mt">
          <Layout>
            <Content className="layout-content">
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
                    {this.state.iepDraftMounted && this.state.student ?
                    this.state.iepDraft && this.state.iepDraft.step.stepNum < this.state.stepNum ?
                    <NotAtThisStep iepDraft={this.state.iepDraft} /> :
                    <Row gutter={32} className="mt-4">
                      <Col span={4} className="border-right">

                        <h2 className="mb-2">Steps</h2>
                        {this.state.teacher && this.state.student && this.state.draftId ?
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
                          </div>
                          <div>
                            <h2 className="mb-3">
                              PLAAFP
                             </h2>
                            <Form onSubmit={this.handleSubmit} 
                            className="login-form text-align-left">
                            {((this.state.iepDraft.subject.length === 1 && 
                            this.state.iepDraft.subject[0] !== 'Math') ||
                            (this.state.iepDraft.subject.length > 1)) ?
                            <div>
                              <h2 className="mt-4 mb-2 pb-2 border-bottom">ELA</h2>
                              {this.state.student && 
                              this.state.student.grade >= 4 && this.state.student.grade <= 8 ?
                              <div>
                              <h4 className="mb-2">State assessment</h4>
                            
                              <FormItem {...formItemLayout} label={"Student's score"}
                                className="pl-1">
                                {getFieldDecorator('elaStateScore', {
                                  rules: [{ required: true, message: 'Select a score.' }],
                                })(
                                  <Select
                                    size={'large'}
                                    placeholder="Select score...">
                                    <Option value={'1'}>
                                      1
                                    </Option>
                                    <Option value={'2'}>
                                      2
                                    </Option>
                                    <Option value={'3'}>
                                      3
                                    </Option>
                                    <Option value={'4'}>
                                      4
                                    </Option>
                                  </Select>
                                )}
                              </FormItem>

                              <FormItem {...formItemLayout} label={"Student met standard"}
                                className="pl-1">
                                {getFieldDecorator('elaStateMet', {
                                  rules: [{
                                    required: true,
                                    message: 'Select whether the student has met the standard'
                                  }],
                                })(
                                  <Select
                                    size={'large'}
                                    placeholder="Select...">
                                    <Option value={'Met'}>
                                      Met
                        </Option>
                                    <Option value={'Not met'}>
                                      Not met
                        </Option>
                                  </Select>
                                )}
                              </FormItem>
                              </div>
                            : ''}

                              <h4 className="mb-2">Norm referenced assessment</h4>
                              <FormItem {...formItemLayout} label={"Norm referenced assessment"}
                                className="pl-1">
                                {getFieldDecorator('elaNormAssessment', {
                                  rules: [{
                                    required: true,
                                    message: 'Select norm referenced assessment.'
                                  }],
                                })(
                                  <Select
                                    size={'large'}
                                    placeholder="Select norm referenced assessment...">
                                    <Option value={'MAP'}>
                                      MAP
                                    </Option>
                                    <Option value={'iReady'}>
                                      iReady
                                    </Option>
                                    <Option value={'AimsWEB'}>
                                      AimsWEB
                                    </Option>
                                    <Option value={'DIBELS'}>
                                      DIBELS
                                    </Option>
                                    <Option value={'MClass'}>
                                      MClass
                                    </Option>
                                    <Option value={'Other'}>
                                      Other
                                    </Option>
                                  </Select>
                                )}
                              </FormItem>

                              <FormItem {...formItemLayout} label={"Administered on"}
                                className="pl-1">
                                {getFieldDecorator('elaNormDate', {
                                  rules: [{
                                    required: true,
                                    message: 'Select norm referenced assessment.'
                                  }],
                                })(
                                  <DatePicker />
                                )}
                              </FormItem>

                              <FormItem {...formItemLayout} label={"Score relative to peers"}
                                className="pl-1">
                                {getFieldDecorator('elaNormLevel', {
                                  rules: [{ required: true, message: 'Select a score.' }],
                                })(
                                  <Select
                                    size={'large'}
                                    placeholder="Select score...">
                                    <Option value={'Low'}>
                                      Low
                                    </Option>
                                    <Option value={'Low Average'}>
                                      Low Average
                                    </Option>
                                    <Option value={'Average'}>
                                      Average
                                    </Option>
                                    <Option value={'High Average'}>
                                      High Average
                                    </Option>
                                    <Option value={'High'}>
                                      High
                                    </Option>
                                  </Select>
                                )}
                              </FormItem>

                              <h4 className="mb-2">Student performance</h4>
                              <FormItem {...formItemLayout} 
                              label={"Student's grade level for reading"}
                                className="pl-1">
                                {getFieldDecorator('elaGradeLevel', {
                                  rules: [{
                                    required: true,
                                    message: "Select student's grade level for this task."
                                  }],
                                })(
                                  <Select size={'large'} placeholder="Select reading level...">
                                    <Option value="preK">preK</Option>
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
                              </div>
                              : ''}

                              {/**Math*/}
                              {this.state.iepDraft.subject.indexOf('Math') > -1 ?
                              <div>
                              <h2 className="mt-4 mb-2 pb-2 border-bottom">Math</h2>
                              {this.state.student && 
                              this.state.student.grade >= 4 && this.state.student.grade <= 8 ?
                              <div>
                              <h4 className="mb-2">State assessment</h4>


                              <FormItem {...formItemLayout} label={"Student's score"}
                                className="pl-1">
                                {getFieldDecorator('mathStateScore', {
                                  rules: [{ required: true, message: 'Select a score.' }],
                                })(
                                  <Select
                                    size={'large'}
                                    placeholder="Select score...">
                                    <Option value={'1'}>
                                      1
                        </Option>
                                    <Option value={'2'}>
                                      2
                        </Option>
                                    <Option value={'3'}>
                                      3
                        </Option>
                                    <Option value={'4'}>
                                      4
                        </Option>
                                  </Select>
                                )}
                              </FormItem>

                              <FormItem {...formItemLayout} label={"Student met standard"}
                                className="pl-1">
                                {getFieldDecorator('mathStateMet', {
                                  rules: [{
                                    required: true,
                                    message: 'Select whether the student has met the standard'
                                  }],
                                })(
                                  <Select
                                    size={'large'}
                                    placeholder="Select...">
                                    <Option value={'Met'}>
                                      Met
                        </Option>
                                    <Option value={'Not met'}>
                                      Not met
                        </Option>
                                  </Select>
                                )}
                              </FormItem>
                              </div>
                              : ''}
                              
                              <h4 className="mb-2">Norm referenced assessment</h4>
                              <FormItem {...formItemLayout} label={"Norm referenced assessment"}
                                className="pl-1">
                                {getFieldDecorator('mathNormAssessment', {
                                  rules: [{
                                    required: true,
                                    message: 'Select norm referenced assessment.'
                                  }],
                                })(
                                  <Select
                                    size={'large'}
                                    placeholder="Select norm referenced assessment...">
                                    <Option value={'MAP'}>
                                      MAP
                                    </Option>
                                    <Option value={'iReady'}>
                                      iReady
                                    </Option>
                                    <Option value={'AimsWEB'}>
                                      AimsWEB
                                    </Option>
                                    <Option value={'DIBELS'}>
                                      DIBELS
                                    </Option>
                                    <Option value={'MClass'}>
                                      MClass
                                    </Option>
                                    <Option value={'Other'}>
                                      Other
                                    </Option>
                                  </Select>
                                )}
                              </FormItem>

                              <FormItem {...formItemLayout} label={"Administered on"}
                                className="pl-1">
                                {getFieldDecorator('mathNormDate', {
                                  rules: [{
                                    required: true,
                                    message: 'Select norm referenced assessment.'
                                  }],
                                })(
                                  <DatePicker />
                                )}
                              </FormItem>

                              <FormItem {...formItemLayout} label={"Score relative to peers"}
                                className="pl-1">
                                {getFieldDecorator('mathNormLevel', {
                                  rules: [{ required: true, message: 'Select a score.' }],
                                })(
                                  <Select
                                    size={'large'}
                                    placeholder="Select score...">
                                    <Option value={'Low'}>
                                      Low
                                    </Option>
                                    <Option value={'Low Average'}>
                                      Low Average
                                    </Option>
                                    <Option value={'Average'}>
                                      Average
                                    </Option>
                                    <Option value={'High Average'}>
                                      High Average
                                    </Option>
                                    <Option value={'High'}>
                                      High
                                    </Option>
                                  </Select>
                                )}
                              </FormItem>

                              <h4 className="mb-2">Student performance</h4>
                              <FormItem {...formItemLayout} 
                              label={"Student's grade level for math"}
                                className="pl-1">
                                {getFieldDecorator('mathGradeLevel', {
                                  rules: [{
                                    required: true,
                                    message: "Select student's grade level for this task."
                                  }],
                                })(
                                  <Select size={'large'} placeholder="Select math grade level...">
                                    <Option value="preK">preK</Option>
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
                              </div>
                              : ''}
                              
                              {/**
                              <h4 className="mb-2 pt-3 border-top">Student strengths (Optional)</h4>
                              <FormItem {...formItemLayout} label={"Student strengths (Optional)"}
                                className="pl-1">
                                {getFieldDecorator('presentLevelStrengths', {
                                  rules: [{
                                    required: true,
                                    message: 'Not required.'
                                  }],
                                })(
                                  <TextArea 
                                  placeholder="Student strengths"
                                  autosize />
                                )}
                              </FormItem>*/}

                              <FormItem className="mb-0 mt-4 pt-4">
                                <Link 
                                  to={'/teacher/add-goal-student/' +
                                  this.state.teacherId +
                                  '?draft=' + this.state.draftId}
                                  className="font-16"
                                >
                                  <span className="left-hover-parent text-cyan">
                                    <Icon type="arrow-left" className="mr-1 left-hover-child" />
                                    <span>Previous Step</span>
                                  </span>
                                </Link>
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

            </Content>
          </Layout>
        </Layout>
        <CustomFooter />
      </div>
    )
  }
}

export default Form.create()(TeacherAddIEPGoalInformation)