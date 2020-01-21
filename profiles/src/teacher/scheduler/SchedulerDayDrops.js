import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'
import DateDrop from './DateDrop'
//import { DNDContext } from './Scheduler'

class SchedulerDayDrops extends Component {
  state = {
    
  }

  componentDidMount() {
 
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
      return (
        <div>
          <div className="flex-col h-100">
            {this.props.timesArray.map((timeValue, rowIndex) => {
              return <div className="border-bottom h-100px"
                          key={timeValue.format()} 
                >
                {this.props.timeSlots.map((slot, colIndex) => {
                  //console.log('iter')
                  return <DateDrop 
                            //style={{'width': 100 / this.props.timeSlots.length + '%'}}
                            style={{'width': '16.666666666%', 'height': '47px'}}
                            dateSlot={timeValue} 
                            columnIndex={colIndex}
                            columns={this.props.timeSlots.length}
                            //events={this.props.events}
                            //calendarBlock={this.props.calendarBlock}
                            key={timeValue.format() + '-' + colIndex + '-drop'} 
                          />
                })
                }
              </div>
            })
            }
          </div>
        </div>
    )
  }
}

export default SchedulerDayDrops
