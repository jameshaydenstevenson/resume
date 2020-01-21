import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/GlobalStyle.css'
import CustomFooter from '../login/CustomFooter'
import { getIDFromURL } from '.././Util'
import { Layout, Icon, Row, Col } from 'antd'
const { Content } = Layout

class TeacherHome extends Component {
  state = {
    teacherId: '',
    teachers: [],
    students: [],
    school: null,
    IEPGoals: [],
    studentIEPStatus: [],
    profileMode: 1,
    componentMounted: false,
  }

  // Do fetch here
  componentDidMount() {
    document.title = 'Home - dot it'

    var teacherId = getIDFromURL(window.location)
    console.log(teacherId)
    console.log(this.props)

    this.setState({
      teacherId: teacherId,
    })
  }

  render() {
    console.log(this.props)
    return (
      <div>
        <Layout className="content layout-header-mt">
          <Layout>
            <Content className="layout-content">
              <div className="w-1024 m-lr-auto">
                {this.state.teacherId ?
                <div>
                <div className="flex flex-v-center mb-2 pb-2">
                  {this.props.teacherBaseProps && this.props.teacherBaseProps.teacher ? 
                  <Row gutter={32} className="w-100 flex flex-v-center">
                  <Col span={4}>
                    <img 
                      className="inline-block mr-3" 
                      src="/dot-it-tree-without-layers.png" 
                      alt="home-logo" 
                      height={128} 
                    />
                  </Col>
                  <Col span={20}>
                    <h1 className="inline-block mb-0 font-30 font-bold mt-1">
                      Hello, {this.props.teacherBaseProps.teacher.firstName}!
                    </h1> 
                    <h2>Welcome to dot it IEP</h2>
                  </Col>
                </Row>
                  : ''}
                </div>
                <Row gutter={128} className="ml-0">
                  <Col span={12} className="pl-0">
                    <Link 
                      to={"/teacher/class/" + this.state.teacherId}
                      className={"w-100 br-4 h-170 up-hover text-left p-3" +
                       " shadow-hover mb-3 ant-btn ant-btn-outlined lh-1-7em font-black relative"}
                    >
                        <div className="font-24 w-100 font-bold mb-2">
                          <Icon type='user' className="mr-1" />
                          <span>My Students</span>
                        </div>
                        <div className="font-18 white-space-normal w-75">
                          View tasks, add students to your caseload, and draft IEPs.
                        </div>
                        <img src={"/hand-up-girl.png"} 
                        className="w-auto mb-2 block m-lr-auto absolute"
                        height={120}
                        style={{right: -30, bottom: -29}}
                        alt="img" />
                    </Link>
                  </Col>
                  <Col span={12} className="pl-0">
                  <Link 
                      to={"/teacher/schedule/" + this.state.teacherId}
                      className={"w-100 br-4 h-170 up-hover text-left p-3" +
                       " shadow-hover mb-3 ant-btn ant-btn-outlined lh-1-7em font-black relative"}
                    >
                        <div className="font-24 w-100 font-bold mb-2">
                          <Icon type='calendar' className="mr-1" />
                          <span>My Services</span>
                        </div>
                        <div className="font-18 white-space-normal w-75">
                          Form groups, schedule setting and service times.
                        </div>
                        <img src={"/group.png"} 
                        className="w-auto mb-2 block m-lr-auto absolute"
                        height={90}
                        style={{right: -30, bottom: -29}}
                        alt="img" />
                    </Link>
                  </Col>
                  <Col span={12} className="pl-0">
                  <Link 
                      to={"/teacher/progress-monitoring/" + this.state.teacherId}
                      className={"w-100 br-4 h-170 up-hover text-left p-3" +
                       " shadow-hover mb-3 ant-btn ant-btn-outlined lh-1-7em font-black relative"}
                    >
                        <div className="font-24 w-100 font-bold mb-2">
                          <Icon type='area-chart' className="mr-1" />
                          <span>My Progress</span>
                        </div>
                        <div className="font-18 white-space-normal w-75">
                          View graphs, add scores, document instructional decisions, 
                           and rate learning behaviors.
                        </div>
                        <img src={"/team.png"} 
                        className="w-auto mb-2 block m-lr-auto absolute"
                        height={110}
                        style={{right: -30, bottom: -29}}
                        alt="img" />
                    </Link>
                  </Col>
                  
                  <Col span={12} className="pl-0">
                  <Link 
                      to={"/teacher/reports/" + this.state.teacherId}
                      className={"w-100 br-4 h-170 up-hover text-left p-3" +
                       " shadow-hover mb-3 ant-btn ant-btn-outlined lh-1-7em font-black relative"}
                    >
                        <div className="font-24 w-100 font-bold mb-2">
                          <Icon type='solution' className="mr-1" />
                          <span>My Reports</span>
                        </div>
                        <div className="font-18 white-space-normal w-75">
                          Real time data on goals, progress, and implementation.
                        </div>
                        <img src={"/report-lady.png"} 
                        className="w-auto mb-2 block m-lr-auto absolute"
                        height={110}
                        style={{right: -40, bottom: -29}}
                        alt="img" />
                    </Link>
                  </Col>
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

export default TeacherHome