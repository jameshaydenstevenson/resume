import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import { firebase, db } from '../firebase/Firebase'
import { flattenDoc, getIDFromURL, gradeText, getInitials } from '.././Util'
import ColType from '.././Types'
import AdminSider from './AdminSider'
import { Layout, Icon, Select,Avatar, Row, Col } from 'antd'
const Option = Select.Option
const { Content, Footer } = Layout

class AdminIEPGoals extends Component {
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
      .onSnapshot((doc) => {
        var admin = flattenDoc(doc)
        this.setState({
          admin: admin,
        }, () => {
          db.collection(ColType.district)
            .doc(admin.districtId)
            .onSnapshot((doc) => {
              var district = flattenDoc(doc)
              this.setState({
                district: district,
              })
            })
          
          db.collection(ColType.school)
            .where('districtId', '==', admin.districtId)
            .onSnapshot((querySnapshot) => {
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
            .onSnapshot((querySnapshot) => {
              var admins = []
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
            .onSnapshot((querySnapshot) => {
              var schoolAdmins = []
              querySnapshot.forEach((doc) => {
                console.log(doc.id, ' => ', doc.data())
                schoolAdmins.push(flattenDoc(doc))
              })

              this.setState({
                schoolAdmins: schoolAdmins,
              })
            })

            db.collection(ColType.teacher)
              .where('districtId', '==', admin.districtId)
              .onSnapshot((querySnapshot) => {
                var teachers = []
                querySnapshot.forEach((doc) => {
                  console.log(doc.id, ' => ', doc.data())
                  teachers.push(flattenDoc(doc))
                })

                this.setState({
                  teachers: teachers,
                })
              })

            db.collection(ColType.student)
              .where('districtId', '==', admin.districtId)
              .onSnapshot((querySnapshot) => {
                var students = []
                querySnapshot.forEach((doc) => {
                  console.log(doc.id, ' => ', doc.data())
                  students.push(flattenDoc(doc))
                })

                this.setState({
                  students: students,
                })
              })

            db.collection(ColType.iep)
              .where('districtId', '==', admin.districtId)
              .onSnapshot((querySnapshot) => {
                var IEPGoals = []
                querySnapshot.forEach((doc) => {
                  console.log("IEP", doc.id, ' => ', doc.data())
                  IEPGoals.push(flattenDoc(doc))
                })

                this.setState({
                  IEPGoals: IEPGoals,
                }, () => {
                  var IEPMeasurements = {}
                  IEPGoals.forEach((IEPGoal) => {
                    db.collection(ColType.iep)
                    .doc(IEPGoal.id)
                    .collection('measurements')
                    .orderBy('timeStamp')
                    .onSnapshot((querySnapshot) => {
                      console.log("MEASRUEMENTS")
                      var measurements = []
                      querySnapshot.forEach((doc) => {
                        console.log("Measurement", doc.id, ' => ', doc.data())
                        measurements.push(flattenDoc(doc))
                      })
      
                      if (measurements.length > 0) IEPMeasurements[IEPGoal.id] = measurements
                      else IEPMeasurements[IEPGoal.id] = []
      
                      this.setState({
                        IEPMeasurements: IEPMeasurements,
                        componentMounted: true,
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
          <AdminSider admin={this.state.admin} activeIdx={'2'} subMenusOpen={['sub1']}></AdminSider>
            <Layout style={{ marginLeft: 250, marginTop: 64 }}>
              <Content className="layout-content">
                <div className="text-align-left">
                <h3 className="mb-4 mt-0">District IEP Goals</h3>
                <h6 className="mb-4">
                  {'Displays the IEP Goals for your district. ' +
                  'You can select a school and filter by teacher and student.'}
                </h6>
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
                              key={"school-" + index}
                            >
                              {school.schoolName}
                            </Option>          
                  })
                  }
                  </Select> : ""}
                </div>
                <Row gutter={16} className="mb-4">
                  <Col className="gutter-row" span={8}>
                    <div className="g-col padding-25">
                    <Row gutter={16}>
                      <Col className="gutter-row mt-1px" span={12}>
                      <h2 className="mb-0 inline-block mr-3 text-muted">
                        {this.state.teachers.filter(t => t.schoolId === 
                          this.state.selectedSchoolId).length}
                      </h2>
                      <h5 className="mb-0 inline-block text-primary va-2">Teachers</h5>
                      </Col>
                      <Col className="gutter-row" span={12}>
                      <div className="w-100">
                        <Icon type="filter" className="mr-8 inline-block" />
                        <Select size={"large"} onChange={this.teacherSelected} 
                        defaultValue={this.state.selectedTeacherId} 
                        value={this.state.selectedTeacherId}
                        style={{width: 'calc(100% - 22px)'}}>
                        <Option value={"Show all"} key={"school-showall"}>Show all</Option>
                          {this.state.teachers.map((teacher, index) => {
                            if (teacher.schoolId !== this.state.selectedSchoolId) return false

                            return <Option value={teacher.id} key={"teacher-" + index}>
                            <div title={teacher.firstName + " " + teacher.lastName}>
                                <Avatar size="small" 
                                  className="mr-8 font-16" 
                                  style={{ backgroundColor: teacher.avatarColor}}
                                >
                                  {getInitials(teacher)}
                              </Avatar>
                              <span className="vertical-align-middle font-16">
                                {teacher.firstName + " " + teacher.lastName}
                              </span>
                              </div>
                                </Option>          
                              })
                          }
                        </Select>
                      </div>
                      </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col className="gutter-row" span={8}>
                  <div className="g-col padding-25">
                    <Row gutter={16}>
                      <Col className="gutter-row mt-1px" span={12}>
                      <h2 className="mb-0 inline-block mr-3 text-muted">
                        {this.state.students.filter(s => s.schoolId === 
                          this.state.selectedSchoolId).length}
                      </h2>
                      <h5 className="mb-0 inline-block text-primary va-2">Students</h5>
                      </Col>
                      <Col className="gutter-row" span={12}>
                      <div className="w-100">
                        <Icon type="filter" className="mr-8 inline-block" />
                        <Select size={"large"} onChange={this.studentSelected} 
                        defaultValue={this.state.selectedStudentId}
                        value={this.state.selectedStudentId}
                        style={{width: 'calc(100% - 22px)'}}>
                        <Option value={"Show all"} key={"school-showall"}>Show all</Option>
                          {this.state.students.map((student, index) => {
                            if (student.schoolId !== this.state.selectedSchoolId) return false

                            return <Option value={student.id} key={"teacher-" + index}>
                                <div title={student.firstName + " " + student.lastName}>
                                <Avatar size="small" 
                                className="mr-8 font-16" 
                                style={{ backgroundColor: student.avatarColor}}>
                                  {getInitials(student)}
                              </Avatar>
                              <span className="vertical-align-middle font-16">
                                {student.firstName + " " + student.lastName}
                              </span>
                              </div>
                                </Option>          
                              })
                          }
                        </Select>
                      </div>
                      </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col className="gutter-row" span={8}>
                    <div className="g-col padding-25" style={{height: '92px'}}>
                      <div className="mt-1px">
                      <h2 className="mb-0 inline-block mr-3">
                        {this.state.IEPGoals.filter(iep => iep.schoolId === 
                          this.state.selectedSchoolId).length}
                      </h2>
                      <h5 className="mb-0 inline-block text-primary va-2">IEP Goals</h5>
                    </div>
                    </div>
                  </Col>
                </Row>
                {this.state.IEPGoals.map((IEPGoal, index) => {
                  if (IEPGoal.schoolId !== this.state.selectedSchoolId) return false
                  if (this.state.selectedTeacherId !== 'Show all' && 
                  IEPGoal.teacherId !== this.state.selectedTeacherId) return false
                  if (this.state.selectedStudentId !== 'Show all' && 
                  IEPGoal.studentId !== this.state.selectedStudentId) return false

                  var teacher = this.state.teachers.filter(t => t.id === IEPGoal.teacherId)[0]
                  var student = this.state.students.filter(s => s.id === IEPGoal.studentId)[0]
                  return <div className="g-col p-0">
                  <div className="header">IEP Goal Information</div>
                  <div className="padding-15">
                  <Row gutter={16}>
                    <Col className="gutter-row" span={6}>
                      <div className="gutter-box g-col p-0">
                        <div className="header">Teacher</div>
                          <div className="padding-15">
                          <Avatar size="large" 
                          className="mr-8 font-16" 
                          style={{ backgroundColor: teacher.avatarColor}}>
                            {getInitials(teacher)}
                        </Avatar>
                        <span className="vertical-align-middle font-16">
                          {teacher.firstName + " " + teacher.lastName}
                        </span>
                        </div>
                      </div>
                      <div className="gutter-box g-col p-0">
                          <div className="header">Student</div>
                          <div className="padding-15">
                          <Avatar size="large" 
                            className="mr-8 font-16" 
                            style={{ backgroundColor: student.avatarColor}}>
                            {getInitials(student)}
                          </Avatar>
                        <span className="vertical-align-middle font-16">
                          {student.firstName + " " + student.lastName + ' - ' +
                        student.grade + gradeText(student.grade) + " Student"}
                        </span>
                        </div>
                      </div>
                      
                      <div className="gutter-box g-col p-0">
                        <div className="header">IEP Goal</div>
                        <div className="padding-15">
                          <div className="font-16 font-bold mb-2">
                            {IEPGoal ? 
                              IEPGoal.iep.st + ' ' + IEPGoal.iep.grade + '.' + 
                              IEPGoal.iep.stnum + " - " + IEPGoal.iep.bigIdea : 
                            ''}
                          </div>
                          <span className="font-16">
                            {IEPGoal ? IEPGoal.iepParagraph : ""}
                          </span>
                        </div>
                      </div>
                      </Col>
                      <Col className="gutter-row" span={18}>
                      {/**<ProgressChart IEPId={IEPGoal.id} 
                          measurements={globalThis.state.IEPMeasurements[IEPGoal.id]} 
                          parentComponentMounted={globalThis.state.componentMounted}
                          allowMeasurementAdding={false}>
                        </ProgressChart>*/}
                      </Col>
                    </Row>
                  </div>
                  </div>
                 
                })
                }
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

export default AdminIEPGoals