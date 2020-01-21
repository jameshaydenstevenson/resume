import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'
//import { DNDContext } from './Scheduler'

class SchedulerDayDropOuter extends Component {
  state = {
    
  }

  componentDidMount() {

  }

  render() {
      return (
        <div 
          className={"drop-container h-50px border-bottom border-left" +
          (this.props.additionalClasses ? " " + this.props.additionalClasses : "")}
          key={this.props.timeValue.format()} 
        >
          {this.props.children}
        </div>
    )
  }
}

export default SchedulerDayDropOuter
