import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'
import DateDrop from './DateDrop'
//import { DNDContext } from './Scheduler'

class SchedulerDayDropInner extends Component {
  state = {
    
  }

  componentDidMount() {
 
  }

  shouldComponentUpdate() {
    //console.log('inner should update')
    return false
  }

  render() {
      return (
        <div className="flex h-100 w-100">
          <DateDrop 
            //style={{'width': 100 / this.props.timeSlots.length + '%'}}
            dateSlot={this.props.timeValue} 
            columnIndex={0}
            columns={this.props.timeSlots.length}
            //events={this.props.events}
            key={this.props.timeValue.format() + '-' + 0 + '-drop'} 
          />
        </div>
    )
  }
}

export default SchedulerDayDropInner
