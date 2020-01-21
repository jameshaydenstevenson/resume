import React, { Component } from 'react'
import { Route} from 'react-router-dom'
import '../styles/GlobalStyle.css'
import { firebase, db } from '../firebase/Firebase'
import AdminHeader from '../login/AdminHeader'
import AdminHome from './AdminHome'
import AdminDistrictSummary from './AdminDistrictSummary'
import AdminSchools from './AdminSchools'
import AdminSchoolSummary from './AdminSchoolSummary'
import VideoContainer from '../video/VideoContainer'
import { flattenDoc, getURLSplitArray, getEmptySchoolOrDistrictSummary, 
  decompress, addArrays } from '../Util'
import ColType from '../Types'
import { Layout } from 'antd'

const AdminHomeComponent = (props, state) => {
  return <AdminHome adminBaseProps={state} {...props} />
}

const DistrictSummaryComponent = (props, state) => {
  return <AdminDistrictSummary adminBaseProps={state} {...props} />
}

const AdminSchoolsComponent = (props, state) => {
  return <AdminSchools adminBaseProps={state} {...props} />
}

const AdminSchoolSummaryComponent = (props, state) => {
  return <AdminSchoolSummary adminBaseProps={state} {...props} />
}

class AdminBase extends Component {
  state = {
    adminId: '',
    admin: null,
    district: null,
    schools: null,
    schoolsDict: null,
    schoolTypes: null,
    districtSummary: null,
    pathId: '',
    headerKey: '',
  }

  // not using state here so we can link to teacher profiles, react-router's
  // Link cannot have a firestore listener being passed.
  listenerState = {
    snapshotListeners: [],
  }

