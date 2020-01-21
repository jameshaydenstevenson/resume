import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/GlobalStyle.css'
//import { DragDropContextProvider } from 'react-dnd'
//import HTML5Backend from 'react-dnd-html5-backend'
//import PersonHeader from '../../login/PersonHeader'
import { Store } from './Store'
//import PersonAvatar from '../../customcomponents/PersonAvatar'
import CustomFooter from '../../login/CustomFooter'
import EventDrag from './EventDrag'
import SchedulerDayDrags from './SchedulerDayDrags'
import SchedulerDayDropOuter from './SchedulerDayDropOuter'
import SchedulerDayDropInner from './SchedulerDayDropInner'
import ReactToPrint from "react-to-print"
import { getIDFromURL, getInitials, gradeText } from '../.././Util'
import { Layout, Collapse, Avatar, Icon, Menu, message, Button } from 'antd'
const { Content, Sider  } = Layout
const Panel = Collapse.Panel
const SubMenu = Menu.SubMenu
var moment = require('moment')

class Scheduler extends Component {
  state = {
    timeStep: 15,       // minutes
    timeRatio: 60 / 15, // hours / minutes
    hours: 10,          // time duration from start to end (7 AM - 5 PM)
    mondayTimes: [],
    events: [],
    IEPScheduled: {},
    timeSlots: Array(12).fill(0),
    dragProps: null,
    isDragging: false,
    isCopyAndPasting: false,
    storeKey: 'schedule',
  }

  copyPasteMessage = () => {
    message.destroy()
    message.info(<div className="p-4">
      <h2>Calendar event is copied, click on the schedule to paste it.</h2>
      <Button 
        size={'large'} 
        type={'danger'}
        onClick={() => Store[this.state.storeKey].setIsCopyPasting(false)}
      >
        <Icon type="close" className="font-white" /> All done copy and pasting
      </Button>
    </div>, 0)
  }
  
  componentWillReceiveProps(nextProps) {
    Store[this.state.storeKey].events = nextProps.teacherBaseProps.events
  }

  componentDidMount() {
    document.title = 'My Services - dot it'
    // preload images
    /**var imgGEDrag = new Image()
    addClass(imgGEDrag, 'display-none')
    imgGEDrag.src = '/ge-drag.png'
    var imgSEDrag = new Image()
    addClass(imgSEDrag, 'display-none')
    imgSEDrag.src = '/se-drag.png'*/

    // populate store values, in the future if you have more than one
    // scheduler at a time pass in the storeKey as props.
    console.log('store', Store)
    console.log('storeKey', this.state.storeKey)
    Store[this.state.storeKey] = {}
    Store[this.state.storeKey].dragProps = null
    Store[this.state.storeKey].dropProps = null
    Store[this.state.storeKey].isCopyAndPasting = false
    Store[this.state.storeKey].setIsCopyPasting = (newValue) => {
      if (newValue) {
        Store[this.state.storeKey].isCopyAndPasting = true
        this.copyPasteMessage()

        setTimeout(() => {
          this.setState({
            isCopyAndPasting: newValue,
          })
        })
      }
      else {
        Store[this.state.storeKey].isCopyAndPasting = false
        Store[this.state.storeKey].dragProps = null
        message.destroy()

        setTimeout(() => {
          this.setState({
            isCopyAndPasting: newValue,
          })
        })
      }
    }
    Store[this.state.storeKey].events = this.props.teacherBaseProps.events

    var mondayStart = moment.utc(new Date(Date.UTC(2015, 5, 1, 7, 30, 0)))
    var tuesdayStart = moment.utc(new Date(Date.UTC(2015, 5, 2, 7, 30, 0)))
    var wednesdayStart = moment.utc(new Date(Date.UTC(2015, 5, 3, 7, 30, 0)))
    var thursdayStart = moment.utc(new Date(Date.UTC(2015, 5, 4, 7, 30, 0)))
    var fridayStart = moment.utc(new Date(Date.UTC(2015, 5, 5, 7, 30, 0)))
    var mondayTimes = [],
      tuesdayTimes = [],
      wednesdayTimes = [],
      thursdayTimes = [],
      fridayTimes = []

    for (var i = 0; i <= this.state.timeRatio * this.state.hours; i++) {
      var newMondayTime = moment.utc(mondayStart)
      var newTuesdayTime = moment.utc(tuesdayStart)
      var newWednesdayTime = moment.utc(wednesdayStart)
      var newThursdayTime = moment.utc(thursdayStart)
      var newFridayTime = moment.utc(fridayStart)

      mondayTimes.push(newMondayTime)
      tuesdayTimes.push(newTuesdayTime)
      wednesdayTimes.push(newWednesdayTime)
      thursdayTimes.push(newThursdayTime)
      fridayTimes.push(newFridayTime)

      mondayStart = mondayStart.add(this.state.timeStep, "minutes")
      tuesdayStart = tuesdayStart.add(this.state.timeStep, "minutes")
      wednesdayStart = wednesdayStart.add(this.state.timeStep, "minutes")
      thursdayStart = thursdayStart.add(this.state.timeStep, "minutes")
      fridayStart = fridayStart.add(this.state.timeStep, "minutes")
    }

    this.setState({
      mondayTimes: mondayTimes,
      tuesdayTimes: tuesdayTimes,
      wednesdayTimes: wednesdayTimes,
      thursdayTimes: thursdayTimes,
      fridayTimes: fridayTimes,
    })

    var teacherId = getIDFromURL(window.location)
    console.log(teacherId)

    this.setState({
      teacherId: teacherId,
    })
  }

