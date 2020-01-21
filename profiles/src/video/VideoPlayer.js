import React, { Component } from 'react'
import videojs from 'video.js'

class VideoPlayer extends Component {
  componentDidMount() {
    window.HELP_IMPROVE_VIDEOJS = false

    // instantiate Video.js
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      console.log('onPlayerReady', this)
    })
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <div data-vjs-player style={this.props.style ? this.props.style : {}}>
        <video 
        width={this.props.width ? this.props.width : 600} 
        height={this.props.height ? this.props.height: 338}
        ref={ node => this.videoNode = node } className="video-js"></video>
      </div>
    )
  }
}

export default VideoPlayer