import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'
import { firebase, db } from '../../firebase/Firebase'
import ColType from '../.././Types'
import InputNumberPickerAnt from '../../customcomponents/InputNumberPickerAnt'
import { getInitials, createIEPGoalText } from '../.././Util'
import { Icon, Button, Avatar } from 'antd'

class TeacherAddIEPGoal extends Component {
  state = {
    student: this.props.student,
    teacher: this.props.teacher,
    iep: this.props.iep,
    originalIEP: this.props.iep,
    iepParagraph: '',
    iepWithPossibleEdits: '',
    totalPoints: null,
    onGoBack: this.props.onGoBack,
    isEditing: false,
    isSubmitting: false,
  }

  componentDidMount() {
    window.scrollTo(0, 0)

    if (this.state.student && this.state.teacher && this.state.iep) {
      this.setState({
        iepParagraph: createIEPGoalText(this.state.iep, this.state.student),
        iepWithPossibleEdits: createIEPGoalText(this.state.iep, this.state.student),
        totalPoints: this.getTotalPoints(this.state.iep)
      })
    }
  }

  progressMonitoringChange = (newValue, index) => {
    console.log('val = ' + newValue, ', idx = ' + index)
    var iep = {...this.state.iep}
    // set the number in the progress monitoring to the new value
    iep.progressMonitoring[index].num = newValue

    this.setState({
      iep: iep,
      totalPoints: this.getTotalPoints(iep)
    }, () => {
      console.log('after', iep)
    })
  }

  getTotalPoints = (iep) => {
    var total = 0
    iep.progressMonitoring.map((item, index) => {
      return total += item.num
    })

    return total
  }

  goBack = (e) => {
    this.setState({
      didSelectIEP: false,
      isEditing: false,
    })
  }

  toggleEdit = (e) => {
    this.setState({
      isEditing: !this.state.isEditing,
    })
  }

  iepEdit = (e) => {
    this.setState({
      iepWithPossibleEdits: e.target.value,
    })
  }

  revertIEP = (e) => {
    var iepParagraph = createIEPGoalText(this.state.originalIEP, this.state.student)

    this.setState({
      iepWithPossibleEdits: iepParagraph,
    })
  }

  submit = (e) => {
    e.preventDefault()

    this.setState({
      isSubmitting: true,
    }, () => {
      db.collection(ColType.iep).add({
        iep: this.state.iep,
        totalPoints: this.state.totalPoints,
        iepParagraph: this.state.iepWithPossibleEdits,
        studentId: this.state.student.id,
        teacherId: this.state.teacher.id,
        schoolId: this.state.teacher.schoolId,
        districtId: this.state.teacher.districtId,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((docRef) => {
        console.log('Document written with ID: ', docRef.id)
        this.setState({
          isSubmitting: false,
        })
      })
      .catch(function (error) {
        console.error('Error adding document: ', error)
      })
    })
  }

  render() {
    var hasNotBeenEditted = false
    if (this.state.iepParagraph && this.state.iepWithPossibleEdits) {
      hasNotBeenEditted = this.state.iepWithPossibleEdits === this.state.iepParagraph
    }

    return <div>
    {this.state.student && this.state.teacher && this.state.iep ?
      <div>
        <div>
          <div className="p-4 pb-0 mb-4 inline-block w-100">
            <div className="pb-4 border-bottom inline-block w-100">
              <h2 className="mb-3 pb-3 border-bottom">
                {this.state.onGoBack ?
                <Button 
                  className="transparent-btn font-18 mr-2" 
                  size={'large'} 
                  disabled={this.state.isSubmitting} 
                  onClick={this.state.onGoBack}
                >
                  <Icon type="arrow-left"/>
                </Button>
                : ''}
                <span>{this.state.iep.grade + '.' + this.state.iep.standard}</span>
              </h2>
              <h3 className="mb-3">
                <span>
                  <Avatar 
                    size="large"
                    className="mr-8" 
                    style={{ backgroundColor: this.state.student.avatarColor}}
                  >
                    {getInitials(this.state.student)}
                  </Avatar>
                  <span className="vertical-align-middle">
                      {this.state.student.firstName + " " + 
                      this.state.student.lastName + "'s IEP Goal"}
                  </span>
                </span>
              </h3>
              {!this.state.isEditing ? 
                <div className="mb-3 font-16">{this.state.iepWithPossibleEdits}</div> : 
                <textarea 
                  rows={5} 
                  className="mb-3 w-100 form-control normal-line-height" 
                  value={this.state.iepWithPossibleEdits} 
                  onChange={evt => this.iepEdit(evt)}
                >
                </textarea>
              }
              {!hasNotBeenEditted ? 
                <Button type={'dashed'}  size={'large'} onClick={evt => this.revertIEP(evt)}>
                  Revert to original
                </Button> : ''
              }
              <Button 
                type={'dashed'} 
                size={'large'} 
                className="float-right" 
                onClick={evt => this.toggleEdit(evt)}>
              <Icon type="edit"/> {!this.state.isEditing ? 'Edit (Optional)' : 'Done Editing'}
              </Button>
            </div>
          </div>

          <div className="p-4 pb-0 pt-0 inline-block">
            <h3 className="mb-3">Progress monitoring rubrik</h3>
            {this.state.iep ? 
            this.state.iep.progressMonitoring.map((item, index) => {
              return <div className="mb-1" key={"progress-monitoring-rubrik" + index}>
                <InputNumberPickerAnt 
                  meta={{index: index}}
                  size={'large'} 
                  min={1} 
                  max={20} 
                  value={item.num}
                  className={''} 
                  onChangeSuccess={this.progressMonitoringChange}
                />
                <span className="font-18 ml-1">
                  {item.info}
                </span>
              </div>
            })
          : ''}
          <div className="mt-3 pb-4 border-top font-18">
            <div className="p-1 pt-2">
              <div className="inline-block width-90px">
                {this.state.totalPoints ? this.state.totalPoints : ''}
              </div>
              <div className="inline-block">Total points</div>
            </div>
          </div>
        </div>

        <div className="p-4 pt-0">
          <div className="border-top pt-4">
            <Button 
              className="m-lr-auto block" 
              size={'large'} 
              type={'primary'} 
              disabled={this.state.isSubmitting} 
              onClick={evt => this.submit(evt)}>
            <Icon 
              type="plus"/> 
              {!this.state.isSubmitting ? 
              'Add this IEP Goal' : 
              'Adding IEP Goal...'}
            </Button>
          </div>
        </div>

        </div>
      </div>
      : ''}
    </div>
  }
}

export default TeacherAddIEPGoal