import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/GlobalStyle.css'
import PersonAvatar from '../customcomponents/PersonAvatar'
import { firebase } from '../firebase/Firebase'
import { getInitials } from '.././Util'
import { Layout, Icon, Menu, Avatar, Popover, message, Select, Tooltip } from 'antd'
const { Header } = Layout
const Option = Select.Option

const errorMessage = (description) => {
  message.error(description)
}

class TeacherHeader extends Component {
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
        pathname: '/teacher/student/' +
          this.props.person.id + '?student=' +
          option.key
      }
    )
  }

  render() {
    console.log(this.props.selectedKey)
    return (
      <div>
        {this.props.person != null &&
          Object.keys(this.props.person).length !== 0 &&
          this.props.person.constructor === Object ?
          <Header
            className={this.props.readOnly ? 't-67' : ''}
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
              {this.props.readOnly ?
                <Menu.Item 
                  key="teacher-view-only" 
                  className="inline-flex flex-v-center menu-no-bb"
                  style={{marginRight: 48}}
                >
                  <Tooltip title="This information can be viewed only."
                   placement="bottomLeft" mouseEnterDelay={.75}>
                    <div>View only</div>
                  </Tooltip>
                </Menu.Item> 
              : ''}

              {!this.props.readOnly ?
                <Menu.Item key="teacher-logo" className="inline-flex flex-v-center menu-no-bb mr-3">
                <Link to={'/'}>
                  <img src='/dotit-iep-logo.png' alt='logo' height='48' />
                </Link>
                </Menu.Item> 
              : ''}
              
              <Menu.Item key="home" className="font-500 inline-flex flex-center">
                <Tooltip title="Home" placement="bottom" mouseEnterDelay={.75}>
                <Link
                  to={'/teacher/home/' + this.props.person.id}>
                  <Icon type="home" className={"font-24 va-middle flex-h-center " +
                  "mr-0 br-50 border p-1 font-30 " +
                  (this.props.readOnly ? "ant-btn-outlined" : "ant-btn-primary")} />
                </Link>
                </Tooltip>
              </Menu.Item>

              <Menu.Item key="class" className="font-500 inline-flex flex-center">
              <Tooltip title="My students" placement="bottom" mouseEnterDelay={.75}>
                <Link
                  to={'/teacher/class/' + this.props.person.id}>
                  <Icon type="user" 
                  className={"font-24 va-middle flex-h-center " +
                  "mr-0 br-50 border p-1 font-30 " +
                  (this.props.readOnly ? "ant-btn-outlined" : "ant-btn-primary")} />
                </Link>
                </Tooltip>
              </Menu.Item>
              <Menu.Item key="schedule" 
              className="font-500 inline-flex flex-center text-muted">
                <Tooltip title="Schedule" placement="bottom" mouseEnterDelay={.75}>
                <Link
                  to={'/teacher/schedule/' + this.props.person.id}>
                  <Icon type="calendar" 
                  className={"font-24 va-middle flex-h-center " +
                  "mr-0 br-50 border p-1 font-30 " +
                  (this.props.readOnly ? "ant-btn-outlined" : "ant-btn-primary")} />
                </Link>
                </Tooltip>
              </Menu.Item>
              <Menu.Item key="progress-monitoring" className="font-500 inline-flex flex-center">
              <Tooltip title="Progress monitoring" placement="bottom" mouseEnterDelay={.75}>
                <Link
                  to={'/teacher/progress-monitoring/' + this.props.person.id}>
                  <Icon type="area-chart" 
                  className={"font-24 va-middle flex-h-center " +
                  "mr-0 br-50 border p-1 font-30 " +
                  (this.props.readOnly ? "ant-btn-outlined" : "ant-btn-primary")} />
                </Link>
                </Tooltip>
              </Menu.Item>
              <Menu.Item key="reports" className="font-500 inline-flex flex-center">
              <Tooltip title="My reports" placement="bottom" mouseEnterDelay={.75}>
                <Link
                  to={'/teacher/reports/' + this.props.person.id}>
                  <Icon type="solution" 
                  className={"font-24 va-middle flex-h-center " +
                  "mr-0 br-50 border p-1 font-30 " +
                  (this.props.readOnly ? "ant-btn-outlined" : "ant-btn-primary")} />
                </Link>
                </Tooltip>
              </Menu.Item>

              
              <Menu.Item key="search" className="inline-flex flex-v-center menu-no-bb ml-auto">
                <Select
                  showSearch
                  className="ant-select-very-large cursor-text br-100"
                  placeholder={'Search students'}
                  showArrow={false}
                  onChange={this.onChange}
                  onSelect={this.onSelect}
                  style={{ width: '350px' }}
                >
                  {this.props.students && this.props.students.map((student, index) => {
                    return <Option
                      key={student.id}
                      value={student.firstName + ' ' + student.lastName}
                      title={student.firstName + ' ' + student.lastName}
                    >
                      <div className="w-100 flex flex-v-center">
                        <PersonAvatar person={student} size={'default'} />
                        <span className="ml-auto text-muted font-500 font-13">
                        Grade: {student.grade}</span>
                      </div>
                    </Option>
                  })
                  }
                </Select>
                <Icon type="search" className="font-16 select-suffix" />
              </Menu.Item>
              
              {!this.props.readOnly ?
              <Menu.Item key="teacher-sign-out"
                className="inline-flex flex-v-center menu-no-bb">
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
                          to={"/teacher/home/" + this.props.person.id}
                          className="font-16 p-2 block"
                        >
                          <Icon type="home"
                            className="mr-3 text-muted font-bold font-20 va-middle" />
                          <span className="va-minus-1 fw-500">Home</span>
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
              </Menu.Item> :
              <Menu.Item key="teacher-home" className="inline-flex flex-v-center menu-no-bb mr-3">
                <Tooltip title={"Teacher: " + 
                this.props.person.firstName + " " + this.props.person.lastName + "."}
                   placement="bottomRight" mouseEnterDelay={.75}>
                  <div>{this.props.person.firstName + " " + this.props.person.lastName}</div>
                </Tooltip>
              </Menu.Item>  
              }

            </Menu>

          </Header>
          : ''}
      </div>
    )
  }
}

export default TeacherHeader