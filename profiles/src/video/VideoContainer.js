import React, { Component } from 'react'
import { getURLSplitArray } from '../Util'
import { Button, Icon, Modal } from 'antd'

class VideoContainer extends Component {
  state = {
    visible: false,
    videoURL: '',
  }

  componentDidMount() {
  
  }

  componentWillReceiveProps() {
    var split = getURLSplitArray(window.location)
    var userJob = split[split.length - 3]
    var pathId = split[split.length - 2]
    console.log('userJob', userJob, 'pathId', pathId)

    if (userJob === 'teacher') {
      if (pathId === 'add-goal-start') {
        this.setState({
          videoURL: 'https://firebasestorage.googleapis' +
                    '.com/v0/b/education-9d7f3.appspot.' +
                    'com/o/Draft%20existing%20or%20new%' +
                    '20video.mp4?alt=media&token=9d0365' +
                    '12-2fde-4986-924d-fbe892bbb8cf'
        })
      }
      else if (pathId === 'home') {
        this.setState({
          videoURL: 'https://firebasestorage.googleapis' +
                    '.com/v0/b/education-9d7f3.appspot.' +
                    'com/o/3M%20Teacher%20Home%20Page%2' +
                    '0video.mp4?alt=media&token=99e24fc' +
                    '5-15ae-406d-b120-7658258802e5'
        })
      }
      else if (pathId === 'add-student') {
        this.setState({
          videoURL: 'https://firebasestorage.googleapis' +
                    '.com/v0/b/education-9d7f3.appspot.' +
                    'com/o/Add%20A%20New%20Student%20Vi' +
                    'deo.mp4?alt=media&token=fffb56f8-8' +
                    '88d-420a-965f-f4f7d9f746da'
        })
      }
      else if (pathId === 'add-goal-student') {
        this.setState({
          videoURL: 'https://firebasestorage.googleapis' +
                    '.com/v0/b/education-9d7f3.appspot.' +
                    'com/o/Draft%20Student%20Informatio' +
                    'n%20page%20video.mp4?alt=media&tok' +
                    'en=3f349108-5b9d-41eb-a814-c86d3cb21fa3'
        })
      }
      else if (pathId === 'add-goal-information') {
        this.setState({
          videoURL: 'https://firebasestorage.googleapis' +
                    '.com/v0/b/education-9d7f3.appspot.' +
                    'com/o/plaafp%20video.mp4?alt=media' +
                    '&token=c2c9b4d5-0c8b-432a-abae-5b540a42f1b2'
        })
      }
      else if (pathId === 'add-goal-select') {
        this.setState({
          videoURL: 'https://firebasestorage.googleapis.' +
                    'com/v0/b/education-9d7f3.appspot.co' +
                    'm/o/observation%20form%20video.mp4?' +
                    'alt=media&token=da28556d-1d7b-4c78-9ae5-611677058aed'
        })
      }
      else if (pathId === 'add-goal-progress-monitoring') {
        this.setState({
          videoURL: 'https://firebasestorage.googleapis.' +
                    'com/v0/b/education-9d7f3.appspot.co' +
                    'm/o/baseline%20and%20target%20video' +
                    '.mp4?alt=media&token=f7d29ba7-72e6-4c23-9daf-841eb0b59e64'
        })
      }
      else if (pathId === 'add-goal-service') {
        this.setState({
          videoURL: 'https://firebasestorage.googleapis.' +
                    'com/v0/b/education-9d7f3.appspot.co' +
                    'm/o/service%20times%20video.mp4?alt' +
                    '=media&token=f9fd0902-7104-4fb0-a0ed-85070c022b71'
        })
      }
      else if (pathId === 'student') {
        this.setState({
          videoURL: 'https://firebasestorage.googleapis.' +
                    'com/v0/b/education-9d7f3.appspot.co' +
                    'm/o/Individual%20Student%20Page%20v' +
                    'ideo%20Belinda.mp4?alt=media&token=' +
                    'd2768687-cd1b-447c-8c07-56de17d8fd64'
        })
      }
      else if (pathId === 'class') {
        this.setState({
          videoURL: 'https://firebasestorage.googleapis' +
                    '.com/v0/b/education-9d7f3.appspot.' +
                    'com/o/My%20Students%20Page%20Vido.' +
                    'mp4?alt=media&token=ae0e6553-d36c-' +
                    '449d-ba6c-a2f2df55db18'
        })
      }
      else if (pathId === 'schedule') {
        this.setState({
          videoURL: 'https://firebasestorage.googleapis' +
                    '.com/v0/b/education-9d7f3.appspot.' +
                    'com/o/schedule%20page%20tutorial.m' +
                    'p4?alt=media&token=db5683a1-db77-4' +
                    'e38-a81e-c9c91f8cc6a3'
        })
      }
      else if (pathId === 'progress-monitoring') {
        this.setState({
          videoURL: 'https://firebasestorage.googleapis' +
                    '.com/v0/b/education-9d7f3.appspot.' +
                    'com/o/progress%20monitoring%20vide' +
                    'o.mp4?alt=media&token=bccef994-fa9' +
                    '8-48bd-8591-1fc15dbef72d'
        })
      }
      else if (pathId === 'reports') {
        this.setState({
          videoURL: 'https://firebasestorage.googleapis' +
                    '.com/v0/b/education-9d7f3.appspot.' +
                    'com/o/report%20page%20video.mp4?al' +
                    't=media&token=cf314fd8-ef8c-4c37-8' +
                    'b74-bfb1ac7d1d73'
        })
      }
      else if (pathId === 'student-report') {
        this.setState({
          videoURL: 'https://firebasestorage.googleapis' +
                    '.com/v0/b/education-9d7f3.appspot.' +
                    'com/o/report%20page%20video.mp4?al' +
                    't=media&token=cf314fd8-ef8c-4c37-8' +
                    'b74-bfb1ac7d1d73'
        })
      }
      else {
        this.setState({
          videoURL: 'https://firebasestorage.googleapis' +
                    '.com/v0/b/education-9d7f3.appspot.' +
                    'com/o/My%20Students%20Page%20Vido.' +
                    'mp4?alt=media&token=ae0e6553-d36c-' +
                    '449d-ba6c-a2f2df55db18'
        })
      }
    }
    else if (userJob === 'school-admin') {
      if (pathId === 'school-admin-home') {
        this.setState({
          videoURL: 'https://firebasestorage.googleapis.' +
                    'com/v0/b/education-9d7f3.appspot.co' +
                    'm/o/Principal%20home%20page%20video' +
                    '.mp4?alt=media&token=c5b36c85-e917-' +
                    '4ff9-9d86-ef838bf9d611'
        })
      }
      else {
        this.setState({
          videoURL: 'https://firebasestorage.googleapis' +
                    '.com/v0/b/education-9d7f3.appspot.' +
                    'com/o/My%20Students%20Page%20Vido.' +
                    'mp4?alt=media&token=ae0e6553-d36c-' +
                    '449d-ba6c-a2f2df55db18'
        })
      }
    }
    else if (userJob === 'admin') {
      // For now, as admins don't have any videos at this time. replace
      // when admins have videos.
      if ('') {

      }
      else {
        this.setState({
          videoURL: 'https://firebasestorage.googleapis' +
                    '.com/v0/b/education-9d7f3.appspot.' +
                    'com/o/My%20Students%20Page%20Vido.' +
                    'mp4?alt=media&token=ae0e6553-d36c-' +
                    '449d-ba6c-a2f2df55db18'
        })
      }
    }
    else {
      this.setState({
        videoURL: 'https://firebasestorage.googleapis' +
                  '.com/v0/b/education-9d7f3.appspot.' +
                  'com/o/My%20Students%20Page%20Vido.' +
                  'mp4?alt=media&token=ae0e6553-d36c-' +
                  '449d-ba6c-a2f2df55db18'
      })
    }
  }

  componentWillUnmount() {
   
  }

  toggleVisible = () => {
    this.setState({ visible: !this.state.visible })
  }

  hide = () => {
    this.setState({ visible: false })
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleOk = (e) => {
    console.log(e)
    this.setState({
      visible: false,
    })
  }

  handleCancel = (e) => {
    console.log(e)
    this.setState({
      visible: false,
    })
  }

  render() {
    return (
      <div>
        <Modal
          visible={this.state.visible}
          footer={null}
          title={'Smart Learning Systems'}
          width={648}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
        {this.state.visible ?
        <div>
            <div>
              {this.props.children}
            </div>
            </div>
            : ''}
        </Modal>
        <div 
          className="flex flex-v-center flex-h-center"
        >
       
        <Button onClick={this.toggleVisible}
          size={'large'}
          shape="circle" 
          className="ant-shadow block"
          style={{width: '100px', height: '100px'}}
        >
          <Icon type="video-camera" className="font-30" />
        </Button>
        </div>

        {this.state.visible ? 
          <div 
            style={{zIndex: 2, position: 'fixed', top: 220, 
                    right: 32}}
          >
           
          </div>
        : ''}
      </div>
    )
  }
}

export default VideoContainer