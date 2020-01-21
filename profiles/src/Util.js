import React from 'react'
import { Link } from 'react-router-dom'
import { Steps, Tooltip } from 'antd'
const Step = Steps.Step
var moment = require('moment')
const LZString = require('lz-string')

export function linkAfterLogin(userInfo, userJobInfo) {
  if (userInfo.accessLevel === "admins") {
    window.location.href = "/admin/admin-home/" + userJobInfo.id
  }
  if (userInfo.accessLevel === "schoolAdmins") {
    window.location.href = "/school-admin/school-admin-home/" + userJobInfo.id
  }
  if (userInfo.accessLevel === "teachers") {
    window.location.href = "/teacher/home/" + userJobInfo.id
  }
}

export function formatAMPM(date) {
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes
  var strTime = hours + ':' + minutes + ' ' + ampm
  return strTime
}

export function getAvatarColor(grade) {
  if (!grade) return '#000'
  if (grade === 'K') return '#722ed1'
  else if (grade === '1') return '#2f54eb'
  else if (grade === '2') return '#f5222d'
  else if (grade === '3') return '#fa541c'
  else if (grade === '4') return '#52c41a'
  else if (grade === '5') return '#eb2f96'
  else if (grade === '6') return '#fa8c16'
  else if (grade === '7') return '#1890ff'
  else if (grade === '8') return '#a0d911'
  else if (grade === '9') return '#faad14'
  else if (grade === '10') return '#5accf1'
  else if (grade === '11') return '#102efe'
  else if (grade === '12') return '#13c2c2'
}

export function getInitials(person) {
  return person.firstName.charAt(0).toUpperCase() + person.lastName.charAt(0).toUpperCase()
}

