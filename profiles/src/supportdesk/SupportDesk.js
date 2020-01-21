import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import InterestedForm from './InterestedForm'
import QuestionForm from './QuestionForm'
import { Button, Icon } from 'antd'

export default class SupportDesk extends Component {
  state = {
    minimized: true,
    mode: 'none',
  }

  componentDidMount() {
    
  }

  minimize = () => {
    this.setState({ minimized: true })
  }

  maximize = () => {
    this.setState({ minimized: false })
  }

  changeMode = (newMode) => {
    this.setState({ mode: newMode })
  }
  

  render() {
    return (
      <div>
        <div style={{position: 'fixed', bottom: 24, right: 24, zIndex: '2'}} 
        className="cursor-pointer"
        onClick={this.maximize}>
          <div className="background-fff p-2 inline-block mr-1 ant-shadow br-15">
            <h2 className="mb-0">How can we help?</h2>
          </div>
          <Button type="primary" size="large" className="br-50 p-0 inline-block ant-shadow"
            style={{height: 64, width: 64}}
          >
            <Icon type="message" className="font-30" />
          </Button>
        </div>

        {!this.state.minimized ?
        <div 
          style={{position: 'fixed', bottom: 0, right: 0, top: 0, zIndex: '200', width: 300}}
          className="background-fff ant-shadow"
        >
          <div className="ant-shadow p-2">
            <h2 className="mb-0 inline-block">Smart Learning Systems</h2>
            <Button className="transparent-btn float-right" onClick={this.minimize}>
              <Icon type="close" className="font-24" />
            </Button>
          </div>

          <div className="p-2 overflow-y-scroll" style={{height: 'calc(100% - 63px'}}>
            {this.state.mode === 'none' ?
              <div>
                <h1>Hi! How can we help?</h1>
                <Button type="primary" size={'large'} className="mb-1" 
                  onClick={() => this.changeMode('interested')}
                >
                  I am interested in dot it
                </Button>
                <Button type="primary" size={'large'} className="mb-1"
                  onClick={() => this.changeMode('question')}
                >
                  I have a question
                </Button>
              </div>
            : ''}

            {this.state.mode === 'interested' ?
              <div>
                <Button className="transparent-btn" 
                onClick={() => this.changeMode('none')}>
                  <Icon type="arrow-left" className="font-24" />
                </Button>
                <h1>Great! What is your email so we can get in touch?</h1>
                <InterestedForm />
              </div>
            : ''}

            {this.state.mode === 'question' ?
              <div>
                <Button className="transparent-btn" 
                onClick={() => this.changeMode('none')}>
                  <Icon type="arrow-left" className="font-24" />
                </Button>
                <h1>Thank you for your interest in dot it! What is your question?</h1>
                <QuestionForm />
              </div>
            : ''}
          </div>
        </div>
        : ''}
      </div>
    )
  }
}