import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/GlobalStyle.css'
import CustomFooter from '../login/CustomFooter'
import { Layout, Row, Col, Icon } from 'antd'
const { Content } = Layout

class AdminSchools extends Component {
  state = {

  }

  // Do fetch here
  componentDidMount() {
    document.title = 'School Summaries - dotit'
  }

  render() {
    console.log(this.props)
    return (
      <div>
        <Layout className="content layout-header-mt">
          <Layout>
            <Content className="layout-content">
              <div className="w-1024 m-lr-auto">
                <h1 className="flex flex-v-center mb-3 pb-3 border-bottom font-bold">
                 <Icon type="profile" className="mr-2 font-30" />
                 <span>Choose a school</span>
               </h1>
               <Row gutter={128} className="ml-0">
                <Col span={6} className="pl-0">
                  <h2 className="text-center mb-2 font-bold">Elementary Schools</h2>
                  {this.props.adminBaseProps.schoolTypes ?
                  this.props.adminBaseProps.schoolTypes.elementarySchool.length === 0 ?
                  <h2  className={"w-100 br-4 border p-2" +
                  " mb-2"}>
                  <div>{'No elementary schools have been added yet.'}</div>
                  <div>{'You can add schools in the "Add personnel" page.'}</div>
                  </h2>
                  :
                  this.props.adminBaseProps.schoolTypes.elementarySchool.map((school, index) => {
                    return <div className="pl-0" key={school.id}>
                       <Link 
                          to={'/admin/school-summary/' + this.props.adminBaseProps.adminId +
                          '?district=' + this.props.adminBaseProps.admin.districtId + 
                          '&school=' + school.id}
                          className={"w-100 br-4 h-150 up-hover" +
                          " shadow-hover mb-2 ant-btn" +
                          " ant-btn-dashed relative parent-hover"}
                        >
                          <div className="w-100 h-100 flex flex-center">
                            <div className="w-100 font-18 white-space-prewrap">
                              {school.schoolName}
                            </div>
                          </div>
                        </Link>
                    </div>
                  })
                  : ''}
                </Col>
                <Col span={6} className="pl-0">
                  <h2 className="text-center mb-2 font-bold">K-8 Schools</h2>
                  {this.props.adminBaseProps.schoolTypes ?
                  this.props.adminBaseProps.schoolTypes.k8School.length === 0 ?
                  <h2  className={"w-100 br-4 border p-2" +
                  " mb-2"}>
                  <div>{'No elementary schools have been added yet.'}</div>
                  <div>{'You can add schools in the "Add personnel" page.'}</div>
                  </h2>
                  :
                  this.props.adminBaseProps.schoolTypes.k8School.map((school, index) => {
                    return <div className="pl-0" key={school.id}>
                       <Link 
                          to={'/admin/school-summary/' + this.props.adminBaseProps.adminId +
                          '?district=' + this.props.adminBaseProps.admin.districtId + 
                          '&school=' + school.id}
                          className={"w-100 br-4 h-150 up-hover" +
                          " shadow-hover mb-2 ant-btn" +
                          " ant-btn-dashed relative parent-hover"}
                        >
                          <div className="w-100 h-100 flex flex-center">
                            <div className="w-100 font-18 white-space-prewrap">
                              {school.schoolName}
                            </div>
                          </div>
                        </Link>
                    </div>
                  })
                  : ''}
                </Col>
                <Col span={6} className="pl-0">
                <h2 className="text-center mb-2 font-bold">Middle Schools</h2>
                  {this.props.adminBaseProps.schoolTypes ?
                  this.props.adminBaseProps.schoolTypes.middleSchool.length === 0 ?
                  <h2  className={"w-100 br-4 border p-2" +
                  " mb-2"}>
                  <div>{'No middle schools have been added yet.'}</div>
                  <div>{'You can add schools in the "Add personnel" page.'}</div>
                  </h2>
                  :
                  this.props.adminBaseProps.schoolTypes.middleSchool.map((school, index) => {
                    return <div className="pl-0 max-w-100" key={school.id}>
                       <Link 
                          to={'/admin/school-summary/' + this.props.adminBaseProps.adminId +
                          '?district=' + this.props.adminBaseProps.admin.districtId + 
                          '&school=' + school.id}
                          className={"w-100 max-w-100 br-4 h-150 up-hover" +
                          " shadow-hover mb-2 ant-btn" +
                          " ant-btn-dashed relative parent-hover"}
                        >
                          <div className="w-100 h-100 flex flex-center flex-wrap">
                            <div className="w-100 font-18 white-space-prewrap">
                              {school.schoolName}
                            </div>
                          </div>
                        </Link>
                    </div>
                  })
                  : ''}
                </Col>
                <Col span={6} className="pl-0">
                <h2 className="text-center mb-2 font-bold">High Schools</h2>
                  {this.props.adminBaseProps.schoolTypes ?
                  this.props.adminBaseProps.schoolTypes.highSchool.length === 0 ?
                    <h2  className={"w-100 br-4 border p-2" +
                    " mb-2"}>
                    <div>{'No high schools have been added yet.'}</div>
                    <div>{'You can add schools in the "Add personnel" page.'}</div>
                    </h2>
                  :
                  this.props.adminBaseProps.schoolTypes.highSchool.map((school, index) => {
                    return <div className="pl-0" key={school.id}>
                       <Link 
                          to={'/admin/school-summary/' + this.props.adminBaseProps.adminId +
                          '?district=' + this.props.adminBaseProps.admin.districtId + 
                          '&school=' + school.id}
                          className={"w-100 br-4 h-150 up-hover" +
                          " shadow-hover mb-2 ant-btn" +
                          " ant-btn-dashed relative parent-hover"}
                        >
                          <div className="w-100 h-100 flex flex-center flex-wrap">
                            <div className="w-100 font-18 white-space-prewrap">
                              {school.schoolName}
                            </div>
                          </div>
                        </Link>
                    </div>
                  })
                  : ''}
                </Col>
               </Row>
              </div>
            </Content>
          </Layout>
        </Layout>
        <CustomFooter />
      </div>
    )
  }
}

export default AdminSchools