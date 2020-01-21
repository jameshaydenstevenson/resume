import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/GlobalStyle.css'
import { db } from '../../firebase/Firebase'
import ColType from '../.././Types'
import PersonAvatar from '../../customcomponents/PersonAvatar'
import InputNumberPickerAnt from '../../customcomponents/InputNumberPickerAnt'
import IEPDrafts from './IEPDrafts'
import NotAtThisStep from './NotAtThisStep'
import IEPFormSteps from './IEPFormSteps'
import {
  flattenDoc, getIDFromURL, capitalizeFirstChar, getTotalPoints,
  getQueryStringParam, createIEPGoalText, getTotalPointsBaselineOrTarget
} from '../.././Util'
import { Layout, Icon, Button, Form, Row, Col, Tabs, Input, message } from 'antd'
import CustomFooter from '../../login/CustomFooter'
const { Content } = Layout
const FormItem = Form.Item
const TabPane = Tabs.TabPane

const errorMessage = (description) => {
  message.destroy()
  message.error(description, 10)
}

class TeacherAddIEPGoalProgressMonitoring extends Component {
  state = {
    teacher: null,
    iep: null,
    iepParagraph: '',
    totalPoints: null,
    students: [],
    iepDrafts: [],
    iepDraft: null,
    tabKey: '1',
    stepNum: 4,
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
    var iepId = getQueryStringParam('iep')
    var draftId = getQueryStringParam('draft')

    this.setState({
      teacherId: teacherId,
      studentId: studentId,
      iepId: iepId,
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
          var obj = {}
          iepDraft.ieps.map((iep, index) => {
            obj[iep.id + '-baseline'] = iep.baselineAccuracyLevel === '<number>' ? 
            0 : 
            getTotalPointsBaselineOrTarget(iep.baselineProgressMonitoring)
            obj[iep.id + '-target'] = iep.targetAccuracyLevel === '<number>' ? 
            null :
            getTotalPointsBaselineOrTarget(iep.targetProgressMonitoring)

            for (var i = 0; i < iep.baselineProgressMonitoring.length; i++) {
              obj[iep.id + '-baseline-' + i] = iep.baselineProgressMonitoring[i].num
              obj[iep.id + '-target-' + i] = iep.targetProgressMonitoring[i].num
            }

            return false
          })

          console.log(obj)
          this.props.form.setFieldsValue(obj)
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

  progressMonitoringChange = (newValue, iep, index) => {
    console.log('val = ' + newValue, ', idx = ' + index)
    // set the number in the progress monitoring to the new value
    iep.progressMonitoring[index].num = newValue
    iep.totalPoints = getTotalPoints(iep)
    iep.iepParagraph = createIEPGoalText(iep, this.state.student)

    this.setState({
      ieps: this.state.ieps,
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
          return false
        })
        newState.ieps = this.state.ieps

        this.props.history.push(
          {
            pathname: '/teacher/add-goal-confirm/' +
              this.state.teacherId + '?student=' +
              this.state.studentId,
            state: newState, // pass state to confirm page
          }
        )
      }
    })
  }

  serviceLocationChange = (value, options) => {
    this.setState({
      serviceLocation: value,
    })
  }

  progressMonitoringChange = (newValue, iep, index) => {
    console.log('val = ' + newValue, ', idx = ' + index)
    // set the number in the progress monitoring to the new value
    iep.progressMonitoring[index].num = newValue
    iep.totalPoints = getTotalPoints(iep)
    iep.iepParagraph = createIEPGoalText(iep, this.state.student)

    this.setState({
      ieps: this.state.ieps,
    })
  }

