import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'
import { Steps } from 'antd'
const Step = Steps.Step

class IEPFormSteps extends Component {
  state = {

  }

  componentDidMount() {

  }

  render() {

    return <Steps current={this.props.current} direction="vertical">
              <Step title="Student Information" />
              <Step title="PLAAFP" />
              <Step title="Observation" />
              <Step title="Goals" />
              <Step title="Baselines / Targets" />
              <Step title="Service Time" />
              <Step title="Accommodations" />
              <Step title="Confirm" />
            </Steps>
  }
}

export default IEPFormSteps