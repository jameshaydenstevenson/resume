import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'
import { db } from '../../firebase/Firebase'
//import PersonHeader from '../../login/PersonHeader'
import PersonAvatar from '../../customcomponents/PersonAvatar'
import Note from '../progressmonitoring/Note'
import IEPParagraph from '../iep/IEPParagraph'
import UIChart from '../progressmonitoring/UIChart'
import ReactToPrint from "react-to-print"
import { flattenDoc, getIDFromURL, getQueryStringParam, capitalizeFirstChar } from '../../Util'
import ColType from '../../Types'
import { Layout, Icon, Button } from 'antd'
const { Content } = Layout
var moment = require('moment')

class StudentReport extends Component {
  state = {
    teacherId: '',
    studentId: '',
    teacher: this.props.teacherBaseProps.teacher,
    student: null,
    school: null,
    IEPGoals: [],
    IEPDict: {},
    componentMounted: false,
  }

  // Do fetch here
  componentDidMount() {
    var teacherId = getIDFromURL(window.location)
    var studentId = getQueryStringParam('student')
    console.log(teacherId, studentId)

    this.setState({
      teacherId: teacherId,
      studentId: studentId,
      teacher: this.props.teacherBaseProps.teacher,
      student: (this.props.teacherBaseProps.studentDict &&
                this.props.teacherBaseProps.studentDict.hasOwnProperty(studentId) ?
                this.props.teacherBaseProps.studentDict[studentId] : 
                null)
    })

    if (!this.props.teacherBaseProps.teacher || 
        !(this.props.teacherBaseProps.studentDict &&
      this.props.teacherBaseProps.studentDict.hasOwnProperty(studentId) ?
      this.props.teacherBaseProps.studentDict[studentId] : 
      null)) {
        this.props.history.push(
          {
            pathname: '/teacher/reports/' + teacherId,
          }
        )
      return
    }

    db.collection(ColType.iep)
      .where('teacherId', '==', teacherId)
      .where('studentId', '==', studentId)
      .where('schoolId', '==', this.props.teacherBaseProps.teacher.schoolId)
      .where('districtId', '==', this.props.teacherBaseProps.teacher.districtId)
      .orderBy('timeStamp', 'desc')
      .get()
      .then((querySnapshot) => {
        var IEPGoals = []
        var IEPDict = {}
        querySnapshot.forEach((doc) => {
          doc = flattenDoc(doc)
          IEPGoals.push(doc)
          IEPDict[doc.id] = doc
          IEPDict[doc.id].measurements = []
          IEPDict[doc.id].notes = []
        })

        this.setState({
          IEPGoals: IEPGoals,
          IEPDict: IEPDict,
          componentMounted: true,
        }, () => {
          IEPGoals.map((iep, index) => {
            db.collection(ColType.measurements)
              .where('teacherId', '==', teacherId)
              .where('schoolId', '==', this.props.teacherBaseProps.teacher.schoolId)
              .where('districtId', '==', this.props.teacherBaseProps.teacher.districtId)
              .where('iepId', '==', iep.id)
              .orderBy('timeStamp')
              .get()
              .then((querySnapshot) => {
                var measurements = []
                querySnapshot.forEach((doc) => {
                  measurements.push(flattenDoc(doc))
                })

                var IEPDict = this.state.IEPDict
                IEPDict[iep.id].measurements = measurements
                this.setState({
                  IEPDict: IEPDict,
                })
              })

            db.collection(ColType.notes)
              .where('teacherId', '==', teacherId)
              .where('schoolId', '==', this.props.teacherBaseProps.teacher.schoolId)
              .where('districtId', '==', this.props.teacherBaseProps.teacher.districtId)
              .where('iepId', '==', iep.id)
              .orderBy('timeStamp', 'desc')
              .limit(25)
              .get()
              .then((querySnapshot) => {
                var notes = []
                querySnapshot.forEach((doc) => {
                  notes.push(flattenDoc(doc))
                })

                var IEPDict = this.state.IEPDict
                IEPDict[iep.id].notes = notes
                this.setState({
                  IEPDict: IEPDict,
                })
              })

            return false
          })
        })
      })
  }

  render() {
    return (
      <Layout>
        {this.state.componentMounted && this.state.student ?
          <Layout className="layout-header-mt">
            {this.state.IEPGoals.length === 0 ?
              <h1 className="sub-menu-width m-lr-auto mt-3">
                This student has no IEP goals.
              </h1> :
              <div className="sub-menu-width m-lr-auto mt-3">
                <div className="pb-3 border-bottom">
                  <ReactToPrint
                    trigger={() => 
                      <Button
                        size={'large'}
                        type={'dashed'}
                        className="btn-vl inline-block mr-2 up-hover"
                      >
                      <Icon type="printer" />
                        Print
                      </Button>
                    }
                    content={() => this.componentRef}
                  />
                </div>
                {/** offset the margin of the printable component so that it lines up correctly */}
                <Content style={{ marginLeft: -32, marginRight: -32 }}>
                  {/** printable component, gave it layout-content and offsetted it above */}
                  <div className="ml-4 mr-4 mt-0" ref={el => (this.componentRef = el)}>
                    {this.state.IEPGoals.map((iep, index) => {
                      return <div className="mt-4" key={'iep-print-' + iep.id}>
                        <h1>IEP Goal - {index + 1}</h1>
                        <h1 className="mb-2 mt-0">
                          <PersonAvatar
                            size={'large'} person={this.state.student}
                          />
                        </h1>
                        <div className="font-16 font-500 mb-3">
                          <Icon type="book" className="mr-1" />
                          <span className="mr-2">
                            {capitalizeFirstChar(iep.iep.standardDescription)}
                          </span>
                          <span className="float-right">
                            Added on: {moment(iep.timeStamp).format('MM/DD/YYYY')}
                          </span>
                        </div>
                        <div className="mb-3 pt-3 border-top">
                          <div className="font-18 font-bold mb-2">
                            Present Level
                            </div>
                          <div className="font-16">
                            {iep ?
                              iep.iep.presentLevel.presentLevelParagraph :
                              ""
                            }
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="font-18 font-bold mb-2">
                            IEP Goal
                            </div>
                          <span className="font-16">
                            {iep ?
                              <IEPParagraph iepParagraph={iep.iep.iepParagraph} /> :
                              ""
                            }
                          </span>
                        </div>
                        <div className="mb-3">
                          <div className="font-18 font-bold mb-2">
                            Progress Monitoring
                          </div>
                          <div className="mb-3">
                         {this.state.IEPDict[iep.id].measurements.length === 0 ?
                            <h3 className="pb-1">No scores have been added yet.</h3>
                          :
                          <UIChart
                            allowMeasurementAdding={false}
                            iep={iep}
                            measurements={this.state.IEPDict[iep.id].measurements}
                          />
                          }
                          </div>
                          
                          <div className="pt-4 pb-4 border-top page-break-after-always">
                            <h2><Icon type="mail" className="mr-1" />What I need to do next?</h2>
                            <div>
                              {this.state.IEPDict[iep.id].notes.length === 0 ?
                                <div className="mt-2 font-16">
                                  No notes to display.
                            </div>
                                : ''}
                              {this.state.IEPDict[iep.id].notes.map((note, index) => {
                                return <div className="mt-2" key={note.id}>
                                  <Note note={note} iep={iep} allowDelete={false} />
                                </div>
                              })
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    })
                    }
                  </div>
                </Content>
              </div>
            }
          </Layout>
          : ''}
      </Layout>
    )
  }
}

export default StudentReport
