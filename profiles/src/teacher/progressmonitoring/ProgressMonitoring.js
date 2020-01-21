import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/GlobalStyle.css'
import { db } from '../../firebase/Firebase'
//import PersonHeader from '../../login/PersonHeader'
import PersonAvatar from '../../customcomponents/PersonAvatar'
import CustomFooter from '../../login/CustomFooter'
import AddNoteForm from './AddNoteForm'
import Note from './Note'
import IEPParagraph from '../iep/IEPParagraph'
import UIChart from './UIChart'
import ProgressMonitoringTest from './ProgressMonitoringTest'
import { flattenDoc, getIDFromURL, getQueryStringParam, 
  capitalizeFirstChar, gradeText } from '../../Util'
import ColType from '../../Types'
import { Layout, Icon, Tabs, Menu, Button, Collapse, Badge, Row, Col } from 'antd'
const { Content, Sider } = Layout
const TabPane = Tabs.TabPane
const SubMenu = Menu.SubMenu
const Panel = Collapse.Panel
var moment = require('moment')

class ProgressMonitoring extends Component {
  state = {
    snapshotListeners: [],
    teacherId: '',
    studentId: '',
    iepId: '',
    teacher: null,
    student: null,
    profileMode: 1,
    IEPMeasurements: {},
    measurements: [],
    notes: [],
    openKeys: [],
    selectedKeys: [],
    componentMounted: false,
    loadingNewData: false,
    newMeasurement: "",
    activeKey: '1',
  }

  componentWillReceiveProps(nextProps) {
    // only for initial page load
    // iepId must be null so measurement additions don't
    // trigger a new listener call.
    if (nextProps.teacherBaseProps.studentDict && 
        nextProps.teacherBaseProps.IEPGoals &&
        nextProps.teacherBaseProps.currentTimeStamp &&
        !this.state.iepId) {
      console.log("Initial load, props made it from teacher base")
      var teacherId = getIDFromURL(window.location)
      var studentId = getQueryStringParam('student')
      var iepId = getQueryStringParam('iep')
  
      this.setState({
        teacherId: teacherId,
        studentId: studentId,
        iepId: iepId,
      }, () => {
        this.subscribeMeasurementListener()
      })
    }
  }

  // Do fetch here
  componentDidMount() {
    document.title = 'My Progress - dot it'

    var teacherId = getIDFromURL(window.location)
    var studentId = getQueryStringParam('student')
    var iepId = getQueryStringParam('iep')
    
    if (iepId && 
      this.props.teacherBaseProps.studentDict && 
      this.props.teacherBaseProps.IEPGoals &&
      this.props.teacherBaseProps.currentTimeStamp) {
      this.setState({
        teacherId: teacherId,
        studentId: studentId,
        iepId: iepId,
      }, () => {
        this.subscribeMeasurementListener()
      })
    } else {
      this.setState({
        teacherId: teacherId,
        studentId: studentId,
      })
    }
  }

  componentWillUnmount() {
    this.unsubscribeListeners()
  }

