import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import { RadialChart, ArcSeries, ArcLabel } from '@data-ui/radial-chart'

class SupportPieChart extends Component {
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
        <RadialChart
          ariaLabel="This is a radial-chart chart of..."
          margin={{ top: 0, left: 21, bottom: 0, right: 21 }}
          width={190}
          height={190}
          renderTooltip={({ event, datum, data, fraction }) => (
            <div>
              <div className="mb-1"><strong>{datum.label}</strong></div>
              <span className="mr-1">{datum.value} / {this.props.lowSupport +
                 this.props.mediumSupport + this.props.highSupport} 
              </span>
              <span>({(fraction * 100).toFixed(2)}%)</span>
            </div>
          )}
        >
        <ArcSeries
          data={[
            { value: this.props.lowSupport, 
              label: "Goals with low level of support", 
              fill: '#52c41a' 
            },
            { value: this.props.mediumSupport, 
              label: "Goals with medium level of support", 
              fill: '#faad14' 
            },
            { value: this.props.highSupport, 
              label: "Goals with high level of support", 
              fill: '#f5222d' 
            }
          ]}
          pieValue={d => d.value}
          label={arc => `${(arc.data.value / (this.props.lowSupport +
            this.props.mediumSupport + this.props.highSupport)).toFixed(1) * 100}%`}
          labelComponent={<ArcLabel fill={'#fff'} />}
          innerRadius={radius => .5 * radius}
          outerRadius={radius =>  1 * radius}
          labelRadius={radius => .72 * radius}
          stroke="#fff"
          strokeWidth={1.5}
          fill={arc => arc.data.fill}
        />
        </RadialChart>
        <div className="text-center">
        {this.props.lowSupport > 0 ?
          <div className="inline-block mb-1 mr-1">
            <div className="br-50 inline-block mr-05" 
              style={{width: 8, height: 8, backgroundColor: '#52c41a'}}>
            </div>
            <div className="inline-block">Low</div>
          </div>
        : ''}
         {this.props.mediumSupport > 0 ?
          <div className="inline-block mb-1 mr-1">
            <div className="br-50 inline-block mr-05" 
              style={{width: 8, height: 8, backgroundColor: '#faad14'}}>
            </div>
            <div className="inline-block">Medium</div>
          </div>
        : ''}
         {this.props.highSupport > 0 ?
          <div className="inline-block mb-1 mr-1">
            <div className="br-50 inline-block mr-05" 
              style={{width: 8, height: 8, backgroundColor: '#f5222d'}}>
            </div>
            <div className="inline-block">High</div>
          </div>
        : ''}
        </div>
      </div>
    )
  }
}

export default SupportPieChart