import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'
import { db } from '../../firebase/Firebase'
import { Store } from './Store'
import EditModal from './EditModal'
import ColType from '../.././Types'
import { message, Popover, Icon, Button, Tooltip, Popconfirm } from 'antd'
var moment = require('moment')

const errorMessage = (description) => {
  message.error(description)
}

const successMessage = (description) => {
  message.success(description)
}

class BlockDragAndDrop extends Component {
  state = {
    isOver: false,
    isValidDrop: true,
    invalidDropMessage: '',
    isDragging: false,
    popoverVisible: false,
    errorPopoverVisible: false,
    popoverTimeout: setTimeout(() => {}),
    isCopied: false,
    componentMounted: false,
  }

  componentDidMount() {
    if (this.props.event) {
      var dayStart = moment.utc(this.props.dayStart)
      var dayEnd = moment.utc(this.props.dayEnd)
      var dayDuration = 615// dayEnd.diff(dayStart, 'minutes')
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
      var dayDuration = 615// dayEnd.diff(dayStart, 'minutes')
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

  handlePopoverVisibleChange = (visible) => {
    this.setState({ popoverVisible: visible })
  }

  closePopover = () => {
    this.setState({
      popoverVisible: false,
    })
  }

  deleteEvent = () => {
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
  }

  expandIntoWrongBlock = (duration) => {
    var dropMoment = moment.utc(this.props.event.start)
    var dragEndMoment = moment.utc(this.props.event.start).add(duration, 'minutes')
    var events = Store['schedule'].events

    for (var i = 0; i < events.length; i++) {
      var event = events[i]
      var start = moment.utc(event.start)

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

  drop = (e) => {
    e.preventDefault()
    clearTimeout(this.state.popoverTimeout)

    var dragProps = Store['schedule'].dragProps
    var dragDuration = Store['schedule'].dragProps.dragName === 'block' ?
      parseInt(Store['schedule'].dragProps.event.duration, 10) :
      Store['schedule'].dragProps.iep !== null ?
      parseInt(Store['schedule'].dragProps.iep.iep.service.serviceDuration, 10) :
      15 // student drop defaults to 15 min
    var dropDuration = dragDuration > parseInt(this.props.event.duration, 10) ?
      dragDuration :
      parseInt(this.props.event.duration, 10)
    var ieps = this.props.event.ieps
    var studentsGeneral = this.props.event.studentsGeneral

    // title
    var dragTitle = dragProps.dragName !== 'block' ? 'No title' : dragProps.event.title
    var dropTitle = this.props.event.title
    var combinedTitle = dropTitle
    if (dragTitle === "No title" && dropTitle === "No title") combinedTitle = "No title"
    else if (dragTitle !== "No title" && dropTitle === "No title") combinedTitle = dragTitle
    else if (dragTitle === "No title" && dropTitle !== "No title") combinedTitle = dropTitle
    else combinedTitle = dragTitle + ' / ' + dropTitle

    if (!this.validDrop(true)) return

    if (dragProps.dragName !== 'block' && dragProps.dragName !== 'teacher') {
      // remove drag iep from the old block
      // This was for when you could drag a goal in a black to another block.
      /**if (dragProps.event) {
        var dragIEPS = dragProps.event.ieps
        var idIndex = dragIEPS.indexOf(dragProps.iep.id)
        var iepIndex = dragProps.ieps.indexOf(dragProps.iep)
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
        // add drag iep to the new block
        ieps.push({
          iepId: dragProps.iep.id,
          iepDuration: dragProps.iep.iep.service.serviceDuration
        })
      } else {
        studentsGeneral.push(dragProps.student.id)
      }
    

    db.collection(ColType.calendarEvents)
      .doc(this.props.event.id)
      .update({
        duration: dropDuration,
        ieps: ieps,
        studentsGeneral: studentsGeneral,
        title: combinedTitle,
      })
      .then(() => {
        if (dragProps.dragName !== 'block') {
          if (dragProps.iep !== null) successMessage('The IEP goal was added to the group.')
          else successMessage('The student was successfully added to the group')
        }
      })
    }

    this.setState({
      isOver: false,
      invalidDropMessage: '',
      isValidDrop: true,
      errorPopoverVisible: false,
    })
  }

  validDrop = (didDrop) => {
    var dragProps = Store['schedule'].dragProps
    var dragDuration = Store['schedule'].dragProps.dragName === 'block' ?
      parseInt(Store['schedule'].dragProps.event.duration, 10) :
      Store['schedule'].dragProps.iep !== null ?
      parseInt(Store['schedule'].dragProps.iep.iep.service.serviceDuration, 10) :
      15 // student drop defaults to 15 min
    var servicedIn = Store['schedule'].dragProps.dragName === 'block' ?
      Store['schedule'].dragProps.event.servicedIn :
      Store['schedule'].dragProps.iep !== null ?
      Store['schedule'].dragProps.iep.iep.service.servicedIn :
      Store['schedule'].dragProps.servicedIn
    //var otherServiceCategory = servicedIn === 'General Education' ?
    //  'Special Education' : 'General Education'
    

    if (servicedIn !== this.props.event.servicedIn) {
      var invalidDropMessage = 'This group is for IEP goals serviced in ' +
        this.props.event.servicedIn.toLowerCase() + '.'
      if (didDrop) {
        this.dragEnd() // clear drop blocks isOver state
        if (dragProps.dragName !== 'block') errorMessage(invalidDropMessage)
      } else {
        this.setState({ invalidDropMessage: invalidDropMessage })
      }
      return false
    }
    if (this.expandIntoWrongBlock(dragDuration)) {
      //invalidDropMessage = 'This would cause the group to overlap into a ' +
      //  otherServiceCategory.toLowerCase() + ' group.'
      invalidDropMessage = 'This would cause the group to overlap with another group.'
      if (didDrop) {
        this.dragEnd() // clear drop blocks isOver state
        if (dragProps.dragName !== 'block') errorMessage(invalidDropMessage)
      } else {
        this.setState({ invalidDropMessage: invalidDropMessage })
      }
      return false
    }

    return true
  }

  dragStart = (e) => {
    console.log(this.props)
    Store['schedule'].dragProps = this.props
    this.props.setIsDragging(true)
    e.dataTransfer.setData('text', 'foo') // firefox needs this to do drag and drop
    //var el = document.getElementById('event-container-' + this.props.event.id)
    var el = document.createElement("img")
    el.src = this.props.servicedIn === "Teacher Event" ? "/teacher-drag-circle.PNG" :
                                       this.props.servicedIn === "General Education" ? 
                                       "/ge-drag-circle.PNG" :
                                       "/se-drag-circle.PNG"
    e.dataTransfer.setDragImage(el,
      25, 0)
    setTimeout(() => this.setState({
      isDragging: true,
    })
    )
  }

  dragEnd = (e) => {
    console.log('drag end')
    clearTimeout(this.state.popoverTimeout)
    this.props.setIsDragging(false)
    setTimeout(() => this.setState({
      isDragging: false,
      invalidDropMessage: '',
      isValidDrop: true,
      isOver: false,
      errorPopoverVisible: false,
    })
    )
  }

  dragOver = (e) => {
    e.preventDefault()
    if (this.state.isOver) return
    var isValidDrop = Store['schedule'].dragProps.hasOwnProperty('dragName') && 
                      Store['schedule'].dragProps.dragName !== 'block' &&
                      Store['schedule'].dragProps.dragName !== 'teacher' ? 
                      this.validDrop(false) : 
                      false

    if (!isValidDrop && 
      Store['schedule'].dragProps.hasOwnProperty('dragName') && 
      Store['schedule'].dragProps.dragName !== 'block' &&
      Store['schedule'].dragProps.dragName !== 'teacher') {
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
      isValidDrop: false,
      isOver: false,
    })
  }

  copyEvent = () => {
      Store['schedule'].dragProps = this.props
      Store['schedule'].setIsCopyPasting(true)
  }

  render() {
    return (
      <Popover
        mouseEnterDelay={.5}
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
        <div draggable={this.props.readOnly ? false : true}
          onDragStart={this.dragStart}
          onDragEnd={this.dragEnd}
          onDrop={this.drop}
          onDragOver={this.dragOver}
          onDragLeave={this.dragExit}
          className={'w-100' +
            (this.state.isDragging ? ' pointer-events-none opacity-50' : '')
          }
          style={this.state.componentMounted ?
            {
              position: 'absolute',
              top: 'calc(' + this.state.eventTopPercentage + '%' +
                (this.props.event.index > 5 ? ' + 47px)' : ')'),
              left: 100 / 6 * (this.props.event.index % 6) + '%',
              //height: '47px',
              // for height that spans multiple rows use this
              height: 'calc(' + this.state.durationRatio + '%' +
                (this.props.event.index > 5 ? ' - 47px)' : ')'),
            }
            : {}}
        >
          <div className={"w-100-minus-3 h-100-minus-3 br-4 overflow-hidden relative p-1 " +
            "parent-hover" +
            (this.state.isDragging ? ' pointer-events-none opacity-50' : ' cursor-grab') +
            (this.props.readOnly ? ' cursor-not-allowed' : '') +
            (this.props.event.servicedIn === 'Teacher Event' ? ' border-teacher background-fff' : 
             this.props.event.servicedIn === 'General Education' ?
              ' border-lge background-l-lge' : ' border-lse background-l-lse') +
            (this.state.isOver ?
              (this.state.isValidDrop ? ' border-success' : ' border-error')
               : '')
          }
          id={'event-container-' + this.props.event.id}
          >
            <div className={"absolute-tr pl-05 pr-05 " +
            (this.state.popoverVisible ? 'visible' : '') +
            " show-on-parent-hover " +      
            " background-fff br-100 br-r-0 ant-shadow "}
            >
            {/**<Popover 
              trigger={'click'} 
              placement={'bottomLeft'}
              arrowPointAtCenter={true}
              title={null}
              className="no-popover-arrow"
              visible={this.state.popoverVisible}
              onVisibleChange={this.handlePopoverVisibleChange}
              content={<div className="w-650 no-popover-arrow relative">
                
                <Tabs defaultActiveKey="1" animated={false}>
    
                <TabPane tab="Students / IEP Goals" key="1">
                  <div className={"p-4 pl-2 pr-2"}>
                    <div className="font-16 mb-1 font-500">
                      <div className="inline-flex mw-150px mr-1">Student</div>
                      <div className="inline-flex mw-200px mr-1">IEP</div>
                      <div className="inline-flex mw-150px">Duration</div>
                    </div>
                    <div className="mh-150 overflow-y-scroll alternate-color-table">
                      {this.props.children}
                    </div>
                  </div>
                </TabPane>
                {!this.props.readOnly ?
                  <TabPane tab="Edit Group" key="2">
                  <div className={"p-4 pl-2 pr-2"}>
                    <EditTitleForm 
                      teacher={this.props.teacher} 
                      event={this.props.event} 
                      expandIntoWrongBlock={this.expandIntoWrongBlock}
                    />
                  </div> 
                  </TabPane> 
                : ''}
                </Tabs>

                <div className="absolute-tr">
                  {!this.props.readOnly ?
                  <Popconfirm title="Are you sure delete this group?" 
                    onConfirm={this.deleteEvent} 
                    onCancel={() => {}} okText="Yes" cancelText="No">
                    <Tooltip 
                      title="Delete group"
                      mouseEnterDelay={.2}
                    >
                    <Button shape="circle" icon="delete" className="mr-1" />
                    </Tooltip>
                  </Popconfirm>
                  : ''}
                  <Tooltip 
                      title="Close"
                      mouseEnterDelay={.2}
                    >
                  <Button shape="circle" icon="close" onClick={this.closePopover} />
                  </Tooltip>
                </div>
              </div>
              }
            >
            <Tooltip 
              title="Edit"
            >
               <Button 
                className={'inline-block font-20 border-none mr-1 ' +
                'font-dark-grey ' + (this.state.popoverVisible ? 'visible' : '') + 
                ' show-on-parent-hover grey-hover-important'}
                size={'large'} shape={'circle'} icon="edit" 
              />
            </Tooltip>
            </Popover>*/}
            <EditModal
              teacher={this.props.teacher} 
              event={this.props.event} 
              expandIntoWrongBlock={this.expandIntoWrongBlock} 
              iepsAndStudents={this.props.children}
              servicedIn={this.props.servicedIn}
            />
            <Tooltip 
              title="Copy Calendar Event"
            >
              <Button 
                className={'inline-block font-20 border-none mr-1 ' +
                'font-dark-grey ' + (this.state.popoverVisible ? 'visible' : '') + 
                ' show-on-parent-hover grey-hover-important'}
                size={'large'} shape={'circle'} icon="copy" 
                onClick={this.copyEvent}
              />
            </Tooltip>
            <Tooltip 
              title="Delete"
            >
            <Popconfirm title="Do you want to delete this event?" 
            onConfirm={this.deleteEvent} onCancel={() => {}} okText="Yes" cancelText="No">

            <Button 
                className={'inline-block font-20 border-none ' +
                'font-dark-grey ' + (this.state.popoverVisible ? 'visible' : '') + 
                ' show-on-parent-hover grey-hover-important'}
                size={'large'} shape={'circle'} icon="delete" 
            />
            </Popconfirm>
            </Tooltip>
            </div>
            <div className="w-100 mh-100 overflow-hidden">
              <span className="font-bold font-16">{this.props.event.title}</span>
            </div>
          </div>
        </div>
      </Popover>
    )
  }
}

export default BlockDragAndDrop