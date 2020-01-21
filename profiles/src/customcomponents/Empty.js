import React, { Component } from 'react'
import '../styles/GlobalStyle.css'

class Empty extends Component {
  state = {

  }

  componentDidMount() {

  }

  render() {
    var containerClassName = ''
    var width = 32
    var height = 32
    var description = 'No data'
    var descriptionClassName = 'font-16 mt-1'
    var src = '/empty-image.svg'
    if (this.props.hasOwnProperty('containerClassName')) {
      containerClassName = this.props.containerClassName
    }
    if (this.props.hasOwnProperty('width')) {
      width = this.props.width
    }
    if (this.props.hasOwnProperty('height')) {
      height = this.props.height
    }
    if (this.props.hasOwnProperty('description')) {
      description = this.props.description
    }
    if (this.props.hasOwnProperty('descriptionClassName')) {
      descriptionClassName = this.props.descriptionClassName
    }
    if (this.props.hasOwnProperty('src')) {
      src = this.props.src
    }

    return (
      <div 
        className={containerClassName}
      >
        <img 
          src={src} 
          width={width} 
          height={height} 
          alt='no data'
        />
        <div className={descriptionClassName}>
          {description}
        </div>
      </div>
    )
  }
}

export default Empty