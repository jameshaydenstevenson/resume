import React, { Component } from 'react'
import { db } from '../../firebase/Firebase'
import { Store } from './Store'
import ColType from '../.././Types'
import { message, Popover, Icon } from 'antd'
var moment = require('moment')

const errorMessage = (description) => {
  message.error(description)
}

class DateDrop extends Component {
  state = {
    isOver: false,
    isValidDrop: true,
    invalidDropMessage: '',
    errorPopoverVisible: false,
    popoverTimeout: setTimeout(() => {}),
    componentMounted: false,
  }

  dragOver = (e) => {
    e.preventDefault()
    if (this.state.isOver) return
    var isValidDrop = this.validDrop(false)
    if (!isValidDrop) {
      this.setState({
        popoverTimeout: setTimeout(() => {
          this.setState({
            errorPopoverVisible: true,
          })
        }, 500)
      })
    }

    this.setState({
      isValidDrop: isValidDrop,
      isOver: true
    })
  }

  dragExit = (e) => {
    e.preventDefault()
    if (!this.state.isOver) return
    clearTimeout(this.state.popoverTimeout)

    this.setState({
      errorPopoverVisible: false,
      isValidDrop: true,
      isOver: false,
    })
  }

  drop = (e) => {
    e.preventDefault()
    //console.log("dropped")
    //console.log("dragProps", this.props.getDragProps())
    //console.log("dropProps", this.props)
    clearTimeout(this.state.popoverTimeout)
    this.moveEvent()
    this.setState({
      errorPopoverVisible: false,
      isValidDrop: true,
      invalidDropMessage: '',
      isOver: false,
    })
  }

  // returns true if an event is already at the location you
  // are trying to drop at, else it returns false.
  dropTimeOccupied = (checkEventId) => {
    var occupied = false
    var dragProps = Store['schedule'].dragProps

    if (checkEventId) occupied = Store['schedule'].events.find(se =>
      se.id !== dragProps.event.id &&
      moment.utc(se.start).isSame(moment.utc(this.props.dateSlot)) &&
      se.index === this.props.columnIndex)
    else occupied = Store['schedule'].events.find(se =>
      moment.utc(se.start).isSame(moment.utc(this.props.dateSlot)) &&
      se.index === this.props.columnIndex)

    return occupied
  }

  dropTimeWidthDurationExceedsMax = (duration) => {
    var newEvent = moment.utc(this.props.dateSlot).add(duration, 'minutes')
    var newEventHour = newEvent.hour()
    var newEventMinutes = newEvent.minutes()
    if (newEventHour > 17 || (newEventHour >= 17 && newEventMinutes > 45)) return true
    return false
  }

  dropInWrongBlock = (duration, servicedIn) => {
    var dropMoment = moment.utc(this.props.dateSlot)
    var dragEndMoment = moment.utc(this.props.dateSlot).add(duration, 'minutes')
    var dragProps = Store['schedule'].dragProps
    var events = Store['schedule'].events

    for (var i = 0; i < events.length; i++) {
      var event = events[i]
      var start = moment.utc(event.start)
      // don't check for the currently dragged block if it interferes with itself
      // and not in copy paste mode (we want to check if the paste event interferes)
      if (!Store['schedule'].isCopyAndPasting && 
          dragProps.dragName === 'block' && 
          event.id === dragProps.event.id) continue
      // event starts before another event
      if (dropMoment.isBefore(start) &&
        // event ends in between another event
        dragEndMoment.isAfter(start)) {
        // event would breach an event of a different service type
        return true
        /**if (event.servicedIn !== servicedIn) {
          return true
        }
        // event would breach an event of the same service type
        else {
          // should they merge?
        }*/
      }
    }

    return false
  }

