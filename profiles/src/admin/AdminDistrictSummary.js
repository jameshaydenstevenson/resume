import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import CustomFooter from '../login/CustomFooter'
//import SubjectPieChart from './SubjectPieChart'
import SupportPieChart from './SupportPieChart'
import SubjectHistogram from './SubjectHistogram'
import SchoolBarChart from './SchoolBarChart'
import { summaryIndex, capitalizeFirstChar } from '.././Util'
import { Layout, Select, Progress, Row, Col, Icon } from 'antd'
const { Content } = Layout
const Option = Select.Option

class AdminDistrictSummary extends Component {
  state = {
    admin: null,
    district: null,
    grade: 'all',
    subject: 'all',
    raceOrEthnicity: 'all',
    grades: ['all', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    subjects: ['all', 'Writing', 'Reading Comprehension in Literature',
                  'Reading Comprehension in Informational Text', 'Reading Foundations',
                  'Math', 'Social Emotional Learning'],
    racesOrEthnicities: ['all', 'Asian', 'Black or African American',
                          'Hispanic or Latino', 
                          'Native American or Alaska Native',
                          'Native Hawaiian or Other Pacific Islander',
                          'White'],
    supportLevels: ['h', 'm', 'l', 'total', 'totalWithMeasurements', 'onTrack']
  }

  componentDidMount() {
    document.title = 'District Summary - dot it'
  }

  gradeChange = (value) => {
    this.setState({
      grade: value
    })
  }

  render() {
    return (
      <div>
        <Layout className="content layout-header-mt">
          <Layout className="w-1024 m-lr-auto">
            <Content className="layout-content">
              <div>
                {!this.props.adminBaseProps.districtSummary ?
                <div className={"h-300 w-100 flex flex-h-center" +
                " flex-center font-30 font-bold text-cyan"}>
                  <div>
                    <Icon type="loading" className="mr-2"/>
                    <span>Loading District Information...</span>
                  </div>
                </div>
                : ''}
                {this.props.adminBaseProps.districtSummary && 
                this.props.adminBaseProps.districtSummary.aggregation.elementarySchool &&
                this.props.adminBaseProps.districtSummary.aggregation.middleSchool &&
                this.props.adminBaseProps.districtSummary.aggregation.highSchool ?
                <div>
                <h1 className="mb-0 pb-2 border-bottom">
                  <span className="font-bold">District Summary</span>
                </h1>
                <h2 className="font-bold mb-0 mt-3">Goals on Track (%)</h2>
                
                  <Row gutter={48} className="mt-3">
                    <Col span={8}>
                      <div className={"ant-shadow h-100 min-h-300 w-100 " +
                        "p-3 pr-4 br-4 mb-4 relative"}>
                        <h2 className="text-center font-bold mb-0">Elementary Schools</h2>
                        {this.props.adminBaseProps.districtSummary.aggregation
                      .elementarySchool.length > 0 ?
                        <SchoolBarChart 
                          schools={this.props.adminBaseProps.districtSummary.aggregation
                          .elementarySchool} 
                          adminId={this.props.adminBaseProps.admin.id}
                          districtId={this.props.adminBaseProps.admin.districtId}
                          />
                        : 
                        <h2 className="mt-4 pt-2 text-center">No data to display.</h2>
                      }
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className={"ant-shadow h-100 min-h-300 w-100 " +
                        "p-3 pr-4 br-4 mb-4 relative"}>
                        <h2 className="text-center font-bold mb-0">K-8 Schools</h2>
                        {this.props.adminBaseProps.districtSummary.aggregation
                      .k8School.length > 0 ?
                        <SchoolBarChart 
                          schools={this.props.adminBaseProps.districtSummary.aggregation
                          .k8School} 
                          adminId={this.props.adminBaseProps.admin.id}
                          districtId={this.props.adminBaseProps.admin.districtId}
                          />
                        : 
                        <h2 className="mt-4 pt-2 text-center">No data to display.</h2>
                      }
                      </div>
                    </Col>
                    <Col span={8}>
                    <div className={"ant-shadow h-100 min-h-300 w-100 " +
                        "p-3 pr-4 br-4 mb-4 relative"}>
                        <h2 className="text-center font-bold mb-0">Middle Schools</h2>
                        {this.props.adminBaseProps.districtSummary.aggregation
                      .middleSchool.length > 0 ?
                        <SchoolBarChart 
                          schools={this.props.adminBaseProps.districtSummary.aggregation
                          .middleSchool} 
                          adminId={this.props.adminBaseProps.admin.id}
                          districtId={this.props.adminBaseProps.admin.districtId}
                        />
                        : 
                        <h2 className="mt-4 pt-2 text-center">No data to display.</h2>
                      }
                      </div>
                    </Col>
                    <Col span={8}>
                    <div className={"ant-shadow h-100 min-h-300 w-100 " +
                        "p-3 pr-4 br-4 relative"}>
                        <h2 className="text-center font-bold mb-0">High Schools</h2>
                        {this.props.adminBaseProps.districtSummary.aggregation
                      .highSchool.length > 0 ?
                        <SchoolBarChart 
                          schools={this.props.adminBaseProps.districtSummary.aggregation
                          .highSchool}
                          adminId={this.props.adminBaseProps.admin.id}
                          districtId={this.props.adminBaseProps.admin.districtId}
                        />
                        : 
                        <h2 className="mt-4 pt-2 text-center">No data to display.</h2>
                      }
                      </div>
                    </Col>
                  </Row>
                
                  
                <div className="w-100 pt-4 mt-4 border-top">
                <div className="w-100 mb-4 pb-2">
                <span className="float-right w-400">
                    <Row>
                      <Col span={8} className="pt-6px">
                        <span className="font-18">Filter by grade:</span>
                      </Col>
                      <Col span={16}>
                        <Select size={'large'} defaultValue={'all'} 
                        placeholder="Grade..." className="w-100 mb-0 inline-block" 
                        onSelect={this.gradeChange}>
                          <Option value="all">All</Option>
                          <Option value="K">K</Option>
                          <Option value="1">1</Option>
                          <Option value="2">2</Option>
                          <Option value="3">3</Option>
                          <Option value="4">4</Option>
                          <Option value="5">5</Option>
                          <Option value="6">6</Option>
                          <Option value="7">7</Option>
                          <Option value="8">8</Option>
                          <Option value="9">9</Option>
                          <Option value="10">10</Option>
                          <Option value="11">11</Option>
                          <Option value="12">12</Option>
                        </Select>
                      </Col>
                    </Row>
                  </span>
                </div>
                {this.state.racesOrEthnicities.map((race, index) => {
                  var total = this.props.adminBaseProps
                                .districtSummary.summary[summaryIndex(this.state.grade, 
                                  this.state.subject, race, 'total')]
                  var totalWithMeasurements = 
                    this.props.adminBaseProps
                    .districtSummary.summary[summaryIndex(this.state.grade, 
                    this.state.subject, race, 'totalWithMeasurements')]
                  var onTrack = this.props.adminBaseProps
                  .districtSummary.summary[summaryIndex(this.state.grade, 
                    this.state.subject, race, 'onTrack')]
                  var lowSupport = this.props.adminBaseProps
                  .districtSummary.summary[summaryIndex(this.state.grade, 
                    this.state.subject, race, 'l')]
                  var mediumSupport = this.props.adminBaseProps
                  .districtSummary.summary[summaryIndex(this.state.grade, 
                    this.state.subject, race, 'm')]
                  var highSupport = this.props.adminBaseProps
                  .districtSummary.summary[summaryIndex(this.state.grade, 
                    this.state.subject, race, 'h')]
                  console.log(this.state.grade, this.state.subject, race, 
                    'support', lowSupport, mediumSupport, highSupport,
                    'onTrack', onTrack, 'totalWithMeasurements', totalWithMeasurements,
                    'total', total)
                  return <div key={race} className="p-4 pl-0 pr-0 border-bottom">
                    <h2 className="mb-3">
                      <span className="mr-3 font-bold">
                        {race === 'all' ? capitalizeFirstChar(race) : race}
                      </span>
                      <span className="text-muted font-16 float-right">{total} IEP Goals</span>
                    </h2>
                    <Row gutter={48}>
                    <Col span={8}>
                      <div className={"ant-shadow h-100 min-h-300 w-100 " +
                        "p-3 pr-4 br-4 relative"}>
                        <h2 className="text-center font-bold mb-0">IEP Goals by Subject</h2>
                        {total > 0 ?
                          /**<SubjectPieChart 
                            Writing={this.props.adminBaseProps
                              .districtSummary.summary[summaryIndex(this.state.grade, 
                              'Writing', race, 'total')]}
                            RL={this.props.adminBaseProps
                              .districtSummary.summary[summaryIndex(this.state.grade, 
                              'Reading Comprehension in Literature', race, 'total')]}
                            RI={this.props.adminBaseProps
                              .districtSummary.summary[summaryIndex(this.state.grade, 
                              'Reading Comprehension in Informational Text', race, 'total')]
                            }
                            RF={this.props.adminBaseProps
                              .districtSummary.summary[summaryIndex(this.state.grade, 
                              'Reading Foundations', race, 'total')]
                            }
                            Math={this.props.adminBaseProps
                              .districtSummary.summary[summaryIndex(this.state.grade, 
                              'Math', race, 'total')]}
                            SEL={this.props.adminBaseProps
                              .districtSummary.summary[summaryIndex(this.state.grade, 
                              'Social Emotional Learning', race, 'total')]}
                            total={total}
                              />*/
                           <SubjectHistogram 
                            Wr={this.props.adminBaseProps
                              .districtSummary.summary[summaryIndex(this.state.grade, 
                              'Writing', race, 'total')]}
                            RL={this.props.adminBaseProps
                              .districtSummary.summary[summaryIndex(this.state.grade, 
                              'Reading Comprehension in Literature', race, 'total')]}
                            RI={this.props.adminBaseProps
                              .districtSummary.summary[summaryIndex(this.state.grade, 
                              'Reading Comprehension in Informational Text', race, 'total')]
                            }
                            RF={this.props.adminBaseProps
                              .districtSummary.summary[summaryIndex(this.state.grade, 
                              'Reading Foundations', race, 'total')]
                            }
                            Math={this.props.adminBaseProps
                              .districtSummary.summary[summaryIndex(this.state.grade, 
                              'Math', race, 'total')]}
                            SEL={this.props.adminBaseProps
                              .districtSummary.summary[summaryIndex(this.state.grade, 
                              'Social Emotional Learning', race, 'total')]}
                            total={total}
                            />
                        :
                          <h2 className="mt-4 pt-2 text-center">No data to display.</h2>
                        }
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className={"ant-shadow h-100 min-h-300 w-100 " +
                        "p-3 pr-4 br-4 relative"}>
                        <h2 className="text-center font-bold mb-0">Goals on Track (%)</h2>
                        {totalWithMeasurements > 0 ?
                          <div className="mt-4 pt-2 text-center">
                          <Progress className="stroke-cyan" type="circle" 
                          percent={Math.round(onTrack / totalWithMeasurements * 100, 10)} />
                          </div>
                          : 
                          <h2 className="mt-4 pt-2 text-center">No data to display.</h2>
                        }
                      </div>
                      </Col>
                      <Col span={8}>
                      <div className={"ant-shadow h-100 min-h-300 w-100 " +
                        "p-3 pr-4 br-4 relative"}>
                        <h2 className="text-center font-bold mb-0">Support Level of Goals</h2>
                          {lowSupport + mediumSupport + highSupport > 0 ?
                            <SupportPieChart 
                              lowSupport={lowSupport}
                              mediumSupport={mediumSupport}
                              highSupport={highSupport}
                            />
                          : 
                          <h2 className="mt-4 pt-2 text-center">No data to display.</h2>}
                        </div>
                      </Col>
                    </Row>
                  </div>
                })}
                </div>
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

export default AdminDistrictSummary