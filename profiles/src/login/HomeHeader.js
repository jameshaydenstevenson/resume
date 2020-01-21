import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/GlobalStyle.css'
import { Layout } from 'antd'
const { Header } = Layout

var pathname = null

class HomeHeader extends Component {
  state = {
    newPopoverVisible: false,
    accountPopoverVisible: false,
    searchValue: '',
    height: 0, 
    width: 5000, // stop header from going into the smaller res version until mount
    pathname: null,
  }

  componentDidMount() {
    this.updateWindowDimensions()
    window.addEventListener("resize", this.updateWindowDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions)
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
  };

  componentWillReceiveProps(newProps) {

  }

  componentWillUpdate() {
    pathname = null
    if (window && window.hasOwnProperty('location') && window.location &&
    window.location.hasOwnProperty('pathname') && window.location.pathname) {
      pathname = window.location.pathname
    }
  }

  newVisibleChange = (visible) => {
    
  }

  accountVisibleChange = (visible) => {
    
  }

  onChange = (value) => {
    console.log(`selected ${value}`)
  }

  onSelect = (value, option) => {
    console.log('on select', value, option)
    console.log('/teacher/student/' +
      this.props.person.id + '?student=' +
      option.key)

    this.props.history.push(
      {
        pathname: '/teacher/student/' +
          this.props.person.id + '?student=' +
          option.key
      }
    )
  }

  render() {
    console.log(pathname)
    return (
      <div style={{zIndex: 100}} className="background-paw-yellow ant-shadow-small">
          <Header
            className={'m-lr-auto background-paw-yellow pt-1 pb-1 relative ' +
             (this.props.readOnly ? 't-67' : '')}
            style={{
              padding: 0,
              textAlign: 'left',
              width: '100%',
              zIndex: 2,
            }}
          >
            <div
className={"background-background-paw-yellow font-16 flex"+
"flex-wrap flex-v-center flex-row border-bottom-none"}
              style={{ lineHeight: '64px', minHeight: '64px' }}
            >
              <span 
 className={"float-left p-lr-20-important inline-flex flex-h-center flex-v-center" +
 (this.state.width < 1100 ? " w-100" : "")}>
                <Link to={'/'}>
                  <img src='/pawcall_icon.png' alt='logo' height='60' />
                </Link>
              </span>
              <span className={"" + (this.state.width < 1100 ? "w-100 text-center" : "pl-4")}>


         {/*      
                <span className="inline-flex flex-h-center flex-v-center font-20 font-lb">
                <Link to={'/about-us'}>
                <span 
                className={"font-lb" + 
                (pathname && pathname === '/about-us' ? 
                ' font-paw-dark-blue font-bold' : '')}>About</span>
                  </Link>
                </span>

                <span className="inline-flex flex-h-center flex-v-center font-20 ml-4 font-lb">
                <Link to={'/products'}>
                <span className={"font-lb" + 
                (pathname && pathname === '/products' ? 
                ' font-paw-dark-blue  font-bold' : '')}>Products</span>
                  </Link>
                </span>
                
         */}    

              </span>

              
            </div>

          </Header>
      </div>
    )
  }
}

export default HomeHeader