import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/GlobalStyle.css'
import { db } from '../../firebase/Firebase'
import ColType from '../.././Types'
import IEPDrafts from './IEPDrafts'
import NotAtThisStep from './NotAtThisStep'
import IEPFormSteps from './IEPFormSteps'
import {
  flattenDoc, getIDFromURL, getQueryStringParam
} from '../.././Util'
import PersonAvatar from '../../customcomponents/PersonAvatar'
import { Layout, Button, Icon, Select, Form, Tabs, Row, Col, message } from 'antd'
import CustomFooter from '../../login/CustomFooter'
const { Content } = Layout
const Option = Select.Option
const FormItem = Form.Item
const TabPane = Tabs.TabPane

const errorMessage = (description) => {
  message.error(description)
}

class TeacherAddIEPGoalAccommodation extends Component {
  state = {
    teacher: null,
    student: null,
    iepDraft: null,
    students: [],
    studentDict: {},
    iepDrafts: [],
    presentLevels: {},
    selectedObj: {
      instructionBarrier: null,
      engagementBarrier: null,
      organizationBarrier: null,
      PSI: {
        instructionBarrier: [
          'Provide options for lengthy handwritten assignments such as: ' +
          'fill in the blank, or complete work on the computer',
          'Shorten assignments that are repetitive',
          'Provide extended time to complete assignments',
          'Use of a highlighter or sticky notes',
          'Listen to an audio version while reading or instead of reading',
        ],
        engagementBarrier: [
          'Check for understanding during each lesson',
          'Create a signal with the student to encourage participation',
          'Provide extra verbal response time for answering questions',
          'Give simple written directions',
          'Talk slowly when giving oral directions',
          'Provide notes or lesson outlines',
        ],
        organizationBarrier: [
          'Create consistent daily class routines',
          'Break assignments into smaller chunks',
          'Show an exemplar before the student starts the task',
          'Provide a rubric about how the task will be graded',
          'Provide a hook related to personal interests for lengthy assignments',
          'Access to tools that support processing (calculator/spell check)',
        ],
      },
      WMI: {
        instructionBarrier: [
          'Preview the lesson',
          'Connect new concepts to prior knowledge',
          'Repeat instructions',
          'Create safe environment for asking for help when unclear about instructions or concepts',
          'Provide visuals to accompany instruction',
          'Paraphrase what has been taught periodically during lesson'
        ],
        engagementBarrier: [
          'Have the student verbalize the task',
          'Provide multiple opportunities for practice in short sessions',
          'Use of peer buddy to review lessons',
          'Use physical movement and/or songs to teach new concepts',
          'Visual cues to maintain attention',
          'Color code key words ',
          'Provide immediate positive feedback for effort and persistence',
        ],
        organizationBarrier: [
          'Create consistent daily class routines',
          'Provide opportunities for repeating a task when needed',
          'Use of graphic organizers to teach new concepts',
          'Provide anchor charts',
          'Start each lesson with a review of the previous one',
          'Access to tools that faciltate learning (calculator/spell check)'
        ],
      },
      VCI: {
        instructionBarrier: [
          'Connect new concepts to prior knowledge',
          'Paraphrase what has been taught periodically during lesson',
          'Highlight key vocabulary and major concepts',
          'Provide visuals or graphics to support new concepts',
          'Proximity seating to support verbal comprehension',
        ],
        engagementBarrier: [
          'Provide a fill in the blank outline and/or cloze notes',
          'Preteach new vocabulary',
          'Incorporate interests and/or prior knowledge when teaching new concepts',
          'Frequently check in with student to ensure comprehension',
          'Provide a reward system'
        ],
        organizationBarrier: [
          'Use of graphic organizers to teach new concepts',
          'Provide a word bank',
          'Use of anchor charts',
          'Use of word walls'
        ],
      },
      FRI: {
        instructionBarrier: [
          'Provide teacher think alouds when teaching new concepts',
          'Provide an outline of lesson',
          'Use numerous examples to explain new concepts',
          'Preview of tasks and expectations',
        ],
        engagementBarrier: [
          'Use of graphic organizers to help provide a summary of information',
          'Provide analogies that are relatable',
          'Provide time for student to explain their work',
          'Provide a peer buddy',
        ],
        organizationBarrier: [
          'Provide time for a review of the lesson',
          'Provide exemplars',
          'Provide procedural checklists',
          'Provide visual schedules'
        ],
      },
    },
    barriersSelected: 0,
    requiredBarrierNum: 0,
    tabKey: '1',
    stepNum: 6,
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
      db.collection(ColType.iepDrafts)
        .doc(draftId)
        .get()
        .then((doc) => {
          console.log(doc.id, '=>', doc.data())
          var iepDraft = flattenDoc(doc)
          var requiredBarrierNum = 0
          if (iepDraft.level === '70 and below') requiredBarrierNum = 3
          else if (iepDraft.level === '70-79') requiredBarrierNum = 2
          else if (iepDraft.level === '80 and above') requiredBarrierNum = 1
          if (iepDraft.hasOwnProperty('accommodations')) {
            var selectedObj = this.state.selectedObj
            var barriersSelected = 0
            selectedObj['instructionBarrier'] = iepDraft.accommodations['instructionBarrier']
            selectedObj['engagementBarrier'] = iepDraft.accommodations['engagementBarrier']
            selectedObj['organizationBarrier'] = iepDraft.accommodations['organizationBarrier']
            if (selectedObj['instructionBarrier'] !== null) {
              barriersSelected += 1
            }
            if (selectedObj['engagementBarrier'] !== null) {
              barriersSelected += 1
            }
            if (selectedObj['organizationBarrier'] !== null) {
              barriersSelected += 1
            }
            this.setState({
              selectedObj,
              barriersSelected,
            })
          }
          
          this.setState({
            iepDraft: iepDraft,
            requiredBarrierNum: requiredBarrierNum,
            iepDraftMounted: true,
          }, () => {
            var iepDraft = this.state.iepDraft
            if (iepDraft) {
              this.props.form.setFieldsValue(iepDraft.accommodations)
            }
          })
        })
    }

