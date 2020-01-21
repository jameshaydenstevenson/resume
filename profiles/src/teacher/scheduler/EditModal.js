import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'
import EditTitleForm from './EditTitleForm'
import { Button, Modal, Tabs, Tooltip } from 'antd'
const TabPane = Tabs.TabPane

// Using this to add students until the step form for adding students is done.
class EditModal extends Component {
  state = { 
    visible: false,
  }

  componentDidMount() {
  
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  hideModal = () => {
    this.setState({
      visible: false,
    })
  }

  handleOk = (e) => {
    console.log(e)
    this.setState({
      visible: false,
    })
  }

  handleCancel = (e) => {
    console.log(e)
    this.setState({
      visible: false,
    })
  }

  render() {
    return (
      <div className="inline-block">
      <Tooltip 
        title="Edit"
      >
          <Button 
          className={'inline-block font-20 border-none mr-1 ' +
          'font-dark-grey ' + 
          ' show-on-parent-hover grey-hover-important'}
          size={'large'} shape={'circle'} icon="edit" 
          onClick={this.showModal}
        />
      </Tooltip>
      <Modal
        title="Calendar event information"
        visible={this.state.visible}
        footer={null}
        width={700}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
      <Tabs 
      defaultActiveKey={
        this.props.servicedIn !== 'Teacher Event' ? '1' : '2'
      } 
      animated={false}>
        {this.props.servicedIn !== 'Teacher Event' ?
        <TabPane tab="Students / IEP Goals" key="1">
          <div className={"p-4 pl-2 pr-2"}>
            <div className="font-16 mb-1 font-500">
              <div className="inline-flex mw-150px mr-1">Student</div>
              <div className="inline-flex mw-200px mr-1">IEP</div>
              <div className="inline-flex mw-150px">Duration</div>
            </div>
            <div className="mh-150 overflow-y-scroll alternate-color-table">
              {this.props.iepsAndStudents}
            </div>
          </div>
        </TabPane>
        : ''}
        {!this.props.readOnly ?
          <TabPane tab="Edit Event" key="2">
          <div className={"p-4 pl-2 pr-2"}>
            <EditTitleForm 
              teacher={this.props.teacher} 
              event={this.props.event} 
              expandIntoWrongBlock={this.props.expandIntoWrongBlock}
              onEditSuccessful={this.hideModal}
            />
          </div> 
          </TabPane> 
        : ''}
        </Tabs>
      </Modal>
    </div>
    )
  }
}

export default EditModal
