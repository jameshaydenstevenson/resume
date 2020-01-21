import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'
import { firebase, db } from '../../firebase/Firebase'
import PersonAvatar from '../../customcomponents/PersonAvatar'
import IEPDrafts from './IEPDrafts'
import IEPFormSteps from './IEPFormSteps'
import ColType from '../.././Types'
import { flattenDoc, getIDFromURL, getQueryStringParam } from '../.././Util'
import { Layout, Button, Icon, Select, Form, Radio, Tabs, Row, Col } from 'antd'
import CustomFooter from '../../login/CustomFooter'
const { Content } = Layout
const Option = Select.Option
const FormItem = Form.Item
const RadioGroup = Radio.Group
const TabPane = Tabs.TabPane

class TeacherAddIEPGoalStudent extends Component {
  state = {
    teacher: null,
    selectedStudent: null,
    selectedSubjects: [],
    students: [],
    studentDict: {},
    iepDrafts: [],
    tabKey: '1',
    iepDraft: null,
    iepDraftMounted: false,
  }

  componentDidMount() {
    var teacherId = getIDFromURL(window.location)
    var draftId = getQueryStringParam('draft')
    var iepDraft = this.props.history.location.state
    console.log(teacherId, iepDraft)

    this.setState({
      teacherId: teacherId,
      draftId: draftId,
      tabKey: '1',
    })

    if (draftId) {
      db.collection(ColType.iepDrafts)
        .doc(draftId)
        .get()
        .then((doc) => {
          this.setState({
            iepDraft: flattenDoc(doc),
            iepDraftMounted: true,
          }, () => {
            iepDraft = this.state.iepDraft
            if (iepDraft &&
              !(Object.keys(iepDraft).length === 0 &&
                iepDraft.constructor === Object)) {
              this.props.form.setFieldsValue({
                studentId: iepDraft.studentId,
                subject: iepDraft.subject,
                category: iepDraft.category,
                level: iepDraft.selectedLevel,
              })
            }
          })
        })
    } else {
      this.setState({
        iepDraftMounted: true,
      })
    }

    db.collection(ColType.teacher)
      .doc(teacherId)
      .get()
      .then((doc) => {
        var teacher = flattenDoc(doc)

        this.setState({
          teacher: teacher,
        })
      })

    db.collection(ColType.student)
      .where('teacherId', '==', teacherId)
      .get()
      .then((querySnapshot) => {
        var students = []
        var studentDict = {}
        querySnapshot.forEach((doc) => {
          //console.log(doc.id, ' => ', doc.data())
          var student = flattenDoc(doc)
          students.push(student)
          studentDict[student.id] = student
        })

        this.setState({
          students: students,
          studentDict: studentDict,
        })
      })

    db.collection(ColType.iepDrafts)
      .where('teacherId', '==', teacherId)
      .get()
      .then((querySnapshot) => {
        var iepDrafts = []

        querySnapshot.forEach((doc) => {
          iepDrafts.push(flattenDoc(doc))
        })

        this.setState({
          iepDrafts: iepDrafts,
        })
      })
  }

  // add a new event to the teacher's events
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // only used for clicking back on this step to set the form value
        values.selectedLevel = values.level
        var belowSeventy = '70 and below'
        var belowEighty = '70-79'
        var aboveEighty = '80 and above'
        if (values.level < 70) values.level = belowSeventy
        else if (values.level < 80) values.level = belowEighty
        else values.level = aboveEighty

        values.studentId = values.studentId
        values.teacherId = this.state.teacher.id
        values.schoolId = this.state.teacher.schoolId
        values.districtId = this.state.teacher.districtId
        values.timeStamp = firebase.firestore.FieldValue.serverTimestamp()
        values.step = {stepNum: 1, path: 'information'}

