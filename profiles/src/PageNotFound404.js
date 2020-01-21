import React, { Component } from 'react'
import './styles/GlobalStyle.css'
import { Icon } from 'antd'

class PageNotFound404 extends Component {
  render() {
    return (
      <div className="w-100 h-100 background-cyan pt-100">
        <div className="background-fff w-500 p-3 m-lr-auto br-4 ant-shadow">
          <div className="text-center">
          <img src="/dotit-iep-logo.png" alt={'logo'} height={80} 
            width={220}
                   className="mb-2 m-lr-auto"
                  />
          </div>
          <a href="https://dotitiep.app" className="font-20">
            <div className="text-center">
              <span className="mr-1 text-center">{'dot it IEP has ' +
              'been moved to dotitiep.app. Go to dot it IEP'}</span>
              <Icon type="arrow-right" />
            </div>
          </a>
          <div className="mt-2 font-20">Sorry for the inconvenience.</div>
        </div>
      </div>
    )
  }
}

export default PageNotFound404