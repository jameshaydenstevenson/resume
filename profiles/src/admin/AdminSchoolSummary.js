import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/GlobalStyle.css'
import { db } from '../firebase/Firebase'
import PersonAvatar from '../customcomponents/PersonAvatar'
import CustomFooter from '../login/CustomFooter'
//import SubjectPieChart from './SubjectPieChart'
import SubjectHistogram from './SubjectHistogram'
import SupportPieChart from './SupportPieChart'
import EditSchoolNameForm from './EditSchoolNameForm'
import EditPersonnelNameForm from './EditPersonnelNameForm'
import ColType from '.././Types'
import { flattenDoc, decompress, addArrays, getQueryStringParam,
  getEmptySchoolOrDistrictSummary, summaryIndex, capitalizeFirstChar } from '.././Util'
import { Layout, Select, Row, Col, Progress, Icon, Tabs } from 'antd'
const { Content } = Layout
const Option = Select.Option
const TabPane = Tabs.TabPane

class AdminSchoolSummary extends Component {
  state = {
    schoolSummary: null,
    loadingData: true,
    schoolTeachers: null,
    schoolAdministrators: null,
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

  componentWillReceiveProps() {
    var districtId = getQueryStringParam('district')
    var schoolId = getQueryStringParam('school')
    if (schoolId === this.state.schoolId) return

    this.setState({ 
      schoolId: schoolId,
      districtId: districtId,
      schoolTeachers: null,
      schoolAdministrators: null, 
    })

    console.log("District Id,", districtId, "Schoold Id", schoolId)

    if (districtId && schoolId) {
      this.setState({
        loadingData: true,
      })
      
      db.collection(ColType.schoolSummary)
      .where('districtId', '==', districtId)
      .where('schoolId', '==', schoolId)
      .orderBy('shardIndex')
      .get()
      .then((querySnapshot) => {
        var schoolSummary = getEmptySchoolOrDistrictSummary()

        querySnapshot.forEach((doc) => {
          var schoolShard = flattenDoc(doc)
          schoolShard.summary = decompress(schoolShard.summary)
          schoolSummary = addArrays(schoolSummary, schoolShard.summary.summary)
        })

        console.log("School summary", schoolSummary)

        this.setState({
          schoolSummary: schoolSummary,
          loadingData: false,
        })
      })

      db.collection(ColType.schoolAdmin)
      .where('districtId', '==', districtId)
      .where('schoolId', '==', schoolId)
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

      db.collection(ColType.teacher)
      .where('districtId', '==', districtId)
      .where('schoolId', '==', schoolId)
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
  }

  componentDidMount() {
    document.title = 'School Summary - dot it'

    var districtId = getQueryStringParam('district')
    var schoolId = getQueryStringParam('school')
    this.setState({ 
      schoolId: schoolId,
      districtId: districtId, 
    })

    console.log("District Id,", districtId, "Schoold Id", schoolId)

    if (districtId && schoolId) {
      db.collection(ColType.schoolSummary)
      .where('districtId', '==', districtId)
      .where('schoolId', '==', schoolId)
      .orderBy('shardIndex')
      .get()
      .then((querySnapshot) => {
        var schoolSummary = getEmptySchoolOrDistrictSummary()

        querySnapshot.forEach((doc) => {
          var schoolShard = flattenDoc(doc)
          schoolShard.summary = decompress(schoolShard.summary)
          schoolSummary = addArrays(schoolSummary, schoolShard.summary.summary)
        })

        console.log("School summary", schoolSummary)

        this.setState({
          schoolSummary: schoolSummary,
          loadingData: false,
        })
      })

      db.collection(ColType.schoolAdmin)
      .where('districtId', '==', districtId)
      .where('schoolId', '==', schoolId)
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

      db.collection(ColType.teacher)
      .where('districtId', '==', districtId)
      .where('schoolId', '==', schoolId)
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
  }

  getTeachers = () => {
    db.collection(ColType.teacher)
    .where('districtId', '==', this.state.districtId)
    .where('schoolId', '==', this.state.schoolId)
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
    db.collection(ColType.schoolAdmin)
      .where('districtId', '==', this.state.districtId)
      .where('schoolId', '==', this.state.schoolId)
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
              {this.state.loadingData ?
               <div className={"h-300 w-100 flex flex-h-center" +
               " flex-center font-30 font-bold text-cyan"}>
                 <div>
                   <Icon type="loading" className="mr-2"/>
                   <span>Loading School Information...</span>
                 </div>
               </div>
              : ''}
              {this.props.adminBaseProps.schoolsDict && 
              this.state.schoolId && this.state.schoolSummary && !this.state.loadingData ?
              <div>
              <h1 className="font-bold">
                {this.props.adminBaseProps.schoolsDict[this.state.schoolId].schoolName}
                <span>
                  <EditSchoolNameForm 
                    school={this.props.adminBaseProps.schoolsDict[this.state.schoolId]} 
                  />
                </span>
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
                  var total = this.state.schoolSummary[summaryIndex(this.state.grade, 
                                  this.state.subject, race, 'total')]
                  var totalWithMeasurements = 
                  this.state.schoolSummary[summaryIndex(this.state.grade, 
                    this.state.subject, race, 'totalWithMeasurements')]
                  var onTrack = this.state.schoolSummary[summaryIndex(this.state.grade, 
                    this.state.subject, race, 'onTrack')]
                  var lowSupport = this.state.schoolSummary[summaryIndex(this.state.grade, 
                    this.state.subject, race, 'l')]
                  var mediumSupport = this.state.schoolSummary[summaryIndex(this.state.grade, 
                    this.state.subject, race, 'm')]
                  var highSupport = this.state.schoolSummary[summaryIndex(this.state.grade, 
                    this.state.subject, race, 'h')]
                  console.log(this.state.grade, this.state.subject, race, 
                      'support', lowSupport, mediumSupport, highSupport,
                      'onTrack', onTrack, 'totalWithMeasurements', totalWithMeasurements,
                      'total', total)
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
                            Wr={this.state.schoolSummary[summaryIndex(this.state.grade, 
                              'Writing', race, 'total')]}
                            RL={this.state.schoolSummary[summaryIndex(this.state.grade, 
                              'Reading Comprehension in Literature', race, 'total')]}
                            RI={this.state.schoolSummary[summaryIndex(this.state.grade, 
                              'Reading Comprehension in Informational Text', race, 'total')]
                            }
                            RF={this.state.schoolSummary[summaryIndex(this.state.grade, 
                              'Reading Foundations', race, 'total')]
                            }
                            Math={this.state.schoolSummary[summaryIndex(this.state.grade, 
                              'Math', race, 'total')]}
                            SEL={this.state.schoolSummary[summaryIndex(this.state.grade, 
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
                {!this.state.schoolAdministrators || !this.state.schoolTeachers ?
                <div className={"h-300 w-100 flex flex-h-center" +
                " flex-center font-30 font-bold text-cyan"}>
                  <div>
                    <Icon type="loading" className="mr-2"/>
                    <span>Loading School Personnel...</span>
                  </div>
                </div>
                : 
                  <div className="mt-4 pl-05 pr-05 pb-1">
                    <Row gutter={32}>
                      <Col span={12}>
                        <div className={"ant-shadow w-100 " +
                          "p-4 br-4"}>
                          <h2 className="text-center font-bold mb-2">
                          School Administrators</h2>
                          {this.state.schoolAdministrators.length > 0 ?
                            this.state.schoolAdministrators.map((schoolAdministrator, index) => {
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
                          {this.state.schoolTeachers.length > 0 ?
                            this.state.schoolTeachers.map((schoolTeacher, index) => {
                              return <Row gutter={32} key={'avatar-' + schoolTeacher.id}>
                              <Col span={20}>
                              <Link 
                                to={{
                                  pathname: '/teacher/home/' +  schoolTeacher.id,
                                  state: { adminBaseProps: this.props.adminBaseProps },
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
                }
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

export default AdminSchoolSummary