  // Do fetch here
  componentDidMount() {
    if(!(window.crypto && window.crypto.getRandomValues)) {
      alert("Your browser does not support a necessary feature. " +
      "Are you using Opera? Please change to any other browser and start again.")
    }
    
    var split = getURLSplitArray(window.location)
    var pathId = split[split.length - 2]
    var adminId = split[split.length - 1]
    
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        // No user is signed in.
        this.props.history.push(
         {
           pathname: '/sign-in/'
         }
        )
      }
    })

    db.collection(ColType.admin)
      .doc(adminId)
      .get()
      .then((doc) => {
        var admin = flattenDoc(doc)
        this.setState({
          pathId: pathId,
          adminId: adminId,
          admin: admin
        }, () => {
          db.collection(ColType.district)
            .doc(admin.districtId)
            .get()
            .then((doc) => {
              var district = flattenDoc(doc)

              console.log('district', district)
              
              this.setState({
                district: district,
              })
            })
          
          // create a listener for schools
          var schoolListener = db.collection(ColType.school)
            .where('districtId', '==', admin.districtId)
            .onSnapshot((querySnapshot) => {
              var schools = []
              var schoolsDict = {}
              var schoolTypes = {
                elementarySchool: [],
                k8School: [],
                middleSchool: [],
                highSchool: [],
              }

              querySnapshot.forEach((doc) => {
                var school = flattenDoc(doc)
                schools.push(school)
                schoolsDict[school.id] = school
                schoolTypes[school.schoolType].push(school)
              })

              console.log('schools', schools)

              this.setState({
                schools: schools,
                schoolsDict: schoolsDict,
                schoolTypes: schoolTypes,
              }, () => {
                db.collection(ColType.districtSummary)
                .where('districtId', '==', admin.districtId)
                .orderBy('shardIndex')
                .get()
                .then((querySnapshot) => {
                  var districtSummary = {
                    summary: getEmptySchoolOrDistrictSummary(),
                    schoolSummary: {
                      elementarySchool: {},
                      k8School: {},
                      middleSchool: {},
                      highSchool: {},
                    },
                    aggregation: {
                      elementarySchool: [],
                      k8School: [],
                      middleSchool: [],
                      highSchool: [],
                    }
                  }

                  this.state.schools.map((school, index) => {
                    return districtSummary.schoolSummary[school.schoolType][school.id] = {
                      schoolId: school.id,
                      schoolName: school.schoolName,
                      total: 0,
                      totalWithMeasurements: 0,
                      onTrack: 0,
                    }
                  })

                  querySnapshot.forEach((doc) => {
                    var districtShard = flattenDoc(doc)
                    districtShard.summary = decompress(districtShard.summary)
                    console.log(districtShard)
                    districtSummary.summary = addArrays(districtSummary.summary, 
                      districtShard.summary.summary)
                    Object.keys(districtSummary.schoolSummary)
                          .map((schoolType, index) => {
                      return Object.keys(districtShard.summary.schoolSummary[schoolType])
                      .map((schoolId, index) => {
                        var districtSchool = districtSummary.schoolSummary[schoolType][schoolId]
                        var shardSchool = districtShard.summary.schoolSummary[schoolType][schoolId]
                        districtSchool.total += shardSchool.total
                        districtSchool.totalWithMeasurements += shardSchool.totalWithMeasurements
                        districtSchool.onTrack += shardSchool.onTrack
                        return false
                      })
                    })           
                  })

                  // aggregate the data into schoolType arrays for charts
                  Object.keys(districtSummary.schoolSummary).map((schoolType, index) => {
                    return Object.keys(districtSummary.schoolSummary[schoolType])
                    .map((schoolId, index) => {
                      console.log('map', schoolType, schoolId)
                      return districtSummary.aggregation[schoolType]
                        .push(districtSummary.schoolSummary[schoolType][schoolId])
                    })
                  })

                  Object.keys(districtSummary.schoolSummary).map((schoolType, index) => {
                    return districtSummary.aggregation[schoolType].sort((a, b) => {
                      var aOnTrackRatio = a.totalWithMeasurements === 0 ? 
                                          0 : 
                                          a.onTrack / a.totalWithMeasurements
                      var bOnTrackRatio = b.totalWithMeasurements === 0 ? 
                                          0 : 
                                          b.onTrack / b.totalWithMeasurements
                      if (aOnTrackRatio > bOnTrackRatio) return -1
                      else if (aOnTrackRatio < bOnTrackRatio) return 1
                      else if (aOnTrackRatio === bOnTrackRatio) return 0
                      return 0
                    })
                  })

                  console.log('after aggregation', districtSummary)

                  this.setState({
                    districtSummary: districtSummary,
                  })
                })
              })
            })

            // not using state here so we can link to teacher profiles, react-router's
            // Link cannot have a firestore listener being passed.
            this.listenerState.snapshotListeners = [schoolListener]
        })
      })
  }

  componentWillUnmount() {
    // not using state here so we can link to teacher profiles, react-router's
    // Link cannot have a firestore listener being passed.
    // unsubscribe listeners
    this.listenerState.snapshotListeners.map((unsubscribe, index) => {
      unsubscribe()
      return false
    })
  }

  componentWillReceiveProps(props, newProps) {
    var split = getURLSplitArray(window.location)
    var pathId = split[split.length - 2]

    this.setState({
      pathId: pathId,
    })
  }

  render() {
    const { match: { url } } = this.props

    return (
      <Layout>
        <AdminHeader 
          person={this.state.admin} 
          schools={this.state.schools}
          selectedKey={this.state.pathId}
          history={this.props.history}
        >
        </AdminHeader>
       
        <VideoContainer />

        <Route 
          path={`${url}/admin-home/*`} 
          render={props => AdminHomeComponent(props, this.state)}  
        />
        <Route 
          path={`${url}/district-summary/*`} 
          render={props => DistrictSummaryComponent(props, this.state)}  
        />
        <Route 
          path={`${url}/schools/*`} 
          render={props => AdminSchoolsComponent(props, this.state)}  
        />
        <Route 
          path={`${url}/school-summary/*`} 
          render={props => AdminSchoolSummaryComponent(props, this.state)}  
        />
      </Layout>
    )
  }
}

export default AdminBase