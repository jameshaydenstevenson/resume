import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import AgendaEvent from './agenda/AgendaEvent'
import { Popover, Button } from 'antd'

class CustomPopover extends Component {
  state = {
    visible: false,
  }

  componentDidMount() {

  }

  // called when edit button is clicked, handleVisibilityChange
  // only fires when you click on the button or away from it.
  hide = () => {
    this.setState({
      visible: false,
    }, () => {
      if (this.props.onPopoverVisibilityChange) {
        this.props.onPopoverVisibilityChange(false)
      }
    })
  }
  
  handleVisibleChange = (visible) => {
    this.setState({ 
      visible 
    }, () => {
      if (this.props.onPopoverVisibilityChange) {
        this.props.onPopoverVisibilityChange(visible)
      }
    })
  }

  render() {
    return (
      <Popover
        placement={'leftTop'}
        trigger={'click'}
        visible={this.state.visible}
        title={null}
        content={
          <div className="negate-popover-padding">
          <AgendaEvent 
            teacher={this.props.teacher}
            event={this.props.event} 
            students={this.props.students} 
            studentDict={this.props.studentDict}
            closePopover={this.hide} 
          />
          </div>
        }
        onVisibleChange={this.handleVisibleChange}
      >
        <Button className="w-90 h-100 br-2 event-card relative">
          <span className="btn-absolute-tl-text p-1">
            {this.props.event.title}
          </span>
        </Button>
      </Popover>
    )
  }
}

export default CustomPopover