  subscribeMeasurementListener() {
    this.unsubscribeListeners()
    var studentId = this.state.studentId
    var iepId = this.state.iepId
    console.log('new props student id', studentId, 'new iep id', iepId)
    console.log(this.props.teacherBaseProps.IEPGoals)
    if (this.props.teacherBaseProps.IEPGoals.length === 0 || !studentId || !iepId) {
      this.setState({
        student: null,
        iep: null,
        componentMounted: true,
      })
      return
    }

    var student = this.props.teacherBaseProps.studentDict[studentId]

    this.setState({
      openKeys: [student.grade, student.id],
      selectedKeys: [iepId],
      studentId: studentId,
      iepId: iepId,
      student: student,
    })

    var snapshotListeners = this.state.snapshotListeners

    var iepListener = db.collection(ColType.iep)
      .doc(iepId)
      .onSnapshot((doc) => {
        var iep = flattenDoc(doc)
        var latestMeasurementTimeStamp = moment.utc(iep.latestMeasurementTimeStamp)
        var twoWeeksAfterLatestMeasurement = 
        moment.utc(latestMeasurementTimeStamp).add(2, 'weeks')
        var requiresAction = 
        this.props.teacherBaseProps.currentTimeStamp.isAfter(twoWeeksAfterLatestMeasurement)

        var idx = -1
        for (var i = 0; i < this.props.teacherBaseProps.IEPGoals.length; i++) {
          if (this.props.teacherBaseProps.IEPGoals[i].iep.id === iepId) {
            idx = i
            break
          }
        }
        
        var IEPGoal = {
          iep: iep,
          requiresAction: requiresAction,
        }
        var IEPGoals = this.props.teacherBaseProps.IEPGoals
        IEPGoals[idx] = IEPGoal

        this.setState({
          iep: IEPGoal,
          IEPGoals: IEPGoals,
        })
      })

    var measurementListener = db.collection(ColType.measurements)
      .where('teacherId', '==', this.state.teacherId)
      .where('schoolId', '==', this.props.teacherBaseProps.teacher.schoolId)
      .where('districtId', '==', this.props.teacherBaseProps.teacher.districtId)
      .where('iepId', '==', iepId)
      .orderBy('timeStamp')
      .onSnapshot((querySnapshot) => {
        var measurements = []
        querySnapshot.forEach((doc) => {
          measurements.push(flattenDoc(doc))
        })

        this.setState({
          measurements: measurements,
          loadingNewData: false,
        })
      })

    var noteListener =  db.collection(ColType.notes)
      .where('teacherId', '==', this.state.teacherId)
      .where('schoolId', '==', this.props.teacherBaseProps.teacher.schoolId)
      .where('districtId', '==', this.props.teacherBaseProps.teacher.districtId)
      .where('iepId', '==', iepId)
      .orderBy('timeStamp', 'desc')
      .limit(25)
      .onSnapshot((querySnapshot) => {
        var notes = []
        querySnapshot.forEach((doc) => {
          notes.push(flattenDoc(doc))
        })

        this.setState({
          notes: notes,
        })
      })
    
    snapshotListeners.push(iepListener)
    snapshotListeners.push(measurementListener)
    snapshotListeners.push(noteListener)
    this.setState({
      snapshotListeners: snapshotListeners,
    })
  }

  unsubscribeListeners() {
    this.state.snapshotListeners.map((unsubscribe, index) => {
      unsubscribe()
      return false
    })
  }

  onOpenChange = (openKeys) => {
    console.log(openKeys)

    this.setState({
      openKeys: openKeys,
    })
  }

  menuClick = ({ item, key, keyPath }) => {
    console.log({ item, key, keyPath })
    if (keyPath.length < 3) return

    this.setState({
      iepId: keyPath[0],
      studentId: keyPath[1],
      selectedKeys: [key],
      loadingNewData: true,
    }, () => {
      this.subscribeMeasurementListener()
    })
  }

  tabChange = (activeKey) => {
    this.setState({
      activeKey: activeKey,
    })
  }

  setChartKey = () => {
    this.setState({
      activeKey: '1',
    })
  }

