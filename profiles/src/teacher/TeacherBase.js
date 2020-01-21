import React, { Component } from 'react'
import { Route} from 'react-router-dom'
import TeacherHome from './TeacherHome'
import TeacherClassStatus from './TeacherClassStatus'
import TeacherReports from './reports/TeacherReports'
import TeacherStudent from './student/TeacherStudent'
import Scheduler from './scheduler/Scheduler'
import ProgressMonitoring from './progressmonitoring/ProgressMonitoring'
import StudentReport from './reports/StudentReport'
import '../styles/GlobalStyle.css'
import { firebase, db } from '../firebase/Firebase'
import TeacherHeader from '../login/TeacherHeader'
import AdminHeader from '../login/AdminHeader'
import SchoolAdminHeader from '../login/SchoolAdminHeader'
import VideoContainer from '../video/VideoContainer'
import { flattenDoc, getURLSplitArray, linkAfterLogin } from '../Util'
import ColType from '../Types'
import { Layout } from 'antd'
const moment = require('moment')
const Promise = require("bluebird")

const TeacherHomeComponent = (props, state) => {
  return <TeacherHome teacherBaseProps={state} {...props} />
}

const TeacherClassComponent = (props, state) => {
  return <TeacherClassStatus teacherBaseProps={state} {...props} />
}

const TeacherReportsComponent = (props, state) => {
  return <TeacherReports teacherBaseProps={state} {...props} />
}

const TeacherStudentComponent = (props, state) => {
  return <TeacherStudent teacherBaseProps={state} {...props} />
}

const TeacherSchedulerComponent = (props, state) => {
  return <Scheduler teacherBaseProps={state} {...props} />
}

const TeacherProgressMonitoringComponent = (props, state) => {
  return <ProgressMonitoring teacherBaseProps={state} {...props} />
}

const TeacherStudentReportComponent = (props, state) => {
  return <StudentReport teacherBaseProps={state} {...props} />
}


class TeacherBase extends Component {
  state = {
    teacherId: '',
    teacher: null,
    students: null,
    studentDict: null,
    school: null,
    grades: null,
    IEPGoals: null,
    IEPDict: null,
    studentRequiresAction: null,
    calendarEvents: null,
    calendarDict: null,
    events: null,
    IEPScheduled: null,
    currentTimeStamp: null,
    adminBaseProps: null,
    schoolAdminBaseProps: null,
    readOnly: false,
    pathId: '',
    headerKey: '',
    snapshotListeners: {},   
  }

