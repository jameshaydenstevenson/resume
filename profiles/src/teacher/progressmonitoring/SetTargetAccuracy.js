import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'
import { db } from '../../firebase/Firebase'
import { createIEPGoalText } from '../.././Util'
import ColType from '../.././Types'
import InputNumberPickerAnt from '../../customcomponents/InputNumberPickerAnt'
import { Modal, Button, message } from 'antd'

const successMessage = (description) => {
  message.success(description)
}

const errorMessage = (description) => {
  message.error(description)
}

class SetTargetAccuracy extends Component {
  state = { 
    iep: this.props.iep,
    student: this.props.student,
    targetValue: 1,
    visible: false,
    confirmLoading: false,
  }

  componentDidMount() {
    
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleOk = (e) => {
    console.log(e)
    this.setState({
      confirmLoading: true,
    }, () => {
      var iep = this.state.iep
      iep.iep.targetAccuracyLevel = this.state.targetValue
      var iepParagraph = createIEPGoalText(iep.iep, this.props.student)

      db.collection(ColType.iep)
      .doc(this.props.IEPId)
      .update({
        'iep.targetAccuracyLevel': this.state.targetValue,
        'iepParagraph': iepParagraph,
      })
      .then(() => {
        this.setState({
          confirmLoading: false,
          visible: false,
        })
        successMessage("Target score was successfully added.")
      })
      .catch((error) => {
        errorMessage("Target score could not be added. " +
        "Please try again or contact your administrator.")
      })
    })
  }

  handleCancel = (e) => {
    console.log(e)
    this.setState({
      visible: false,
    })
  }

  onChange = (value, index) => {
    console.log(value)
    this.setState({
      targetValue: value,
    })
  }

  render() {
    return (
      <div>
        <div className="mb-2">
          <span>
            {'This IEP goal does not yet have a target score. ' +
            'One must be added before additional scores can be entered.'}
          </span>
        </div>
        <Button 
          size={'large'} 
          type="primary" 
          onClick={this.showModal}
        >
          Set target score for this IEP goal
        </Button>
        <Modal
          title="Set target score for this IEP goal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText={'Set target score'}
          confirmLoading={this.state.confirmLoading}
        >
          <InputNumberPickerAnt 
            meta={{index: 0}}
            size={'large'} 
            min={1} 
            max={100} 
            value={this.state.targetValue}
            className={'w-100'} 
            onChangeSuccess={this.onChange}
          />
        </Modal>
      </div>
    )
  }
}

export default SetTargetAccuracy
