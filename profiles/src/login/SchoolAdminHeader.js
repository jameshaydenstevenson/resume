import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/GlobalStyle.css'
import { firebase } from '../firebase/Firebase'
import { getInitials } from '.././Util'
import { Layout, Icon, Menu, Avatar, Popover, message, Tooltip } from 'antd'
const { Header } = Layout

const errorMessage = (description) => {
  message.error(description)
}

class SchoolAdminHeader extends Component {
  state = {
    newPopoverVisible: false,
    accountPopoverVisible: false,
    searchValue: '',
  }

  componentDidMount() {

  }

  componentWillReceiveProps(newProps) {
    console.log(newProps.selectedKey)
    // on url change set popovers visible to false
    this.setState({
      newPopoverVisible: false,
      accountPopoverVisible: false,
    })
  }

  newVisibleChange = (visible) => {
    this.setState({ newPopoverVisible: visible })
  }

  accountVisibleChange = (visible) => {
    this.setState({ accountPopoverVisible: visible })
  }

  signOut = () => {
    firebase.auth().signOut().then(function () {
      console.log('Signed Out')
      //sending users to the sign in page after signing out for now.
      window.location.href = "/sign-in"
    }, function (error) {
      console.error('Sign Out Error', error)
      errorMessage("There was an error signing you out. Please try again.")
    })
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
        pathname: '/admin/school-summary/' +
          this.props.person.id + '?district=' +
          this.props.person.districtId + '&school=' +
          option.key
      }
    )
  }

  render() {
    console.log(this.props.person)
    return (
      <div>
        {this.props.person != null &&
          Object.keys(this.props.person).length !== 0 &&
          this.props.person.constructor === Object ?
          <Header
            style={{
              padding: 0,
              textAlign: 'left',
              position: 'fixed',
              width: '100%',
              zIndex: 2,
            }}
          >
            <Menu
              selectedKeys={[this.props.selectedKey]}
              mode="horizontal"
              className="font-16 flex flex-row border-bottom-none ant-header-shadow"
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="admin-logo" className="inline-flex flex-v-center menu-no-bb mr-3">
                <Link to={'/'}>
                  <img src='/dotit-iep-logo.png' alt='logo' height='48' />
                </Link>
              </Menu.Item>
              
              <Menu.Item key="school-admin-home" className="font-500 inline-flex flex-center">
                <Tooltip title="Home" placement="bottom" mouseEnterDelay={.75}>
                <Link
                  to={'/school-admin/school-admin-home/' + this.props.person.id}>
                  <Icon type="home" className={"font-24 va-middle flex-h-center " +
                  "mr-0 br-50 border p-1 font-30 ant-btn-primary"} />
                </Link>
                </Tooltip>
              </Menu.Item>
              <Menu.Item key="school-summary" className="font-500 inline-flex flex-center">
                <Tooltip title="School summary" placement="bottom" mouseEnterDelay={.75}>
                <Link
                  to={'/school-admin/school-summary/' + this.props.person.id}>
                  <Icon type="bar-chart" className={"font-24 va-middle flex-h-center " +
                  "mr-0 br-50 border p-1 font-30 ant-btn-primary"} />
                </Link>
                </Tooltip>
              </Menu.Item>
              <Menu.Item key="add-person" className="font-500 inline-flex flex-center">
                <Tooltip title="Add personnel to school" placement="bottom" mouseEnterDelay={.75}>
                <Link
                  to={'/school-admin/add-person/' + this.props.person.id}>
                  <Icon type="plus" className={"font-24 va-middle flex-h-center " +
                  "mr-0 br-50 border p-1 font-30 ant-btn-primary"} />
                </Link>
                </Tooltip>
              </Menu.Item>

              <Menu.Item key="teacher-sign-out"
                className="inline-flex flex-v-center menu-no-bb ml-auto">
                <Popover
                  visible={this.state.accountPopoverVisible}
                  onVisibleChange={this.accountVisibleChange}
                  placement="bottomLeft"
                  title={
                    <div className="pt-1 pb-1">
                      <Avatar
                        size="large"
                        className="inline-block mr-8"
                        style={{ backgroundColor: '#000' }}
                      >
                        {getInitials(this.props.person)}
                      </Avatar>
                      <span className="font-16 font-bold vertical-align-middle">
                        {this.props.person.firstName + " " + this.props.person.lastName}
                      </span>
                    </div>
                  } content={
                    <div className="p-0 border-right-none negate-popover-padding">
                      <div className="ant-menu-item p-0 border-bottom">
                        <Link
                          to={"/school-admin/school-admin-home/" + this.props.person.id}
                          className="font-16 p-2 block"
                        >
                          <Icon type="home"
                            className="mr-3 text-muted font-bold font-20 va-middle" />
                          <span className="va-minus-1 fw-500">My Home</span>
                        </Link>
                      </div>
                      <Menu.Divider />
                      <div className="ant-menu-item p-0" onClick={this.signOut}>
                        <span className="font-16 p-2 block">
                          <Icon type="logout"
                            className="mr-3 text-muted font-bold font-20 va-middle" />
                          <span className="va-minus-1 fw-500">Sign out</span>
                        </span>
                      </div>
                    </div>
                  } trigger="click">
                  <span className="h-67px inline-flex flex-v-center">
                    <Avatar
                      size="large"
                      style={{ backgroundColor: '#000' }}
                    >
                      {getInitials(this.props.person)}
                    </Avatar>
                  </span>
                </Popover>
              </Menu.Item>

            </Menu>

          </Header>
          : ''}
      </div>
    )
  }
}

export default SchoolAdminHeader