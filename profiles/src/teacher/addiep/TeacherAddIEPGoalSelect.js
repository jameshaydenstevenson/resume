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
  getQueryStringParam, capitalizeFirstChar
} from '../.././Util'
import { Layout, Icon, Form, Button, Checkbox, Row, Col, Tabs } from 'antd'
import CustomFooter from '../../login/CustomFooter'
const { Content } = Layout
const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const TabPane = Tabs.TabPane
const Promise = require("bluebird")

class TeacherAddIEPGoalSelect extends Component {
  state = {
    teacher: null,
    student: null,
    iepDict: {},
    iepSubjectDict: {},
    iepSelections: {},
    iepSelectionsNoCount: {},
    iepDraft: null,
    students: [],
    tabKey: '1',
    stepNum: 2,
    iepDraftMounted: false,
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
          this.setState({
            iepDraft: flattenDoc(doc),
            iepDraftMounted: true,
          }, () => {
            var iepDraft = this.state.iepDraft
            console.log(iepDraft)

            db.collection(ColType.student)
              .doc(studentId)
              .get()
              .then((doc) => {
                var student = flattenDoc(doc)
                var iepDict = {}
                var iepSubjectDict = {}
                var iepSelections = {}
                var iepSelectionsNoCount = {}
                var standardPromises = []

                iepDraft.subject.map((subject, index) => {
                  iepSubjectDict[subject] = []
                  iepSelectionsNoCount[subject] = []
                  if (subject === 'Reading Foundations') {
                    iepSelections[subject] = { curr: 0, max: 3, selections: [] }
                  }
                  else iepSelections[subject] = { curr: 0, max: 2, selections: [] }
                  console.log(student.grade, subject, iepDraft.category, iepDraft.level)
                  return standardPromises.push(db.collection(ColType.iepStandards)
                    .where('grade', '==', student.grade)
                    .where('mainSubject', '==', subject)
                    .where('category', '==', iepDraft.category)
                    .where('level', '==', iepDraft.level)
                    .get()
                  )
                })

                Promise.all(standardPromises)
                  .then((querySnapshots) => {
                    querySnapshots.map((querySnapshot, index) => {
                      return querySnapshot.forEach((doc) => {
                        var iep = flattenDoc(doc)
                        iepSubjectDict[iep.mainSubject].push(iep)
                        iepDict[iep.id] = iep
                        console.log(iep.mainSubject)
                      })
                    })

                    this.setState({
                      student: student,
                      iepDict: iepDict,
                      iepSubjectDict: iepSubjectDict,
                      iepSelections: iepSelections,
                    }, () => {
                      if (iepDraft.iepSelectionsNoCount &&
                        !(Object.keys(iepDraft.iepSelectionsNoCount).length === 0 &&
                          iepDraft.iepSelectionsNoCount.constructor === Object)) {
                        if (this.state.iepDraft.step.stepNum > this.state.stepNum) 
                        this.props.form.setFieldsValue(iepDraft.iepSelectionsNoCount)
                      }          
                    })
                  })
                  .catch((error) => {
                    console.log(error)
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

  checkBoxGroupChange = (checkedValue, subject) => {
    console.log(checkedValue, subject)
    var iepSelections = this.state.iepSelections
    var iepSelectionsNoCount = this.state.iepSelectionsNoCount
    console.log(iepSelections[subject].curr, iepSelections[subject].max,
      iepSelections[subject].selections)
    //if (checkedValue > iepSelections[subject].max) return
    iepSelections[subject].curr = checkedValue.length
    iepSelections[subject].selections = checkedValue
    iepSelectionsNoCount[subject] = checkedValue

    this.setState({
      iepSelections: iepSelections,
      iepSelectionsNoCount: iepSelectionsNoCount,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('received values from form', values)

        var newState = this.state.iepDraft
        newState.iepSelectionsNoCount = values
        var iepStandards = []
        newState.subject.map((subject, index) => {
          return newState.iepSelectionsNoCount[subject].map((iepId, index) => {
            return iepStandards.push(this.state.iepDict[iepId].standard)
          })
        })

        newState.iepStandards = iepStandards
        newState.step = {stepNum: this.state.stepNum + 1, path: 'modify'}

        db.collection(ColType.iepDrafts)
          .doc(this.state.draftId)
          .set(newState, { merge: true })
          .then(() => {
            this.props.history.push(
              {
                pathname: '/teacher/add-goal-modify/' +
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

    return <div>
        <Layout className="content layout-header-mt">
        {this.state.teacher && this.state.student && this.state.draftId ?
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
                   {this.state.iepDraftMounted ?
                    this.state.iepDraft && this.state.iepDraft.step.stepNum < this.state.stepNum ?
                    <NotAtThisStep iepDraft={this.state.iepDraft} /> :
                    <Row gutter={32} className="mt-4">
                      <Col span={4} className="border-right">

                        <h2 className="mb-2">Steps</h2>
                        <IEPFormSteps current={this.state.stepNum} />
                  </Col>
                  <Col span={20}>
                        <div className="sub-menu-width m-lr-auto">
                    <div>
                      <h1 className="flex flex-v-center">
                        <span className="mr-2">Student: </span>
                        <PersonAvatar person={this.state.student} />
                      </h1>
                      <h2 className="mb-1">
                        Observation
                      </h2>

                  <div>
                    {this.state.student ?
                    <h3 className="mb-3">Based on teacher observation within the past six weeks,
                    {" " + this.state.student.firstName + " "} 
                    needs to improve knowledge and skills in: (each choice will become a goal)</h3>
                    : ''}

                    <Form onSubmit={this.handleSubmit} className="login-form text-align-left">

                      {Object.keys(this.state.iepSubjectDict).map((subject, index) => {
                        return <div key={'form-item-' + subject}>
                          <h2 className="mb-1">
                            <span className="mr-3">{capitalizeFirstChar(subject)}</span>
                          </h2>
                          <h3 className="mb-1 text-muted">
                            <span>{'Each choice will become an IEP goal.'}</span>
                          </h3>
                          <FormItem {...formItemLayout} label={null}
                            className="block-label">
                            {getFieldDecorator(subject, {
                              rules: [{ required: true, message: 'Required' }],
                            })(
                              <CheckboxGroup
                                onChange={(checkedValue) =>
                                  this.checkBoxGroupChange(checkedValue, subject)}
                              >
                                {this.state.iepSubjectDict[subject].map((iep, index) => {
                                  return <Row gutter={16} className="font-18 mt-1"
                                    key={'iep-checkbox-row-' + iep.id}
                                  >
                                    <Col span={2}>
                                      <Checkbox
                                        value={iep.id}
                                        className="block ml-0"
                                        key={'checkbox-iep-' + iep.id}
                                      >
                                      </Checkbox>
                                    </Col>
                                    <Col span={16} className="mt-minus-3">
                                      {capitalizeFirstChar(iep.standardDescription)}
                                    </Col>
                                  </Row>
                                })
                                }
                              </CheckboxGroup>
                            )}
                          </FormItem>
                        </div>
                      })
                      }

                      <FormItem className="mb-0 mt-4 pt-2">
                        <Link 
                            to={'/teacher/add-goal-information/' +
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
            </Content>
          </Layout> : ''}
        </Layout> 
        <CustomFooter />
    </div>
  }
}

export default Form.create()(TeacherAddIEPGoalSelect)