  baselineMonitoringChange = (newValue, iep, index) => {
    console.log('baseline val = ' + newValue, ', idx = ' + index)
    // set the number in the progress monitoring to the new value
    iep.baselineProgressMonitoring[index].num = newValue
    var totalPoints = getTotalPointsBaselineOrTarget(iep.baselineProgressMonitoring)
    iep.baselineAccuracyLevel = 
    (totalPoints / 
      iep.totalPoints * 100).toFixed(0)
    iep.iepParagraph = createIEPGoalText(iep, this.state.student)
    
    var obj = {
      [iep.id + '-baseline-' + index]: newValue,
      [iep.id + '-baseline']: totalPoints,
    }

    this.props.form.setFieldsValue(obj)

    this.setState({
      ieps: this.state.ieps,
    })
  }

  targetMonitoringChange = (newValue, iep, index) => {
    console.log('baseline val = ' + newValue, ', idx = ' + index)
    // set the number in the progress monitoring to the new value
    iep.targetProgressMonitoring[index].num = newValue
    var totalPoints = getTotalPointsBaselineOrTarget(iep.targetProgressMonitoring)
    iep.targetAccuracyLevel = 
    (totalPoints / 
      iep.totalPoints * 100).toFixed(0)
    iep.iepParagraph = createIEPGoalText(iep, this.state.student)

    var obj = {
      [iep.id + '-target-' + index]: newValue,
      [iep.id + '-target']: totalPoints,
    }

    this.props.form.setFieldsValue(obj)

    this.setState({
      ieps: this.state.ieps,
    })
  }