export function getQueryStringParam(name) {
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
  let regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
  let results = regex.exec(window.location.search)
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

export function getIDFromURL(location) {
  var url = [location.protocol, '//', location.host, location.pathname].join('')
  var split = url.split('/')
  var id = split[split.length - 1] // id is after the last '/'
  console.log(split, split.length, id)
  return id
}

export function getURLSplitArray(location) {
  var url = [location.protocol, '//', location.host, location.pathname].join('')
  var split = url.split('/')
  return split
}

// category is PSI, WMI, VCI, FRI, VSPI
export function isAppropriateLevel(studentLevelNumber, iep, category) {
  var num = studentLevelNumber
  var level = iep.level
  if (num <= 70) {
    if (level === category + ' 70 and below') return true
  } else if (num > 70 && num < 80) {
    if (level === category + ' 70-79') return true
  } else {
    if (level === category + ' 80 and above') return true
  }

  return false
}

export function findStrategyWithLevel(strategies, level) {
  return undefined
}

export function gradeText(grade) {
  var gradeLevel = grade
  if (typeof grade === 'string' && grade !== 'K' && grade !== 'preK') {
    gradeLevel = parseInt(grade, 10)
  } 

  if (gradeLevel === 'preK') {
    return 'preK'
  } else if (gradeLevel === 'K') {
    return 'indergarten'
  } else if (gradeLevel === 1) {
    return 'st Grade'
  } else if (gradeLevel === 2) {
    return 'nd Grade'
  } else if (gradeLevel === 3) {
    return 'rd Grade'
  } else {
    return 'th Grade'
  }
}

export function flattenDoc(doc) {
  var map = doc.data()
  map.id = doc.id
  return map
}

export function createIEPGoalText(iep, student) {    
  var iepParagraph = 'By ' + 
  (iep.completionDate === '<date>,' ? '<date>' : iep.completionDate) + ', given '

  iep.given.map((givenText, index) => {
    iepParagraph += givenText + ' '
    return false
  })

  iepParagraph += student.firstName + ' will '

  iep.studentWill.map((willText, index) => {
    iepParagraph += willText + ' '
    return false
  })

  iepParagraph += 'from ' + iep.baselineAccuracyLevel + '% '
  iepParagraph += 'to ' + iep.targetAccuracyLevel + '% accuracy '
  iepParagraph += iep.metric
  iepParagraph += ' measured bimonthly'
  iepParagraph += ' by ' + iep.by

  return iepParagraph
}

export function createELAPresentLevelText(iep, presentLevelObj, student) {
  var presentLevel = ''

  if (iep.subject === 'social emotional learning') {
    presentLevel += 'According to teacher observations over the past 6 weeks'
    presentLevel += ', ' + student.firstName
    presentLevel += ' needs instruction in ' + iep.subject + '. '
    presentLevel += student.firstName + ' needs to improve'
    presentLevel += ' skills related to ' + iep.standardDescription
  }
  else if (iep.subject === 'writing') {
    presentLevel += 'According to student writing  samples over the past 6 weeks, ' 
    presentLevel += student.firstName + ' needs to improve skills related to '
    presentLevel += iep.standardDescription
  }
  else {
    if (student.grade >= 4 && student.grade <= 8) {
      presentLevel += 'Based on the state assessment in '
      presentLevel += 'ELA, '
      presentLevel += student.firstName + ' scored level '
      presentLevel += presentLevelObj.elaStateScore
      presentLevel += ' indicating that ' + student.firstName
      presentLevel += ' has ' + presentLevelObj.elaStateMet.toLowerCase()
      presentLevel += ' standards expectations in reading. '
    }
    presentLevel += 'On a norm referenced assessment ('
    presentLevel += presentLevelObj.elaNormAssessment + '),'
    presentLevel += ' administered on ' + presentLevelObj.elaNormDate
    presentLevel += ', ' + student.firstName
    presentLevel += ' scored in the ' + presentLevelObj.elaNormLevel.toLowerCase()
    presentLevel += ' range compared to grade level peers.'
    presentLevel += ' Overall, ' + student.firstName + ' is'
    presentLevel += ' performing at a ' + gradeToGradeLevel(presentLevelObj.elaGradeLevel)
    presentLevel += ' grade level in reading. This assessment shows that '
    presentLevel += student.firstName + ' is performing lowest in the area of '
    presentLevel +=  iep.subject + '. ' + student.firstName + ' needs to'
    presentLevel += ' improve skills related to ' + iep.standardDescription
  }

  presentLevel += " " + student.firstName + "'s disability " + iep.impactDegree + ' ' + iep.subject
  presentLevel += '. ' +  student.firstName + ' has difficulty with ' + iep.impactStatement

  return presentLevel
}

export function createMathPresentLevelText(iep, presentLevelObj, student) {
  var presentLevel = ''

  if (student.grade >= 4 && student.grade <= 8) {
    presentLevel += 'Based on the state assessment in '
    presentLevel += 'Math, '
    presentLevel += student.firstName + ' scored level '
    presentLevel += presentLevelObj.mathStateScore
    presentLevel += ' indicating that ' + student.firstName
    presentLevel += ' has ' + presentLevelObj.mathStateMet.toLowerCase()
    presentLevel += ' standards expectations in math. '
  }
  presentLevel += 'On a norm referenced assessment ('
  presentLevel += presentLevelObj.mathNormAssessment + '),'
  presentLevel += ' administered on ' + presentLevelObj.mathNormDate
  presentLevel += ', ' + student.firstName
  presentLevel += ' scored in the ' + presentLevelObj.mathNormLevel.toLowerCase()
  presentLevel += ' range compared to grade level peers.'
  presentLevel += ' Overall, ' + student.firstName + ' is'
  presentLevel += ' performing at a ' + gradeToGradeLevel(presentLevelObj.mathGradeLevel)
  presentLevel += ' grade level in math. This assessment shows that '
  presentLevel += student.firstName + ' is performing lowest in the area of '
  presentLevel +=  iep.subject + '. ' + student.firstName + ' needs to'
  presentLevel += ' improve skills related to ' + iep.standardDescription

  presentLevel += " " + student.firstName + "'s disability " + iep.impactDegree + ' ' + iep.subject
  presentLevel += '. ' +  student.firstName + ' has difficulty with ' + iep.impactStatement

  return presentLevel
} 

export function getSpecialEducationRemovalStatement(student, category, level) {
  var removalStatement = student.firstName + ' requires'

  if (category === 'PSI') {
    if (level === '70 and below') {
      removalStatement += ' direct, explicit instruction'
      removalStatement += ' and mastery oriented feedback'
      removalStatement += ' using modified materials and concrete examples'
      removalStatement += ' in a small group'
      removalStatement += ' to build the knowledge and skills needed to access the'
      removalStatement += ' general curriculum.'
    }
    else if (level === '70-79') {
      removalStatement += ' teacher modeled examples,'
      removalStatement += ' and frequent checks for understanding'
      removalStatement += ' using instructional level materials and picture supports'
      removalStatement += ' in a small group'
      removalStatement += ' to build the knowledge and skills needed to access the '
      removalStatement += ' general curriculum.'
    }
    else if (level === '80 and above') {
      removalStatement += ' concise directions'
      removalStatement += ' and descriptive feedback'
      removalStatement += ' in a small group'
      removalStatement += ' to build the knowledge and skills needed to access the '
      removalStatement += ' general curriculum.'
    }
  }
  else if (category === 'WMI') {
    if (level === '70 and below') {
      removalStatement += ' systematic, multisensory instruction'
      removalStatement += ' and mastery oriented feedback,'
      removalStatement += ' using modified materials and concrete examples'
      removalStatement += ' in a small group'
      removalStatement += ' to build the knowledge and skills needed to access the '
      removalStatement += ' general curriculum.'
    }
    else if (level === '70-79') {
      removalStatement += ' a review of prior concepts'
      removalStatement += ' and frequent checks for understanding'
      removalStatement += ' using instructional level materials and picture supports'
      removalStatement += ' in a small group'
      removalStatement += ' to build the knowledge and skills needed to access the '
      removalStatement += ' general curriculum.'
    }
    else if (level === '80 and above') {
      removalStatement += ' clearly stated lesson objectives'
      removalStatement += ' and descriptive feedback,'
      removalStatement += ' in a small group'
      removalStatement += ' to build the knowledge and skills needed to access the '
      removalStatement += ' general curriculum.'
    }
  }
  else if (category === 'VCI') {
    if (level === '70 and below') {
      removalStatement += ' multisensory vocabulary instruction'
      removalStatement += ' and mastery oriented feedback,'
      removalStatement += ' using modified materials and concrete examples'
      removalStatement += ' in a small group'
      removalStatement += ' to build the knowledge and skills needed to access the '
      removalStatement += ' general curriculum.'
    }
    else if (level === '70-79') {
      removalStatement += ' key word vocabulary instruction'
      removalStatement += ' and frequent checks for understanding'
      removalStatement += ' using instructional level materials and picture supports'
      removalStatement += ' in a small group'
      removalStatement += ' to build the knowledge and skills needed to access the '
      removalStatement += ' general curriculum.'
    }
    else if (level === '80 and above') {
      removalStatement += ' objectives in student friendly language'
      removalStatement += ' and descriptive feedback,'
      removalStatement += ' in a small group'
      removalStatement += ' to build the knowledge and skills needed to access the '
      removalStatement += ' general curriculum.'
    }
  }
  else if (category === 'FRI') {
    if (level === '70 and below') {
      removalStatement += ' systematic, explicit instruction'
      removalStatement += ' and mastery oriented feedback,'
      removalStatement += ' using modified materials and concrete examples'
      removalStatement += ' in a small group'
      removalStatement += ' to build the knowledge and skills needed to access the '
      removalStatement += ' general curriculum.'
    }
    else if (level === '70-79') {
      removalStatement += ' a teacher modeled think aloud'
      removalStatement += ' and checks for understanding,'
      removalStatement += ' using instructional level materials and picture supports'
      removalStatement += ' in a small group'
      removalStatement += ' to build the knowledge and skills needed to access the '
      removalStatement += ' general curriculum.'
    }
    else if (level === '80 and above') {
      removalStatement += ' instruction using real world examples'
      removalStatement += ' and descriptive feedback,'
      removalStatement += ' in a small group'
      removalStatement += ' to build the knowledge and skills needed to access the '
      removalStatement += ' general curriculum.'
    }
  }
  else if (category === 'VSI') {
    if (level === '70 and below') {
      removalStatement += ' systematic, explicit instruction'
      removalStatement += ' and mastery oriented feedback,'
      removalStatement += ' using modified materials and concrete examples'
      removalStatement += ' in a small group'
      removalStatement += ' to build the knowledge and skills needed to access the '
      removalStatement += ' general curriculum.'
    }
    else if (level === '70-79') {
      removalStatement += ' a teacher modeled think aloud'
      removalStatement += ' and checks for understanding,'
      removalStatement += ' using instructional level materials and picture supports'
      removalStatement += ' in a small group'
      removalStatement += ' to build the knowledge and skills needed to access the '
      removalStatement += ' general curriculum.'
    }
    else if (level === '80 and above') {
      removalStatement += ' instruction using real world examples'
      removalStatement += ' and descriptive feedback,'
      removalStatement += ' in a small group'
      removalStatement += ' to build the knowledge and skills needed to access the '
      removalStatement += ' general curriculum.'
    }
  }

  return removalStatement
}

export function genderToPronoun(gender) {
  if (gender === 'Male') return 'he'
  else return 'she'
}

export function gradeToGradeLevel(grade) {
  if (grade === 'preK') return 'preK'
  if (grade === 'K') return 'kindergarten'
  if (grade === '1') return '1st'
  if (grade === '2') return '2nd'
  if (grade === '3') return '3rd'
  else return grade + 'th'
}

export function setCharAt(s, n, t) {
  return s.substring(0, n) + t + s.substring(n + 1)
}

export function getTotalPoints(iep) {
  var total = 0
  iep.progressMonitoring.map((item, index) => {
    return total += item.num
  })

  return total
}

export function getTotalPointsBaselineOrTarget(pmObj) {
  var total = 0
  pmObj.map((item, index) => {
    return total += item.num
  })

  return total
}

// antd needs steps to just be html, couldn't create
// a react component for this one.
export function stepLink(title, icon, status, href, state) {
  return <Step 
      status={status ? status : ''}
      title={
        <Link to={
            {
              pathname: href ? href : '', 
              state: state ? state : {},
            }
          }
          className=""
        >
         <Tooltip title="Go to this step." placement="top">
          <div className={"ant-steps-item ant-steps-item-finish " +
          "ant-steps-item-custom"}>
            <div className="ant-steps-item-icon">
              <span className="ant-steps-icon">
                {icon ? icon : ''}
              </span>
            </div>
            <div className="ant-steps-item-content">
              <div className="ant-steps-item-title">
                {title ? title : ''}
              </div>
            </div>
          </div>
          </Tooltip>
        </Link>
      }
      icon={<span></span>} 
    >
    </Step>
}

export function capitalizeFirstChar(stringToCapitalize) {
  return stringToCapitalize.charAt(0).toUpperCase() +
  stringToCapitalize.slice(1).toLowerCase()
}

export function calendarBlockKey(momentObj) {
  return momentObj.format('DD-HH-mm')
}

export function getCalendarBlock() {
  var calendarBlock = {}
  var timeStep = 30      // minutes
  var timeRatio = 60 / 30 // hours / minutes
  var hours = 10          // time duration from start to end (7 AM - 5 PM)
  var mondayStart = moment(new Date(2015, 5, 1, 7, 0, 0))
  var tuesdayStart = moment(new Date(2015, 5, 2, 7, 0, 0))
  var wednesdayStart = moment(new Date(2015, 5, 3, 7, 0, 0))
  var thursdayStart = moment(new Date(2015, 5, 4, 7, 0, 0))
  var fridayStart = moment(new Date(2015, 5, 5, 7, 0, 0))

  for (var i = 0; i <= timeRatio * hours; i++) {
    var newMondayTime = moment(mondayStart)
    var newTuesdayTime = moment(tuesdayStart)
    var newWednesdayTime = moment(wednesdayStart)
    var newThursdayTime = moment(thursdayStart)
    var newFridayTime = moment(fridayStart)

    var newMondayString = calendarBlockKey(newMondayTime)
    var newTuesdayString = calendarBlockKey(moment(newTuesdayTime))
    var newWednesdayString = calendarBlockKey(moment(newWednesdayTime))
    var newThursdayString = calendarBlockKey(moment(newThursdayTime))
    var newFridayString= calendarBlockKey(moment(newFridayTime))

    // calendarBlock for each timeSlot is the number of people currently
    // scheduled in that block, intialized to 0.
    calendarBlock[newMondayString] = {'General Education': 0, 'Special Education': 0}
    calendarBlock[newTuesdayString] = {'General Education': 0, 'Special Education': 0}
    calendarBlock[newWednesdayString] = {'General Education': 0, 'Special Education': 0}
    calendarBlock[newThursdayString] = {'General Education': 0, 'Special Education': 0}
    calendarBlock[newFridayString] = {'General Education': 0, 'Special Education': 0}

    mondayStart = mondayStart.add(timeStep, "minutes")
    tuesdayStart = tuesdayStart.add(timeStep, "minutes")
    wednesdayStart = wednesdayStart.add(timeStep, "minutes")
    thursdayStart = thursdayStart.add(timeStep, "minutes")
    fridayStart = fridayStart.add(timeStep, "minutes")
  }

  return calendarBlock
}

export function getEmptySchoolOrDistrictSummary() {
  var data = []

  for (var i = 0; i < 4116; ++i) {
      data.push(0)
  }

  return data
  /**var racesOrEthnicities = ["all", "Native American or Alaska Native", 
  "Asian", "Black or African American",
  "Native Hawaiian or Other Pacific Islander",
  "White", "Hispanic or Latino"]
  racesOrEthnicities =  ["a", "NA", 
  "As", "B",
  "NH",
  "W", "H"]
  var grades = [
    'a',
    'K',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
  ]
  var subjects = [
    'all',
    'Writing',
    'Reading Comprehension in Literature',
    'Reading Comprehension in Informational Text',
    'Reading Foundations',
    'Math',
    'Social Emotional Learning',
  ]
  subjects = [
    'a',
    'W',
    'RL',
    'RI',
    'RF',
    'M',
    'S',
  ]
  var supportLevels = [
    'h',
    'm',
    'l',
  ]
  /**var iepInfos = [
    'total',
  ]
  var iepWithMeasurementInfos = [
    'total',
    'onTrack',
  ]

  var schoolObj = {}
  grades.forEach((grade, index) => {
    subjects.forEach((subject, index) => {
      schoolObj[grade + '-' + subject] = []
      racesOrEthnicities.forEach((race, index) => {
        schoolObj[grade + '-' + subject].push(0)
        schoolObj[grade + '-' + subject].push(0)
        schoolObj[grade + '-' + subject].push(0)
        //schoolObj[grade + '-' + subject + '-' + race + '-t'] = 0
        //schoolObj[grade + '-' + subject + '-' + race + '-wt'] = 0
        //schoolObj[grade + '-' + subject + '-' + race + '-wot'] = 0
        supportLevels.forEach((supportLevel, index) => {
          schoolObj[grade + '-' + subject].push(0)
          //schoolObj[grade][subject][race] = {}
          //schoolObj[grade][subject][race]['withMeasurements'] = {}
         // schoolObj[grade + '-' + subject + '-' + race + '-' + supportLevel + '-t'] = 0
        })
      
        iepInfos.forEach((iepInfo, index) => {
          schoolObj[grade][subject][race][iepInfo] = 0
        })
        iepWithMeasurementInfos.forEach((iepWithMeasurementInfo, index) => {
          schoolObj[grade][subject][race]['withMeasurements'][iepWithMeasurementInfo] = 0
        })
      })
    })
  })

  return schoolObj*/
}

export function levelToSupport(level) {
  if (level === '70 and below') return 'h'
  else if (level === '70-79') return 'm'
  else if (level === '80 and above') return 'l'
  console.log("Level was not found!", level)
  return 'h'
}

export function incrementSummary(iep, schoolOrDistrict, grade, 
  subject, raceOrEthnicity, school, isDistrict) {
  // I don't think this matters as its just a reference to schoolOrDistrict but am doing it for
  // clarity reasons.
  var updatedSchoolOrDistrict = schoolOrDistrict
  
  // add school obj with key school.id if the school id isn't already in the schoolSummary
  if (isDistrict && 
      updatedSchoolOrDistrict.summary.schoolSummary.hasOwnProperty(school.schoolType)) {
    if (!updatedSchoolOrDistrict.summary
                                .schoolSummary[school.schoolType].hasOwnProperty(school.id)) {
      updatedSchoolOrDistrict.summary.schoolSummary[school.schoolType][school.id] = {
        schoolId: school.id,
        schoolName: school.schoolName,
        total: 0,
        totalWithMeasurements: 0,
        onTrack: 0,
      }
    }

    updatedSchoolOrDistrict.summary.schoolSummary[school.schoolType][school.id].total += 1
  }

  // update all fields
  var gradeKeys = [grade, 'all']
  var subjectKeys = [subject, 'all']
  var raceOrEthnicityKeys = [raceOrEthnicity, 'all']
  gradeKeys.forEach((gradeKey, index) => {
    subjectKeys.forEach((subjectKey, index) => {
      raceOrEthnicityKeys.forEach((raceOrEthnicityKey, index) => {
        // increment total
        var idx = summaryIndex(gradeKey, subjectKey, raceOrEthnicityKey, 'total')
        if (idx === null) console.log("idx is null", idx)
        if (idx !== null) updatedSchoolOrDistrict.summary.summary[idx] += 1
        // increment support level
        idx = summaryIndex(gradeKey, subjectKey, raceOrEthnicityKey, levelToSupport(iep.level))
        if (idx === null) console.log("idx is null", idx)
        if (idx !== null) updatedSchoolOrDistrict.summary.summary[idx] += 1
      })
    })
  })

  return updatedSchoolOrDistrict
}

export function updateSummary(docBefore, docAfter, 
  schoolOrDistrict, grade, subject, raceOrEthnicity, school, isDistrict) {
  // I don't think this matters as its just a reference to schoolOrDistrict but am doing it for
  // clarity reasons.
  var updatedSchoolOrDistrict = schoolOrDistrict
  if (isDistrict) console.log(schoolOrDistrict, school.schoolType, school.id, school.schoolName)

  // update school in district schoolSummary
  if (isDistrict && 
    updatedSchoolOrDistrict.summary.schoolSummary.hasOwnProperty(school.schoolType)) {
    // Need to check if this district shard has the school.id in its schoolSummary.
    // Because a random shard calls incrementSummary(...), 18 shards are left that
    // don't have this data initialized. So check, and initialize if this shard
    // does not have the school.id in its schoolSummary
    if (!updatedSchoolOrDistrict.summary
      .schoolSummary[school.schoolType].hasOwnProperty(school.id)) {
        updatedSchoolOrDistrict.summary.schoolSummary[school.schoolType][school.id] = {
          schoolId: school.id,
          schoolName: school.schoolName,
          total: 0,
          totalWithMeasurements: 0,
          onTrack: 0,
        }
      }

    if (docBefore.totalMeasurements === 0 && docAfter.totalMeasurements > 0) {
      updatedSchoolOrDistrict.summary
      .schoolSummary[school.schoolType][school.id].totalWithMeasurements += 1
    }
    else if (docBefore.totalMeasurements > 0 && docAfter.totalMeasurements === 0) {
      updatedSchoolOrDistrict.summary
      .schoolSummary[school.schoolType][school.id].totalWithMeasurements -= 1
    }
    if (!docBefore.onTrack && docAfter.onTrack) {
      updatedSchoolOrDistrict.summary
      .schoolSummary[school.schoolType][school.id].onTrack += 1
    }
    else if (docBefore.onTrack && !docAfter.onTrack) {
      updatedSchoolOrDistrict.summary
      .schoolSummary[school.schoolType][school.id].onTrack -= 1
    }
  }

  // update all fields
  var gradeKeys = [grade, 'all']
  var subjectKeys = [subject, 'all']
  var raceOrEthnicityKeys = [raceOrEthnicity, 'all']
  gradeKeys.forEach((gradeKey, index) => {
    subjectKeys.forEach((subjectKey, index) => {
      raceOrEthnicityKeys.forEach((raceOrEthnicityKey, index) => {
        // inc total if before total measurements was 0 and after total was > 0
        // (i.e. iep goal now has measurements)
        if (docBefore.totalMeasurements === 0 && docAfter.totalMeasurements > 0) {
          var idx = summaryIndex(gradeKey, subjectKey, raceOrEthnicityKey, 'totalWithMeasurements')
          if (idx === null) console.log("idx is null", idx)
          if (idx !== null) updatedSchoolOrDistrict.summary.summary[idx] += 1
        }
        // dec total if before was > 0 and after total was 0 (i.e. iep goal has no measurements).
        // can be less than 0 because all shards will be summed and the sum will be >= 0.
        else if (docBefore.totalMeasurements > 0 && docAfter.totalMeasurements === 0) {
          idx = summaryIndex(gradeKey, subjectKey, raceOrEthnicityKey, 'totalWithMeasurements')
          if (idx === null) console.log("idx is null", idx)
          if (idx !== null) updatedSchoolOrDistrict.summary.summary[idx] -= 1
        }
        // inc onTrack if before onTrack was false and after onTrack was true.
        if (!docBefore.onTrack && docAfter.onTrack) {
          idx = summaryIndex(gradeKey, subjectKey, raceOrEthnicityKey, 'onTrack')
          if (idx === null) console.log("idx is null", idx)
          if (idx !== null) updatedSchoolOrDistrict.summary.summary[idx] += 1
        }
        // dec onTrack if before onTrack was true and after onTrack was falee,
        // can be less than 0 because all shards will be summed and the sum will be >= 0.
        else if (docBefore.onTrack && !docAfter.onTrack) {
          idx = summaryIndex(gradeKey, subjectKey, raceOrEthnicityKey, 'onTrack')
          if (idx === null) console.log("idx is null", idx)
          if (idx !== null) updatedSchoolOrDistrict.summary.summary[idx] -= 1
        }
      })
    })
  })

  return updatedSchoolOrDistrict
}

export function decrementSummary(docToBeDeleted, iep, schoolOrDistrict, grade, 
  subject, raceOrEthnicity, school, isDistrict) {
  // I don't think this matters as its just a reference to schoolOrDistrict but am doing it for
  // clarity reasons.
  var updatedSchoolOrDistrict = schoolOrDistrict
  
  // add school obj with key school.id if the school id isn't already in the schoolSummary
  // This is used for the school bar charts on the district summary page only
  if (isDistrict && 
      updatedSchoolOrDistrict.summary.schoolSummary.hasOwnProperty(school.schoolType)) {
    if (!updatedSchoolOrDistrict.summary
                                .schoolSummary[school.schoolType].hasOwnProperty(school.id)) {
      updatedSchoolOrDistrict.summary.schoolSummary[school.schoolType][school.id] = {
        schoolId: school.id,
        schoolName: school.schoolName,
        total: 0,
        totalWithMeasurements: 0,
        onTrack: 0,
      }
    }

    // dec total
    updatedSchoolOrDistrict.summary.schoolSummary[school.schoolType][school.id].total -= 1

    // if the deleted iep goal had measurements, then dec totalWithMeasurements
    if (docToBeDeleted.totalMeasurements > 0) {
      updatedSchoolOrDistrict.summary
        .schoolSummary[school.schoolType][school.id].totalWithMeasurements -= 1
    }
    // if the deleted iep goal was onTrack, then dec onTrack
    if (docToBeDeleted.onTrack) {
      updatedSchoolOrDistrict.summary
        .schoolSummary[school.schoolType][school.id].onTrack -= 1
    }
  }

  // update all fields
  var gradeKeys = [grade, 'all']
  var subjectKeys = [subject, 'all']
  var raceOrEthnicityKeys = [raceOrEthnicity, 'all']
  gradeKeys.forEach((gradeKey, index) => {
    subjectKeys.forEach((subjectKey, index) => {
      raceOrEthnicityKeys.forEach((raceOrEthnicityKey, index) => {
        // dec total
        var idx = summaryIndex(gradeKey, subjectKey, raceOrEthnicityKey, 'total')
        if (idx === null) console.log("idx is null", idx)
        if (idx !== null) updatedSchoolOrDistrict.summary.summary[idx] -= 1
        
        // dec support level
        idx = summaryIndex(gradeKey, subjectKey, raceOrEthnicityKey, levelToSupport(iep.level))
        if (idx === null) console.log("idx is null", idx)
        if (idx !== null) updatedSchoolOrDistrict.summary.summary[idx] -= 1
        
        // if the deleted iep goal had measurements, then dec totalWithMeasurements
        if (docToBeDeleted.totalMeasurements > 0) {
          idx = summaryIndex(gradeKey, subjectKey, raceOrEthnicityKey, 'totalWithMeasurements')
          if (idx === null) console.log("idx is null", idx)
          if (idx !== null) updatedSchoolOrDistrict.summary.summary[idx] -= 1
        }

        // if the deleted iep goal was onTrack, then dec onTrack
        if (docToBeDeleted.onTrack) {
          idx = summaryIndex(gradeKey, subjectKey, raceOrEthnicityKey, 'onTrack')
          if (idx === null) console.log("idx is null", idx)
          if (idx !== null) updatedSchoolOrDistrict.summary.summary[idx] -= 1
        }
      })
    })
  })

  return updatedSchoolOrDistrict
}

export function leastSquares(xSeries, ySeries) {
  if (xSeries.length === 0 || ySeries.length === 0) return [0, 0, 0]

  var reduceSumFunc = function(prev, cur) { return prev + cur }
  
  var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length
  var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length

  var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2) })
    .reduce(reduceSumFunc)
  
  var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2) })
    .reduce(reduceSumFunc)
    
  var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar) })
    .reduce(reduceSumFunc)
    
  var slope = ssXY / ssXX
  var intercept = yBar - (xBar * slope)
  var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY)
  
  return [slope, intercept, rSquare]
}

