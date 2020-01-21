import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'

class IEPParagraph extends Component {
  state = {

  }

  componentDidMount() {
    
  }

  render() {
    return (
      <div>
        {this.props.iepParagraph ?
          this.props.iepParagraph
          :
          ''
        }
      </div>
    )
  }
}

export default IEPParagraph
