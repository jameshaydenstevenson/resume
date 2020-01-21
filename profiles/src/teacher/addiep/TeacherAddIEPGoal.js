import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'
import { db } from '../../firebase/Firebase'
import PersonHeader from '../../login/PersonHeader'
import ColType from '../.././Types'
import IEPEditAndConfirm from './IEPEditAndConfirm'
import { flattenDoc, getIDFromURL, getInitials, createIEPGoalText } from '../.././Util'
import { Layout, Avatar, Tag, Card, Select, Row, Col } from 'antd'
const { Content,  Footer } = Layout
const Option = Select.Option

class TeacherAddIEPGoal extends Component {
  state = {
    teacher: null,
    school: null,
    student: null,
    iep: null,
    students: [],
    iepChoices: [],
    studentIdx: -1,
    grade: '',
    subject: '',
    didSelectIEP: false,
  }

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
          teacher: teacher,
        }, () => {
          db.collection(ColType.school)
          .doc(this.state.teacher.schoolId)
          .onSnapshot((doc) => {
            //console.log(doc.id, ' => ', doc.data())
            var school = flattenDoc(doc)
            this.setState({
              school: school,
            })
          })
        })
      })

    db.collection(ColType.student)
      .where('teacherId', '==', teacherId)
      .get()
      .then((querySnapshot) => {
        var students = []
        querySnapshot.forEach((doc) => {
          //console.log(doc.id, ' => ', doc.data())
          students.push(flattenDoc(doc))
        })

        this.setState({
          students: students,
        })
      })
  }

  queryIEPInfo() {
    var student = this.state.student
    console.log(student.grade + " " + this.state.subject)

    // Change VCI later when needed
    db.collection(ColType.iepStandards)
      .where('grade', '==', student.grade)
      .where('subject', '==', this.state.subject)
      .where('category', '==', 'VCI') 
      .onSnapshot((querySnapshot) => {
        var iepInfo = []
        querySnapshot.forEach((doc) => {
          iepInfo.push(doc.data())
        })

        console.log("Iep length " + iepInfo.length)

        this.setState({
          iepChoices: iepInfo,
        })
      })
  }

  subjectChange = (value) => {
    this.setState({
      subject: value,
    }, () => {
      this.queryIEPInfo()
    })
  }

  studentChange = (value) => {
    this.setState({
      studentIdx: value,
      student: this.state.students[value]
    }, () => {
      this.queryIEPInfo()
    })
  }

  selectedIEP = (e, iepIdx) => {
    var selectedIEP = this.state.iepChoices[iepIdx]

    this.setState({
      iep: selectedIEP,
      didSelectIEP: true,
    })
  }

  goBack = () => {
    this.setState({
      didSelectIEP: false,
    })
  }

  render() {
    var student = this.state.student
    var iep = this.state.iep

    return (
      <div>
        <PersonHeader person={this.state.teacher}></PersonHeader>
        <Layout>
            <Layout style={{ marginLeft: 250, marginTop: 132 }}>
            <Content className="layout-content">
                {this.state.didSelectIEP ?
                <IEPEditAndConfirm
                  teacher={this.state.teacher} 
                  student={student} 
                  iep={iep}
                  onGoBack={this.goBack}
                /> :
                <div>
                  <div>
                    <div className="p-4 pb-0">
                      <h2>New IEP Goal</h2>
                      <h3 className="text-muted border-bottom mb-2 pb-2">IEP information</h3>
                    </div>
                    <div className="p-4 pt-0">
                      <Row gutter={32}>
                        <Col span={12}>
                          <div className="mb-1">Student:</div>
                          <Select 
                            showSearch
                            className="ant-select-very-large"
                            style={{ width: '100%' }}
                            placeholder="Select student"
                            defaultValue={this.state.studentIdx !== -1 ?
                              this.state.studentIdx : 'Select student'}
                            onChange={evt => this.studentChange(evt)}>
                            {this.state.students.map(function (student, index) {
                              return <Option value={index} key={"student-" + index}>
                              <Avatar 
                                size="large"
                                className="mr-8" 
                                style={{ backgroundColor: student.avatarColor}}
                              >
                                {getInitials(student)}
                              </Avatar>
                              <span className="vertical-align-middle">
                                  {student.firstName + " " + student.lastName}
                              </span>
                            </Option>
                            })
                            }
                          </Select>
                        </Col>
                      
                        <Col span={12}>
                          <div>
                            <div className="mb-1">Subject:</div>
                              <Select 
                                placeholder="Select subject" 
                                className="ant-select-very-large"
                                style={{ width: '100%' }}
                                defaultValue={this.state.subject !== '' ? 
                                  this.state.subject : 'Select subject'}
                                onChange={evt => this.subjectChange(evt)}>
                                  <Option value="Writing">
                                    <span className="vertical-align-middle">Writing</span>
                                  </Option>
                              </Select>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <div className="pt-4 border-top">
                      <div>
                        {!student || !iep ? 
                          <h3 className="mb-4">Select a student and subject above</h3> : 
                          ''
                        }
                        {student && iep ?
                        <h3 className="mb-4">
                          Recommended 
                          {iep ? ' ' + iep.st + ' ' : ' {Select subject} '}
                          IEP goals for 
                          {student ? 
                          ' ' + student.firstName + ' ' + student.lastName : 
                          ' {Select student}'}
                        </h3>
                        : ''}
                      </div>
                    </div>
                    <form>
                      <Row gutter={'16'} type={'flex'}>
                        {this.state.iepChoices.map((iepChoice, index) => {
                          // if (!isAppropriateLevel(student.psi, iepChoice, 
                          // iepChoice.category)) return
                          return <Col span={8} className="mb-2 h-100">
                          <div 
                            className="iep-choice-container shadow-hover h-100" 
                            onClick={evt => this.selectedIEP(evt, index)}
                          >
                            <Card title={<div>{iepChoice.bigIdea}
                              <div> 
                                <Tag>{iepChoice.grade + '.' + iepChoice.standard}</Tag>
                                <Tag color="geekblue">Recommended</Tag>
                              </div>
                            </div>}>
                            <p>{createIEPGoalText(iepChoice, student)}</p>
                              </Card> </div>
                              </Col>
                            })
                        }
                      </Row>
                    </form>
                  </div>
                </div>
              }
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

export default TeacherAddIEPGoal