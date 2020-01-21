import React from 'react'
import {Route, Switch} from 'react-router-dom'
import PageNotFound404 from './PageNotFound404'
import Home from './home/Home'
import PaymentForm from './home/PaymentForm'
import PaymentSuccess from './home/PaymentSuccess'
import PaymentError from './home/PaymentError'
import 'antd/dist/antd.css'  // or 'antd/dist/antd.less'

class App extends React.Component {

  componentDidMount() {

  }

  render() {
    return (
      <Switch>
        <Route exact={true} path="/" component={Home} />
        <Route path="/pay" component={PaymentForm} />
        <Route path="/pay-success" component={PaymentSuccess} />
        <Route path="/pay-error" component={PaymentError} />
        <Route component={PageNotFound404} />
        
      </Switch>
    )
  }
}

export default App
