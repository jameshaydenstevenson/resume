import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/GlobalStyle.css'
import { getInitials } from '.././Util'
import { Layout, Menu, Icon, Avatar } from 'antd'
const { Sider } = Layout
const SubMenu = Menu.SubMenu

class TeacherSider extends Component {
  state = {
    collapsed: false,
    }

  onCollapse = (collapsed) => {
    this.setState({ collapsed })
  }

  render() {
    if (!(this.props.teacher != null && 
        Object.keys(this.props.teacher).length !== 0 && 
        this.props.teacher.constructor === Object)) {
        return (
            <Sider 
                width={250} 
                style={{ overflow: 'auto', height: 'calc(100% - 64px)', 
                position: 'fixed', left: 0, marginTop: 64, borderRight: '1px solid #e6e6e6' }}>
            </Sider>
        )
    }

    var currentKey = 6
    return ( 
        <Sider 
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
            width={250} 
            style={{ overflow: 'auto', height: 'calc(100% - 64px)', position: 'fixed', 
                     left: 0, marginTop: 64, borderRight: '1px solid #e6e6e6' }}>
            <div className="logo" />
                <div className="text-align-left">
                <div className="p-24">
                    <Avatar 
                        size="large" 
                        className="avatar-very-large2 inline-block mr-12" 
                        style={{ backgroundColor: this.props.teacher.avatarColor}}
                    >
                        {getInitials(this.props.teacher)}
                    </Avatar>
                <div className="inline-block vertical-align-middle font-16 mw-109 text-of-ellipsis">
                <span>Welcome,</span>
                <div className="font-bold">
                    {this.props.teacher.firstName + " " + 
                    this.props.teacher.lastName}
                </div>
                </div>
                </div>
                <Menu 
                    mode="inline" 
                    className="menu-grey" 
                    defaultOpenKeys={this.props.subMenusOpen} 
                    defaultSelectedKeys={[this.props.activeIdx]}
                >
                <Menu.Item key="1">
                    <Link 
                        to={'/teacher/schedule/' + this.props.teacher.id} 
                        className="nav-text"><Icon type="calendar" />
                        My Schedule
                    </Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link 
                        to={'/teacher/class/' + this.props.teacher.id} 
                        className="nav-text"><Icon type="contacts" />
                        My Class
                    </Link>
                </Menu.Item>
                {/**<Menu.Item key="3">
                    <a href={'/teacher/iep-goals/' + this.props.teacher.id} 
                    className="nav-text"><Icon type="bar-chart" />IEP Goals</a>
                </Menu.Item>*/}
                {<SubMenu 
                    key="sub1" 
                    title={<span>
                           <Icon type="profile" className="font-18"/>
                           <span className="nav-text">IEP Goals</span></span>
                    }
                >
                {this.props.students.map((student, index) => {
                    currentKey += 1
                    return <Menu.Item key={currentKey.toString()}>
                        <Link 
                            to={'/teacher/progress-monitoring/' + 
                            this.props.teacher.id + '?student=' + student.id}
                        > 
                        <Avatar className="mr-8 avatar-left" 
                        style={{ backgroundColor: student.avatarColor}}>
                            {getInitials(student)}
                        </Avatar>
                        <span className="vertical-align-middle">
                            {student.firstName + " " + student.lastName}
                        </span>
                        </Link>
                    </Menu.Item>
                })
                }
                    
                </SubMenu>}
                {/**<Menu.Item key="4">
                    <a href={'/teacher/instructional-plan/' + this.props.teacher.id} 
                    className="nav-text"><Icon type="book" />Instructional Plan</a>
                </Menu.Item>*/}
                <Menu.Divider />
                <Menu.Item key="5">
                    <Link  
                        to={'/teacher/add-student/' + this.props.teacher.id} 
                        className="nav-text"><Icon type="user-add" />
                        Add Student
                    </Link>
                </Menu.Item>
                <Menu.Item key="6">
                    <Link 
                        to={'/teacher/add-goal-student/' + this.props.teacher.id} 
                        className="nav-text"><Icon type="plus-circle-o" />
                        Add IEP Goal
                    </Link>
                </Menu.Item>
                {/**<SubMenu key="sub1" title={<span><Icon type="profile" />
                <span className="nav-text">Progress Monitoring</span></span>}>
                {this.props.iepGoals.map((IEPGoal: IEP, index) => {
                    currentKey += 1
                    var student = this.props.students.filter(s => s.id === IEPGoal.studentId)[0]
                    return <Menu.Item key={"" + currentKey}>
                        <a href={'/teacher/progress-monitoring/' + 
                        this.props.teacher.id + '?iep=' + IEPGoal.id}> 
                        {
                            student.firstName + " " + student.lastName + " - " +
                            IEPGoal.iep.st + " " + IEPGoal.iep.grade + "." + IEPGoal.iep.stnum
                        }
                        </a>
                    </Menu.Item>
                })
                }
                    
                </SubMenu>*/}
                </Menu>
            </div>
      </Sider> 
    )
  }
}

export default TeacherSider