  moveEvent = () => {
    var dragProps = Store['schedule'].dragProps
    if (!dragProps) return
    if (!this.props.dateSlot) return
    console.log(dragProps.dragName)

    // the event is not in the calendar, add it
    // coming from the side menu
    if (Store['schedule'].dragProps.dragName === 'iep') {
      if (!this.validDrop(true)) return

      // This was for when you could drag a goal in a black to another block.
      /**if (dragProps.event) {
        var dragIEPS = dragProps.event.ieps
        var idIndex = dragIEPS.indexOf(dragProps.iep.id)
        var iepIndex = dragProps.ieps.indexOf(dragProps.iep)
        console.log(dragProps.ieps.length, 'before')
        if (idIndex > -1) {
          dragIEPS.splice(idIndex, 1)
          dragProps.ieps.splice(iepIndex, 1)
        } else {
          errorMessage('Something went wrong.')
          return
        }

        // if there are still ieps in the block update it
        if (dragIEPS.length > 0) {
          var maxDuration = 0
          console.log(dragProps.ieps, iepIndex)
          dragProps.ieps.map((item, index) => {
            console.log(parseInt(item.iep.service.serviceDuration, 10))
            if (parseInt(item.iep.service.serviceDuration, 10) > maxDuration) {
              maxDuration = parseInt(item.iep.service.serviceDuration, 10)
            }
            return false
          })

          db.collection(ColType.calendarEvents)
            .doc(dragProps.event.id)
            .update({
              duration: maxDuration,
              ieps: dragIEPS,
            })
            .then(() => {

            })
        }
        // else remove the block
        else {
          db.collection(ColType.calendarEvents)
            .doc(dragProps.event.id)
            .delete()
        }
      }*/

      if (dragProps.iep !== null) {
        db.collection(ColType.calendarEvents)
          .add({
            title: 'No title',
            index: this.props.columnIndex,
            day: parseInt(this.props.dateSlot.format('D'), 10),
            startTime: this.props.dateSlot._d,
            endTime: moment.utc(this.props.dateSlot).add(60, 'minutes')._d,
            duration: dragProps.iep.iep.service.serviceDuration,
            ieps: [{iepId: dragProps.iep.id, 
              iepDuration: dragProps.iep.iep.service.serviceDuration}],
            studentsGeneral: [], // students who are in the group, but without an iep goal
            servicedIn: dragProps.iep.iep.service.servicedIn,
            teacherId: dragProps.teacher.id,
            schoolId: dragProps.teacher.schoolId,
            districtId: dragProps.teacher.districtId,
          })
          .then((docRef) => {

          })
          .catch((error) => {
            Store['schedule'].dragProps = null
          })
      }
      else {
        db.collection(ColType.calendarEvents)
          .add({
            title: 'No title',
            index: this.props.columnIndex,
            day: parseInt(this.props.dateSlot.format('D'), 10),
            startTime: this.props.dateSlot._d,
            endTime: moment.utc(this.props.dateSlot).add(60, 'minutes')._d,
            duration: 15,
            ieps: [],
            studentsGeneral: [dragProps.student.id],
            servicedIn: dragProps.servicedIn,
            teacherId: dragProps.teacher.id,
            schoolId: dragProps.teacher.schoolId,
            districtId: dragProps.teacher.districtId,
          })
          .then((docRef) => {

          })
          .catch((error) => {
            Store['schedule'].dragProps = null
          })
      }
    }
    else if (Store['schedule'].dragProps.dragName === 'teacher') {
      db.collection(ColType.calendarEvents)
      .add({
        title: 'No title',
        index: this.props.columnIndex,
        day: parseInt(this.props.dateSlot.format('D'), 10),
        startTime: this.props.dateSlot._d,
        endTime: moment.utc(this.props.dateSlot).add(60, 'minutes')._d,
        duration: 15,
        ieps: [],
        studentsGeneral: [],
        servicedIn: dragProps.servicedIn,
        teacherId: dragProps.teacher.id,
        schoolId: dragProps.teacher.schoolId,
        districtId: dragProps.teacher.districtId,
      })
      .then((docRef) => {

      })
      .catch((error) => {
        Store['schedule'].dragProps = null
      })
    }
    // the event is already in the calendar, update it 
    // calendar block
    else {
      if (!this.validDrop(true)) return

      db.collection(ColType.calendarEvents)
        .doc(dragProps.event.id)
        .update({
          day: parseInt(this.props.dateSlot.format('D'), 10),
          startTime: moment.utc(this.props.dateSlot).format(),
          endTime: moment.utc(this.props.dateSlot).add(dragProps.event.duration, 'minutes')._d,
          index: this.props.columnIndex,
        })
        .then(() => {

        })
    }
  }

  validDrop = (didDrop) => {
    var duration = Store['schedule'].dragProps.dragName === 'block' ?
      parseInt(Store['schedule'].dragProps.event.duration, 10) :
      Store['schedule'].dragProps.iep !== null ?
      parseInt(Store['schedule'].dragProps.iep.iep.service.serviceDuration, 10) :
      15 // student drop defaults to 15 min
    var servicedIn = Store['schedule'].dragProps.dragName === 'block' ?
      Store['schedule'].dragProps.event.servicedIn :
      Store['schedule'].dragProps.iep !== null ?
      Store['schedule'].dragProps.iep.iep.service.servicedIn :
      Store['schedule'].dragProps.servicedIn

    if (Store['schedule'].dragProps.dragName === 'iep' ||
        Store['schedule'].dragProps.dragName === 'teacher') {
      if (this.dropTimeOccupied(false)) {
        var invalidDropMessage = 'An event is already scheduled at this location.'
        if (didDrop) {
          errorMessage(invalidDropMessage)
          Store['schedule'].dragProps = null
        } else {
          this.setState({ invalidDropMessage: invalidDropMessage })
        }
        return false
      }
      else if
      (this.dropTimeWidthDurationExceedsMax(duration)) {
        invalidDropMessage = 'The event would end later than 5:30 PM.'
        if (didDrop) {
          errorMessage(invalidDropMessage)
          Store['schedule'].dragProps = null
        }
        else {
          this.setState({ invalidDropMessage: invalidDropMessage })
        }
        return false
      }
      else if (this.dropInWrongBlock(duration, servicedIn)) {
        var otherServiceCategory = servicedIn === 'General Education' ?
          'Special Education' : 'General Education'
        invalidDropMessage = 'The ' + servicedIn.toLowerCase() + ' event would overlap with a ' +
          otherServiceCategory.toLowerCase() + ' block.'
        if (didDrop) {
          errorMessage(invalidDropMessage)
          Store['schedule'].dragProps = null
        }
        else {
          this.setState({ invalidDropMessage: invalidDropMessage })
        }
        return false
      }

      return true
    }
    else {
      if (this.dropTimeOccupied(true)) {
        invalidDropMessage = 'An event is already scheduled at this location.'
        if (didDrop) {
          errorMessage(invalidDropMessage)
          Store['schedule'].dragProps = null
        }
        else {
          this.setState({ invalidDropMessage: invalidDropMessage })
        }
        return false
      }
      else if (this.dropTimeWidthDurationExceedsMax(duration)) {
        invalidDropMessage = 'The event would end later than 5:30 PM.'
        if (didDrop) {
          errorMessage(invalidDropMessage)
          Store['schedule'].dragProps = null
        }
        else {
          this.setState({ invalidDropMessage: invalidDropMessage })
        }
        return false
      }
      else if (this.dropInWrongBlock(duration, servicedIn)) {
        otherServiceCategory = servicedIn === 'General Education' ?
          'Special Education' : 'General Education'
        //invalidDropMessage = 'The ' + servicedIn.toLowerCase() + ' event would overlap with a ' +
        //  otherServiceCategory.toLowerCase() + ' block.'
        invalidDropMessage = 'The event would overlap with another event.'
        if (didDrop) {
          errorMessage(invalidDropMessage)
          Store['schedule'].dragProps = null
        }
        else {
          this.setState({ invalidDropMessage: invalidDropMessage })
        }
        return false
      }

      return true
    }
  }

