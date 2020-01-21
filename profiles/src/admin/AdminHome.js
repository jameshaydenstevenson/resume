import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/GlobalStyle.css'
import CustomFooter from '../login/CustomFooter'
import { getIDFromURL } from '../Util'
import { Layout, Row, Col, Icon, Tooltip } from 'antd'
const { Content } = Layout

class AdminHome extends Component {
  state = {
    adminId: '',
  }

  // Do fetch here
  componentDidMount() {
    document.title = 'Home - dot it'

    var adminId = getIDFromURL(window.location)
    console.log(adminId)

    this.setState({
      adminId: adminId,
    })
  }

  render() {
    return (
      <div>
        <Layout className="content layout-header-mt">
          <Layout>
            <Content className="layout-content-extra-pt">
            <div className="w-1024 m-lr-auto">
                {this.state.adminId ?
                <div>
                  <div className="flex flex-v-center mb-2 pb-2">
                  {this.props.adminBaseProps && this.props.adminBaseProps.admin ? 
                  <h1 className="inline-block mb-0 font-30 font-bold mt-1">
                    Hello, {this.props.adminBaseProps.admin.firstName}!
                  </h1> 
                  : ''}
                </div>
                <Row gutter={48} className="ml-0">
                  <Col span={8} className="pl-0">
                    <Tooltip title="View district summary information."
                      mouseEnterDelay={.5}
                    >
                    <Link 
                      to={"/admin/district-summary/" + this.state.adminId}
                      className={"w-100 br-4 h-150 up-hover" +
                       " shadow-hover flex-center mb-2 ant-btn ant-btn-primary"}
                    >
                        <div className="font-24 w-100">
                          <Icon type="bar-chart" className="mr-2 font-30"/>
                          <span>District Summary</span>
                        </div>
                    </Link>
                    </Tooltip>
                  </Col>
                  <Col span={8} className="pl-0">
                  <Tooltip title="View summary information for schools in the district."
                      mouseEnterDelay={.5}
                    >
                    <Link 
                      to={"/admin/schools/" + this.state.adminId}
                      className={"w-100 br-4 h-150 up-hover" +
                       " shadow-hover flex-center mb-2 ant-btn ant-btn-primary"}
                    >
                        <div className="font-24 w-100">
                          <Icon type="profile" className="mr-2 font-30"/>
                          <span>School Summaries</span>
                        </div>
                    </Link>
                    </Tooltip>
                  </Col>
                  <Col span={8} className="pl-0">
                  <Tooltip 
                      title={"Add personnel (Administrators, school " +
                      "administrators, and teachers) to the district."}
                      mouseEnterDelay={.5}
                    >
                    <Link 
                      to={"/admin/add-person/" + this.state.adminId}
                      className={"w-100 br-4 h-150 up-hover" +
                       " shadow-hover flex-center mb-2 ant-btn ant-btn-primary"}
                    >
                        <div className="font-24 w-100">
                          <Icon type="plus" className="mr-2 font-30"/>
                          <span>Add Personnel</span>
                        </div>
                    </Link>
                    </Tooltip>
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

export default AdminHome