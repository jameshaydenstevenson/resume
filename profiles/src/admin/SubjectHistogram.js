import React, { Component } from 'react'
import '../styles/GlobalStyle.css'

class SubjectHistogram extends Component {
  state = {
    subjectColors: {
      'Wr': '#597ef7',
      'RL': '#ffc53d',
      'RI': '#f759ab',
      'RF': '#9254de',
      'Math': '#ff7a45',
      'SEL': '#40a9ff',
    }
  }

  // Do fetch here
  componentDidMount() {

  }

  componentWillReceiveProps(props, newProps) {

  }

  render() {
    return (
      <div className="mt-4 font-16">
        {['Wr', 'RL', 'RI', 'RF', 'Math', 'SEL'].map((subject, index) => {
          console.log(subject, this.props[subject], this.props.total)
          return  <div className={"w-100 flex flex-v-center " + 
          (index !== 5 ? "" : "")}
          key={index}>
          <div className="w-25-p inline-block border-right">
              <div className="pr-1">
                {subject}
              </div>
          </div>
          <div className="w-75-p-minus-35 inline-block flex flex-v-center">
            <div className="br-tr-2 br-br-2 inline-block relative"
                style={{height: 18,
                background: '#597ef7', 
                width: this.props.total === 0 ? '0%' : 
                (this.props[subject] / this.props.total * 100) + '%'}}>

                <span className="font-13 absolute w-33 r-minus-35 t-minus-2">
                 <span className="float-left">
                  {this.props.total === 0 ? '0%' : 
                   Math.round(this.props[subject] / this.props.total * 100) + '%'}
                </span>
               </span>
            </div>
          </div>
        </div>
        })}

         <div className="w-100">
          <div className="w-25-p inline-block">
          </div>
          <div className="w-75-p-minus-35 inline-block border-top" style={{verticalAlign: 13}}>
          <div className="w-25-p inline-block">
            <span className="float-left">0</span>
          </div>
          <div className="w-25-p inline-block">
            <span className="float-right">50</span>
          </div>
          <div className="w-25-p inline-block">
          </div>
          <div className="w-25-p inline-block">
            <span className="float-right">100</span>
          </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SubjectHistogram
