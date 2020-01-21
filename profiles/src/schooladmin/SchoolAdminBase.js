import React, { Component } from 'react'
import { Route} from 'react-router-dom'
import '../styles/GlobalStyle.css'
import { firebase, db } from '../firebase/Firebase'
import SchoolAdminHeader from '../login/SchoolAdminHeader'
import SchoolAdminHome from './SchoolAdminHome'
import SchoolAdminSchoolSummary from './SchoolAdminSchoolSummary'
import SchoolAdminAddPerson from './SchoolAdminAddPerson'
import VideoContainer from '../video/VideoContainer'
import { flattenDoc, getURLSplitArray, getEmptySchoolOrDistrictSummary, 
  decompress, addArrays } from '../Util'
import ColType from '../Types'
import { Layout } from 'antd'

const SchoolAdminHomeComponent = (props, state) => {
  return <SchoolAdminHome schoolAdminBaseProps={state} {...props} />
}

const SchoolAdminSchoolSummaryComponent = (props, state) => {
  return <SchoolAdminSchoolSummary schoolAdminBaseProps={state} {...props} />
}

const SchoolAdminAddPersonComponent = (props, state) => {
  return <SchoolAdminAddPerson schoolAdminBaseProps={state} {...props} />
}

class SchoolAdminBase extends Component {
  state = {
    schoolAdminId: '',
    schoolAdmin: null,
    school: null,
    schoolAdministrators: null,
    schoolTeachers: null,
    schoolSummary: null,
    schoolTypes: null,
    loadingData: true,
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
    var schoolAdminId = split[split.length - 1]

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

    db.collection(ColType.schoolAdmin)
    .doc(schoolAdminId)
    .get()
    .then((doc) => {
      var schoolAdmin = flattenDoc(doc)
      this.setState({
        pathId: pathId,
        schoolAdminId: schoolAdminId,
        schoolAdmin: schoolAdmin,
      }, () => {
        db.collection(ColType.schoolSummary)
          .where('districtId', '==', this.state.schoolAdmin.districtId)
          .where('schoolId', '==', this.state.schoolAdmin.schoolId)
          .orderBy('shardIndex')
          .get()
          .then((querySnapshot) => {
            var schoolSummary = getEmptySchoolOrDistrictSummary()

            querySnapshot.forEach((doc) => {
              var schoolShard = flattenDoc(doc)
              schoolShard.summary = decompress(schoolShard.summary)
              schoolSummary = addArrays(schoolSummary, schoolShard.summary.summary)
            })

            console.log("School summary", schoolSummary)

            this.setState({
              schoolSummary: schoolSummary,
              loadingData: false,
            })
          })

        db.collection(ColType.school)
          .doc(this.state.schoolAdmin.schoolId)
          .get()
          .then((doc) => {
            var school = flattenDoc(doc)
            this.setState({
              school: school,
            })
          })

        db.collection(ColType.schoolAdmin)
          .where('districtId', '==', this.state.schoolAdmin.districtId)
          .where('schoolId', '==', this.state.schoolAdmin.schoolId)
          .get()
          .then((querySnapshot) => {
            var schoolAdministrators = []

            querySnapshot.forEach((doc) => {
              var schoolAdministrator = flattenDoc(doc)
              schoolAdministrators.push(schoolAdministrator)
            })

            this.setState({
              schoolAdministrators: schoolAdministrators
            })
          })

        db.collection(ColType.teacher)
          .where('districtId', '==', this.state.schoolAdmin.districtId)
          .where('schoolId', '==', this.state.schoolAdmin.schoolId)
          .get()
          .then((querySnapshot) => {
            var schoolTeachers = []

            querySnapshot.forEach((doc) => {
              var teacher = flattenDoc(doc)
              schoolTeachers.push(teacher)
            })

            this.setState({
              schoolTeachers: schoolTeachers
            })
          })
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
        <SchoolAdminHeader 
          person={this.state.schoolAdmin} 
          selectedKey={this.state.pathId}
          history={this.props.history}
        >
        </SchoolAdminHeader>
       
        <VideoContainer />

        <Route 
          path={`${url}/school-admin-home/*`} 
          render={props => SchoolAdminHomeComponent(props, this.state)}  
        />
        <Route 
          path={`${url}/school-summary/*`} 
          render={props => SchoolAdminSchoolSummaryComponent(props, this.state)}  
        />
         <Route 
          path={`${url}/add-person/*`} 
          render={props => SchoolAdminAddPersonComponent(props, this.state)}  
        />
      </Layout>
    )
  }
}

export default SchoolAdminBase