    db.collection(ColType.teacher)
      .doc(teacherId)
      .get()
      .then((doc) => {
        var teacher = flattenDoc(doc)

        db.collection(ColType.student)
          .doc(studentId)
          .get()
          .then((doc) => {
            var student = flattenDoc(doc)
            this.setState({
              teacher: teacher,
              student: student,
            })
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
        if (this.state.barriersSelected < this.state.requiredBarrierNum) {
          errorMessage('Please select ' + this.state.requiredBarrierNum + ' barrier(s).')
          return
        }

        console.log('Received values from form', values)
        // if only 1 or 2 of these is required the nonselected values
        // can be undefined, so here we check if any are undefined
        // then delete the value as firebase cannot have undefined values.
        if (!values.instructionBarrier) delete values.instructionBarrier
        if (!values.engagementBarrier) delete values.engagementBarrier
        if (!values.organizationBarrier) delete values.organizationBarrier

        var newState = this.state.iepDraft
        newState.accommodations = values
        newState.step = {stepNum: this.state.stepNum + 1, path: 'confirm'}

        db.collection(ColType.iepDrafts)
          .doc(this.state.draftId)
          .set(newState, { merge: true })
          .then(() => {
            this.props.history.push(
              {
                pathname: '/teacher/add-goal-confirm/' +
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

  selectChange = (value, option, sectionKey) => {
    console.log(value, option, sectionKey)
    var selectedObj = this.state.selectedObj
    selectedObj[sectionKey] = value

    var barriersSelected = 0
    if (selectedObj['instructionBarrier']) {
      barriersSelected += 1
    }
    if (selectedObj['engagementBarrier']) {
      barriersSelected += 1
    }
    if (selectedObj['organizationBarrier']) {
      barriersSelected += 1
    }

    this.setState({
      barriersSelected: barriersSelected,
      selectedObj: selectedObj,
    })
  }

  unselectBarrier = (e, sectionKey) => {
    var selectedObj = this.state.selectedObj
    selectedObj[sectionKey] = null

    var barriersSelected = 0
    if (selectedObj['instructionBarrier'] !== null) {
      barriersSelected += 1
    }
    if (selectedObj['engagementBarrier'] !== null) {
      barriersSelected += 1
    }
    if (selectedObj['organizationBarrier'] !== null) {
      barriersSelected += 1
    }

    this.props.form.setFieldsValue({[sectionKey]: null})

    this.setState({
      barriersSelected: barriersSelected,
      selectedObj: selectedObj,
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: {
        xs: { span: 20 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 30 },
        sm: { span: 18 },
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
                    {this.state.iepDraftMounted ?
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
                            <h2 className="mb-1">
                              Accommodations
                            </h2>
                            <h3 className="mb-3 pb-3 border-bottom">
                              Select accommodations to remove barriers and to help 
                              {this.state.student ?
                              (' ' + this.state.student.firstName + ' ') :
                              ''} 
                              access the general education curriculum.
                            </h3>
                            <h2 className="mb-1"
                            >Choose at least {this.state.requiredBarrierNum} barrier(s)</h2>
                            <h3 className="mb-4">
                            {this.state.barriersSelected} / 
                            {' ' + this.state.requiredBarrierNum} barrier(s) chosen
                            </h3>
                            <Form onSubmit={this.handleSubmit} 
                            className="login-form text-align-left">
                              <h4 className="mb-2 w-100 h-100 inline-block">
                                <span>Barrier 1: Instruction</span>
                              </h4>
                            
                              <FormItem {...formItemLayout} 
                              label={'Barrier'}
                               className="pl-1">
                                {getFieldDecorator('instructionBarrier', {
                                  rules: [{ required: false, message: 'Select an assessment.' }],
                                })(
                                  <Select
                                    size={'large'}
                                    placeholder="Select..."
                                    allowClear={true}
                                    onChange={
                                      (value, option) => 
                                      this.selectChange(value, option, 'instructionBarrier')
                                    }
                                  >
                                    {this.state.iepDraft.category && 
                                     this.state.selectedObj[this.state.iepDraft.category]
                                     .instructionBarrier
                                     .map((instructionValue, index) => {
                                      return <Option 
                                        value={instructionValue}
                                        key={instructionValue}
                                      >
                                        {instructionValue}
                                      </Option>
                                     })
                                    }
                                  </Select>
                                )}
                              </FormItem>
                              
                              <h4 className="mb-2">Barrier 2: Engagement</h4>
                              <FormItem {...formItemLayout} 
                              label={'Barrier'} className="pl-1">
                                {getFieldDecorator('engagementBarrier', {
                                  rules: [{ required: false, message: 'Select an assessment.' }],
                                })(
                                  <Select
                                    size={'large'}
                                    placeholder="Select..." 
                                    allowClear={true}
                                    onChange={
                                      (value, option) => 
                                      this.selectChange(value, option, 'engagementBarrier')
                                    }
                                  >
                                   {this.state.iepDraft.category && 
                                     this.state.selectedObj[this.state.iepDraft.category]
                                     .engagementBarrier
                                     .map((engagementValue, index) => {
                                      return <Option 
                                        value={engagementValue}
                                        key={engagementValue}
                                      >
                                        {engagementValue}
                                      </Option>
                                     })
                                    }
                                  </Select>
                                )}
                              </FormItem>

                              <h4 className="mb-2">Barrier 3: Organization</h4>
                              <FormItem {...formItemLayout} 
                               label={'Barrier'} className="pl-1">
                                {getFieldDecorator('organizationBarrier', {
                                  rules: [{ required: false, message: 'Select an assessment.' }],
                                })(
                                  <Select
                                    size={'large'}
                                    placeholder="Select..."
                                    allowClear={true}
                                    onChange={
                                      (value, option) => 
                                      this.selectChange(value, option, 'organizationBarrier')
                                    }
                                  >
                                   {this.state.iepDraft.category && 
                                     this.state.selectedObj[this.state.iepDraft.category]
                                     .organizationBarrier
                                     .map((organizationValue, index) => {
                                      return <Option 
                                        value={organizationValue}
                                        key={organizationValue}
                                      >
                                        {organizationValue}
                                      </Option>
                                     })
                                    }
                                  </Select>
                                )}
                              </FormItem>

                              <FormItem className="mb-0 mt-4 pt-2">
                                <Link 
                                  to={'/teacher/add-goal-service/' +
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

export default Form.create()(TeacherAddIEPGoalAccommodation)