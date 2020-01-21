import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import { db } from '../firebase/Firebase'
import TeacherSider from './TeacherSider'
import { flattenDoc, getIDFromURL, getInitials } from '.././Util'
import ColType from '.././Types'
import { Layout, Button, Icon, Avatar, Table } from 'antd'
const { Content, Footer } = Layout

class TeacherIEPGoals extends Component {
  state = {
    teacherId: '',
    teacher: null,
    students: [],
    school: null,
    IEPGoals: [],
    studentIEPStatus: [],
    profileMode: 1,
  }

  // Do fetch here
  componentDidMount() {
    var teacherId = getIDFromURL(window.location)
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
        }, () => {
          db.collection(ColType.iep)
            .where('teacherId', '==', teacherId)
            .orderBy('timeStamp', 'desc')
            .get()
            .then((querySnapshot) => {
              var IEPGoals = []
              querySnapshot.forEach((doc) => {
                console.log("iep " + doc.id, ' => ', doc.data())
                IEPGoals.push(flattenDoc(doc))
              })

              this.setState({
                IEPGoals: IEPGoals,
              }, () => {
                var studentIEPStatus = []
                this.state.students.forEach((student) => {
                  studentIEPStatus.push({student: student, hasIEP: false})
                })
                this.state.IEPGoals.forEach((IEPGoal) => {
                  var student = this.state.students.filter(s => s.id === IEPGoal.studentId)[0]
                  studentIEPStatus.forEach(studentStatus => {
                    if (studentStatus.student === student) {
                      studentStatus.hasIEP = true
                    }
                  })
                })

                this.setState({
                  studentIEPStatus: studentIEPStatus,
                })
              })
            })
        })
      })
    
  }

  linkToIEP(path) {
    window.location.href = path
  }

  changeProfileMode = (newProfileMode) => {
    this.setState({
      profileMode: newProfileMode,
    })
  }

  handleClick = (e) => {
    console.log('click ', e)
    this.setState({
      profileMode: parseInt(e.key, 10),
    })
  }

  render() {    
    const iepColumns = [
        {
          title: 'Student',
          dataIndex: 'iep',
          key: 'name',
          render: (text, IEPGoal ) => (
            <div>
              <Avatar 
              size="large" 
              className="mr-8" 
              style={{ backgroundColor: 
              this.state.students.filter(s => s.id === IEPGoal.studentId)[0].avatarColor}}
              >
                {getInitials(this.state.students.filter(s => s.id === IEPGoal.studentId)[0])}
              </Avatar>
              <span className="vertical-align-middle">
                {this.state.students.filter(s => s.id === IEPGoal.studentId)[0].firstName + " " + 
                this.state.students.filter(s => s.id === IEPGoal.studentId)[0].lastName}
              </span>
            </div>
          ),
        },
        {
          title: 'Grade',
          dataIndex: 'iep',
          key: 'grade',
          render: (text, IEPGoal ) => (
            <span>{this.state.students.filter(s => s.id === IEPGoal.studentId)[0].grade}</span>
          ),
        },
        {
          title: 'IEP Goal',
          dataIndex: 'iep',
          key: 'age',
          render: (text, IEPGoal ) => (
            <span>{IEPGoal.iep.st + ' ' + IEPGoal.iep.grade + '.' + 
            IEPGoal.iep.stnum + " - " + IEPGoal.iep.bigIdea}</span>
          ),
        },
        {
          title: 'Progress Monitoring',
          dataIndex: 'iep',
          key: 'action',
          render: (text, IEPGoal ) => (
            <Button href={'/teacher/progress-monitoring/' + 
            this.state.teacherId + '?iep=' + IEPGoal.id} 
            type={'primary'}
            >
              <Icon type="dot-chart" />View Progress Report
            </Button>
          ),
        },
      ]

    return (
      <div>
        <Layout>
          <TeacherSider 
            teacher={this.state.teacher} 
            activeIdx={'3'} 
            iepGoals={this.state.IEPGoals} 
            students={this.state.students}
          >
          </TeacherSider>
            <Layout style={{ marginLeft: 250, marginTop: 64 }}>
            <Content className="layout-content">
                <div style={{ background: '#fff' }}>
                    <Table
                    pagination={false}
                    columns={iepColumns} 
                    dataSource={this.state.IEPGoals} 
                    />
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

export default TeacherIEPGoals