  setDragProps = (newDragProps) => {
    this.setState({
      dragProps: newDragProps
    })
  }

  getDragProps = () => {
    return this.state.dragProps
  }

  setIsDragging = (isDragging) => {
    setTimeout(() => {
      this.setState({
        isDragging: isDragging,
      })
    })
  }

  render() {
    return (
      <div>
      <Layout className="layout-header-mt">
        <div className="display-none">
          <img alt="preload-ge-drag" src="/teacher-drag-circle.PNG" 
          height="0" width="0" className="display-none" />
          <img alt="preload-ge-drag" src="/ge-drag-circle.PNG" 
          height="0" width="0" className="display-none" />
          <img alt="preload-de-drag" src="/se-drag-circle.PNG" 
          height="0" width="0" className="display-none" />
        </div>
        {this.props.teacherBaseProps.teacher ?
          <Sider
            width={270}
            style={{
              overflow: 'auto', overflowX: 'hidden', height: 'calc(100% - 107px)', 
              position: 'fixed',
              left: 0, marginTop: 40, borderRight: '1px solid #f1f1f1',
              background: '#fff',
            }}>
            <div>
              <div>
         
                 <div className="pb-3 border-bottom">
                  <div className="pb-3 border-bottom">
                    <h3 className="mt-2 mb-0 pl-2 pr-2 text-muted uppercase font-bold font-14">
                      Schedule teacher event
                    </h3>
                    <EventDrag
                      dragName={'teacher'}
                      iep={null}
                      readOnly={this.props.teacherBaseProps.readOnly}
                      servicedIn={'Teacher Event'}
                      student={null}
                      teacher={this.props.teacherBaseProps.teacher}
                      schedulerState={this.state}
                      IEPScheduled={this.props.teacherBaseProps.IEPScheduled}
                      dayStart={moment.utc(new Date(
                        Date.UTC(2015, 5, 1, 6, 0, 0))).format()}
                      dayEnd={moment.utc(new Date(
                        Date.UTC(2015, 5, 1, 17, 0, 0))).format()}
                      setDragProps={this.setDragProps}
                      setIsDragging={this.setIsDragging}
                      key={'teacher-drag-event'}
                    />
                  </div>
                  <h3 className="mt-3 mb-0 pl-2 pr-2 text-muted uppercase font-bold font-14">
                    Schedule student events
                  </h3>
                  {this.props.teacherBaseProps.IEPGoals &&
                 this.props.teacherBaseProps.IEPGoals.length > 0 ?
                  <div className="">
                    
                  </div>
                  :
                  <h2 className="p-2">
                  {<div>
                    <div className="mb-4">No IEP goals have been drafted yet.</div>
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
                  }
                  </h2>
                  }
                 <Menu
                 mode="inline"
                 theme='light'
                 className="menu-large border-right-none"
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
                <Collapse className="arrow-mt-1 grey-hover-parent"
                 bordered={false} accordion={true}>
                  {studentsInGrade.map((student, index) => {
                    var studentIEPGoals =
                      this.props.teacherBaseProps.IEPGoals.filter(e => e.studentId === student.id)
                    if (studentIEPGoals.length === 0) return false
                    return <Panel header={<span>
                      <div className="font-16 flex flex-center"
                           id={'student-avatar-' + student.id}
                      >
                        <Avatar
                          size="large"
                          className="mr-8"
                          style={{ backgroundColor: student.avatarColor }}
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
                    </span>
                    } key={"panel-" + student.id}>
                      <div key={'student-iep-goal-container-' + student.id}>
                      {/**<h3 className={"mt-2 mb-0 text-muted uppercase" +
                                     " font-bold font-14 text-left"}>
                        Schedule student only
                      </h3>
                          <EventDrag
                            dragName={'iep'}
                            iep={null}
                            readOnly={this.props.teacherBaseProps.readOnly}
                            servicedIn={'General Education'}
                            student={student}
                            teacher={this.props.teacherBaseProps.teacher}
                            schedulerState={this.state}
                            IEPScheduled={this.props.teacherBaseProps.IEPScheduled}
                            dayStart={moment.utc(new Date(
                              Date.UTC(2015, 5, 1, 6, 0, 0))).format()}
                            dayEnd={moment.utc(new Date(
                              Date.UTC(2015, 5, 1, 17, 0, 0))).format()}
                            setDragProps={this.setDragProps}
                            setIsDragging={this.setIsDragging}
                            key={'student-student-goal-ge-' + student.id}
                          />
                          <EventDrag
                            dragName={'iep'}
                            iep={null}
                            readOnly={this.props.teacherBaseProps.readOnly}
                            servicedIn={'Special Education'}
                            student={student}
                            teacher={this.props.teacherBaseProps.teacher}
                            schedulerState={this.state}
                            IEPScheduled={this.props.teacherBaseProps.IEPScheduled}
                            dayStart={moment.utc(new Date(
                              Date.UTC(2015, 5, 1, 6, 0, 0))).format()}
                            dayEnd={moment.utc(new Date(
                              Date.UTC(2015, 5, 1, 17, 0, 0))).format()}
                            setDragProps={this.setDragProps}
                            setIsDragging={this.setIsDragging}
                            key={'student-student-goal-se-' + student.id}
                            />*/}
                        <div>
                          {studentIEPGoals.map((iep, index) => {
                            return <EventDrag
                              dragName={'iep'}
                              iep={iep}
                              readOnly={this.props.teacherBaseProps.readOnly}
                              servicedIn={iep.iep.service.servicedIn}
                              student={student}
                              teacher={this.props.teacherBaseProps.teacher}
                              schedulerState={this.state}
                              IEPScheduled={this.props.teacherBaseProps.IEPScheduled}
                              dayStart={moment.utc(new Date(
                                Date.UTC(2015, 5, 1, 6, 0, 0))).format()}
                              dayEnd={moment.utc(new Date(
                                Date.UTC(2015, 5, 1, 17, 0, 0))).format()}
                              setDragProps={this.setDragProps}
                              setIsDragging={this.setIsDragging}
                              key={'student-iep-goal-' + iep.id}
                            />
                          })
                          }
                        </div>
                      </div>
                    </Panel>
                  })
                  }
                </Collapse>
                </SubMenu>
                 })
                
                }
                </Menu>
                </div>
              </div>
              <div className="p-2 pt-3 inline-block w-100">
                  <h3 className={"mt-0 mb-2 " +
                  "text-muted uppercase font-bold font-14"}>
                    Print schedule
                  </h3>
                  <ReactToPrint
                    trigger={() => 
                      <Button
                        size={'large'}
                        className="inline-block w-100 up-hover"
                      >
                      <Icon type="printer" />
                        Print
                      </Button>
                    }
                    content={() => this.componentRef}
                  />
                </div>
            </div>
          </Sider> : ''}
          <Layout style={{ marginLeft: 270 }}>
            <Layout className="content">
            <Content 
              className="layout-content" 
              ref={el => (this.componentRef = el)}
            >
            {this.props.teacherBaseProps.teacher ?
              <div>
                <div className={'relative h-100 border-top br-2' +
                  (this.state.isDragging ? ' is-dragging' : '') +
                  (this.state.isCopyAndPasting ? ' isCopyAndPasting' : '')}>
                  <div>
                    <div className="h-50 flex">
                      <div style={{ width: '50px' }}
                        className="h-50 flex-col">
                        <div className="time-gap border-left"></div>
                        {this.state.mondayTimes.map((mondayTime, rowIndex) => {
                          return <div
                            className={"border-bottom border-left text-center h-50px relative"}
                            key={'timestamp-' + mondayTime.format()}
                          >
                            <span className="absolute-tl">{mondayTime.format('hh:mm A')}</span>
                          </div>
                        })
                        }
                      </div>
                      <div className="w-100 h-100">
                        <div className="w-20 inline-block">
                          <div className={"h-100px font-18 text-center border-left " +
                            "border-bottom flex flex-v-center flex-h-center"}>
                            <span className="font-bold">Monday</span>
                          </div>
                          <div className="relative">
                            {this.state.mondayTimes && 
                            this.state.mondayTimes.map((timeValue, rowIndex) => {
                              return <SchedulerDayDropOuter
                                timeValue={timeValue}
                                key={'monday-outer-' + rowIndex}
                              >
                                <SchedulerDayDropInner
                                  timeValue={timeValue}
                                  timeSlots={this.state.timeSlots}
                                />
                              </SchedulerDayDropOuter>
                            })
                            }
                            <SchedulerDayDrags
                              dayString={'Monday'}
                              dayNumber={1}
                              readOnly={this.props.teacherBaseProps.readOnly}
                              timesArray={this.state.mondayTimes}
                              timeSlots={this.state.timeSlots}
                              events={this.props.teacherBaseProps.events}
                              IEPGoals={this.props.teacherBaseProps.IEPGoals}
                              IEPDict={this.props.teacherBaseProps.IEPDict}
                              teacher={this.props.teacherBaseProps.teacher}
                              studentDict={this.props.teacherBaseProps.studentDict}
                              setDragProps={this.setDragProps}
                              setIsDragging={this.setIsDragging}
                            />
                          </div>
                        </div>
                        <div className="w-20 inline-block">
                          <div className={"h-100px font-18 text-center border-left " +
                            "border-bottom flex flex-v-center flex-h-center"}>
                            <span className="font-bold">Tuesday</span>
                          </div>
                          <div className="relative">
                            {this.state.tuesdayTimes && 
                            this.state.tuesdayTimes.map((timeValue, rowIndex) => {
                              return <SchedulerDayDropOuter
                                timeValue={timeValue}
                                key={'tuesday-outer-' + rowIndex}
                              >
                                <SchedulerDayDropInner
                                  timeValue={timeValue}
                                  timeSlots={this.state.timeSlots}
                                />
                              </SchedulerDayDropOuter>
                            })
                            }
                            <SchedulerDayDrags
                              dayString={'Tuesday'}
                              dayNumber={2}
                              readOnly={this.props.teacherBaseProps.readOnly}
                              timesArray={this.state.tuesdayTimes}
                              timeSlots={this.state.timeSlots}
                              events={this.props.teacherBaseProps.events}
                              IEPGoals={this.props.teacherBaseProps.IEPGoals}
                              IEPDict={this.props.teacherBaseProps.IEPDict}
                              teacher={this.props.teacherBaseProps.teacher}
                              studentDict={this.props.teacherBaseProps.studentDict}
                              setDragProps={this.setDragProps}
                              setIsDragging={this.setIsDragging}
                            />
                          </div>
                        </div>
                        <div className="w-20 inline-block">
                          <div className={"h-100px font-18 text-center border-left " +
                            "border-bottom flex flex-v-center flex-h-center"}>
                            <span className="font-bold">Wednesday</span>
                          </div>
                          <div className="relative">
                            {this.state.wednesdayTimes && 
                            this.state.wednesdayTimes.map((timeValue, rowIndex) => {
                              return <SchedulerDayDropOuter
                                timeValue={timeValue}
                                key={'wednesday-outer-' + rowIndex}
                              >
                                <SchedulerDayDropInner
                                  timeValue={timeValue}
                                  timeSlots={this.state.timeSlots}
                                />
                              </SchedulerDayDropOuter>
                            })
                            }
                            <SchedulerDayDrags
                              dayString={'Wednesday'}
                              dayNumber={3}
                              readOnly={this.props.teacherBaseProps.readOnly}
                              timesArray={this.state.wednesdayTimes}
                              timeSlots={this.state.timeSlots}
                              events={this.props.teacherBaseProps.events}
                              IEPGoals={this.props.teacherBaseProps.IEPGoals}
                              IEPDict={this.props.teacherBaseProps.IEPDict}
                              teacher={this.props.teacherBaseProps.teacher}
                              studentDict={this.props.teacherBaseProps.studentDict}
                              setDragProps={this.setDragProps}
                              setIsDragging={this.setIsDragging}
                            />
                          </div>
                        </div>
                        <div className="w-20 inline-block">
                          <div className={"h-100px font-18 text-center border-left " +
                            "border-bottom flex flex-v-center flex-h-center"}>
                            <span className="font-bold">Thursday</span>
                          </div>
                          <div className="relative">
                            {this.state.thursdayTimes && 
                            this.state.thursdayTimes.map((timeValue, rowIndex) => {
                              return <SchedulerDayDropOuter
                                timeValue={timeValue}
                                key={'thursday-outer-' + rowIndex}
                              >
                                <SchedulerDayDropInner
                                  timeValue={timeValue}
                                  timeSlots={this.state.timeSlots}
                                />
                              </SchedulerDayDropOuter>
                            })
                            }
                            <SchedulerDayDrags
                              dayString={'Thursday'}
                              dayNumber={4}
                              readOnly={this.props.teacherBaseProps.readOnly}
                              timesArray={this.state.thursdayTimes}
                              timeSlots={this.state.timeSlots}
                              events={this.props.teacherBaseProps.events}
                              IEPGoals={this.props.teacherBaseProps.IEPGoals}
                              IEPDict={this.props.teacherBaseProps.IEPDict}
                              teacher={this.props.teacherBaseProps.teacher}
                              studentDict={this.props.teacherBaseProps.studentDict}
                              setDragProps={this.setDragProps}
                              setIsDragging={this.setIsDragging}
                            />
                          </div>
                        </div>
                        <div className="w-20 inline-block border-right">
                          <div className={"h-100px font-18 text-center border-left " +
                            "border-bottom flex flex-v-center flex-h-center"}>
                            <span className="font-bold">Friday</span>
                          </div>
                          <div className="relative">
                            {this.state.fridayTimes && 
                            this.state.fridayTimes.map((timeValue, rowIndex) => {
                              return <SchedulerDayDropOuter
                                timeValue={timeValue}
                                key={'friday-outer-' + rowIndex}
                              >
                                <SchedulerDayDropInner
                                  timeValue={timeValue}
                                  timeSlots={this.state.timeSlots}
                                />
                              </SchedulerDayDropOuter>
                            })
                            }
                            <SchedulerDayDrags
                              dayString={'Friday'}
                              dayNumber={5}
                              readOnly={this.props.teacherBaseProps.readOnly}
                              timesArray={this.state.fridayTimes}
                              timeSlots={this.state.timeSlots}
                              events={this.props.teacherBaseProps.events}
                              IEPGoals={this.props.teacherBaseProps.IEPGoals}
                              IEPDict={this.props.teacherBaseProps.IEPDict}
                              teacher={this.props.teacherBaseProps.teacher}
                              studentDict={this.props.teacherBaseProps.studentDict}
                              setDragProps={this.setDragProps}
                              setIsDragging={this.setIsDragging}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              : ''}
          </Content>
        </Layout>
        <CustomFooter />
        </Layout>
      </Layout>
      </div>
    )
  }
}

export default Scheduler
