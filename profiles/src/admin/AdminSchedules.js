import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import { firebase, db } from '../firebase/Firebase'
import { flattenDoc, getIDFromURL, getInitials } from '.././Util'
import ColType from '.././Types'
import AdminSider from './AdminSider'
import { Layout, Select, Tabs, Avatar } from 'antd'
const Option = Select.Option
const { TabPane } = Tabs
const { Content, Footer } = Layout

class AdminSchedules extends Component {
  state = {
    user: {},
    admin: {},
    district: {},
    admins: [],
    schoolAdmins: [],
    teachers: [],
    students: [],
    schools: [],
    IEPGoals: [],
    IEPMeasurements: {},
    selectedJob: '',
    selectedSchoolId: '',
    selectedTeacherId: 'Show all',
    selectedStudentId: 'Show all',
    submitting: false,
    calendarEvents: {},
    calendarDict: {},
    events: {},
    componentMounted: false,
  }

  componentDidMount() {
    if(!(window.crypto && window.crypto.getRandomValues)) {
      alert("Your browser does not support a necessary feature. " +
      "Are you using Opera? Please change to any other browser and start again.")
    }

    var adminId = getIDFromURL(window.location)

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
          // User is signed in.
          console.log("signed in user", user)
          this.setState({
              user: user,
          })
      } else {
          console.log("signed out user", user)
          // User is signed out.
          this.setState({
              user: user,
          })
      }
    })

    db.collection(ColType.admin)
      .doc(adminId)
      .get()
      .then((doc) => {
        var admin = flattenDoc(doc)
        this.setState({
          admin: admin,
        }, () => {
          db.collection(ColType.district)
            .doc(admin.districtId)
            .get()
            .then((doc) => {
              var district = flattenDoc(doc)
              this.setState({
                district: district,
              })
            })
          
          db.collection(ColType.school)
            .where('districtId', '==', admin.districtId)
            .get()
            .then((querySnapshot) => {
              var schools = []
              querySnapshot.forEach((doc) => {
                console.log(doc.id, ' => ', doc.data())
                schools.push(flattenDoc(doc))
              })

              this.setState({
                schools: schools,
                selectedSchoolId: schools[0].id, // default school is the first one.
              })
            })

            db.collection(ColType.admin)
            .where('districtId', '==', admin.districtId)
            .get()
            .then((querySnapshot) => {
              var admins =[]
              querySnapshot.forEach((doc) => {
                console.log(doc.id, ' => ', doc.data())
                admins.push(flattenDoc(doc))
              })

              this.setState({
                admins: admins,
              })
            })

            db.collection(ColType.schoolAdmin)
            .where('districtId', '==', admin.districtId)
            .get()
            .then((querySnapshot) => {
              var schoolAdmins = []
              querySnapshot.forEach((doc) => {
                console.log(doc.id, ' => ', doc.data())
                schoolAdmins.push(flattenDoc(doc))
              })

              this.setState({
                schoolAdmins: schoolAdmins,
              })
            })

            db.collection(ColType.student)
            .where('districtId', '==', admin.districtId)
            .get()
            .then((querySnapshot) => {
              var students = []
              querySnapshot.forEach((doc) => {
                console.log(doc.id, ' => ', doc.data())
                students.push(flattenDoc(doc))
              })

              this.setState({
                students: students,
              }, () => {
                db.collection(ColType.teacher)
                .where('districtId', '==', admin.districtId)
                .get()
                .then((querySnapshot) => {
                  var teachers = []
                  querySnapshot.forEach((doc) => {
                    console.log(doc.id, ' => ', doc.data())
                    teachers.push(flattenDoc(doc))
                  })
    
                  this.setState({
                    teachers: teachers,
                  }, () => {
                    teachers.forEach((teacher, index) => {
                        db.collection(ColType.calendarEvents)
                            .doc(teacher.id)
                            .collection('events')
                            .get()
                            .then((querySnapshot) => {
                            var calendarEvents = []
                            var calendarDict = {}
                            var events = []
                            var idx = 0
                            querySnapshot.forEach((doc) => {
                                console.log("event idx = " + idx)
                                var flattenedDoc = flattenDoc(doc)
                                calendarEvents.push(flattenDoc(doc))
                                var start = new Date(flattenedDoc.startTime)
                                var end = new Date(flattenedDoc.endTime)
                                events.push({
                                id: idx,
                                title: flattenedDoc.title,
                                start: new Date(2015, 
                                                5, 
                                                parseInt(flattenedDoc.day, 10), 
                                                start.getHours(), 
                                                start.getMinutes(), 
                                                0),
                                end: new Date(2015, 
                                              5, 
                                              parseInt(flattenedDoc.day, 10), 
                                              end.getHours(), 
                                              end.getMinutes(), 
                                              0),
                                })
                                calendarDict[idx.toString()] = {
                                  'flattenedDoc': flattenedDoc, 
                                  'unFlattenedDoc': doc.data()
                                }
                                idx += 1
                            })
                            
                            var _calendarEvents = this.state.calendarEvents
                            var _calendarDict = this.state.calendarDict
                            var _events = this.state.events
                            _calendarEvents[teacher.id] = calendarEvents
                            _calendarDict[teacher.id] = calendarDict
                            _events[teacher.id] = events
                            this.setState({
                                calendarEvents: _calendarEvents,
                                calendarDict: _calendarDict,
                                events: _events,
                            }, () => {
                                if (index === teachers.length - 1) {
                                    this.setState({
                                        componentMounted: false,
                                    }, () => {
                                        this.setState({
                                            componentMounted: true,
                                        })
                                    })
                                }
                            })
                        })
                    })
                 })   
              })
            })
          })
         
      })
    })
    
  }

  schoolSelected = (value) => {
    this.setState({
      selectedSchoolId: value,
      selectedTeacherId: 'Show all',
      selectedStudentId: 'Show all',
    })
  }

  teacherSelected = (value) => {
    this.setState({
      selectedTeacherId: value,
    })
  }

  studentSelected = (value) => {
    this.setState({
      selectedStudentId: value,
    })
  }

  render() {
    return (
      <div>
        <Layout>
          <AdminSider admin={this.state.admin} activeIdx={'3'} subMenusOpen={['sub1']}></AdminSider>
            <Layout style={{ marginLeft: 250, marginTop: 64 }}>
              <Content className="layout-content">
                <div className="text-align-left">
                <h3 className="mb-4 mt-0">Teacher Schedules</h3>
                <h6 className="mb-4">{'Find the schedules for teachers ' +
                'in your district by selecting a school and teacher.'}</h6>
                <div className="g-col">
                <h5 className="inline-block mb-0 mr-4 va-minus-1 text-muted">Selected School</h5>
                  {this.state.schools.length > 0 ? 
                  <Select 
                    size={"large"} 
                    onChange={this.schoolSelected} 
                    defaultValue={this.state.schools.length > 0 ? 
                      this.state.schools[0].schoolName : 
                    ""} 
                    style={{width: '300px'}}>
                  {this.state.schools.map((school, index) => {
                    return <Option 
                              value={school.id} 
                              key={"school-" + index}>{school.schoolName}
                            </Option>          
                  })
                  }
                  </Select> : ""}
                </div>
         
                <Tabs className="standard-border text-align-left" defaultActiveKey={"teacher-0"}>
                  {this.state.teachers.map((teacher, index) => {
                    if (teacher.schoolId !== this.state.selectedSchoolId) return false

                    return <TabPane 
                      tab={
                        <span>
                          <Avatar size="small" 
                                  className="mr-8 font-16" 
                                  style={{ backgroundColor: teacher.avatarColor}}>
                            {getInitials(teacher)}
                          </Avatar>
                          <span className="vertical-align-middle font-16">
                            {teacher.firstName + " " + teacher.lastName}
                          </span>
                        </span>
                      } 
                      key={"teacher-" + index}
                    >
                      {this.state.componentMounted ?
                      /**<Schedule teacherId={teacher.id}
                        calendarEvents={this.state.calendarEvents[teacher.id]}
                        calendarDict={this.state.calendarDict[teacher.id]}
                        events={this.state.events[teacher.id]}
                        componentMounted={this.state.componentMounted}
                        students={this.state.students}
                      >
                      </Schedule>*/ '' : ''}
                    </TabPane>          
                    })
                  }
                </Tabs>   
              </div>
              </Content>
              <Footer style={{ textAlign: 'center' }}>
                  Copyright
              </Footer>
            </Layout>
        </Layout>
    </div>
    )
  }
}

export default AdminSchedules