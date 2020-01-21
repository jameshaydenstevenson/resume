import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import { getInitials } from '.././Util'
import { Layout, Menu, Icon, Avatar } from 'antd'
const { Sider} = Layout

class AdminSider extends Component {
  state = {
        
  }
  
  render() {
    if (!(this.props.admin != null && 
        Object.keys(this.props.admin).length !== 0 && 
        this.props.admin.constructor === Object)) {
        return (
            <Sider 
                width={250} 
                style={{ overflow: 'auto', 
                         height: 'calc(100% - 64px)', 
                         position: 'fixed', left: 0, marginTop: 64, 
                         borderRight: '1px solid #e6e6e6' }}>
            </Sider>
        )
    }

    return ( 
        <Sider 
            width={250} 
            style={{ overflow: 'auto', height: 'calc(100% - 64px)', 
                     position: 'fixed', left: 0, marginTop: 64, 
                     borderRight: '1px solid #e6e6e6'}}>
            <div className="logo" />
                <div className="text-align-left">
                <div className="p-24">
                    <Avatar size="large" 
                        className="avatar-very-large2 inline-block mr-12" 
                        style={{ backgroundColor: this.props.admin.avatarColor}}>
                        {getInitials(this.props.admin)}
                    </Avatar>
                    <div 
                    className="inline-block vertical-align-middle font-16 mw-109 text-of-ellipsis">
                        <span>Welcome,</span>
                        <div className="font-bold">
                            {this.props.admin.firstName + " " + this.props.admin.lastName}
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
                        <a href={'/admin/district/' + this.props.admin.id} 
                           className="nav-text">
                            <Icon type="home" />My District
                        </a>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <a href={'/admin/iep-goals/' + this.props.admin.id} 
                           className="nav-text">
                           <Icon type="profile" />District IEP Goals
                        </a>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <a href={'/admin/schedules/' + this.props.admin.id} 
                           className="nav-text">
                           <Icon type="calendar" />Teacher Schedules
                        </a>
                    </Menu.Item> 
                    <Menu.Divider />
                    <Menu.Item key="4">
                        <a href={'/admin/add-person/' + this.props.admin.id} 
                           className="nav-text">
                            <Icon type="plus-circle-o" />Add personnel
                        </a>
                    </Menu.Item>       
                </Menu>
            </div>
      </Sider> 
    )
  }
}

export default AdminSider