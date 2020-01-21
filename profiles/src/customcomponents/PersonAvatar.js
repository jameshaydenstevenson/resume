import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import { getInitials } from '.././Util'
import { Avatar } from 'antd'

class PersonAvatar extends Component {
  state = {

  }

  componentDidMount() {

  }

  render() {
    return (
      <div
        className={"inline-flex" +
          (this.props.containerClassName ? ' ' + this.props.containerClassName : '')}
        id={this.props.containerId}
      >
        {this.props.person ?
          <span className="flex flex-v-center">
            <Avatar
              size={this.props.size}
              className={"mr-8 inline-flex flex-v-center flex-h-center" +
                (this.props.avatarClassName ? ' ' + this.props.avatarClassName : '')}
              style={{ backgroundColor: this.props.person.avatarColor }}
            >
              {getInitials(this.props.person)}
            </Avatar>
            <span className={"" +
              (this.props.personClassName ? ' ' + this.props.personClassName : '')}
            >
              {this.props.person.firstName + " " + this.props.person.lastName}
            </span>
          </span>
          : ''}
      </div>
    )
  }
}

export default PersonAvatar