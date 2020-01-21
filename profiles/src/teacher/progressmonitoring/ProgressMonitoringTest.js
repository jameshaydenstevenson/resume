import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'
import { firebase, db } from '../../firebase/Firebase'
import ColType from '../../Types'
import { isGoalOnTrack, getRandomShardIndex, getNumShards, 
  updateSummary, compress, decompress } from '../../Util'
import InputNumberPickerAnt from '../../customcomponents/InputNumberPickerAnt'
import { Progress, Divider, message, Button, Icon } from 'antd'

const successMessage = (description) => {
  message.success(description)
}

const errorMessage = (description) => {
  message.error(description)
}

class ProgressMonitoringTest extends Component {
  state = {
    iep: this.props.iep,
    progressMonitoringCopy: null,
    totalPoints: 0,
    submitting: false,
  }

  componentDidMount() {
    console.log('component mounted')
    this.setState({
      totalPoints: 0,
      progressMonitoringCopy: this.makeProgressMonitoringCopy(),
    })
  }

  makeProgressMonitoringCopy = () => {
    var copy = JSON.parse(JSON.stringify(this.state.iep.iep.progressMonitoring))
    // initialize scores to 0
    copy.map((item, index) => {
      item.max = item.num
      item.num = 0
      return item
    })

    return copy
  }

  getTotalPoints = (progressMonitoring) => {
    var total = 0
    progressMonitoring.map((item, index) => {
      return total += item.num
    })

    return total
  }

  progressMonitoringChange = (newValue, iep, index) => {
    var pm = this.state.progressMonitoringCopy
    pm[index].num = newValue

    this.setState({
      progressMonitoringCopy: pm,
      totalPoints: this.getTotalPoints(pm)
    })
  }

  addMeasurement = () => {
    this.setState({
      submitting: true,
    }, () => {
      console.log('add', this.state.iep)
      // stop potential divide by 0 (should be impossible, means the rubrik's total score is 0)
      var newMeasurement = this.props.iep.iep.totalPoints === 0 ? 0 :
      (this.state.totalPoints / this.props.iep.iep.totalPoints * 100).toFixed(0)
      var newMeasurements = []
      this.props.measurements.map((measurement, index) => {
        return newMeasurements.push(measurement)
      })
      // push an object, isGoalOnTrack needs an object in the measurements array.
      newMeasurements.push({measurement: newMeasurement})
      var totalMeasurements = newMeasurements.length
      var onTrack = isGoalOnTrack(this.props.iep.iep, newMeasurements)

      var totalMeasurementsBefore = this.props.measurements.length
      var totalMeasurementsAfter = newMeasurements.length
      var onTrackBefore = this.props.iep.onTrack
      var onTrackAfter = onTrack
      var docBefore = {totalMeasurements: totalMeasurementsBefore, onTrack: onTrackBefore}
      var docAfter = {totalMeasurements: totalMeasurementsAfter, onTrack: onTrackAfter}
      var grade = this.props.student.grade
      var subject = this.props.iep.iep.mainSubject
      var raceOrEthnicity = this.props.student.ethnicity === 'Hispanic or Latino' ? 
                            this.props.student.ethnicity : 
                            this.props.student.race
      var shardIndex = getRandomShardIndex(getNumShards())
      var shardPromises = []
      
      console.log('districtId', this.props.iep.districtId, 
      'schoolId', this.props.iep.schoolId, 'shardIndex', shardIndex)

      shardPromises.push(db.collection(ColType.schoolSummary)
          .where('districtId', '==', this.props.iep.districtId)
          .where('schoolId', '==', this.props.iep.schoolId)
          .where('shardIndex', '==', shardIndex)
          .get()
      )

      shardPromises.push(db.collection(ColType.districtSummary)
          .where('districtId', '==', this.props.iep.districtId)
          .where('shardIndex', '==', shardIndex)
          .get()
      )

      Promise.all(shardPromises)
      .then((docs) => {
        console.log('shard promises result', docs)
        var schoolSummaryRef
        var districtSummaryRef
        docs[0].forEach((doc) => {
          if (!doc.exists) {
            console.log("School summary document did not exist!")
            errorMessage("We could not locate your school, please contact your administrator.")
            this.setState({ submitting: false })
            return
          }
          schoolSummaryRef = doc.ref
          console.log('school summary doc', doc.data())
        })
        docs[1].forEach((doc) => {
          if (!doc.exists) {
            console.log("District summary document did not exist!")
            errorMessage("We could not locate your district, " +
            "please contact your administrator.")
            this.setState({ submitting: false })
            return
          }
          districtSummaryRef = doc.ref
          console.log('school summary doc', doc.data())
        })

        if (!schoolSummaryRef || !districtSummaryRef) return

        var transactionPromises = []
        transactionPromises.push(
          db.runTransaction((transaction) => {
              return transaction.get(schoolSummaryRef).then((schoolSummaryDoc) => {
                  if (!schoolSummaryDoc.exists) {
                      throw new Error("School summary document does not exist!")
                  }
  
                  var schoolSummaryData = schoolSummaryDoc.data()
                  schoolSummaryData.summary = decompress(schoolSummaryData.summary)

                  var isDistrict = false
                  schoolSummaryData = updateSummary(docBefore, docAfter, schoolSummaryData, 
                    grade, subject, raceOrEthnicity, this.props.school, isDistrict)

                  schoolSummaryData.summary = compress(schoolSummaryData.summary)
                  return transaction.update(schoolSummaryRef, schoolSummaryData)
              })
          })
        )
        transactionPromises.push(
          db.runTransaction((transaction) => {
              return transaction.get(districtSummaryRef).then((districtSummaryDoc) => {
                  if (!districtSummaryDoc.exists) {
                      throw new Error("District summary document does not exist!")
                  }
  
                  var districtSummaryData = districtSummaryDoc.data()
                  districtSummaryData.summary = decompress(districtSummaryData.summary)

                  var isDistrict = true
                  districtSummaryData = updateSummary(docBefore, docAfter, districtSummaryData, 
                    grade, subject, raceOrEthnicity, this.props.school, isDistrict)

                  districtSummaryData.summary = compress(districtSummaryData.summary)
                  return transaction.update(districtSummaryRef, districtSummaryData)
              })
          })
        )

        // transction promises
        Promise.all(transactionPromises)
          .then(() => {
            var promises = []
            promises.push(db.collection(ColType.measurements)
              .add({
                iepId: this.props.iep.id,
                teacherId: this.props.teacher.id,
                schoolId: this.props.teacher.schoolId,
                districtId: this.props.teacher.districtId,
                timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                measurement: newMeasurement,
                progressMonitoringResult: this.state.progressMonitoringCopy,
              })
            )
            promises.push(db.collection(ColType.iep)
              .doc(this.props.iep.id)
              .update({
                totalMeasurements: totalMeasurements,
                onTrack: onTrack,
                latestMeasurementTimeStamp: firebase.firestore.FieldValue.serverTimestamp(),
              })
            )
            
            // score promises
            Promise.all(promises)
              .then(() => {
                successMessage("New score added successfully.")
                this.setState({ 
                  submitting: false,
                  totalPoints: 0,
                  progressMonitoringCopy: this.makeProgressMonitoringCopy(),
                })
                
                // switch back to chart on success
                if (this.props.setChartKey) this.props.setChartKey()
              })
              .catch((error) => {
                console.log(error)
                errorMessage("New score could not be added.")
                this.setState({ submitting: false })
              })
          })
          .catch((error) => {
            console.log(error)
            errorMessage("New score could not be added.")
            this.setState({ submitting: false })
          })
      })
    })
  }

