import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/GlobalStyle.css'
import { db } from '../../firebase/Firebase'
import TeacherSider from '.././TeacherSider'
import ColType from '../.././Types'
import { flattenDoc, getIDFromURL, getInitials, getQueryStringParam } from '../.././Util'
import { Layout, Icon, Avatar } from 'antd'
const { Content, Footer } = Layout

// Using this to add students until the step form for adding students is done.
class TeacherAddStudentContinue extends Component {
  state = {
    teacherId: '',
    teacher: null,
    student: null,
    students: [],
    submitting: false,
  }

  componentDidMount() {
    var teacherId = getIDFromURL(window.location)
    var studentId = getQueryStringParam('student')
    console.log(teacherId)

    this.setState({
      teacherId: teacherId,
    })

    db.collection(ColType.teacher)
      .doc(teacherId)
      .get()
      .then((doc) => {
        var teacher = flattenDoc(doc)
        this.setState({
          teacher: teacher
        })
      })

    db.collection(ColType.student)
      .doc(studentId)
      .get()
      .then((doc) => {
        var student = flattenDoc(doc)
        this.setState({
          student: student
        })
      })

    db.collection(ColType.student)
      .where('teacherId', '==', teacherId)
      .get()
      .then((querySnapshot) => {
        var students = []
        querySnapshot.forEach((doc) => {
          console.log(doc.id, ' => ', doc.data())
          students.push(flattenDoc(doc))
        })

        this.setState({
          students: students,
        })
      })
  }

  render() {
    return (
      <div>
      <Layout>
        <TeacherSider 
          teacher={this.state.teacher} 
          activeIdx={'5'} 
          iepGoals={this.state.IEPGoals} 
          students={this.state.students}
        >
        </TeacherSider>
          <Layout style={{ marginLeft: 250, marginTop: 132 }}>
          <Content className="layout-content">
            {this.state.teacher && this.state.student ?
            <div className="w-500 m-lr-auto">
              <h1 className="mb-3 pb-3 border-bottom">
                <Avatar 
                  size="large" 
                  className="mr-8 font-16" 
                  style={{ backgroundColor: this.state.student.avatarColor}}
                >
                  {getInitials(this.state.student)}
                </Avatar>
                <span className="vertical-align-middle">
                  {this.state.student.firstName + " " + this.state.student.lastName + ' '}
                  was successfully added!
                </span>
              </h1>
              <h2 className="mb-4">Would you like to add IEP Goals for this student?</h2>
              <Link 
                  to={'/teacher/add-goal-student/' + 
                  this.state.teacher.id + '?student=' +
                  this.state.student.id} 
                  className={"ant-btn login-form-button " +
                  "text-align-center ant-btn-primary ant-btn-lg mb-4 w-100"}>
                  <Icon type="plus-circle-o" className="mr-1" />
                  Add an IEP Goal for 
                  {" " + this.state.student.firstName + 
                  " " + this.state.student.lastName}
              </Link>
              <h2 className="mb-4">Or would you rather continue adding more students?</h2>
              <Link  
                  to={'/teacher/add-student/' + this.state.teacher.id} 
                  className={"ant-btn login-form-button " +
                  "text-align-center ant-btn-dashed ant-btn-lg mb-4 w-100"}>
                  <Icon type="user-add" className="mr-1" />
                  Add another student
              </Link>
            </div>
            : ''}
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

export default TeacherAddStudentContinue
