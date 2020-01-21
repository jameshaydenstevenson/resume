import React, { Component } from 'react'
import '../styles/GlobalStyle.css'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'

class SchoolBarChart extends Component {
  state = {

  }

  // Do fetch here
  componentDidMount() {

  }

  componentWillReceiveProps(props, newProps) {

  }

  render() {
    return (
      <div className="mt-4 font-16">
        {this.props.schools && this.props.schools.map((school, index) => {
          return  <div className={"w-100 flex flex-v-center " + 
          (index !== 5 ? "" : "")}
          key={index}>
          <div className="w-33-p inline-block border-right">
              <div className="pr-1 font-14 ellipsis" title={school.schoolName}>
                {school.schoolName}
              </div>
          </div>
          <div className="w-66-p-minus-35 inline-block flex flex-v-center">
            <Tooltip title={"View " + school.schoolName + "'s summary."}
              placement="right"
              mouseEnterDelay={.75}>
            <Link to={'/admin/school-summary/' + this.props.adminId +
              '?district=' + this.props.districtId + '&school=' + school.schoolId} 
              className="w-100 lh-0">
            <div className="background-cyan cyan-hover br-tr-2 br-br-2 inline-block relative"
                style={{height: 18, 
                width: school.totalWithMeasurements === 0 ? '0%' : 
                (school.onTrack / school.totalWithMeasurements * 100) + '%'}}>

                <span className="font-13 absolute w-33 r-minus-35 t-8 color-b">
                 <span className="float-left">
                  {school.totalWithMeasurements === 0 ? '0%' : 
                   Math.round(school.onTrack / school.totalWithMeasurements * 100) + '%'}
                </span>
               </span>
            </div>
            </Link>
            </Tooltip>
          </div>
        </div>
        })}

         <div className="w-100">
          <div className="w-33-p inline-block">
          </div>
          <div className="w-66-p-minus-35 inline-block border-top" style={{verticalAlign: 13}}>
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

export default SchoolBarChart