        if (this.state.draftId) {
          db.collection(ColType.iepDrafts)
            .doc(this.state.draftId)
            .set(values)
            .then(() => {
              console.log("Document set with ID: ", this.state.draftId)
              this.props.history.push(
                {
                  pathname: '/teacher/add-goal-information/' +
                    this.state.teacherId + '?student=' +
                    values.studentId +
                    '&draft=' + this.state.draftId,
                  state: values, // pass state to confirm page
                }
              )
            })
            .catch((error) => {
              console.log(error)
            })
        }
        else {
          db.collection(ColType.iepDrafts)
            .add(values)
            .then((docRef) => {
              console.log("Document written with ID: ", docRef.id)
              this.props.history.push(
                {
                  pathname: '/teacher/add-goal-information/' +
                    this.state.teacherId + '?student=' +
                    values.studentId +
                    '&draft=' + docRef.id,
                  state: values, // pass state to confirm page
                }
              )
            })
            .catch((error) => {
              console.log(error)
            })
        }
      }
    })
  }

  tabChange = (activeKey) => {
    this.setState({ tabKey: activeKey })
  }

  studentChange = (value, option) => {
    console.log('student change', value, option)
    var student = this.state.studentDict &&
                  this.state.studentDict.hasOwnProperty(value) ?
                  this.state.studentDict[value] :
                  null

    this.setState({
      selectedStudent: student,
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    const formItemBlockLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    }

    return (
      <div>
        <Layout className="content layout-header-mt">
          <Layout>
            <Content className="layout-content">
              <div>
                <Tabs
                  activeKey={this.state.tabKey}
                  onChange={this.tabChange}
                  size={'large'}
                  tabPosition={'top'}
                  animated={false}
                >
                  <TabPane tab={<div className="font-16 text-left">
                    <Icon type="file" className="mr-2 font-18" />
                    <span>Current Draft</span>
                  </div>
                  }
                    key="1"
                  >
                    <Row gutter={32} className="mt-4">
                      <Col span={4} className="border-right">
                        <h2 className="mb-2">Steps</h2>
                        <IEPFormSteps current={0} />
                      </Col>
                      <Col span={20}>
                        <div className="sub-menu-width m-lr-auto">
                          <h1 className="mb-1">Draft an IEP</h1>

                          <div>
                            <h2 className="mb-3">Student Information</h2>
                            <Form onSubmit={this.handleSubmit} 
                            className="login-form text-align-left">
                              <FormItem {...formItemBlockLayout} 
                              label="Student" className="block-label">
                                {getFieldDecorator('studentId', {
                                  rules: [{ required: true, message: 'Select a student.' }],
                                })(
                                  <Select
                                    showSearch
                                    className="ant-select-very-large"
                                    placeholder="Select student"
                                    onChange={this.studentChange}
                                  >
                                    {this.state.students.map((student, index) => {
                                      return <Option value={student.id} key={"student-" + index}>
                                        <PersonAvatar
                                          size={'default'}
                                          person={student}
                                        />
                                      </Option>
                                    })
                                    }
                                  </Select>
                                )}
                              </FormItem>
                              
                              {this.state.selectedStudent == null || 
                               this.state.selectedStudent.grade > 5 ?
                              <FormItem {...formItemBlockLayout} 
                              label={"The student needs goals for " +
                              "(select all content areas that apply - a goal will " +
                              "be generated for each content area selected)"} 
                              className="block-label">
                                {getFieldDecorator('subject', {
                                  rules: [{ required: true, 
                                    message: 'Select all content areas that apply.' }],
                                })(
                                  <Select
                                    mode="multiple"
                                    size={'large'}
                                    placeholder="Select all content areas that apply"
                                  >
                                    <Option value={'Reading Comprehension in Literature'}>
                                      Reading Comprehension in Literature
                                    </Option>
                                    <Option value={'Reading Comprehension in Informational Text'}>
                                      Reading Comprehension in Informational Text
                                    </Option>
                                    <Option value={'Math'}>
                                      Math
                                    </Option>
                                    <Option value={'Writing'}>
                                      Writing
                                    </Option>
                                    <Option value={'Social Emotional Learning'}>
                                      Social Emotional Learning
                                    </Option>
                                  </Select>
                                )}
                              </FormItem>
                              : 
                              <FormItem {...formItemBlockLayout} 
                              label={"The student needs goals for " +
                              "(select all content areas that apply - a goal will " +
                              "be generated for each content area selected)"} 
                              className="block-label">
                                {getFieldDecorator('subject', {
                                  rules: [{ required: true, 
                                    message: 'Select all content areas that apply.' }],
                                })(
                                  <Select
                                    mode="multiple"
                                    size={'large'}
                                    placeholder="Select all content areas that apply"
                                  >
                                    <Option value={'Reading Comprehension in Literature'}>
                                      Reading Comprehension in Literature
                                    </Option>
                                    <Option value={'Reading Comprehension in Informational Text'}>
                                      Reading Comprehension in Informational Text
                                    </Option>
                                    <Option value={'Reading Foundations'}>
                                      Reading Foundational Skills
                                    </Option>
                                    <Option value={'Math'}>
                                      Math
                                    </Option>
                                    <Option value={'Writing'}>
                                      Writing
                                    </Option>
                                    <Option value={'Social Emotional Learning'}>
                                      Social Emotional Learning
                                    </Option>
                                  </Select>
                                )}
                              </FormItem>
                              }
                             

                              <FormItem {...formItemBlockLayout} label={"Based on the student's " +
                                "psychological evaluation, access to the general curriculum " +
                                "is impacted most by weaknesses in"}
                                className="block-label">
                                {getFieldDecorator('category', {
                                  rules: [{ required: true, message: 'Select greatest impact.' }],
                                })(
                                  <Select
                                    size={'large'}
                                    placeholder="Select impact">
                                    <Option value={'WMI'}>
                                      Working Memory
                        </Option>
                                    <Option value={'PSI'}>
                                      Processing Speed
                        </Option>
                                    <Option value={'FRI'}>
                                      Fluid Reasoning / Visual Spatial Processing
                        </Option>
                                    <Option value={'VCI'}>
                                      Verbal Comprehension
                        </Option>
                                  </Select>
                                )}
                              </FormItem>

                              <FormItem {...formItemBlockLayout}
                                label={"On this index, the student scored"}
                                className="block-label">
                                {getFieldDecorator('level', {
                                  rules: [{ required: true, message: 'Select score' }],
                                })(
                                  <RadioGroup>
                                    <Radio value={69}>
                                      Extremely Low (69 or below)
                          </Radio>
                                    <Radio className="block mt-1" value={79}>
                                      Very Low (70-79)</Radio>
                                    <Radio className="block mt-1" value={89}>
                                      Low Average (80-89)
                          </Radio>
                                    <Radio className="block mt-1" value={109}>
                                      Average (90-109)
                          </Radio>
                                    <Radio className="block mt-1" value={119}>
                                      High Average (110-119)
                          </Radio>
                                    <Radio className="block mt-1" value={129}>
                                      Very High (120-129)
                          </Radio>
                                  </RadioGroup>
                                )}
                              </FormItem>

                              <FormItem className="mb-0">
                                <Button
                                  type="primary"
                                  size={'large'}
                                  htmlType="submit"
                                  className="login-form-button text-align-center float-right"
                                >
                                  Continue
                      </Button>
                              </FormItem>
                            </Form>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane
                    tab={<div className="font-16 text-left">
                      <Icon type="folder" className="mr-2 font-18" />
                      <span>Saved Drafts</span>
                    </div>
                    }
                    key="2"
                  >
                    <div className="mt-4">
                      <h1 className="mb-1">IEP Drafts</h1>
                      <h3 className="mb-4">
                        IEP Drafts that you are working on will have their progress saved here.
                    </h3>
                      <IEPDrafts
                        draftId={this.state.draftId}
                        iepDrafts={this.state.iepDrafts}
                        studentDict={this.state.studentDict}
                      />
                    </div>
                  </TabPane>
                </Tabs>

              </div>
            </Content>
          </Layout>
        </Layout>
        <CustomFooter />
      </div>
    )
  }
}

export default Form.create()(TeacherAddIEPGoalStudent)