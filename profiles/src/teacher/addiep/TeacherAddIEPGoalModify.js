import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/GlobalStyle.css'
import { db } from '../../firebase/Firebase'
import ColType from '../.././Types'
import PersonAvatar from '../../customcomponents/PersonAvatar'
import IEPDrafts from './IEPDrafts'
import NotAtThisStep from './NotAtThisStep'
import IEPFormSteps from './IEPFormSteps'
import {
  flattenDoc, getIDFromURL, capitalizeFirstChar, getTotalPoints,
  getQueryStringParam, createIEPGoalText, createELAPresentLevelText,
  createMathPresentLevelText
} from '../.././Util'
import { Layout, Icon, Button, Form, Row, Col, Tabs } from 'antd'
import CustomFooter from '../../login/CustomFooter'
const { Content } = Layout
const TabPane = Tabs.TabPane
const Promise = require("bluebird")

class TeacherAddIEPGoalModify extends Component {
  state = {
    teacher: null,
    iep: null,
    iepParagraph: '',
    totalPoints: null,
    students: [],
    ieps: [],
    iepStandardDict: {},
    iepDrafts: [],
    iepDraft: null,
    tabKey: '1',
    stepNum: 3,
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
        this.setState({
          iepDraft: flattenDoc(doc),
          iepDraftMounted: true,
        }, () => {
          var iepDraft = this.state.iepDraft
         
          db.collection(ColType.student)
            .doc(studentId)
            .get()
            .then((doc) => {
              var student = flattenDoc(doc)
              var ieps = []
              var iepDict = {}
              var iepSubjectDict = {}
              var iepSelections = {}
              var iepStandardDict = {}
              var standardPromises = []
              
              iepDraft.subject.map((subject, index) => {
                iepStandardDict[subject] = []
                return iepSubjectDict[subject] = []
              })

              iepDraft.iepStandards.map((standard, index) => {
                return standardPromises.push(db.collection(ColType.iepStandards)
                  .where('grade', '==', student.grade)
                  .where('category', '==', iepDraft.category)
                  .where('standard', '==', standard)
                  .orderBy('level', 'desc')
                  //.where('level', '==', iepDraft.level)
                  .get()
                )
              })

              Promise.all(standardPromises)
                .then((querySnapshots) => {
                  console.log('query length', querySnapshots.length)
                  querySnapshots.forEach((querySnapshot, index) => {
                    console.log('doc length', querySnapshot.docs.length)
                    querySnapshot.forEach((doc) => {
                      var iep = flattenDoc(doc)
                      iep.presentLevel = JSON.parse(JSON.stringify(iepDraft.presentLevel))
                      if (iep.mainSubject === 'Math') {
                        iep.presentLevel.presentLevelParagraph = 
                          createMathPresentLevelText(iep, iep.presentLevel, student)
                      }
                      else {
                        iep.presentLevel.presentLevelParagraph = 
                          createELAPresentLevelText(iep, iep.presentLevel, student)
                      }
                      iep.iepParagraph = createIEPGoalText(iep, student)
                      iep.totalPoints = getTotalPoints(iep)
                      ieps.push(iep)
                      if (!(iepStandardDict[iep.mainSubject].hasOwnProperty(iep.standard))) {
                        iepStandardDict[iep.mainSubject][iep.standard] = []
                      }
                      if (iep.level === iepDraft.level) {
                        iepSelections[iep.standard] = iep
                      }
                     
                      iepStandardDict[iep.mainSubject][iep.standard].push(iep)
                      iepSubjectDict[iep.mainSubject].push(iep)
                      iepDict[iep.id] = iep
                    })
                  })         

                  this.setState({
                    student: student,
                    ieps: ieps,
                    iepStandardDict: iepStandardDict,
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

  handleSubmit = (e) => {
    e.preventDefault()

    var newState = this.state.iepDraft
    newState.step = {stepNum: this.state.stepNum + 1, path: 'progress-monitoring'}

    var ieps = []
    var selectedStandardDict = {}

    Object.keys(this.state.iepSelections).map((standard, index) => {
      var iep = this.state.iepSelections[standard]
      selectedStandardDict[standard] = iep.id
      // copy of progress monitoring for baseline/target for the next step in the form.
      iep.baselineProgressMonitoring = JSON.parse(JSON.stringify(iep.progressMonitoring))
      iep.targetProgressMonitoring = JSON.parse(JSON.stringify(iep.progressMonitoring))
      for (var i = 0; i < iep.baselineProgressMonitoring.length; i++) {
        iep.baselineProgressMonitoring[i].max = iep.baselineProgressMonitoring[i].num
        iep.targetProgressMonitoring[i].max = iep.targetProgressMonitoring[i].num
        iep.baselineProgressMonitoring[i].num = 0
        iep.targetProgressMonitoring[i].num = 0
      }
      
      return ieps.push(iep)
    })

    console.log('selectedIEPS', ieps)
    newState.ieps = ieps
    newState.selectedStandardDict = selectedStandardDict

    db.collection(ColType.iepDrafts)
    .doc(this.state.draftId)
    .set(newState, { merge: true })
    .then(() => {
      this.props.history.push(
        {
          pathname: '/teacher/add-goal-progress-monitoring/' +
            this.state.teacherId + '?student=' +
            this.state.studentId +
            '&draft=' + this.state.draftId,
          state: newState, // pass state to confirm page
        }
      )
    })
  }

  tabChange = (activeKey) => {
    this.setState({ tabKey: activeKey })
  }

  levelTabChange = (activeKey, standard) => {
    console.log(activeKey + " " + standard)

    var iep = this.state.iepDict[activeKey]
    var iepSelections = this.state.iepSelections
    iepSelections[iep.standard] = iep
    this.setState({
      iepSelections: iepSelections,
    })
  }

  render() {
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
                    <h2 className="mb-1">Recommended Goals</h2>
                      {this.state.iepDraft.subject.map((subject, subjectIndex) => {
                        return <div className="mb-3" key={'baseline-target-block-' + subjectIndex}>
                          <h2 className="mb-2 pb-2 mt-2 border-bottom">
                          {capitalizeFirstChar(subject)}</h2>
                       {!this.state.iepStandardDict.hasOwnProperty(subject) ?
                          '' :
                        Object.keys(this.state.iepStandardDict[subject]).map((standard, index) => {
                          var activeTabLevel = ''
                          // state prefilling, this step doesnt have a form so its done by
                          // setting the tab's defaultActiveKey to the iep.id
                          if (this.state.iepDraft.hasOwnProperty('selectedStandardDict')) {
                            activeTabLevel = this.state.iepDraft.selectedStandardDict[standard]
                          }
                          else {
                            activeTabLevel = this.state.iepStandardDict[subject][standard]
                            .find(iep => iep.level === this.state.iepDraft.level)
                            activeTabLevel = activeTabLevel.id
                          }

                          return <Row gutter={64} className="mb-3 font-16" 
                          key={subject + standard + index}>
                          <Col span={6}><h3 className="mt-2">
                          <span className="mr-3">IEP Goal</span>
                          </h3>
                          </Col>
                          <Col span={18}>
                          <Tabs 
                            defaultActiveKey={activeTabLevel}
                            onChange={(activeKey) => this.levelTabChange(activeKey, standard)} 
                            animated={false}
                          >
                          {this.state.iepStandardDict[subject][standard].map((iep, index) => {
                            var tab = iep.level === '70 and below' ? 'High level support' : 
                            iep.level === '70-79' ? 'Moderate level of support' : 
                            'Low level of support'
                            return <TabPane tab={tab} key={iep.id}>
                            <div className="font-16 mt-3">

                                
                                <div className="mb-2">
                                <h3>{capitalizeFirstChar(iep.standardDescription)}</h3>
                                {iep.iepParagraph}
                                </div>
                              {/**<div>
                                 <div>
                                 <h3 className="mb-2">
                                 Edit progress monitoring rubric</h3>
                                 {iep.progressMonitoring.map((item, index) => {
                                   return <div className="mb-1" 
                                               key={"progress-monitoring-rubrik" + index}
                                   >
                                     <InputNumberPickerAnt
                                       meta={{ iep: iep, index: index }}
                                       size={'large'}
                                       min={1}
                                       max={20}
                                       value={item.num}
                                       className={''}
                                       onChangeSuccess={this.progressMonitoringChange}
                                     />
                                     <span className="font-18 ml-1">
                                       {item.info}
                                     </span>
                                   </div>
                                 })
                                 }
                               </div>
                               <div className="mt-3 pb-4 border-top font-18">
                                 <div className="p-1 pt-2">
                                   <div className="inline-block width-90px">
                                     {iep.totalPoints}
                                   </div>
                                   <div className="inline-block">Total points</div>
                                 </div>
                               </div>
                                </div>*/}
                            </div>
                            </TabPane>
                            })
                            }
                            </Tabs>
                           </Col>
                           </Row>
                          })}
                        </div>
                      })
                      }
    
                      <div className="mt-4">
                        {this.state.teacherId && this.state.studentId && this.state.draftId ?
                          <Link 
                            to={'/teacher/add-goal-select/' +
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
                          onClick={this.handleSubmit}
                        >
                          Continue
                      </Button>
                    </div>

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

export default Form.create()(TeacherAddIEPGoalModify)
