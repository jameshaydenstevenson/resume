import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'
import EventDrag from './EventDrag'
import BlockDragAndDrop from './BlockDragAndDrop'
//import { DNDContext } from './Scheduler'
var moment = require('moment')

class SchedulerDayDrags extends Component {
  state = {

  }

  componentDidMount() {
   
  }

  render() {
      return (
        <div>
          {this.props.events && this.props.events.map((event, index) => {
              if (event.day !== this.props.dayNumber) return false
              var ieps = []
              event.ieps.map((iep, index) => {
                if (!(this.props.IEPDict.hasOwnProperty(iep.iepId))) return false
                return ieps.push(this.props.IEPDict[iep.iepId])
              })

              ieps.sort((obj1, obj2) => 
              obj1.iep.service.serviceDuration - obj2.iep.service.serviceDuration)

              var studentsGeneral = event.studentsGeneral ? event.studentsGeneral : []
              
              return <BlockDragAndDrop
                        dragName={'block'}
                        readOnly={this.props.readOnly}
                        teacher={this.props.teacher}
                        student={this.props.studentDict && 
                          this.props.studentDict.hasOwnProperty[event.studentId] ?
                          this.props.studentDict[event.studentId] :
                          null
                        }
                        iep={this.props.IEPGoals.length > 0 ?
                          this.props.IEPGoals.find(e => e.id === event.iepId) :
                          null
                        }
                        ieps={ieps}
                        event={event}
                        servicedIn={event.servicedIn}
                        columns={this.props.timeSlots.length}
                        dayStart={moment(new Date(Date.UTC(2015, 5, 
                                  event.day, 7, 30, 0))).format()}
                        dayEnd={moment(new Date(Date.UTC(2015, 5, 
                                event.day, 17, 0, 0))).format()}
                        setDragProps={this.props.setDragProps}
                        setIsDragging={this.props.setIsDragging}
                        key={'drag-event-in-schedule-' + event.id}
                      >
                          {ieps.map((iep, index) => {
                            return <EventDrag
                              dragName={'iep'}
                              readOnly={this.props.readOnly}
                              teacher={this.props.teacher}
                              student={this.props.studentDict[iep.studentId]}
                              iep={iep}
                              servicedIn={iep.iep.service.servicedIn}
                              ieps={ieps}
                              studentsGeneral={studentsGeneral}
                              IEPDict={this.props.IEPDict}
                              event={event}
                              index={index}
                              columns={this.props.timeSlots.length}
                              dayStart={moment(new Date(Date.UTC(2015, 5, 
                                        event.day, 7, 30, 0))).format()}
                              dayEnd={moment(new Date(Date.UTC(2015, 5, 
                                      event.day, 17, 0, 0))).format()}
                              setDragProps={this.props.setDragProps}
                              setIsDragging={this.props.setIsDragging}
                              key={'drag-event-in-schedule-inner' + event.id + '-' + index}
                            />
                          })
                          }
                          {studentsGeneral && studentsGeneral.map((studentId, index) => {
                            return <EventDrag
                              dragName={'iep'}
                              readOnly={this.props.readOnly}
                              teacher={this.props.teacher}
                              student={this.props.studentDict[studentId]}
                              iep={null}
                              servicedIn={event.servicedIn}
                              ieps={ieps}
                              studentsGeneral={studentsGeneral}
                              IEPDict={this.props.IEPDict}
                              event={event}
                              index={index}
                              columns={this.props.timeSlots.length}
                              dayStart={moment(new Date(Date.UTC(2015, 5, 
                                        event.day, 7, 30, 0))).format()}
                              dayEnd={moment(new Date(Date.UTC(2015, 5, 
                                      event.day, 17, 0, 0))).format()}
                              setDragProps={this.props.setDragProps}
                              setIsDragging={this.props.setIsDragging}
                              key={'drag-event-in-schedule-inner' + event.id + '-' + index}
                            />
                          })
                          }
                      </BlockDragAndDrop>
            })
          }
        </div>
    )
  }
}

export default SchedulerDayDrags
