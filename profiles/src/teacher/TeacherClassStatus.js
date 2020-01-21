import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/GlobalStyle.css'
import { db } from '../firebase/Firebase'
import { flattenDoc, getInitials, getRandomShardIndex, 
  getNumShards, compress, decompress, decrementSummary } from '.././Util'
import ColType from '.././Types'
import CustomFooter from '../login/CustomFooter'
import { Layout, Icon, Avatar, Row, Col, Button, message, Popconfirm } from 'antd'
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

class TeacherClassStatus extends Component {
  state = {
   
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props)
  }

  // Do fetch here
  componentDidMount() {
    document.title = 'My Students - dot it'
    console.log(this.props)
  }

  deleteStudent = (e, studentId) => {
    e.preventDefault()
    loadingMessage("Deleting student. Please wait...")

      var promises = []

      db.collection(ColType.iep)
          .where('teacherId', '==', this.props.teacherBaseProps.teacherId)
          .where('studentId', '==', studentId)
          .orderBy('timeStamp', 'desc')
          .get()
          .then((querySnapshot) => {
            var IEPGoals = []
            querySnapshot.forEach((doc) => {
              IEPGoals.push(doc)
            })

            // delete all iep drafts that this student has before mapping over
            // the iep goals (order doesn't matter its just simpler this way)
            promises.push(new Promise((resolve, reject) => {
              db.collection(ColType.iepDrafts)
                .where('teacherId', '==', this.props.teacherBaseProps.teacher.id)
                .where('studentId', '==', studentId)
                .get()
                .then((querySnapshot) => {
                  var chunkPromises = []
                  var chunkedArray = chunk(querySnapshot.docs, 500)
                  chunkedArray.map((chunk, index) => {
                    return chunkPromises.push(new Promise((resolve, reject) => {
                      var batch = db.batch()
                      chunk.forEach(doc => {
                        if (!doc.exists) return
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
            )

            console.log("iep goals len,", IEPGoals.length)
            IEPGoals.map((iep, index) => {
              var IEPId = iep.id
              promises.push(new Promise.bind({IEPId: IEPId})
                .then(() => {
                  return new Promise((resolve, reject) => {
                    console.log('Calendar events - Promise IEPId', IEPId)
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
                                    var ieps = event.ieps
                                    ieps = ieps.filter(iepObj => iepObj.iepId !== IEPId)
        
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
                })
              }).then(() => {
                return new Promise((resolve, reject) => {
                  console.log('Promise IEPId', IEPId)
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
                            if (!doc.exists) return
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
                  console.log('Promise IEPId', IEPId)
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
                            if (!doc.exists) return
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
              })
            )

            return false
          })

          Promise.all(promises)
          .then(() => {
            if (!this.props.teacherBaseProps.studentDict.hasOwnProperty(studentId)) {
              errorMessage("Student to delete could not be found. " +
              "Please contact technical support.")
              return
            }
            var student = this.props.teacherBaseProps.studentDict[studentId]
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
                      IEPGoals.map((iepDoc, index) => {
                        var iep = flattenDoc(iepDoc)
                        var subject = iep.iep.mainSubject
                        var docToBeDeleted = {
                          totalMeasurements: iep.totalMeasurements, 
                          onTrack: iep.onTrack
                        }
                        return schoolSummaryData = decrementSummary(docToBeDeleted, iep.iep, 
                        schoolSummaryData, grade, subject, raceOrEthnicity, 
                        this.props.teacherBaseProps.school, isDistrict)
                      })

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
                      IEPGoals.map((iepDoc, index) => {
                        var iep = flattenDoc(iepDoc)
                        var subject = iep.iep.mainSubject
                        var docToBeDeleted = {
                          totalMeasurements: iep.totalMeasurements, 
                          onTrack: iep.onTrack
                        }
                        return districtSummaryData = decrementSummary(docToBeDeleted, iep.iep, 
                        districtSummaryData, grade, subject, raceOrEthnicity, 
                        this.props.teacherBaseProps.school, isDistrict)
                      })

                      districtSummaryData.summary = compress(districtSummaryData.summary)
                      return transaction.update(districtSummaryRef, districtSummaryData)
                  })
              })
            )
  
            Promise.all(transactionPromises)
              .then(() => {
                console.log('District and school transactions succeeded')
                // distrct and school summaries have been decremented, now delete iep goals
                var chunkPromises = []
                var chunkedArray = chunk(IEPGoals, 500)
                chunkedArray.map((chunk, index) => {
                    return chunkPromises.push(new Promise((resolve, reject) => {
                      var batch = db.batch()
    
                      chunk.forEach(doc => {
                        if (!doc.exists) return
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
                
                return Promise.all(chunkPromises)
                  .then(() => {
                  // delete student as all iep goals tied to the student 
                  // have been successfully deleted
                    console.log("All promises succeeded, in student delete")
    
                    // delete student
                    db.collection(ColType.student)
                    .doc(studentId)
                    .delete()
                    .then(() => {
                      // update student list by re-getting the students
                      db.collection(ColType.student)
                        .where('teacherId', '==', this.props.teacherBaseProps.teacherId)
                        .orderBy('grade', 'desc')
                        .get()
                        .then((querySnapshot) => {
                          var students = []
                          querySnapshot.forEach((doc) => {
                            students.push(flattenDoc(doc))
                          })
    
                          this.setState({
                            students: students,
                            componentMounted: true,
                          })
    
                          successMessage("The student has been successfully removed.")
                        })
                    })
                    .catch((error) => {
                      errorMessage('Failed to remove student.')
                    })
                  })
                  .catch((error) => {
                    console.log(error)
                    errorMessage("An error occurred when trying to delete a student.")
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
          .catch((error) => {
            console.log("Some promises was rejected (in promises.all). Error message:", error)
            errorMessage("An error occurred when trying to delete a student.")
          })
      
    })
  }

  render() {
    return (
      <div>
        <Layout className="content layout-header-mt">
          <Layout>
            <Content className="layout-content">
              <div className="sub-menu-width m-lr-auto">
                {this.props.teacherBaseProps.teacher ?
                <div>
                <h1 className="flex flex-v-center mb-3 pb-3 border-bottom">
                 <Icon type="user" className="mr-2 font-30" />
                 <span>My Students</span>
               </h1>
                <Row gutter={48} className="ml-0">
                  <Col span={8} className="pl-0">
                    <Link 
                      to={"/teacher/add-goal-start/" + this.props.teacherBaseProps.teacher.id}
                      disabled={this.props.teacherBaseProps.readOnly}
                      className={"w-100 br-4 h-150 up-hover" +
                       " shadow-hover flex-center mb-2 ant-btn ant-btn-primary"}
                    >
                        <div className="font-16 w-100 flex flex-h-center">
                          <Icon type="plus-circle-o" className="mr-2 font-30"/>
                          <span className="font-18">Draft an IEP</span>
                        </div>
                    </Link>
                  </Col>
                  {this.props.teacherBaseProps.students && 
                  this.props.teacherBaseProps.students.map((student, index) => {
                    return <Col span={8} key={'student-col-' + index} className="pl-0">
                        <Link 
                          to={'/teacher/student/' + 
                          this.props.teacherBaseProps.teacher.id + '?student=' + student.id}
                          className={"w-100 br-4 h-150 up-hover" +
                          " shadow-hover mb-2 ant-btn" +
                          " ant-btn-dashed relative parent-hover"}
                        >
                          <div className="w-100 h-100 flex flex-center">

                            <div className="absolute-tr p-1 pr-2 show-on-parent-hover">
                              <Popconfirm 
                                title="Are you sure you want to permanently delete this student?" 
                                onConfirm={(e) => this.deleteStudent(e, student.id)} 
                                onCancel={(e) => e.preventDefault()} 
                                okText="Yes" cancelText="No">
                               <Button className="transparent-btn font-20">
                              <Icon type="close" />
                            </Button>
                              </Popconfirm>
                            </div>

           
                            
                            <div className="w-100">
                              <div className="font-16 mb-2">
                                <Avatar 
                                  size="large" 
                                  className="mr-8" 
                                  style={{ backgroundColor: student.avatarColor}}
                                >
                                  {getInitials(student)}
                                </Avatar>
                                <div className="inline-block va-minus-14">
                                  <div>{student.firstName + " " + student.lastName}</div>
                                  <div className="text-align-left font-14 lh-14 text-muted">
                                    Grade: {student.grade}
                                  </div>
                                </div>
                              </div>
                              <div>
                              {this.props.teacherBaseProps.studentRequiresAction &&
                              this.props.teacherBaseProps.studentRequiresAction
                                .hasOwnProperty(student.id) ?
                                this.props.teacherBaseProps.studentRequiresAction[student.id]
                                .newMeasurementNeeded ?
                                  <div className="text-danger">
                                    <Icon type="warning" className="mr-1"/>
                                    Progress monitoring due.
                                  </div>
                                :
                                  <div className="text-success">
                                    <Icon type="check" className="mr-1"/>
                                    Progress monitoring up to date.
                                  </div>
                                : ''}
                                {this.props.teacherBaseProps.studentRequiresAction &&
                                this.props.teacherBaseProps.studentRequiresAction
                                .hasOwnProperty(student.id) &&
                                this.props.teacherBaseProps.studentRequiresAction[student.id]
                                .completionDateUpcoming ?
                                  <div className="text-danger">
                                    <Icon type="info-circle-o" className="mr-1"/>
                                    Annual review coming up.
                                  </div>
                                : ''}
                                {this.props.teacherBaseProps.studentRequiresAction &&
                                !this.props.teacherBaseProps.studentRequiresAction
                                .hasOwnProperty(student.id) ? 
                                  <span className="text-danger">
                                    <Icon type="warning" className="mr-1"/>
                                    Student needs an IEP.
                                  </span>
                                : ''}  
                                {!this.props.teacherBaseProps.studentRequiresAction ?
                                <div>
                                <div className="flex flex-h-center">
                                <div className="height-30px w-100px background-light-grey"></div>
                                </div>
                                </div>
                                : ''}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </Col>
                  })
                  }
                </Row>
                </div>
                : ''}
              </div>
            </Content>
            </Layout>
        </Layout>
        <CustomFooter />
      </div>
    )
  }
}

export default TeacherClassStatus