import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import { Layout, Icon } from 'antd'
const Footer = Layout.Footer

class CustomFooter extends Component {
  state = {

  }

  componentDidMount() {

  }

  render() {
    return (
      <Footer className="footer">
        <div>
          <Icon type="copyright" className="mr-1" />
          <span>2018 Smart Learning Systems, LLC.</span>
        </div>
       
        <div className="inline-block w-100">
          <span className="mr-3">
            <Icon type="mail" className="mr-1 font-14" />
            <span>9105 Yellow Pine CT - Waxhaw, NC 28173, United States</span>
          </span>
          <span className="mr-3">
            <Icon type="phone" className="mr-1 font-14" />
            <span>(828) 273-5699</span>
          </span>
           
 
      </div>
    </Footer>
    )
  }
}

export default CustomFooter