  render() {
    console.log(this.state.totalPoints)
    console.log(this.props.iep)
    return (
      <div>
        {this.props.iep && this.state.progressMonitoringCopy ? 
          <div>
            {this.props.iep.iep.progressMonitoring.map((item, index) => {
              return <div className="mb-1" key={"progress-monitoring-rubrik" + index}>
                <InputNumberPickerAnt 
                  meta={{index: index}}
                  size={'large'} 
                  min={0} 
                  max={item.num} 
                  value={this.state.progressMonitoringCopy[index].num}
                  className={''} 
                  onChangeSuccess={this.progressMonitoringChange}
                />
                <span className="font-18">
                  <span className="ml-1 mr-1">/</span>
                  <span>{item.num + ' ' + item.info}</span>
                </span>
              </div>
            })
            }
            <div className="mt-3 pt-3 border-top font-18">
              <div className="pl-1 pr-1 inline-block w-100">
                <div className="inline-block width-90px">
                  {this.state.totalPoints}
                </div>
                <div className="inline-block">
                  <span className="mr-1">/</span>
                  <span>{this.props.iep.iep.totalPoints} Total points</span>
                </div>
                <Divider type="vertical" className="height-35px ml-2 mr-2" />
                <div className="inline-block font-500 mr-3">
                  Score of
                </div>
                <div className="inline-block">
                  <Progress 
                    type="dashboard"
                    className="test-progress"
                    percent={(this.state.totalPoints / 
                              this.props.iep.iep.totalPoints * 100).toFixed(0)} 
                  />
                </div>
              </div>
            </div>
            <div>
              <Button type="primary" size="large" className="btn-vl" 
              disabled={this.state.submitting}
              onClick={this.addMeasurement}>
                {this.state.submitting ? 
                  <span>
                    <Icon type="loading" className="mr-1" />Adding...
                  </span>
                :
                <span>
                  <Icon type="plus-circle-o" className="mr-1"/>Add This Score ({
                    (this.state.totalPoints / 
                      this.props.iep.iep.totalPoints * 100).toFixed(0)
                  }%)
                </span>
                }
              </Button>
            </div>
          </div>
        : ''}
      </div>
    )
  }
}

export default ProgressMonitoringTest