export function isGoalOnTrack(iep, measurements) {
  if (measurements.length === 0) return false
  if (measurements.length > 18) {
    if (parseInt(measurements[measurements.length - 1], 10) >= iep.targetAccuracyLevel) {
      return true
    }
    else {
      return false
    }
  }

  var xData = [0]
  var yData = [parseInt(iep.baselineAccuracyLevel, 10)]

  measurements.map((item, index) => {
    xData.push(index + 1)
    yData.push(parseInt(item.measurement, 10))
    return false
  })

  var leastSquaresRes = leastSquares(xData, yData)
  // 19 becuase baseline accuracy is at index 0
  var finalYValue = (19)*leastSquaresRes[0] + leastSquaresRes[1]

  // if the finalYValue is greater than or equal to the target accuracy level this
  // goal is on track, else its not on track
  if (finalYValue >= iep.targetAccuracyLevel) return true
  else return false
}

export function getNumShards() {
  return 20
}

export function getRandomShardIndex(numShards) {
  return Math.floor(Math.random() * numShards - 1) + 1
}

export function compress(data) {
  return LZString.compressToEncodedURIComponent(JSON.stringify(data))
}

export function decompress(data) {
  data = LZString.decompressFromEncodedURIComponent(data)
  //console.log("util decompress", data)
  //data.summary = data.summary.split(',').map(Number)
  return JSON.parse(data)
}

