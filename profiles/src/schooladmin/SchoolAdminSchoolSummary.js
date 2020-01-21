import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/GlobalStyle.css'
import { db } from '../firebase/Firebase'
import PersonAvatar from '../customcomponents/PersonAvatar'
import CustomFooter from '../login/CustomFooter'
//import SubjectPieChart from './SubjectPieChart'
import SubjectHistogram from '../admin/SubjectHistogram'
import SupportPieChart from '../admin/SupportPieChart'
import EditPersonnelNameForm from '../admin/EditPersonnelNameForm'
import ColType from '.././Types'
import { flattenDoc, summaryIndex, capitalizeFirstChar } from '.././Util'
import { Layout, Select, Row, Col, Progress, Icon, Tabs } from 'antd'
const { Content } = Layout
const Option = Select.Option
const TabPane = Tabs.TabPane

class SchoolAdminSchoolSummary extends Component {
  state = {
    schoolAdministrators: this.props.schoolAdminBaseProps.schoolAdministrators,
    schoolTeachers: this.props.schoolAdminBaseProps.schoolTeachers,
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

  componentWillReceiveProps(nextProps) {
    console.log('next props')
    this.setState({
      schoolAdministrators: nextProps.schoolAdminBaseProps.schoolAdministrators,
      schoolTeachers: nextProps.schoolAdminBaseProps.schoolTeachers,
    })
  }

  componentDidMount() {
    document.title = 'School Summary - dot it'
  }

  gradeChange = (value) => {
    this.setState({
      grade: value
    })
  }

  getTeachers = () => {
    if (!this.props.schoolAdminBaseProps.schoolAdmin) return
    db.collection(ColType.teacher)
    .where('districtId', '==', this.props.schoolAdminBaseProps.schoolAdmin.districtId)
    .where('schoolId', '==', this.props.schoolAdminBaseProps.schoolAdmin.schoolId)
    .get()
    .then((querySnapshot) => {
      var schoolTeachers = []
      
      querySnapshot.forEach((doc) => {
        var teacher = flattenDoc(doc)
        schoolTeachers.push(teacher)
      })

      this.setState({
        schoolTeachers: schoolTeachers
      })
    })
  }

  getSchoolAdmins = () => {
    if (!this.props.schoolAdminBaseProps.schoolAdmin) return
    db.collection(ColType.schoolAdmin)
      .where('districtId', '==', this.props.schoolAdminBaseProps.schoolAdmin.districtId)
      .where('schoolId', '==', this.props.schoolAdminBaseProps.schoolAdmin.schoolId)
      .get()
      .then((querySnapshot) => {
        var schoolAdministrators = []

        querySnapshot.forEach((doc) => {
          var schoolAdministrator = flattenDoc(doc)
          schoolAdministrators.push(schoolAdministrator)
        })

        this.setState({
          schoolAdministrators: schoolAdministrators
        })
      }) 
  }

  render() {
    console.log("render teachers", this.state.schoolTeachers, 
    'schoolAdmins', this.state.schoolAdministrators, 'props teachers',
    this.props.schoolAdminBaseProps.schoolTeachers)
    return (
      <div>
        <Layout className="content layout-header-mt">
        <Layout className="w-1024 m-lr-auto">
            <Content className="layout-content">
              <div>
              {this.props.schoolAdminBaseProps.loadingData ?
               <div className={"h-300 w-100 flex flex-h-center" +
               " flex-center font-30 font-bold text-cyan"}>
                 <div>
                   <Icon type="loading" className="mr-2"/>
                   <span>Loading School Information...</span>
                 </div>
               </div>
              : ''}
              {this.props.schoolAdminBaseProps.school && 
              this.props.schoolAdminBaseProps.schoolSummary && 
              !this.props.schoolAdminBaseProps.loadingData ?
              <div>
              <h1 className="font-bold">
                {this.props.schoolAdminBaseProps.school.schoolName}
              </h1>
              <Tabs defaultActiveKey="1" size={'large'} className="overflow-visible" 
              animated={false} onChange={() => {}}>
                <TabPane tab="Summary" key="1">
                <div className="mt-4">
                <h2 className="mb-0 pb-2 border-bottom">
                  <Row gutter={32}>
                  <Col span={12}>
           
                  </Col>
                  <Col span={12}>
                  <span className="float-right w-100">
                    <Row>
                      <Col span={7}>
                        <span className="font-18">Filter by grade:</span>
                      </Col>
                      <Col span={17}>
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
                  </Col>
                  </Row>
                </h2>
                
                
                {this.state.racesOrEthnicities.map((race, index) => {
                  var total = this.props.schoolAdminBaseProps
                  .schoolSummary[summaryIndex(this.state.grade, 
                                  this.state.subject, race, 'total')]
                  var totalWithMeasurements = 
                  this.props.schoolAdminBaseProps.schoolSummary[summaryIndex(this.state.grade, 
                    this.state.subject, race, 'totalWithMeasurements')]
                  var onTrack = this.props.schoolAdminBaseProps
                  .schoolSummary[summaryIndex(this.state.grade, 
                    this.state.subject, race, 'onTrack')]
                  var lowSupport = this.props.schoolAdminBaseProps
                  .schoolSummary[summaryIndex(this.state.grade, 
                    this.state.subject, race, 'l')]
                  var mediumSupport = this.props.schoolAdminBaseProps
                  .schoolSummary[summaryIndex(this.state.grade, 
                    this.state.subject, race, 'm')]
                  var highSupport = this.props.schoolAdminBaseProps
                  .schoolSummary[summaryIndex(this.state.grade, 
                    this.state.subject, race, 'h')]
                  console.log(onTrack, totalWithMeasurements)
                  return <div key={race} className="p-4 pl-0 pr-0 border-bottom">
                    <h2 className="mb-3 font-bold">
                      <span className="mr-3">
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
                            Writing={this.props.schoolAdminBaseProps
                              .districtSummary.summary[summaryIndex(this.state.grade, 
                              'Writing', race, 'total')]}
                            RL={this.props.schoolAdminBaseProps
                              .districtSummary.summary[summaryIndex(this.state.grade, 
                              'Reading Comprehension in Literature', race, 'total')]}
                            RI={this.props.schoolAdminBaseProps
                              .districtSummary.summary[summaryIndex(this.state.grade, 
                              'Reading Comprehension in Informational Text', race, 'total')]
                            }
                            RF={this.props.schoolAdminBaseProps
                              .districtSummary.summary[summaryIndex(this.state.grade, 
                              'Reading Foundations', race, 'total')]
                            }
                            Math={this.props.schoolAdminBaseProps
                              .districtSummary.summary[summaryIndex(this.state.grade, 
                              'Math', race, 'total')]}
                            SEL={this.props.schoolAdminBaseProps
                              .districtSummary.summary[summaryIndex(this.state.grade, 
                              'Social Emotional Learning', race, 'total')]}
                            total={total}
                              />*/
                           <SubjectHistogram 
                            Wr={this.props.schoolAdminBaseProps
                              .schoolSummary[summaryIndex(this.state.grade, 
                              'Writing', race, 'total')]}
                            RL={this.props.schoolAdminBaseProps
                              .schoolSummary[summaryIndex(this.state.grade, 
                              'Reading Comprehension in Literature', race, 'total')]}
                            RI={this.props.schoolAdminBaseProps
                              .schoolSummary[summaryIndex(this.state.grade, 
                              'Reading Comprehension in Informational Text', race, 'total')]
                            }
                            RF={this.props.schoolAdminBaseProps
                              .schoolSummary[summaryIndex(this.state.grade, 
                              'Reading Foundations', race, 'total')]
                            }
                            Math={this.props.schoolAdminBaseProps
                              .schoolSummary[summaryIndex(this.state.grade, 
                              'Math', race, 'total')]}
                            SEL={this.props.schoolAdminBaseProps
                              .schoolSummary[summaryIndex(this.state.grade, 
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
              </TabPane>
                <TabPane tab="Personnel" key="2">
                  <div className="mt-4 pl-05 pr-05 pb-1">
                    <Row gutter={32}>
                      <Col span={12}>
                        <div className={"ant-shadow w-100 " +
                          "p-4 br-4"}>
                          <h2 className="text-center font-bold mb-2">
                          School Administrators</h2>
                          {this.state.schoolAdministrators && 
                          this.state.schoolAdministrators.length > 0 ?
                          this.state.schoolAdministrators
                          .map((schoolAdministrator, index) => {
                              return <div className="mb-1" key={'avatar-' + schoolAdministrator.id}>
                                <PersonAvatar person={schoolAdministrator} />
                                <span className="float-right">
                                  <EditPersonnelNameForm 
                                    person={schoolAdministrator}
                                    collectionType={ColType.schoolAdmin}
                                    onEditSuccessful={this.getSchoolAdmins}
                                  />
                                </span>
                              </div>
                            })
                          : 
                          <h2 className="text-center mt-3">No data to display.</h2>}
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className={"ant-shadow w-100 " +
                          "p-4 br-4"}>
                          <h2 className="text-center font-bold mb-2">
                          Teachers</h2>
                          {this.state.schoolTeachers && 
                          this.state.schoolTeachers.length > 0 ?
                          this.state.schoolTeachers
                          .map((schoolTeacher, index) => {
                              return <Row gutter={32} key={'avatar-' + schoolTeacher.id}>
                              <Col span={20}>
                              <Link 
                                to={{
                                  pathname: '/teacher/home/' +  schoolTeacher.id,
                                  state: { schoolAdminBaseProps: this.props.schoolAdminBaseProps },
                                }}
                                className={"w-100 h-100 br-4 text-left p-2 inline-block up-hover" +
                                " shadow-hover mb-1 ant-btn" +
                                " ant-btn-dashed relative parent-hover"}
                            >
                              <Row gutter={32}>
                                <Col span={12}>
                                <PersonAvatar person={schoolTeacher} size={'large'} />
                                </Col>
                                <Col span={12} className="pt-5px">
                                  <span className="float-right font-14">
                                    <Icon type="eye-o" className="mr-1 font-24 va-middle" />
                                    <span>View</span>
                                  </span>
                                </Col>
                              </Row>
                            </Link>
                            </Col>
                            <Col span={4}>
                                <EditPersonnelNameForm 
                                  person={schoolTeacher}
                                  collectionType={ColType.teacher}
                                  onEditSuccessful={this.getTeachers}
                                  btnStyles={'mt-2'}
                                />
                            </Col>
                            </Row>
                            })
                          : 
                          <h2 className="text-center mt-3">No data to display.</h2>}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </TabPane>
              </Tabs>
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

export default SchoolAdminSchoolSummary