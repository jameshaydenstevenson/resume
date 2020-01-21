import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import { Modal, Button, Icon, Tooltip } from 'antd'

export default class BlogSections extends Component {
  state = { visible: false, width: 0, height: 0 }

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

  showModal = () => {
    this.setState({
      visible: true,
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
      <div>
        <div className="relative inline-block parent-hover">
          <img src={this.props.imgSrc} className={this.props.additionalClassNames} alt={'img'} />
          {this.state.width > 1000 ?
          <Tooltip title="Expand image">
          <Button style={{height: '50px', width: '50px', left: 'calc(50% - 25px)', 
                          top: 'calc(50% - 25px)',
                          }}
          className="absolute font-bold font-35 show-on-parent-hover" 
            shape="circle"
            type="primary"
            onClick={this.showModal}>
              <Icon type="plus" style={{color: '#fff'}}/>
          </Button>
          </Tooltip>
          : ''}
        </div>
        <Modal
          title={null}
          footer={null}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={600}
        >
          <img src={this.props.imgSrc} alt={'img'} height={550} />
        </Modal>
      </div>
    )
  }
}