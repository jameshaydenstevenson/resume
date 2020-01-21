import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'
import { db } from '../../firebase/Firebase'
import ColType from '../.././Types'
import { Button, message, Rate, Tooltip } from 'antd'

const successMessage = (description) => {
  message.success(description)
}

const errorMessage = (description) => {
  message.error(description)
}

class Note extends Component {
  state = { 
    submitting: false,
  }

  componentDidMount() {
    
  }

  deleteNote = () => {
    this.setState({
      submitting: false,
    }, () => {
      db.collection(ColType.notes)
      .doc(this.props.note.id)
      .delete()
      .then(() => {
        console.log('Document updated')
        successMessage('Note removed successfully.')
      })
      .catch((error) => {
        console.error('Error adding document: ', error)
        errorMessage("Something went wrong when removing the note.")
        this.setState({
          submitting: true,
        })
      })
    })
  }

  render() {
    return (
      <div className="p-2 font-16 background-light-grey br-4 relative">
        {this.props.note && this.props.note.timeStamp ?
          <div>
            <div className={"absolute-tr p-2" +
            (this.props.allowDelete ? '' : ' display-none')}>
              <Tooltip title="Remove note">
                <Button type="dashed" shape="circle" icon="close" size={'small'}
                  disabled={this.state.submitting} 
                  onClick={this.deleteNote}
                />
              </Tooltip>
            </div>
            <div>
              <div className="mb-1">Added on {this.props.note.timeStamp.toLocaleString()}</div>
              <div className="mb-1">{this.props.note.message}</div>
              <Rate disabled defaultValue={this.props.note.rating} />
            </div>
          </div>
        : ''}
      </div>
    )
  }
}

export default Note
