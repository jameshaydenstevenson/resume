import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import { Histogram, BarSeries, 
  XAxis, YAxis } from '@data-ui/histogram'

class SchoolHistogram extends Component {
  state = {

  }

  // Do fetch here
  componentDidMount() {

  }

  componentWillReceiveProps(props, newProps) {

  }

  render() {
    return (
      <div>
       <Histogram
        ariaLabel="My histogram of ..."
        orientation="vertical"
        cumulative={false}
        normalized={true}
        binCount={25}
        valueAccessor={datum => datum}
        binType="numeric"
        renderTooltip={({ event, datum, data, color }) => (
          <div>
            <strong style={{ color }}>{datum.bin0} to {datum.bin1}</strong>
            <div><strong>count </strong>{datum.count}</div>
            <div><strong>cumulative </strong>{datum.cumulative}</div>
            <div><strong>density </strong>{datum.density}</div>
          </div>
        )}
      >
        <BarSeries
          animated
          rawData={[2]}
        />
        <XAxis />
        <YAxis />
      </Histogram>
      </div>
    )
  }
}

export default SchoolHistogram
