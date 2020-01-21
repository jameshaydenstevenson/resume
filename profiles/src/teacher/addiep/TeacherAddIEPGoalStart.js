import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/GlobalStyle.css'
import { getIDFromURL } from '../.././Util'
import { Layout, Icon, Row, Col } from 'antd'
import CustomFooter from '../../login/CustomFooter'
const { Content } = Layout

class TeacherAddIEPGoalStart extends Component {
  state = {
    teacherId: '',
  }

  componentDidMount() {
    var teacherId = getIDFromURL(window.location)
    console.log(teacherId)

    this.setState({
      teacherId: teacherId,
    })
  }

  render() {
    return (
      <div>
         <Layout className="content layout-header-mt">
          <Layout>
            <Content className="layout-content">
              <div className="sub-menu-width m-lr-auto">
              <h1 className="flex flex-v-center mb-3 pb-3 border-bottom">
                  <span className="mr-2">Draft an IEP for:</span>
              </h1>
              {this.state.teacherId ?
              <Row gutter={48} className="ml-0">
                  <Col span={12} className="pl-0">
                    <Link 
                      to={"/teacher/add-goal-student/" + this.state.teacherId}
                      className={"w-100 br-4 h-150 up-hover" +
                       " shadow-hover flex-center mb-2 ant-btn ant-btn-primary"}
                    >
                        <div className="font-16 w-100 flex flex-h-center">
                          <Icon type="user" className="mr-2 font-30"/>
                          <span className="font-18">An Existing Student</span>
                        </div>
                    </Link>
                  </Col>

                  <Col span={12} className="pl-0">
                    <Link 
                      to={"/teacher/add-student/" + this.state.teacherId}
                      className={"w-100 br-4 h-150 up-hover" +
                       " shadow-hover flex-center mb-2 ant-btn ant-btn-primary"}
                    >
                        <div className="font-16 w-100 flex flex-h-center">
                          <Icon type="user-add" className="mr-2 font-30"/>
                          <span className="font-18">A New Student</span>
                        </div>
                    </Link>
                  </Col>
                </Row>
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

export default TeacherAddIEPGoalStart