export function summaryIndex(grade, subject, race, support) {
  var grades = ['all', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  var subjects = ['all', 'Writing', 'Reading Comprehension in Literature',
                  'Reading Comprehension in Informational Text', 'Reading Foundations',
                  'Math', 'Social Emotional Learning']
  var racesOrEthnicities = ['all', 'Native American or Alaska Native', 'Asian',
                            'Black or African American', 
                            'Native Hawaiian or Other Pacific Islander',
                            'White', 'Hispanic or Latino']
  var supportLevels = ['h', 'm', 'l', 'total', 'totalWithMeasurements', 'onTrack']
  var a = grades.indexOf(grade)
  if (a === -1) return null
  var B = subjects.length
  var b = subjects.indexOf(subject)
  if (b === -1) return null
  var C = racesOrEthnicities.length
  var c = racesOrEthnicities.indexOf(race)
  if (c === -1) return null
  var D = supportLevels.length
  var d = supportLevels.indexOf(support)
  if (d === -1) return null

  return (a * B * C * D) + (b * C * D) + (c * D) + d 
}

// in place modifying a, function is not pure, takes a, b and modifies a
// then returns a. Doing it because I don't want to create another 30kb array.
export function addArrays(a, b) {
  if (a.length !== b.length) {
    console.log("Util addArrays arrays were different lengths a.length:", 
    a.length, "b.length:", b.length)
    return
  }

  for (var i = 0; i < a.length; i++) {
    a[i] += b[i]
  }

  return a
}
