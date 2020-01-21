import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/GlobalStyle.css'
import { db } from '../../firebase/Firebase'
import PersonAvatar from '../../customcomponents/PersonAvatar'
import CustomFooter from '../../login/CustomFooter'
import {  getIDFromURL, getQueryStringParam, capitalizeFirstChar,
 getRandomShardIndex, getNumShards, compress, decompress, decrementSummary } from '../../Util'
import ColType from '../../Types'
import { Layout, Row, Col, Icon, Button, Popconfirm, message } from 'antd'
const { Content } = Layout
const Promise = require("bluebird")
const chunk = require('lodash.chunk')

const loadingMessage = (description) => {
  message.destroy()
  message.loading(description, 0)
}

const errorMessage = (description) => {
  message.destroy()
  message.error(description)
}

const successMessage = (description) => {
  message.destroy()
  message.success(description)
}

class TeacherStudent extends Component {
  state = {
    teacherId: this.props.teacherBaseProps.teacherId,
    studentId: '',
    student: null,
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props)
    var studentId = getQueryStringParam('student')
    console.log('new props student id', studentId)

    if (nextProps.teacherBaseProps.studentDict) {
      this.setState({
        studentId: studentId,
        student: nextProps.teacherBaseProps.studentDict[studentId]
      })
    }
  }

  // Do fetch here
  componentDidMount() {
    var teacherId = getIDFromURL(window.location)
    var studentId = getQueryStringParam('student')
    this.setState({
      teacherId: teacherId,
      studentId: studentId,
    })

    if (this.props.teacherBaseProps.studentDict) {
      this.setState({
        studentId: studentId,
        student: this.props.teacherBaseProps.studentDict[studentId]
      })
    }
  }

  linkToEdit = (e) => {
    e.preventDefault()

    this.props.history.push(
      {
        pathname: '/teacher/update-student/' +
          this.state.teacherId + '?student=' +
          this.state.studentId,
      }
    )
  }

  // delete all data related to this iep goals
  // delete 1. IEP itself 2. all calendar events with this iep attached
  // (update if there are still events left in the array) 3. all measurements
  // 4. all notes
  deleteIEP = (e, IEPId) => {
    e.preventDefault()
    loadingMessage("Deleting IEP goal. Please wait...")

    var promises = []

    promises.push(new Promise((resolve, reject) => {
      db.collection(ColType.calendarEvents)
      .where('teacherId', '==', this.props.teacherBaseProps.teacher.id)
      .get()
      .then((querySnapshot) => {
        var chunkPromises = []
        var chunkedArray = chunk(querySnapshot.docs, 500)
        chunkedArray.map((chunk, index) => {
          return chunkPromises.push(new Promise((resolve, reject) => {
            chunk.forEach(doc => {
              db.runTransaction((transaction) => {
              // This code may get re-run multiple times if there are conflicts.
              return transaction.get(doc.ref).then((doc) => {
                if (!doc.exists) {
                  throw new Error("Document does not exist")
                }
                var event = doc.data()
                var ieps = event.ieps
                ieps = ieps.filter(iepObj => iepObj.iepId !== IEPId)
                // Ignore teacher events when deleting student's calendar events
                // If not ignored teacher events will be deleted because they have
                // no iep goals in them
                if (event.servicedIn === 'Teacher Event') {
                  // update the transaction without modification because no
                  // update needs to happen but firestore requires a transactions
                  // to write and read
                  transaction.update(doc.ref, event)
                }
                else {
                  // if there are no more ieps in the event, delete the event
                  if (ieps.length === 0) {
                    transaction.delete(doc.ref)
                  }
                  // else update the event with all instances of IEPId removed
                  else {
                    var maxDuration = 0
                    ieps.map((item, index) => {
                        if (parseInt(item.iepDuration, 10) > maxDuration) {
                        maxDuration = parseInt(item.iepDuration, 10)
                      }
                      return false
                    })
                    transaction.update(doc.ref, 
                      { ieps: ieps, duration: maxDuration }
                    )
                  }
                }
              })
            }).then(() => {
                console.log("Transaction successfully committed!")
                resolve()
            }).catch((error) => {
                console.log("Transaction failed: ", error)
                // I don't care about this error, it just means that the document that
                // was attempted to be read does no exist. Should be fine. Any other
                // errors should reject the promise though.
                if (error.message !== "Document does not exist") reject(error)
            })
          })
        })
        )
      })

      // if all transactions went through, then resolve else reject
      Promise.all(chunkPromises)
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
      })
    }).then(() => {
      return new Promise((resolve, reject) => {
        db.collection(ColType.measurements)
          .where('teacherId', '==', this.props.teacherBaseProps.teacher.id)
          .where('iepId', '==', IEPId)
          .get()
          .then((querySnapshot) => {
            var chunkPromises = []
            var chunkedArray = chunk(querySnapshot.docs, 500)
            chunkedArray.map((chunk, index) => {
              return chunkPromises.push(new Promise((resolve, reject) => {
                var batch = db.batch()
                chunk.forEach(doc => {
                  batch.delete(doc.ref)
                })

                return batch.commit().then(() => {
                  resolve()
                }).catch((error) => {
                  reject(error)
                })
              })
              )
            })

            Promise.all(chunkPromises)
              .then(() => {
                resolve()
              })
              .catch((error) => {
                reject(error)
              })
        })
      })
    }).then(() => {
      return new Promise((resolve, reject) => {
        db.collection(ColType.notes)
          .where('teacherId', '==', this.props.teacherBaseProps.teacher.id)
          .where('iepId', '==', IEPId)
          .get()
          .then((querySnapshot) => {
            var chunkPromises = []
            var chunkedArray = chunk(querySnapshot.docs, 500)
            chunkedArray.map((chunk, index) => {
              return chunkPromises.push(new Promise((resolve, reject) => {
                var batch = db.batch()
                chunk.forEach(doc => {
                  batch.delete(doc.ref)
                })

                return batch.commit().then(() => {
                  resolve()
                }).catch(() => {
                  reject()
                })
              })
              )
            })

            Promise.all(chunkPromises)
            .then(() => {
              resolve()
            })
            .catch((error) => {
              reject(error)
            })
          })
      })
    }))

    // all iep related data has been deleted, now decrement the school and
    // district summaries
    Promise.all(promises)
      .then((querySnapshots) => {
          var student = this.state.student
            // delete iep goals now as all data tied to them have been successfully deleted
          var grade = student.grade
          var raceOrEthnicity = student.ethnicity === 'Hispanic or Latino' ? 
                                student.ethnicity : 
                                student.race
          var shardIndex = getRandomShardIndex(getNumShards())
          var shardPromises = []
          
          console.log('districtId', this.props.teacherBaseProps.teacher.districtId, 
          'schoolId', this.props.teacherBaseProps.teacher.schoolId, 'shardIndex', shardIndex)

          shardPromises.push(db.collection(ColType.schoolSummary)
              .where('districtId', '==', this.props.teacherBaseProps.teacher.districtId)
              .where('schoolId', '==', this.props.teacherBaseProps.teacher.schoolId)
              .where('shardIndex', '==', shardIndex)
              .get()
          )

          shardPromises.push(db.collection(ColType.districtSummary)
              .where('districtId', '==', this.props.teacherBaseProps.teacher.districtId)
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

            console.log("schoolSummaryRef", schoolSummaryRef, 
            "districtSummaryRef", districtSummaryRef)
            if (!schoolSummaryRef || !districtSummaryRef) return
            console.log("school and district exist")

            var transactionPromises = []
            transactionPromises.push(
              db.runTransaction((transaction) => {
                  return transaction.get(schoolSummaryRef).then((schoolSummaryDoc) => {
                      if (!schoolSummaryDoc.exists) {
                          throw new Error("School summary document does not exist!")
                      }
                      
                      var schoolSummaryData = schoolSummaryDoc.data()
                      schoolSummaryData.summary = decompress(schoolSummaryData.summary)

                      var isDistrict = false
                      var iep = this.props.teacherBaseProps.IEPDict[IEPId]
                      var subject = iep.iep.mainSubject
                      var docToBeDeleted = {
                        totalMeasurements: iep.totalMeasurements, 
                        onTrack: iep.onTrack
                      }

                      schoolSummaryData = decrementSummary(docToBeDeleted, iep.iep, 
                        schoolSummaryData, grade, subject, raceOrEthnicity, 
                        this.props.teacherBaseProps.school, isDistrict)

                      schoolSummaryData.summary = compress(schoolSummaryData.summary)
                      return transaction.update(schoolSummaryRef, schoolSummaryData)
                  })
              })
            )
            transactionPromises.push(
              db.runTransaction((transaction) => {
                  return transaction.get(districtSummaryRef).then((districtSummaryDoc) => {
                      if (!districtSummaryDoc.exists) {
                          throw new Error("District summary document does not exist!")
                      }
      
                      var districtSummaryData = districtSummaryDoc.data()
                      districtSummaryData.summary = decompress(districtSummaryData.summary)

                      var isDistrict = true
                      var iep = this.props.teacherBaseProps.IEPDict[IEPId]
                      var subject = iep.iep.mainSubject
                      var docToBeDeleted = {
                        totalMeasurements: iep.totalMeasurements, 
                        onTrack: iep.onTrack
                      }

                      districtSummaryData = decrementSummary(docToBeDeleted, iep.iep, 
                        districtSummaryData, grade, subject, raceOrEthnicity, 
                        this.props.teacherBaseProps.school, isDistrict)

                      districtSummaryData.summary = compress(districtSummaryData.summary)
                      return transaction.update(districtSummaryRef, districtSummaryData)
                  })
              })
            )

            Promise.all(transactionPromises)
            .then(() => {
              // school and district have been decremented, and all iep related
              // data has been deleted, now delete the iep goal
              console.log("All promises succeeded.")
              db.collection(ColType.iep).doc(IEPId)
                .delete()
                .then(() => {
                  successMessage("IEP goal has been successfully deleted.")
                })
                .catch(() => {
                  errorMessage("Something went wrong deleting the IEP goal.")
                })
            })
          })
      })
      .catch((error) => {
        console.log("All promises did not succeed", error)
        errorMessage("Something went wrong deleting data related to the IEP goal.")
      })
  }

  render() {
    return(
      <div>
        <Layout className="content layout-header-mt">
          <Layout>
            <Content className="layout-content">
              <div className="sub-menu-width m-lr-auto">
                {this.props.teacherBaseProps.teacher && this.state.student ?
                  <Row gutter={32}>
                    <Col span={7} className="border-right">
                      <PersonAvatar
                        person={this.state.student}
                        size={'large'}
                        containerClassName="font-20 mb-2"
                        avatarClassName="avatar-very-large2"
                        personClassName="font-bold"
                      />
                      <div className="font-16 font-bold text-muted mb-1">
                        Grade: {this.state.student.grade}
                      </div>
                      <div className="font-16 font-bold text-muted mb-1">
                        Gender: {this.state.student.gender}
                      </div>
                      {this.state.student.hasOwnProperty('accommodations') ?
                      <div>
                        <div 
                          className={"font-16 font-bold mb-1 "+
                          "pb-1 mt-2 border-bottom inline-block"}>
                          Accommodations
                        </div>
                        {this.state.student.accommodations.hasOwnProperty('instructionBarrier') ? 
                          <div className="font-16 mb-2">
                            <div className="mb-05 font-bold">
                            Strategy to overcome instructional barrier:</div>
                            <div className="inline-block">
                              {this.state.student.accommodations.instructionBarrier}.
                            </div>
                          </div> 
                        :
                        ''}

                        {this.state.student.accommodations.hasOwnProperty('engagementBarrier') ? 
                          <div className="font-16 mb-2">
                            <div className="mb-05 font-bold">
                            Strategy to overcome engagement barrier:</div>
                            <div className="inline-block">
                              {this.state.student.accommodations.engagementBarrier}.
                            </div>
                          </div> 
                        :
                        ''}
    
                        {this.state.student.accommodations.hasOwnProperty('organizationBarrier') ? 
                          <div className="font-16 mb-2">
                            <div className="mb-05 font-bold">
                            Strategy to overcome organizational barrier:</div>
                            <div className="inline-block">
                              {this.state.student.accommodations.organizationBarrier}.
                            </div>
                          </div> 
                        :
                        ''}

                      </div>
                      : ''}
                      {this.state.student.hasOwnProperty('removalStatement') ?
                        <div>
                          <div 
                            className={"font-16 font-bold mb-1 "+
                            "pb-1 mt-2 border-bottom inline-block"}>
                            Removal Statement
                          </div>
                          <div className="font-16 mb-2">
                            {this.state.student.removalStatement}
                          </div>
                       </div> 
                      : ''}
                      <Button
                        size={'default'}
                        disabled={this.props.teacherBaseProps.readOnly}
                        className="mb-2 mt-2 up-hover"
                        onClick={(e) => this.linkToEdit(e)}
                      >
                        <Icon type="edit" />
                        Update Information
                    </Button>
                    </Col>
                    <Col span={17} className="pl-4">
                      <div>
                        {/**<Link
                          to={'/teacher/add-goal-student/' +
                            this.props.teacherBaseProps.teacher.id + '?student=' + 
                            this.state.student.id}
                          className={"inline-flex flex-center up-hover" +
                            " ant-btn" +
                            " ant-btn-dashed relative parent-hover btn-vl mr-2"}
                        >
                          <Icon type="plus" className="mr-1" />
                          Draft IEP Goal
                      </Link>
                        <Link
                          to={'/teacher/student-report/' +
                      this.props.teacherBaseProps.teacher.id + '?student=' + this.state.student.id}
                          className={"inline-flex flex-center up-hover" +
                            " ant-btn" +
                            " ant-btn-dashed relative parent-hover btn-vl mr-2"}
                        >
                          <Icon type="solution" className="mr-1" />
                          Get Printable Report
                      </Link>*/}
                        <h2 className="pb-2 mb-0 border-bottom pl-4">
                          IEP Goals
                        </h2>
                        {this.props.teacherBaseProps.IEPGoals && 
                        this.props.teacherBaseProps.IEPGoals
                        .filter(g => g.studentId === this.state.studentId).length === 0 ?
                          <div className="font-20 mt-2 mb-1 pl-4 relative">
                            <div className="absolute-tl pl-4 font-24">
                              <Icon type="exclamation-circle-o" 
                              className="text-primary va-text-top" />
                            </div>
                            <div className="inline-block ml-4 pl-1">
                              <div className="mb-4">No IEP Goals have been drafted yet.</div>
                              <Link
                                to={'/teacher/add-goal-student/' +
                                  this.props.teacherBaseProps.teacher.id + 
                                  '?student=' + this.state.student.id}
                                className={"inline-flex flex-center flex-h-center up-hover w-100" +
                                  " ant-btn" +
                                  " ant-btn-primary relative parent-hover btn-vl mr-2"}
                              >
                                <Icon type="plus" className="mr-1" />
                                Draft IEP Goals
                            </Link>
                            </div>
                          </div>
                          : ''}
                        {this.props.teacherBaseProps.IEPGoals && 
                        this.props.teacherBaseProps.IEPGoals.map((IEPGoal, index) => {
                          var iep = IEPGoal
                          var requiresAction = IEPGoal.requiresAction
                          var completionDateRequiresAction = IEPGoal.completionDateRequiresAction
                          if (iep.studentId !== this.state.studentId) return false

                          console.log(IEPGoal)
                          return <Link
                            to={{
                              pathname: '/teacher/progress-monitoring/' + 
                              this.props.teacherBaseProps.teacher.id,
                              search: '?student=' + this.state.student.id + '&iep=' + iep.id
                            }}
                            key={'iep-' + iep.id}
                            className={"no-text-decoration inline-block w-100 h-100 ant-btn" +
                              " text-left font-20 p-4 pt-2 pb-2 shadow-hover right-hover-parent" +
                              " mt-2 up-hover parent-hover relative"}
                          >
                            <div>
                              <div className="pt-1 pr-4 absolute-tr show-on-parent-hover">
                                <Popconfirm
                                  title="Are you sure you want to delete this IEP goal?"
                                  onConfirm={(e) => this.deleteIEP(e, iep.id)}
                                  onCancel={(e) => e.preventDefault()}
                                  okText="Yes" cancelText="No">
                                  <Button className="transparent-btn font-20">
                                    <Icon type="close" />
                                  </Button>
                                </Popconfirm>
                              </div>
                              <div className="font-16">
                                {requiresAction || completionDateRequiresAction  ?
                                  <div>
                                    {requiresAction ?
                                      <div className="text-danger">
                                        <Icon type="warning" className="mr-1"/>
                                        Action required - This IEP goal needs a new measurement.
                                      </div>
                                    : ''}

                                    {completionDateRequiresAction ?
                                      <div className="text-danger">
                                        <Icon type="info-circle-o" className="mr-1"/>
                                        Annual review coming up.
                                      </div>
                                    : ''}
                                  </div>
                                :
                                  <span className="text-success">
                                    <Icon type="check" className="mr-1" />
                                    No action required.
                                  </span>
                                }
                              </div>
                              <div className="mr-1 ellipsis">
                                {capitalizeFirstChar(iep.iep.standardDescription)}
                              </div>
                              {/**<span
                            className="float-right va-middle"
                          >
                            <Icon type="area-chart" className="mr-1" />
                            <span className="mr-1">Monitor Progress</span>
                            <Icon type="arrow-right" className="right-hover-child"/>
                          </span>*/}
                            </div>
                          </Link>
                        })
                        }

                      </div>
                    </Col>
                  </Row>
                  : ''}
              </div>
            </Content>

          </Layout>
        </Layout>
        <CustomFooter />
      </div >
    )
  }
}

export default TeacherStudent