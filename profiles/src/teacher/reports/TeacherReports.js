import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/GlobalStyle.css'
import CustomFooter from '../../login/CustomFooter'
import { getInitials } from '../../Util'
import { Layout, Avatar, Row, Col, Icon } from 'antd'
const { Content } = Layout

class TeacherReports extends Component {
  state = {

  }

  componentWillReceiveProps(nextProps) {

  }

  // Do fetch here
  componentDidMount() {
    document.title = 'My Reports - dot it'
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
                 <Icon type="solution" className="mr-2 font-30" />
                 <span className="va-middle">My Reports</span>
               </h1>
                <Row gutter={48} className="ml-0">
                  {this.props.teacherBaseProps.students && 
                  this.props.teacherBaseProps.students.map((student, index) => {
                    return <Col span={8} key={'student-col-' + index} className="pl-0">
                        <Link 
                          to={'/teacher/student-report/' + 
                          this.props.teacherBaseProps.teacher.id + '?student=' + student.id}
                          className={"w-100 br-4 h-150 up-hover" +
                          " shadow-hover mb-2 ant-btn" +
                          " ant-btn-dashed relative parent-hover"}
                        >
                          <div className="w-100 h-100 flex flex-center">
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
                            </div>
                          </div>
                        </Link>
                      </Col>
                  })
                  }
                  {this.props.teacherBaseProps.students &&
                   this.props.teacherBaseProps.students.length === 0 ?
                    <h2>No students or IEP goals have been added yet.</h2>
                  : ''}
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

export default TeacherReports