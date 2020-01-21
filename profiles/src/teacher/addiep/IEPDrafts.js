import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/GlobalStyle.css'
import { db } from '../../firebase/Firebase'
import ColType from '../.././Types'
import PersonAvatar from '../../customcomponents/PersonAvatar'
import { Tag, Popconfirm, Button, Icon, message } from 'antd'

const errorMessage = (description) => {
  message.destroy()
  message.error(description)
}

const successMessage = (description) => {
  message.destroy()
  message.success(description)
}

class IEPDrafts extends Component {
  state = {
    deletedDrafts: [] // not relying on snapshot listeners for this, I think its too much
  }

  componentDidMount() {

  }

  deleteDraft = (e, draftId) => {
    e.preventDefault()
    db.collection(ColType.iepDrafts)
      .doc(draftId)
      .delete()
      .then(() => {
        successMessage("Draft deleted successfully.")
        var deletedDrafts = this.state.deletedDrafts
        deletedDrafts.push(draftId)
        this.setState({ deletedDrafts : deletedDrafts })
      })
      .catch((error) => {
        errorMessage("Draft could not be deleted.")
      })
  }

  render() {
    console.log(window.location.search)

    return <div>
      {this.props.iepDrafts ?
        this.props.iepDrafts.length === 0 ?
          <h2>No drafts have been started yet.</h2>
          : 
          this.props.iepDrafts.map((iepDraft, index) => {
            if (this.state.deletedDrafts.indexOf(iepDraft.id) > -1) return false
            return <div key={'draft-' + iepDraft.id}>
              <Link to={{
                    pathname: '/teacher/add-goal-' + iepDraft.step.path + '/' + 
                        iepDraft.teacherId,
                    search: '?student=' + iepDraft.studentId +
                    '&draft=' + iepDraft.id,
                    }}
                    disabled={window.location.pathname === '/teacher/add-goal-' + 
                    iepDraft.step.path + '/' + 
                    iepDraft.teacherId &&
                    window.location.search === '?student=' + iepDraft.studentId +
                    '&draft=' + iepDraft.id}
                    className={"w-100 h-100 br-100 up-hover" +
                                " shadow-hover mb-2 p-2 ant-btn" +
                                " ant-btn-dashed relative parent-hover text-left"}
              >
              <div className="absolute-tr pr-3 show-on-parent-hover">
                <Popconfirm 
                  arrowPointAtCenter={false}
                  placement={'topRight'}
                  title="Do you want to delete this draft?" 
                  onConfirm={(e) => this.deleteDraft(e, iepDraft.id)} 
                  onCancel={(e) => e.preventDefault()} 
                  okText="Yes" cancelText="No">
                    <Button className="transparent-btn font-20">
                    <Icon type="close" />
                   </Button>
                </Popconfirm>
              </div>
                <PersonAvatar person={this.props.studentDict[iepDraft.studentId]} />
                {this.props.draftId === iepDraft.id ?
                  <Tag color="blue" className="ml-1">Currently working on this draft.</Tag>
                : ''}
                <span className="float-right text-muted">
                  Started on: {iepDraft.timeStamp.toLocaleString()}
                </span>
              </Link>
            </div>
          })
      : ''}
    </div>
  }
}

export default IEPDrafts