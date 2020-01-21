import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import { RadialChart, ArcSeries, ArcLabel } from '@data-ui/radial-chart'

class SubjectPieChart extends Component {
  state = {
    subjects: ['all', 'Writing', 'Reading Comprehension in Literature',
    'Reading Comprehension in Informational Text', 'Reading Foundations',
    'Math', 'Social Emotional Learning']
  }

  // Do fetch here
  componentDidMount() {

  }

  componentWillReceiveProps(props, newProps) {

  }

  render() {
    console.log(this.props)
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
              <span className="mr-1">{datum.value} / {this.props.total} 
              </span>
              <span>({(fraction * 100).toFixed(2)}%)</span>
            </div>
          )}
        >
        <ArcSeries
          data={[
            { value: this.props.Writing, 
              label: "Writing",
              abrLabel: "Wr", 
              fill: '#597ef7' 
            },
            { value: this.props.RL, 
              label: "Reading Comprehension in Literature",
              abrLabel: "RL", 
              fill: '#ffc53d' 
            },
            { value: this.props.RI, 
              label: "Reading Comprehension in Informational Text",
              abrLabel: "RI",  
              fill: '#f759ab' 
            },
            { value: this.props.RF, 
            label: "Reading Foundations", 
            abrLabel: "RF", 
            fill: '#9254de' 
            },
            { value: this.props.Math, 
              label: "Math", 
              abrLabel: "Math", 
              fill: '#ff7a45' 
            }, 
            { value: this.props.SEL, 
              label: "Social Emotional Learning", 
              abrLabel: "SEL", 
              fill: '#40a9ff' 
            },
          ]}
          pieValue={d => d.value}
          label={arc => `${(arc.data.value / (this.props.total)).toFixed(2) * 100}%`}
          labelComponent={<ArcLabel fill={'#fff'} />}
          innerRadius={radius => .5 * radius}
          outerRadius={radius =>  1 * radius}
          labelRadius={radius => .75 * radius}
          stroke="#fff"
          strokeWidth={1.5}
          fill={arc => arc.data.fill}
        />
        </RadialChart>
      <div className="text-center">
        {this.props.Writing > 0 ?
          <div className="inline-block mb-1 mr-1">
            <div className="br-50 inline-block mr-05" 
              style={{width: 8, height: 8, backgroundColor: '#597ef7'}}>
            </div>
            <div className="inline-block">Wr</div>
          </div>
        : ''}
        {this.props.RL > 0 ?
          <div className="inline-block mb-1 mr-1">
            <div className="br-50 inline-block mr-05" 
              style={{width: 8, height: 8, backgroundColor: '#ffc53d'}}>
            </div>
            <div className="inline-block">RL</div>
          </div>
        : ''}
         {this.props.RL > 0 ?
          <div className="inline-block mb-1 mr-1">
            <div className="br-50 inline-block mr-05" 
              style={{width: 8, height: 8, backgroundColor: '#f759ab'}}>
            </div>
            <div className="inline-block">RI</div>
          </div>
        : ''}
         {this.props.RL > 0 ?
          <div className="inline-block mb-1 mr-1">
            <div className="br-50 inline-block mr-05" 
              style={{width: 8, height: 8, backgroundColor: '#9254de'}}>
            </div>
            <div className="inline-block">RF</div>
          </div>
        : ''}
         {this.props.RL > 0 ?
          <div className="inline-block mr-1">
            <div className="br-50 inline-block mr-05" 
              style={{width: 8, height: 8, backgroundColor: '#ff7a45'}}>
            </div>
            <div className="inline-block">Ma</div>
          </div>
        : ''}
         {this.props.RL > 0 ?
          <div className="inline-block mb-1 mr-1">
            <div className="br-50 inline-block mr-05" 
              style={{width: 8, height: 8, backgroundColor: '#40a9ff'}}>
            </div>
            <div className="inline-block">SE</div>
          </div>
        : ''}
      </div>
      </div>
    )
  }
}

export default SubjectPieChart