  baselineOrTargetChange = (newValue, iep, baselineOrTarget) => {
    console.log(baselineOrTarget, newValue)

    if (baselineOrTarget === 'baseline') {
      iep.baselineAccuracyLevel = newValue
      this.props.form.setFieldsValue({[iep.id + '-baseline']: newValue})
    } else {
      iep.targetAccuracyLevel = newValue
      this.props.form.setFieldsValue({[iep.id + '-target']: newValue})
    }

    iep.iepParagraph = createIEPGoalText(iep, this.state.student)

    this.setState({
      ieps: this.state.ieps,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('received values from form', values)

        for (var i = 0; i < this.state.ieps.length; i++) {
          var iep = this.state.ieps[i]
          console.log(iep.baselineAccuracyLevel, iep.targetAccuracyLevel, 
            parseInt(iep.baselineAccuracyLevel, 10) >= parseInt(iep.targetAccuracyLevel, 10))
          if (parseInt(iep.baselineAccuracyLevel, 10) >= parseInt(iep.targetAccuracyLevel, 10)) {
            errorMessage('Baseline accuracy must be less than target accuracy.')
            return
          }
        }

        var newState = this.state.iepDraft
        newState.ieps = this.state.ieps
        newState.step = {stepNum: this.state.stepNum + 1, path: 'service'}

        db.collection(ColType.iepDrafts)
        .doc(this.state.draftId)
        .set(newState, { merge: true })
        .then(() => {
          this.props.history.push(
            {
              pathname: '/teacher/add-goal-service/' +
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
        xs: { span: 9 },
        sm: { span: 9 },
      },
      wrapperCol: {
        xs: { span: 15 },
        sm: { span: 15 },
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
                    <h2 className="mb-3">Baseline and Target Levels</h2>
                    <Form onSubmit={this.handleSubmit}>
                      {this.state.iepDraft.subject.map((subject, subjectIndex) => {
                        var ieps = this.state.ieps.filter(iep => iep.mainSubject === subject)
                        return <div className="mb-3" key={'baseline-target-block-' + subjectIndex}>
                          <h2 className="mb-2 pb-2 border-bottom">
                          {capitalizeFirstChar(subject)}</h2>
                          {ieps.map((iep, index) => {
                            return <Row gutter={64} className="mb-1 font-16" 
                                        key={"iep-row-" + iep.id}
                            >
                              <Col span={24} className="mb-2">
                                <h3 className="mb-2">IEP Goal</h3>
                                <div className="mb-1">
                                {iep.iepParagraph}
                                </div>
                              </Col>
                              <Col span={12}>
                              <div>
                              <h3 className="mb-2">Baseline</h3>
                              {iep.baselineProgressMonitoring.map((item, index) => {
                                return <div className="mb-1" 
                                            key={"progress-monitoring-rubrik" + index}
                                >
                                   <FormItem {...formItemLayout} 
                                label={null} className="inline-block mb-0">
                                  {getFieldDecorator(iep.id + '-baseline-' + index, {
                                    rules: [{ required: false, 
                                      message: '' }],
                                  })(
                                   <InputNumberPickerAnt
                                    meta={{ iep: iep, index: index }}
                                    size={'large'}
                                    min={0}
                                    max={item.max}
                                    //value={item.num}
                                    initialValue={item.num}
                                    className={''}
                                    onChangeSuccess={this.baselineMonitoringChange}
                                  />
                                )}
                                </FormItem>
                                  <span className="font-18 va-minus-5">
                                    <span className="ml-1 mr-1">/</span>
                                    <span>{item.max + ' ' + item.info}</span>
                                  </span>
                                </div>
                              })
                              }
                            </div>
                            <div className="mt-3 pb-4 border-top font-18">
                              <div className="pt-2">
                                <div className="inline-block width-90px">
                                <FormItem {...formItemLayout} 
                                label={null} className="inline-block">
                                  {getFieldDecorator(iep.id + '-baseline', {
                                    rules: [{ required: true, 
                                      message: 'Required.'
                                    }],
                                  })(
                                  <Input className="width-90px" disabled={true} size={'large'} />
                                )}
                                </FormItem>
                                </div>
                                <div className="inline-block va-minus-5">
                                  <span>
                                    <span className="ml-1 mr-1">/</span>
                                    <span className="mr-1">{iep.totalPoints}</span>
                                    <span className="mr-2">Total points</span>
                                    {iep.baselineAccuracyLevel === '<number>' ? '' :
                                    <span>({iep.baselineAccuracyLevel}%)</span>}
                                  </span>
                                </div>
                              </div>
                            </div>
                              </Col>
                              <Col span={12}>
                              <div>
                              <h3 className="mb-2">Target</h3>
                              {iep.targetProgressMonitoring.map((item, index) => {
                                return <div className="mb-1" 
                                            key={"progress-monitoring-rubrik" + index}
                                >
                                 <FormItem {...formItemLayout} 
                                label={null} className="inline-block mb-0">
                                  {getFieldDecorator(iep.id + '-target-' + index, {
                                    rules: [{ required: false, 
                                      message: '' }],
                                  })(
                                  <InputNumberPickerAnt
                                    meta={{ iep: iep, index: index }}
                                    size={'large'}
                                    min={0}
                                    max={item.max}
                                    initialValue={item.num}
                                    className={''}
                                    onChangeSuccess={this.targetMonitoringChange}
                                  />
                                )}
                                </FormItem>
                                  <span className="font-18 va-minus-5">
                                    <span className="ml-1 mr-1">/</span>
                                    <span>{item.max + ' ' + item.info}</span>
                                  </span>
                                </div>
                              })
                              }
                            </div>
                            <div className="mt-3 pb-4 border-top font-18">
                              <div className="p-1 pt-2">
                                <div className="inline-block width-90px">
                                <FormItem {...formItemLayout} 
                                label={null} className="inline-block">
                                  {getFieldDecorator(iep.id + '-target', {
                                    rules: [{ required: true, 
                                      message: 'Required.' }],
                                  })(
                                  <Input className="width-90px" disabled={true} size={'large'} />
                                )}
                                </FormItem>
                                </div>
                                <div className="inline-block va-minus-5">
                                  <span>
                                    <span className="ml-1 mr-1">/</span>
                                    <span className="mr-1">{iep.totalPoints}</span>
                                    <span className="mr-2">Total points</span>
                                    {iep.targetAccuracyLevel === '<number>' ? '' :
                                    <span>({iep.targetAccuracyLevel}%)</span>}
                                  </span>
                                </div>
                              </div>
                            </div>
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
                            to={'/teacher/add-goal-modify/' +
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

export default Form.create()(TeacherAddIEPGoalProgressMonitoring)