import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/GlobalStyle.css'
import { Icon } from 'antd'

class NotAtThisStep extends Component {
  state = {

  }

  componentDidMount() {

  }

  render() {
    var iepDraft = this.props.iepDraft

    return <div>
      {iepDraft ?
        <div className="mt-4">
          <h1>You are not at this step yet.</h1>
          <Link to={'/teacher/add-goal-' + iepDraft.step.path + '/' +
            iepDraft.teacherId + '?student=' + iepDraft.studentId +
            '&draft=' + iepDraft.id}
            className={"w-500 h-100 br-100 text-center up-hover" +
              " shadow-hover mb-2 p-2 pl-3 pr-3 ant-btn" +
              " ant-btn-dashed relative parent-hover text-left"}
          >
            <Icon type="arrow-left" className="mr-2" />Go to my current step.
          </Link>
        </div>
        : ''}
    </div>
  }
}

export default NotAtThisStep