  // Do fetch here
  componentDidMount() {
    console.log('Base mount')
    var split = getURLSplitArray(window.location)
    var pathId = split[split.length - 2]
    var teacherId = split[split.length - 1]
    
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        db.collection(ColType.users)
        .doc(user.uid)
        .get()
        .then((doc) => { 
          var userObj = doc.data()
          userObj.id = doc.id
          userObj.uid = user.uid
          userObj.signedIn = true
          console.log(userObj.accessLevel)
          // if the user is not a teacher, see if we have the adminBaseProps state
          // which is passed via Link when the admin clicks on this teacher.
          // If we don't have it (user refreshes the page for example so the state
          // from Link is gone, then redirect to admin/home). Not ideal, but probably fine.
          if (userObj.accessLevel !== 'teachers') {
            // if we have adminBaseProps via Link state, set it.
            if (this.props &&
              this.props.hasOwnProperty('location') && this.props.location &&
              this.props.location.hasOwnProperty('state') && this.props.location.state && 
              this.props.location.state.hasOwnProperty('adminBaseProps')) {
              this.setState({
                adminBaseProps: this.props.location.state.adminBaseProps,
                readOnly: true,
              })
            }
            else if (this.props &&
              this.props.hasOwnProperty('location') && this.props.location &&
              this.props.location.hasOwnProperty('state') && this.props.location.state && 
              this.props.location.state.hasOwnProperty('schoolAdminBaseProps')) {
              this.setState({
                schoolAdminBaseProps: this.props.location.state.schoolAdminBaseProps,
                readOnly: true,
              })
            }
            // else get the user's accessLevel (admin) information and link back to their home
            // page.
            else {
              db.collection(userObj.accessLevel)
                .doc(userObj.refId)
                .onSnapshot((doc) => {
                  var userJobInfo = flattenDoc(doc)
                  console.log(userObj, userJobInfo)
                  linkAfterLogin(userObj, userJobInfo)
                })
            }
          }
          else {
            this.setState({
              readOnly: false,
            })
          }
        })
      } 
      else {
        // No user is signed in.
        this.props.history.push(
         {
           pathname: '/sign-in/'
         }
        )
      }
    })

    this.setState({
      pathId: pathId,
      teacherId: teacherId,
    })

    new Promise((resolve, reject) => {
      db.collection(ColType.time)
      .doc(teacherId)
      .set({ time: firebase.firestore.FieldValue.serverTimestamp() })
      .then(() => {
        db.collection(ColType.time)
          .doc(teacherId)
          .get()
          .then((doc) => {
            var currentTimeStamp = flattenDoc(doc)
            currentTimeStamp = moment.utc(currentTimeStamp.time)
            this.setState({
              currentTimeStamp: currentTimeStamp,
            }, () => {
              resolve()
            })
          })
        })
    }).then(() => {
      return new Promise((resolve, reject) => {
        var districtId
        var schoolId
        // admin has no school
        if (this.state.adminBaseProps) {
          districtId = this.state.adminBaseProps.admin.districtId
        }
        else if (this.state.schoolAdminBaseProps) {
          districtId = this.state.schoolAdminBaseProps.schoolAdmin.districtId
          schoolId = this.state.schoolAdminBaseProps.schoolAdmin.schoolId
        }

        console.log('teacherId', teacherId, 'districtId', districtId, 'schoolId', schoolId)

        // school admin's query
        if (districtId && schoolId) {
          db.collection(ColType.teacher)
          .where(firebase.firestore.FieldPath.documentId(), '==', teacherId)
          .where('schoolId', '==', schoolId)
          .where('districtId', '==', districtId)
          .get()
          .then((querySnapshot) => {
            console.log('query len', querySnapshot.empty)
            var doc = querySnapshot.docs[0]
            console.log(doc, doc.id, doc.data())
            var teacher = flattenDoc(doc)
            console.log('Admin teacher', teacher)
            this.setState({
              pathId: pathId,
              teacherId: teacherId,
              teacher: teacher,
            }, () => {
              console.log("Reached teacher", this.state.teacher)
              resolve()
            })
          })
        }
        // admin's query
        else if (districtId) {
          db.collection(ColType.teacher)
          .where(firebase.firestore.FieldPath.documentId(), '==', teacherId)
          .where('districtId', '==', districtId)
          .get()
          .then((querySnapshot) => {
            console.log('query len', querySnapshot.empty)
            var doc = querySnapshot.docs[0]
            console.log(doc, doc.id, doc.data())
            var teacher = flattenDoc(doc)
            console.log('Admin teacher', teacher)
            this.setState({
              pathId: pathId,
              teacherId: teacherId,
              teacher: teacher,
            }, () => {
              console.log("Reached teacher", this.state.teacher)
              resolve()
            })
          })
        }
        // teacher's query
        else {
          db.collection(ColType.teacher)
          .doc(teacherId)
          .get()
          .then((doc) => {
            var teacher = flattenDoc(doc)
            this.setState({
              pathId: pathId,
              teacherId: teacherId,
              teacher: teacher,
            }, () => {
              resolve()
            })
          })
        }
        
      })
    }).then(() => {
      return new Promise((resolve, reject) => {
        var iepListener = db.collection(ColType.iep)
          .where('teacherId', '==', teacherId)
          .where('schoolId', '==', this.state.teacher.schoolId)
          .where('districtId', '==', this.state.teacher.districtId)
          .orderBy('timeStamp', 'desc')
          .onSnapshot((querySnapshot) => {
            var IEPGoals = []
            var IEPDict = {}
            var studentRequiresAction = {}
            querySnapshot.forEach((doc) => {
              var iep = flattenDoc(doc)
              IEPDict[iep.id] = iep
              var latestMeasurementTimeStamp = moment.utc(iep.latestMeasurementTimeStamp)
              var twoWeeksAfterLatestMeasurement = 
              moment.utc(latestMeasurementTimeStamp).add(2, 'weeks')
              var completionDate = moment.utc(iep.iep.completionDate, "YYYY-MM-DD")
              var sixWeeksToCompletionDate = moment.utc(completionDate).subtract(6, 'weeks')

              var requiresAction = 
              this.state.currentTimeStamp.isAfter(twoWeeksAfterLatestMeasurement)
              
              var completionDateRequiresAction = 
              this.state.currentTimeStamp.isAfter(sixWeeksToCompletionDate)

              if (requiresAction) iep.requiresAction = true
              if (completionDateRequiresAction) iep.completionDateRequiresAction = true
              if (!(studentRequiresAction.hasOwnProperty(iep.studentId))) {
                studentRequiresAction[iep.studentId] = {
                  newMeasurementNeeded: false,
                  completionDateUpcoming: false,
                }
              }
              
              if (!studentRequiresAction[iep.studentId].newMeasurementNeeded) {
                studentRequiresAction[iep.studentId].newMeasurementNeeded = requiresAction
              }
              if (!studentRequiresAction[iep.studentId].completionDateUpcoming) {
                studentRequiresAction[iep.studentId]
                  .completionDateUpcoming = completionDateRequiresAction
              }

              IEPGoals.push(iep)
            })

            // update calendar scheduled events with new iep calls 
            // if the calendar has already run once (i.e. this.state.IEPSscheduled)
            // has a value
            if (this.state.IEPScheduled) {
              var IEPScheduled = this.state.IEPScheduled

              IEPGoals.map((iep, index) => {
                IEPScheduled['total'].scheduledRequired += iep.iep.service.days
                return IEPScheduled[iep.id] = {
                  scheduledActual: 0,
                  scheduledRequired: iep.iep.service.days,
                }
              })

              this.state.events && this.state.events.map((event, index) => {
                return event.ieps.map((iepObj, index) => {
                  if (IEPScheduled.hasOwnProperty(iepObj.iepId)) {
                    IEPScheduled[iepObj.iepId].scheduledActual += 1
                    IEPScheduled['total'].scheduledActual += 1
                  }
                  return false
                })
              })

              this.setState({
                IEPScheduled: IEPScheduled,
              })
            }

            this.setState({
              IEPGoals: IEPGoals,
              IEPDict: IEPDict,
              studentRequiresAction: studentRequiresAction,
            }, () => {
              resolve()
            })
        })

        var snapshotListeners = this.state.snapshotListeners
        // if this ever happens, unsubscribe old listener before setting the new one
        if (snapshotListeners.hasOwnProperty('iepListener')) {
          snapshotListeners['iepListener']()
        }
        snapshotListeners['iepListener'] = iepListener
        this.setState({
          snapshotListeners: snapshotListeners
        })
      })
    }).then(() => {
      return new Promise((resolve, reject) => {
        var calendarEventsListener = db.collection(ColType.calendarEvents)
          .where('teacherId', '==', teacherId)
          .where('schoolId', '==', this.state.teacher.schoolId)
          .where('districtId', '==', this.state.teacher.districtId)
          .orderBy('startTime')
          .orderBy('index')
          .orderBy('duration', 'desc')
          .onSnapshot((querySnapshot) => {
            console.log('calendar query', this.state.IEPGoals.length)
            var calendarEvents = []
            var calendarDict = {}
            var IEPScheduled = {
              total: {
                scheduledActual: 0,
                scheduledRequired: 0,
              }
            }
            var events = []
            var idx = 0

            this.state.IEPGoals.map((iep, index) => {
              IEPScheduled['total'].scheduledRequired += iep.iep.service.days
              return IEPScheduled[iep.id] = {
                scheduledActual: 0,
                scheduledRequired: iep.iep.service.days,
              }
            })

            querySnapshot.forEach((doc) => {
              if (!doc.exists) return
              var event = flattenDoc(doc)
              calendarEvents.push(flattenDoc(doc))
              var start = moment.utc(event.startTime)
              var end = new Date(event.endTime)
              //start = new Date(2015, 5, parseInt(event.day, 10),
              //  start.getHours(), start.getMinutes(), 0)
              end = new Date(2015, 5, parseInt(event.day, 10),
                end.getHours(), end.getMinutes(), 0)
              event.start = start
              event.end = end

              events.push(event)
              calendarDict[idx.toString()] = {
                'flattenedDoc': event,
                'unFlattenedDoc': doc.data()
              }

              event.ieps.map((iepObj, index) => {
                if (IEPScheduled.hasOwnProperty(iepObj.iepId)) {
                  IEPScheduled[iepObj.iepId].scheduledActual += 1
                  IEPScheduled['total'].scheduledActual += 1
                }
                return false
              })

            })

            this.setState({
              calendarEvents: calendarEvents,
              calendarDict: calendarDict,
              events: events,
              IEPScheduled: IEPScheduled,
            }, () => {
              resolve()
            })
          })
        
        var snapshotListeners = this.state.snapshotListeners
        // if this ever happens, unsubscribe old listener before setting the new one
        if (snapshotListeners.hasOwnProperty('calendarEventsListener')) {
          snapshotListeners['calendarEventsListener']()
        }
        snapshotListeners['calendarEventsListener'] = calendarEventsListener
        this.setState({
          snapshotListeners: snapshotListeners
        })
      })
    }).then(() => {

    

    console.log("Teacher", this.state.teacher)

    db.collection(ColType.school)
      .doc(this.state.teacher.schoolId)
      .get()
      .then((doc) => {
        var school = flattenDoc(doc)
        
        this.setState({
          school: school,
        })
      })
      

    var studentListener = db.collection(ColType.student)
      .where('teacherId', '==', teacherId)
      .where('schoolId', '==', this.state.teacher.schoolId)
      .where('districtId', '==', this.state.teacher.districtId)
      .orderBy('grade', 'desc')
      .onSnapshot((querySnapshot) => {
        var students = []
        var studentDict = {}
        var grades = new Set()
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            var student = flattenDoc(doc)
            students.push(student)
            studentDict[doc.id] = student
            grades.add(student.grade)
          }
        })

        students.sort((a, b) => {
          if (a.grade === 'K' && b.grade === 'K') {
            if (a.lastName.charAt(0) > b.lastName.charAt(0)) {
              return 1
            } else {
              return -1
            }
          }
          if (a.grade === 'K' && b.grade !=='K') return -1
          if (a.grade !== 'K' && b.grade === 'K') return 1
          if (a.grade === b.grade) {
            if (a.lastName.charAt(0) > b.lastName.charAt(0)) {
              return 1
            } else {
              return -1
            }
          }
          var aGrade = parseInt(a.grade, 10)
          var bGrade = parseInt(b.grade, 10)
          if (aGrade > bGrade) return 1
          if (bGrade > aGrade) return -1
          return 0
        })

        grades = Array.from(grades).sort((a, b) => {
          if (a === 'K' && b === 'K') return 1
          if (a === 'K' && b !=='K') return -1
          if (a !== 'K' && b === 'K') return 1
          a = parseInt(a, 10)
          b = parseInt(b, 10)
          if (a > b) return 1
          if (b > a) return -1
          return 0
        })

        this.setState({
          students: students,
          studentDict: studentDict,
          grades: grades,
        })
      })

    
    var snapshotListeners = this.state.snapshotListeners
    // if this ever happens, unsubscribe old listener before setting the new one
    if (snapshotListeners.hasOwnProperty('studentListener')) {
      snapshotListeners['studentListener']()
    }
    snapshotListeners['studentListener'] = studentListener
    this.setState({
      snapshotListeners: snapshotListeners
    })
  })
  }

  componentWillUnmount() {
    // unsubscribe listeners
    if (this.state.snapshotListeners.hasOwnProperty('iepListener')) {
      this.state.snapshotListeners['iepListener']()
    }
    if (this.state.snapshotListeners.hasOwnProperty('calendarEventsListener')) {
      this.state.snapshotListeners['calendarEventsListener']()
    }
    if (this.state.snapshotListeners.hasOwnProperty('studentListener')) {
      this.state.snapshotListeners['studentListener']()
    }
  }

  componentWillReceiveProps(props, newProps) {
    console.log("Base receive props")
    var split = getURLSplitArray(window.location)
    var pathId = split[split.length - 2]

    this.setState({
      pathId: pathId,
    })
  }

  componentWillUpdate(nextProps, nextState) {
    return true
  }

  render() {
    const { match: { url } } = this.props

    return (
      <Layout className={this.state.readOnly ? 'read-only' : ''}>
        {this.state.readOnly && this.state.adminBaseProps ?
          <AdminHeader 
            person={this.state.adminBaseProps.admin} 
            schools={this.state.adminBaseProps.schools}
            selectedKey={this.state.pathId}
            history={this.props.history}
          >
          </AdminHeader>
        : ''}

        {this.state.readOnly && this.state.schoolAdminBaseProps ?
          <SchoolAdminHeader 
            person={this.state.schoolAdminBaseProps.schoolAdmin} 
            selectedKey={this.state.pathId}
            history={this.props.history}
          >
          </SchoolAdminHeader>
        : ''}
        
        <TeacherHeader 
          readOnly={this.state.readOnly}
          person={this.state.teacher} 
          students={this.state.students}
          studentDict={this.state.studentDict}
          selectedKey={this.state.pathId}
          history={this.props.history}
        >
        </TeacherHeader>
       
        <VideoContainer readOnly={this.state.readOnly} />
        
        <Route path={`${url}/home/*`} render={props => TeacherHomeComponent(props, this.state)}  />
        <Route path={`${url}/class/*`} render={props => TeacherClassComponent(props, this.state)} />
        <Route path={`${url}/reports/*`} 
          render={props => TeacherReportsComponent(props, this.state)} />
        <Route path={`${url}/student/*`} 
          render={props => TeacherStudentComponent(props, this.state)} />
        <Route path={`${url}/schedule/*`} 
          render={props => TeacherSchedulerComponent(props, this.state)} />
        <Route path={`${url}/progress-monitoring/*`} 
          render={props => TeacherProgressMonitoringComponent(props, this.state)} />
        <Route path={`${url}/student-report/*`} 
          render={props => TeacherStudentReportComponent(props, this.state)} />
      </Layout>
    )
  }
}

export default TeacherBase