  render() {
    return (
      <div>
      <Layout className="layout-header-mt">
        {this.props.teacherBaseProps.teacher ?
          <Layout>
            <Sider
              width={250}
              style={{
                overflow: 'auto', height: 'calc(100% - 107px)', position: 'fixed',
                left: 0, marginTop: '40px', borderRight: '1px solid #f1f1f1',
                background: '#fff', overflowX: 'hidden'
              }}>
              {this.props.teacherBaseProps.IEPGoals && 
               this.props.teacherBaseProps.IEPGoals.length === 0  ? 
                <div className="pl-2 pr-2">
                <div className="mb-2 font-16">No IEP goals have been drafted yet.</div>
                <Link
                    to={'/teacher/add-goal-start/' +
                      this.props.teacherBaseProps.teacher.id}
                    className={"inline-flex flex-center flex-h-center up-hover w-100" +
                      " ant-btn" +
                      " ant-btn-primary relative parent-hover btn-vl mr-2"}
                  >
                    <Icon type="plus" className="mr-1" />
                    Draft IEP Goals
                </Link>
              </div>
              : ''}
              <Menu
                mode="inline"
                openKeys={this.state.openKeys}
                selectedKeys={this.state.selectedKeys}
                onOpenChange={this.onOpenChange}
                onClick={this.menuClick}
                theme='light'
                className="w-100 menu-large border-right-none"
              >
                {this.props.teacherBaseProps.IEPGoals && 
                 this.props.teacherBaseProps.grades && 
                Array.from( this.props.teacherBaseProps.grades).map((grade, index) => {
                  var studentsInGrade = this.props.teacherBaseProps
                  .students.filter(s => s.grade === grade)
                  if (studentsInGrade.length === 0) return false
                  return <SubMenu key={grade} title={
                    <span className="font-24">{grade + gradeText(grade)}</span>
                  }
                  >
                    {studentsInGrade.map((student, index) => {
                      var studentIEPGoals = 
                      this.props.teacherBaseProps
                      .IEPGoals.filter(e => e.studentId === student.id)
                      if (studentIEPGoals.length === 0) return false
                      return <SubMenu key={student.id}
                        title={
                          <div
                            title={student.firstName + " " + student.lastName}
                            key={'student-iep-goal-container-' + student.id}
                          >
                            <PersonAvatar
                              size={'large'}
                              person={student}
                              personClassName={'font-bold ellipsis max-w-100px'}
                              containerClassName={'p-1 font-16 h-initial lh-initial'}
                              containerId={'student-avatar-' + student.id}
                            />
                          </div>
                        }
                      >
                        {studentIEPGoals.map((IEPGoal, index) => {
                          var iep = IEPGoal
                          var requiresAction = IEPGoal.requiresAction
                          var completionDateRequiresAction = IEPGoal.completionDateRequiresAction
                          return <Menu.Item key={iep.id}>
                            {requiresAction || completionDateRequiresAction ?
                              <span>
                                {requiresAction ?
                                  <Icon type="warning" 
                                  className="mr-1 text-danger font-bold" 
                                  title="Action required - Add new measurement."/>
                                : ''}

                                {completionDateRequiresAction ?
                                  <Icon type="info-circle-o" 
                                  className="mr-1 text-danger font-bold" 
                                  title="Annual review coming up."/>
                                : ''} 
                              </span>
                            :
                              <Icon type="check" className="mr-1 text-success font-bold" 
                              title="No action required."/>
                            }
                            {capitalizeFirstChar(iep.iep.standardDescription)}
                          </Menu.Item>
                        })
                        }
                      </SubMenu>
                    })
                    }
                  </SubMenu>
                })
                }
              </Menu>
            </Sider>
            <Layout style={{ marginLeft: 250 }}>
            <Layout className="content">
              <Content className="layout-content">
                {this.state.student && this.state.iep ?
                  <div className="sub-menu-width m-lr-auto">
                    <h1 className="mb-2 mt-0">
                      <PersonAvatar
                        size={'large'} person={this.state.student}
                      />
                    </h1>
                    <h2>
                      <Collapse bordered={false} className="inline-block">
                        <Panel
                          header={
                            <span>
                              <Icon type="book" className="mr-1" />
                              <span className="mr-2">
                              {capitalizeFirstChar(this.state.iep.iep.iep.standardDescription)}
                              </span>
                              <span className="text-primary">
                                View present level / IEP goal
                                <Icon type="down" className="ml-1 va-middle font-12"/>
                              </span>
                            </span>
                          }
                          showArrow={false}
                          className="border-bottom-none"
                          key="1"
                        >
                          <div className="mb-3 pt-3 border-top">
                            <div className="font-18 font-bold mb-2">
                              Present Level
                            </div>
                            <span className="font-16">
                              {this.state.iep ?
                                this.state.iep.iep.iep.presentLevel.presentLevelParagraph :
                                ""
                              }
                            </span>
                          </div>
                          <div>
                            <div className="font-18 font-bold mb-2">
                              IEP Goal
                            </div>
                            <div className="font-16 font-bold mb-2">
                              {this.state.iep ?
                                capitalizeFirstChar(this.state.iep.iep.iep.standardDescription) :
                                ''}
                            </div>
                            <span className="font-16">
                              {this.state.iep ?
                              <IEPParagraph iepParagraph={this.state.iep.iep.iep.iepParagraph} /> :
                              ""
                              }
                            </span>
                          </div>
                        </Panel>
                      </Collapse>
                    </h2>
                    {this.state.iep && this.state.measurements ?
                    <div>
                    <div className="pt-4 pb-4 border-top">
                        <Tabs activeKey={this.state.activeKey} onChange={this.tabChange}>
                          <TabPane
                            tab={
                              <Button size={'large'} type="dashed" className="btn-vl up-hover">
                                <Icon type="area-chart" className="mr-1" />
                                <span>Chart</span>
                              </Button>
                            }
                            key="1"
                          >
                          {this.state.loadingNewData ?
                            <div className={"h-500 flex flex-h-center" +
                            " flex-center font-30 font-bold text-cyan"}>
                              <div>
                                <Icon type="loading" className="mr-2"/>
                                <span>Loading...</span>
                              </div>
                            </div> :
                            <div className="mt-4">
                             
                              <div>
                                <h3 
                              className={"w-527 background-light-grey p-1 pl-2 pr-2 ml-3"}>
                                <Row gutter={16}>
                                <Col span={2}>
                                 <Icon type="info-circle-o"
                                  />
                                </Col>
                                <Col span={22}>
                                 <span>
                                 {'Click a point on the chart ' +
                                 'if you want to delete a score you have added.'}
                                 </span>
                                 </Col>
                                 </Row>
                                </h3>
                              <UIChart
                                allowMeasurementAdding={true}
                                teacher={this.props.teacherBaseProps.teacher}
                                school={this.props.teacherBaseProps.school}
                                iep={this.state.iep.iep}
                                student={this.state.student}
                                measurements={this.state.measurements}
                              />
                              
                              </div>
                              
                            </div>
                          }
                          </TabPane>
                          {!this.props.teacherBaseProps.readOnly ?
                          <TabPane
                            tab={
                              this.state.iep.requiresAction ?
                              <Badge count={'Add new measurement'} 
                              style={{ backgroundColor: '#597ef7' }}>
                                 <Button size={'large'} 
                                 type="dashed" className="btn-vl up-hover">
                                <Icon type="plus-circle" className="mr-1" /><span>Add score</span>
                              </Button>
                              </Badge>
                              :
                              <Button size={'large'} 
                              type="dashed" className="btn-vl up-hover">
                                <Icon type="plus-circle" className="mr-1" /><span>Add score</span>
                              </Button>
                            }
                            key="2"
                          >
                           {this.state.loadingNewData ?
                            <div className={"h-500 flex flex-h-center" +
                            " flex-center font-30 font-bold text-cyan"}>
                              <div>
                                <Icon type="loading" className="mr-2"/>
                                <span>Loading...</span>
                              </div>
                            </div> :
                            <div className="mt-4 pt-2 pb-4">
                              <ProgressMonitoringTest
                                key={this.state.iep.iep.id}
                                teacher={this.props.teacherBaseProps.teacher}
                                school={this.props.teacherBaseProps.school}
                                iep={this.state.iep.iep}
                                student={this.state.student}
                                measurements={this.state.measurements}
                                setChartKey={this.setChartKey}
                              />
                            </div>
                           }
                          </TabPane> : ''}
                        </Tabs> 
                    </div>
                    <div className="pt-4 pb-4 mb-4 border-top">
                      {!this.props.teacherBaseProps.readOnly ?
                        <div>
                          <h2><Icon type="mail" className="mr-1 mb-2" />What I need to do next?</h2>
                          <div className="inline-block border-bottom pb-3">
                            <AddNoteForm 
                              key={this.props.teacherBaseProps.teacher.id}
                              teacher={this.props.teacherBaseProps.teacher} 
                              iep={this.state.iep.iep} 
                            />
                          </div>
                        </div>
                      : ''}
                      <div>
                        {this.state.notes.length === 0 ?
                          <div className="mt-2 font-16">
                            No notes to display. Add a note by filling out the form above.
                          </div>
                        : ''}
                        {this.state.notes.map((note, index) => {
                          return <div className="mt-2" key={note.id}>
                            <Note note={note} iep={this.state.iep.iep} allowDelete={true} />
                          </div>
                        })
                        }
                      </div>
                    </div>
                    </div>
                    : ''}
                  </div>
                  :
                  <h2>
                    <Icon type="arrow-left" className="mr-1" />
                    Use the side menu to select a student's goal.</h2>
                }
              </Content>
            </Layout>
            {this.state.componentMounted ? <CustomFooter /> : '' }

            </Layout>
          </Layout>
          : ''}
      </Layout>
      </div>
    )
  }
}

export default ProgressMonitoring
