import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'
import { db } from '../../firebase/Firebase'
import { Store } from './Store'
import ColType from '../.././Types'
import { capitalizeFirstChar } from '../../Util'
import PersonAvatar from '../../customcomponents/PersonAvatar'
import { Button, Icon, message, Tooltip, Row, Col } from 'antd'
var moment = require('moment')

const errorMessage = (description) => {
  message.error(description)
}

const successMessage = (description) => {
  message.success(description)
}

class EventDrag extends Component {
  state = {
    popoverVisible: false,
    componentMounted: false,
  }

  componentDidMount() {
    if (this.props.event) {
      var dayStart = moment.utc(this.props.dayStart)
      var dayEnd = moment.utc(this.props.dayEnd)
      var dayDuration = 630// dayEnd.diff(dayStart, 'minutes')
      var eventStart = moment.utc(this.props.event.start)
      var eventEnd = moment.utc(eventStart).add(this.props.event.duration, 'minutes')
      var eventStartDiff = eventStart.diff(dayStart, 'minutes')
      var eventStartTop = eventStartDiff / dayDuration * 100
      var duration = this.props.event.duration// in minutes

      this.setState({
        dayStart: dayStart,
        dayEnd: dayEnd,
        eventStart: eventStart,
        eventEnd: eventEnd,
        eventTopPercentage: eventStartTop,
        durationRatio: duration / dayDuration * 100,
        componentMounted: true
      })
    } else {
      this.setState({
        componentMounted: true,
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.event) {
      var dayStart = moment.utc(nextProps.dayStart)
      var dayEnd = moment.utc(nextProps.dayEnd)
      var dayDuration = 630// dayEnd.diff(dayStart, 'minutes')
      var eventStart = moment.utc(nextProps.event.start)
      var eventEnd = moment.utc(eventStart).add(nextProps.event.duration, 'minutes')
      var eventStartDiff = eventStart.diff(dayStart, 'minutes')
      var eventStartTop = eventStartDiff / dayDuration * 100
      var duration = nextProps.event.duration// in minutes

      this.setState({
        dayStart: dayStart,
        dayEnd: dayEnd,
        eventStart: eventStart,
        eventEnd: eventEnd,
        eventTopPercentage: eventStartTop,
        durationRatio: duration / dayDuration * 100,
        componentMounted: true
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  dragStart = (e) => {
    // stop drag propogation to BlockDrag
    e.stopPropagation()
    console.log(this.props)
    Store['schedule'].dragProps = this.props
    this.props.setIsDragging(true)
    e.dataTransfer.setData('text', 'foo') // firefox needs this to do drag and drop
    var el = document.createElement("img")
    el.src = this.props.servicedIn === "Teacher Event" ? "/teacher-drag-circle.PNG" :
                                       this.props.servicedIn === "General Education" ? 
                                       "/ge-drag-circle.PNG" :
                                       "/se-drag-circle.PNG"                          
    e.dataTransfer.setDragImage(el,
      25, 0)
  }

  dragEnd = (e) => {
    // stop drag propogation to BlockDrag
    e.stopPropagation()
    console.log('drag end')
    this.props.setIsDragging(false)
  }

  handlePopoverVisibleChange = (visible) => {
    this.setState({ popoverVisible: visible })
  }

  closePopover = () => {
    this.setState({
      popoverVisible: false,
    })
  }

  delete = () => {
    var studentsGeneral = this.props.studentsGeneral
    var ieps = this.props.ieps
    ieps.splice(this.props.index, 1)

    if (ieps.length === 0 && studentsGeneral.length === 0) {
      db.collection(ColType.calendarEvents)
        .doc(this.props.event.id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!")
          successMessage('Group deleted successfully.')
        }).catch((error) => {
          console.error("Error removing document: ", error)
          errorMessage('Something went wrong deleting the group.')
        })
    } else {
      var maxDuration = 0
      var IEPIds = []
      ieps.map((iep, index) => {
        IEPIds.push({
          iepId: iep.id,
          iepDuration: this.props.IEPDict[iep.id].iep.service.serviceDuration
        })

        if (parseInt(this.props.IEPDict[iep.id].iep.service.serviceDuration, 10) > maxDuration) {
          maxDuration = parseInt(this.props.IEPDict[iep.id].iep.service.serviceDuration, 10)
        }
        return false
      })

      db.collection(ColType.calendarEvents)
        .doc(this.props.event.id)
        .update({
          ieps: IEPIds,
          duration: maxDuration,
        })
        .then(() => {
          console.log("IEP was successfully deleted from the group.")
          successMessage('IEP was successfully deleted from the group.')
        }).catch((error) => {
          console.error("Error removing document: ", error)
          errorMessage('Something went wrong deleting the IEP.')
        })
    }
  }

  deleteStudent = () => {
    var ieps = this.props.ieps
    var studentsGeneral = this.props.studentsGeneral
    studentsGeneral.splice(this.props.index, 1)

    if (ieps.length === 0 && studentsGeneral.length === 0) {
      db.collection(ColType.calendarEvents)
        .doc(this.props.event.id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!")
          successMessage('Group deleted successfully.')
        }).catch((error) => {
          console.error("Error removing document: ", error)
          errorMessage('Something went wrong deleting the group.')
        })
    } else {
      db.collection(ColType.calendarEvents)
        .doc(this.props.event.id)
        .update({
          studentsGeneral: studentsGeneral,
        })
        .then(() => {
          console.log("IEP was successfully deleted from the group.")
          successMessage('IEP was successfully deleted from the group.')
        }).catch((error) => {
          console.error("Error removing document: ", error)
          errorMessage('Something went wrong deleting the IEP.')
        })
    }
  }

  render() {
    console.log(this.props)
    if (this.state.componentMounted &&
      this.props.event === undefined &&
      this.props.iep !== null &&
      this.props.IEPScheduled) {
      var nonEventMetScheduleRequirement =
        this.props.IEPScheduled[this.props.iep.id].scheduledActual >=
        this.props.IEPScheduled[this.props.iep.id].scheduledRequired
    }

    return (
      <div draggable={this.props.readOnly ? false : (this.state.componentMounted
         ? this.props.event ? false :
        nonEventMetScheduleRequirement ?
          false :
          true :
        false)}
        onDragStart={this.dragStart}
        onDragEnd={this.dragEnd}
        className={(this.props.event ?
          "event-container-placed" :
          "") +
          (this.props.servicedIn === 'Teacher Event' ? ' pl-2 pr-2' : '') +
          (this.props.className ? ' ' + this.props.className : '')
        }
      >
        {/** 
            Event rendered in the calendar.
          */}
        {this.state.componentMounted && this.props.event ?
          <div className="p-1 br-2">
            <div className={"inline-flex flex-v-center"}
            >
              <PersonAvatar containerClassName="mr-1 mw-150px inline-flex flex-v-center"
                size={'default'} person={this.props.student} />
              {this.props.iep ?
                <div className="inline-flex flex-v-center">
                  <div className="mr-1 mw-200px inline-flex flex-v-center">
                    {capitalizeFirstChar(this.props.iep.iep.standardDescription)}
                  </div>
                  <div className="mw-150px inline-flex flex-v-center">
                    <span className="mr-1">
                      {this.props.iep.iep.service.serviceDuration} minutes
                    </span>
                  </div>
                </div>
              :
                <div className="inline-flex flex-v-center">
                  <div className="mr-1 mw-200px inline-flex flex-v-center">
                    Not working on any particular goal.
                  </div>
                  <div className="mw-150px inline-flex flex-v-center">
                    <span className="mr-1">
                      {this.props.event.duration} minutes
                    </span>
                  </div>
                </div> 
              }

            </div>
            {!this.props.readOnly ?
            <div className="inline-flex">
              {this.props.iep ?
                <Tooltip 
                  title="Delete IEP from group"
                  placement="right"
                  mouseEnterDelay={.2}
                >
                  <Button shape='circle' icon='delete' onClick={this.delete} />
                </Tooltip>
              :
                <Tooltip 
                  title="Delete student from group"
                  placement="right"
                  mouseEnterDelay={.2}
                >
                  <Button shape='circle' icon='delete' onClick={this.deleteStudent} />
                </Tooltip>
              }
            </div> : ''}
          </div>
          : ''}

        {/** 
            Event rendered in the side menu of ieps to drop onto the calendar.
          */}
        {this.state.componentMounted &&
          this.props.event === undefined &&
          this.props.IEPScheduled &&
          this.props.iep !== null ?
          <div
            className={"mt-2 p-2 pb-0 w-100 h-100 br-2 ant-btn text-left" +
              " white-space-normal inline-block relative font-15 lh-30 ant-shadow-small" +
              (this.props.readOnly ? ' cursor-not-allowed' : '') +
              (nonEventMetScheduleRequirement ? '' : ' cursor-grab')}
            disabled={this.props.readOnly || nonEventMetScheduleRequirement}
            title={nonEventMetScheduleRequirement ?
              "This IEP Goal's service requirements have been met." :
              ''
            }
          >
            {nonEventMetScheduleRequirement ?
              <Icon type="check" className="text-success absolute-tr p-1" />
              :
              ''}
            <div className="lh-normal mb-05">
              <Row gutter={16}>
                <Col span={4}>
                  <Icon className="font-18" type="book" />
                </Col>
                <Col span={20}>
                  {capitalizeFirstChar(this.props.iep.iep.standardDescription)}
                </Col>
              </Row>
            </div>
            <div>
            <Row gutter={16}>
              <Col span={4}>
                <Icon className="font-18" type="clock-circle-o" />
              </Col>
                <Col span={20}>
              <span className="mr-1">{this.props.iep.iep.service.serviceDuration} minutes</span>
              </Col>
              </Row>
            </div>
            <div>
            <Row gutter={16}>
              <Col span={4}>
                <Icon className="font-18" type="schedule" />
              </Col>
                <Col span={20}>
              <span>{this.props.IEPScheduled[this.props.iep.id].scheduledActual + ' / ' +
                this.props.IEPScheduled[this.props.iep.id].scheduledRequired +
                ' days a week'}
              </span>
              </Col>
              </Row>
            </div>
            <div>
            <Row gutter={16}>
              <Col span={4}>
                <Icon className="font-18" type="environment-o" />
              </Col>
                <Col span={20}>
              <span
                className={(this.props.iep.iep.service.servicedIn === 'General Education' ?
                  "text-ge " :
                  "text-se ") + "font-bold"}>
                {this.props.iep.iep.service.servicedIn}
              </span>
              </Col>
              </Row>
            </div>
            <div 
              className={"text-center border-top pt-1 mt-1 pb-1 " +
              "uppercase font-12 font-bold text-muted m-lr-minus-16"}>
              <Icon type="calendar" className="mr-1 font-16" />
              <span>Drag to Schedule</span>
            </div>
          </div>
          : ''}
        
          {/** 
            Event rendered in the side menu of ieps to drop onto the calendar.
            Student version for general event.
          */}
          {this.state.componentMounted &&
          this.props.event === undefined &&
          this.props.IEPScheduled &&
          this.props.iep === null ?
            <div className={"mt-2 p-2 pb-0 w-100 h-100 br-2 ant-btn text-left" +
            " white-space-normal inline-block relative font-15 lh-30 ant-shadow-small" +
            (this.props.servicedIn === 'Teacher Event' ? ' text-center' : '') +
            (this.props.readOnly ? ' cursor-not-allowed' : '') +
            ' cursor-grab'}
            disabled={this.props.readOnly}
            >
              <div className={'text-center ' + (this.props.servicedIn === 'Teacher Event' ? '' :
                  this.props.servicedIn === 'General Education' ?
                  "text-ge " :
                  "text-se ") + "font-bold"}>
                {this.props.servicedIn === 'Teacher Event' ? ' Teacher Event' :
                this.props.servicedIn + ' Event'}
              </div>
              <div 
                className={"text-center border-top pt-1 mt-1 pb-1 " +
                "uppercase font-12 font-bold text-muted m-lr-minus-16"}>
                <Icon type="calendar" className="mr-1 font-16" />
                <span>Drag to Schedule</span>
              </div>
            </div>
          : ''}
      </div>
    )
  }
}

//EventDrag = DragSource(Types.ITEM, dragSource, dragCollect)(EventDrag)

export default EventDrag