  onMouseEnter = (e) => {
    e.preventDefault()
    if (!Store['schedule'].isCopyAndPasting) return
    if (!Store['schedule'].dragProps) return
    if (this.state.isOver) return
    var isValidDrop = this.validDrop(false)
    if (!isValidDrop) {
      this.setState({
        popoverTimeout: setTimeout(() => {
          this.setState({
            errorPopoverVisible: true,
          })
        }, 500)
      })
    }

    this.setState({
      isValidDrop: isValidDrop,
      isOver: true
    })
  }

  onMouseLeave = (e) => {
    e.preventDefault()
    if (!Store['schedule'].isCopyAndPasting) return
    if (!Store['schedule'].dragProps) return
    if (!this.state.isOver) return
    clearTimeout(this.state.popoverTimeout)

    this.setState({
      errorPopoverVisible: false,
      isValidDrop: true,
      isOver: false,
    })
  }

  pasteEvent = () => {
    console.log("Clicked on drop, paste event.")
    if (!Store['schedule'].isCopyAndPasting) return
    if (Store['schedule'].dragProps) {
      if (!this.validDrop(false)) return
      var dragProps = Store['schedule'].dragProps
      console.log("Paste drag props", dragProps)
      db.collection(ColType.calendarEvents)
        .add({
          title: dragProps.event.title,
          index: this.props.columnIndex,
          day: parseInt(this.props.dateSlot.format('D'), 10),
          startTime: this.props.dateSlot._d,
          endTime: moment.utc(this.props.dateSlot).add(60, 'minutes')._d,
          duration: dragProps.event.duration,
          ieps: dragProps.event.ieps,
          studentsGeneral: dragProps.event.studentsGeneral,
          servicedIn: dragProps.event.servicedIn,
          teacherId: dragProps.event.teacherId,
          schoolId: dragProps.event.schoolId,
          districtId: dragProps.event.districtId,
        })
        .then((docRef) => {

        })
        .catch((error) => {
          errorMessage("Could not paste event.")
        })
    }
  }

  componentDidMount() {
    this.setState({
      componentMounted: true,
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    //console.log('shouldComponentUpdate')
    if (this.state.componentMounted &&
      (this.state.isOver || nextState.isOver)) return true
    return false
  }

  render() {
    return (
      <Popover
        content={<div className="w-230px">
          {this.state.invalidDropMessage}
        </div>}
        title={
          <span>
            <Icon type="warning" className="mr-1 text-warning" />
            <span>Cannot drop at this location</span>
          </span>
        }
        visible={this.state.errorPopoverVisible}
      >
        <div
          onDrop={this.drop}
          onDragOver={this.dragOver}
          onDragLeave={this.dragExit}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onClick={this.pasteEvent}
          className={"h-100 w-100 inline-block drop-zone flex"}
        >
          <div className={"w-100-minus-3 h-100-minus-3 br-4" +
            (this.state.isOver ? ' border-dashed-3px ' : '') +
            (this.state.isValidDrop ? ' border-success' : ' border-error')}
          >
            {this.state.isOver && this.state.isValidDrop ?
              <div className="paste-drop-info flex flex-h-center flex-v-center invisible">
                <div className="mt-10px font-16 font-500">
                  <Icon type="pushpin-o" className="mr-2 font-20" />
                  Paste Here
                </div>
              </div>
              : ''
            }
          </div>
        </div>
      </Popover>
    )
  }
}

export default DateDrop