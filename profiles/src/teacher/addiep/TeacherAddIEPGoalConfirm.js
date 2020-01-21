import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/GlobalStyle.css'
import { firebase, db } from '../../firebase/Firebase'
import ColType from '../.././Types'
import IEPDrafts from './IEPDrafts'
import PersonAvatar from '../../customcomponents/PersonAvatar'
import NotAtThisStep from './NotAtThisStep'
import IEPFormSteps from './IEPFormSteps'
import {
  flattenDoc, getIDFromURL, capitalizeFirstChar, getTotalPoints,
  getQueryStringParam, createIEPGoalText, getRandomShardIndex, getNumShards,
  incrementSummary, compress, decompress
} from '../.././Util'
import { Layout, Icon, Button, Collapse, Tabs, Row, Col, Form, DatePicker, message } from 'antd'
import IEPParagraph from '../iep/IEPParagraph'
import CustomFooter from '../../login/CustomFooter'
const { Content } = Layout
const Panel = Collapse.Panel
const FormItem = Form.Item
const TabPane = Tabs.TabPane

const errorMessage = (description) => {
  message.error(description)
}

class TeacherAddIEPGoalConfirm extends Component {
  state = {
    teacher: null,
    iep: null,
    iepParagraph: '',
    totalPoints: null,
    students: [],
    school: null,
    completionDateString: '',
    iepDraft: null,
    tabKey: '1',
    stepNum: 7,
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
        var draft = flattenDoc(doc)
        this.setState({
          iepDraft: draft,
          iepSelections: draft.iepSelectionsNoCount,
          ieps: draft.ieps,
          iepDraftMounted: true,
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

        db.collection(ColType.school)
          .doc(teacher.schoolId)
          .get()
          .then((doc) => {
            var school = flattenDoc(doc)
            console.log('School', school)
            
            this.setState({
              school: school,
            })
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

  onCompletionDateChange = (date, dateString) => {
    console.log(date, dateString)
    var ieps = this.state.ieps
    ieps.map((iep, index) => {
      iep.completionDate = dateString
      iep.iepParagraph = createIEPGoalText(iep, this.state.student)
      return false
    })

    this.setState({ 
      ieps: ieps,
      completionDateString: dateString 
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err && this.state.completionDateString) {
        console.log("Received values of form:", values)

        this.setState({
          isSubmitting: true,
        }, () => {
          var grade = this.state.student.grade
          var raceOrEthnicity = this.state.student.ethnicity === 'Hispanic or Latino' ? 
                                this.state.student.ethnicity : 
                                this.state.student.race
          var shardIndex = getRandomShardIndex(getNumShards())
          var shardPromises = []
          
          console.log('districtId', this.state.teacher.districtId, 
          'schoolId', this.state.teacher.schoolId, 'shardIndex', shardIndex)

          shardPromises.push(db.collection(ColType.schoolSummary)
              .where('districtId', '==', this.state.teacher.districtId)
              .where('schoolId', '==', this.state.teacher.schoolId)
              .where('shardIndex', '==', shardIndex)
              .get()
          )

          shardPromises.push(db.collection(ColType.districtSummary)
              .where('districtId', '==', this.state.teacher.districtId)
              .where('shardIndex', '==', shardIndex)
              .get()
          )

          Promise.all(shardPromises)
          .then((docs) => {
            console.log('shard promises result', docs)
            var schoolSummaryRef
            var districtSummaryRef
            docs[0].forEach((doc) => {
              if (!doc.exists) {
                console.log("School summary document did not exist!")
                errorMessage("We could not locate your school, please contact your administrator.")
                return
              }
              schoolSummaryRef = doc.ref
              console.log('school summary doc', doc.data())
            })
            docs[1].forEach((doc) => {
              if (!doc.exists) {
                console.log("District summary document did not exist!")
                errorMessage("We could not locate your district, " +
                "please contact your administrator.")
                return
              }
              districtSummaryRef = doc.ref
              console.log('school summary doc', doc.data())
            })

            if (!schoolSummaryRef || !districtSummaryRef) return

            var promises = []
            promises.push(
              db.runTransaction((transaction) => {
                  return transaction.get(schoolSummaryRef).then((schoolSummaryDoc) => {
                      if (!schoolSummaryDoc.exists) {
                          throw new Error("School summary document does not exist!")
                      }
                      
                      var schoolSummaryData = schoolSummaryDoc.data()
                      schoolSummaryData.summary = decompress(schoolSummaryData.summary)

                      var isDistrict = false
                      this.state.ieps.map((iep, index) => {
                        var subject = iep.mainSubject
                        return schoolSummaryData = incrementSummary(iep, schoolSummaryData, 
                        grade, subject, raceOrEthnicity, this.state.school, isDistrict)
                      })

                      schoolSummaryData.summary = compress(schoolSummaryData.summary)
                      return transaction.update(schoolSummaryRef, schoolSummaryData)
                  })
              })
            )
            promises.push(
              db.runTransaction((transaction) => {
                  return transaction.get(districtSummaryRef).then((districtSummaryDoc) => {
                      if (!districtSummaryDoc.exists) {
                          throw new Error("District summary document does not exist!")
                      }
      
                      var districtSummaryData = districtSummaryDoc.data()
                      districtSummaryData.summary = decompress(districtSummaryData.summary)

                      var isDistrict = true
                      this.state.ieps.map((iep, index) => {
                        var subject = iep.mainSubject
                        return districtSummaryData = incrementSummary(iep, districtSummaryData, 
                        grade, subject, raceOrEthnicity, this.state.school, isDistrict)
                      })

                      districtSummaryData.summary = compress(districtSummaryData.summary)
                      return transaction.update(districtSummaryRef, districtSummaryData)
                  })
              })
            )
  
            Promise.all(promises)
              .then(() => {
                console.log('District and school transactions succeeded')
                var batch = db.batch()

                // delete draft in batch
                var draftRef = db.collection(ColType.iepDrafts).doc(this.state.draftId)
                batch.delete(draftRef)

                // add accommodations and possibly removalStatement to student
                var studentRef = db.collection(ColType.student).doc(this.state.student.id)
                var updatedStudentObj = {}
                updatedStudentObj.accommodations = this.state.iepDraft.accommodations
                if (this.state.iepDraft.hasOwnProperty('removalStatement')) {
                  updatedStudentObj.removalStatement = this.state.iepDraft.removalStatement
                }

                // update student
                batch.update(studentRef, updatedStudentObj)

                // add all ieps in batch
                this.state.ieps.map((iep, index) => {
                  var newDoc = db.collection(ColType.iep).doc()
                  // student at the time of creation (used in functions)
                  return batch.set(newDoc, {
                      iep: iep,
                      student: this.state.student,
                      studentId: this.state.student.id,
                      teacherId: this.state.teacher.id,
                      schoolId: this.state.teacher.schoolId,
                      districtId: this.state.teacher.districtId,
                      onTrack: false,
                      totalMeasurements: 0,
                      latestMeasurementTimeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                  })
                })

                batch.commit().then(() => {
                  console.log("Batch added successfully")
                  
                  this.setState({
                    isSubmitting: false,
                  })

                  this.props.history.push(
                    {
                      pathname: '/teacher/student/' +
                        this.state.teacherId + '?student=' +
                        this.state.studentId 
                    }
                  )
                })
              })
              .catch((error) => {
                console.log(error)
                errorMessage("Something went wrong adding the IEP goals, please try again.")
              })
          })
          .catch((error) => {
            console.log(error)
            errorMessage("Something went wrong adding the IEP goals, please try again.")
          })
        })
      }
    })
  }

  tabChange = (activeKey) => {
    this.setState({ tabKey: activeKey })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return <div>
      <Layout className="content layout-header-mt">
        <Layout>
            <Content className="layout-content">
            {this.state.student && this.state.teacher ?
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
                <div>
                <h2 className="mb-3">Confirm</h2>
                  <Form onSubmit={this.handleSubmit}>
                 
                  {this.state.iepDraft.subject.map((subject, index) => {
                    var ieps = this.state.ieps.filter(iep => iep.mainSubject === subject)
                    console.log(subject, ieps.length)
                    return <div className="mb-3" key={'iep-state-' + index}>
                      <h2 className="mb-2 pb-2 border-bottom">
                        {capitalizeFirstChar(subject)}</h2>
                      <Collapse>
                        {ieps.map((iep, index) => {
                          return <Panel 
                          key={'iep-panel-' + subject + index + iep.id}
                          header={<span className="font-500">
                            {capitalizeFirstChar(iep.standardDescription)}
                          </span>}
                          >
                          <div className="font-16">
                            <h3>Present Level</h3>
                            <div className="mb-2">{iep.presentLevel.presentLevelParagraph}</div>
                            <h3>IEP Goal</h3>
                            <div className="mb-2">
                              <IEPParagraph iepParagraph={iep.iepParagraph} />
                            </div>
                            </div>
                          </Panel>
                        })
                        }
                      </Collapse>
                    </div>
                  })
                  }
                  <h2 className="mt-4">When is the completion date for these goals?</h2>
                  <div className="w-500">
                   <FormItem
                    label={'Completion date'}>
                      {getFieldDecorator('completionDate', {
                        rules: [{ required: true, 
                          message: 'Select a completion date.' }],
                      })(
                        <DatePicker 
                          size={'large'} 
                          onChange={this.onCompletionDateChange} 
                        />
                      )}
                    </FormItem>
                  </div>
                  <FormItem className="mb-0">
                <div className="pt-4">
                  {this.state.teacherId && this.state.studentId && this.state.draftId ?
                    <Link 
                      to={'/teacher/add-goal-accommodations/' +
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
                    className="block float-right"
                    size={'large'}
                    type={'primary'}
                    htmlType="submit"
                    disabled={this.state.isSubmitting}
                  >
                    <Icon
                      type="plus" />
                    {!this.state.isSubmitting ?
                      'Add these IEP Goals' :
                      'Adding IEP Goals...'}
                  </Button>
                </div>
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
  }
}

export default Form.create()(TeacherAddIEPGoalConfirm)
