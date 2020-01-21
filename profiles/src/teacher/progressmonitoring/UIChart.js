import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'
import { db } from '../../firebase/Firebase'
import ColType from '../../Types'
import { leastSquares, isGoalOnTrack, updateSummary, 
  getRandomShardIndex, getNumShards, compress, decompress } from '../../Util'
import { message, notification, Icon, Button } from 'antd'
import { XYChart, LineSeries, AreaSeries, PointSeries, CrossHair, 
  XAxis, YAxis, LinearGradient } from '@data-ui/xy-chart'

const errorMessage = (description) => {
  message.destroy()
  message.error(description)
}

const successMessage = (description) => {
  message.destroy()
  message.success(description)
}


class UIChart extends Component {
  state = { 
 
  }

  componentDidMount() {

  }

  componentWillReceiveProps() {
    console.log('new chart props')
  }

  removeMeasurement = (measurement) => {
    var newMeasurements = this.props.measurements.filter(m => m.id !== measurement.id)
    console.log('old len', this.props.measurements.length, 'new len', newMeasurements.length)

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
        db.collection(ColType.measurements)
        .doc(measurement.id)
        .delete().then(() => {
          console.log("Document successfully deleted!")
          notification.destroy() // destroy previous notifications
          var updateObj = {
            totalMeasurements: totalMeasurements,
            onTrack: onTrack,
          }
          if (totalMeasurements.length > 0) {
            updateObj.latestMeasurementTimeStamp = 
            newMeasurements[newMeasurements.length - 1].timeStamp
          }

          // update iep goal
          db.collection(ColType.iep)
            .doc(this.props.iep.id)
            .update(updateObj)

          successMessage("The measurement was successfully removed.") // show success message
        }).catch((error) => {
          console.error("Error removing document: ", error)
          notification.destroy() // destroy previous notifications
          errorMessage("The measurement could not be removed.") // show error message
        })
      })
      .catch((error) => {
        console.log('transaction promises error', error)
        errorMessage("The measurement could not be removed.") // show error message
      })
    })
    .catch((error) => {
      console.log('shard transaction error', error)
      errorMessage("The measurement could not be removed.") // show error message
    })
  }

  openNotification = (measurement) => {
    if (!this.props.allowMeasurementAdding) return
    notification.destroy() // destroy previous notifications

    const key = measurement.timeStamp
    const btn = (
      <Button 
        type="primary" 
        className="font-bold" 
        size="large" 
        onClick={() => this.removeMeasurement(measurement)}
      >
        <Icon type="delete"/>Remove this measurement
      </Button>)
  
    notification.open({
      duration: 0,
      message: 'Remove this measurement',
      description: React.createElement('div', 
      {id:'removeMeasurementNotification', className: "text-align-left"}, '',
      React.createElement('div', {className: 'font-bold inline-block mt-3'}, 'Measurement value: '),
      React.createElement('span', {}, ' ' + measurement.measurement + '%'),
      React.createElement('div', {}, ''),
      React.createElement('div', {className: 'font-bold inline-block'}, 'Date added: '),
      React.createElement('span', {}, ' ' + measurement.timeStamp.toLocaleDateString("en-US")),
      React.createElement('div', 
      {className: 'mt-2 mb-2'}, 'Once removed, this measurement cannot be recovered.')),
      icon: <Icon type="delete" className="text-muted" />,
      btn,
      key,
    })
  }

  render() {
    console.log(this.props.measurements)
    console.log('onTrack = ' + isGoalOnTrack(this.props.iep.iep, this.props.measurements))

    var width = 600
    var height = 400
    var top = 5,
        right = 50,
        left = 25,
        bottom = 100

    var data = [{seriesName: 'measurement', x: '0', 
    y: this.props.iep.iep.baselineAccuracyLevel, index: 0, 
    timeStamp: this.props.iep.timeStamp}]
    var goalData = [{seriesName: 'goal', x: '0', 
    y: this.props.iep.iep.targetAccuracyLevel, index: 0, 
    timeStamp: this.props.iep.timeStamp}]
    var xData = [0]
    var yData = [parseInt(this.props.iep.iep.baselineAccuracyLevel, 10)]

    this.props.measurements.map((item, index) => {
      if (!item.timeStamp) return false
      xData.push(index + 1)
      yData.push(parseInt(item.measurement, 10))
      data.push({
                seriesName: 'measurement', 
                x: '' + (index + 1), 
                y: item.measurement, 
                timeStamp: item.timeStamp,
                measurement: item,
                index: index + 1,
                })
      goalData.push({seriesName: 'goal', 
                     x: '' + (index + 1), 
                     y: this.props.iep.iep.targetAccuracyLevel, 
                     timeStamp: item.timeStamp,
                     measurement: item,
                     index: index + 1,
      })
      return false
    })

    var leastSquaresRes = leastSquares(xData, yData)
    var leastSquaresData = ['temporaryValue']
    xData.map((d, i) => {
      var measurement = i === 0 ? 0 : this.props.measurements[i - 1]
      return leastSquaresData.push({
        seriesName: 'aimLine',
        x: '' + (i), 
        y: (i)*leastSquaresRes[0] + leastSquaresRes[1],
        measurement: measurement,
        index: i
      })
    })

    console.log(leastSquaresRes, leastSquaresData)
    
    return (
      <XYChart
        ariaLabel="Chart"
        theme={{xTickStyles: {
          stroke: 'blue',
        }
        }
        }
        width={width}
        height={height}
        margin={{ top, right, bottom, left }}
        xScale={{ type: 'linear', domain: [0, data.length - 1] }}
        yScale={{ type: "linear", domain: [0, 100] }}
        renderTooltip={({ datum, event, seriesKey, series }) => (
          <div>
            {datum.seriesName === 'aimLine' ?
              <div>
                <div><strong>Aim line: </strong>{Math.floor(datum.y)}%</div>
              </div>
            :
             datum.seriesName === 'measurement' ? 
             datum.timeStamp === data[0].timeStamp ?
              <div>
                IEP Goal was added on this date.
                <div><strong>Baseline Score: </strong>{datum.y}%</div>
              </div> :
              <div>
                <div><strong>Score: </strong>{datum.y}%</div>
                <div><strong>Date: </strong>{datum.timeStamp.toLocaleDateString("en-US")}</div>
              </div>
            :
              <div><strong>Target Score: </strong>{datum.y}%</div>
            }
          </div>
        )}
        eventTrigger='container'
        snapTooltipToDataX
        snapTooltipToDataY
        onClick={(datum, event) => {
          console.log(datum)
          if (datum.datum.index !== 0) {
            this.openNotification(datum.datum.measurement)
          }
        }}
      >
        <LinearGradient
          id="my_fancy_gradient"
          from={'#597ef7'}
          to={'#d6e4ff'}
        />
        <AreaSeries
          data={data}
          stroke='#2f54eb'
          fill="url('#my_fancy_gradient')"
          color='blue'
        />
        <LineSeries 
          data={goalData}
          stroke='#52c41a'
        />
        {leastSquaresData.length > 2 ?
        <LineSeries 
          data={leastSquaresData}
          strokeDasharray="8 8"
          stroke='#faad14'
        /> : ''}
         {/**<PointSeries
            data={goalData}
            fill={'#fff'}
            size={4}
            strokeWidth={1}
            stroke="#52c41a"
         />*/}
         <PointSeries
            data={data}
            fill={'#fff'}
            size={4}
            strokeWidth={1}
            stroke="#597ef7"
          />
        
        <XAxis 
          numTicks={data.length > 1 ? data.length - 1 : 1} 
          tickFormat={(tick, tickIndex) => {
            //if (!data || tickIndex > data.length - 1 || !data[tickIndex].timeStamp) return
            return data[tickIndex].timeStamp.toLocaleDateString("en-US")
          }
          }
          tickLabelProps={(val, i) => ({
            textAnchor: "start",
            dy: 0,
            angle: 75
          })}
          //tickLabelComponent={<text>hi</text>}
        />
        <YAxis numTicks={4} tickValues={[20, 40, 60, 80]} label="Score" />
        <CrossHair showHorizontalLine={false} fullHeight stroke="#e8e8e8" />
      </XYChart>
    )
  }
}

export default UIChart

