import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import '../styles/GlobalStyle.css'
import { InputNumber } from 'antd'

// Using this to add students until the step form for adding students is done.
class InputNumberPickerAnt extends Component {
  constructor(props) {
    super(props)

    this.setWrapperRef = this.setWrapperRef.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  state = {
    el: null,
    value: this.props.value,
    meta: this.props.meta,
  }

  componentDidMount() {
    this.setState({
      el: ReactDOM.findDOMNode(this)
    }, () => {
      document.addEventListener('click', this.handleClickOutside)
    })
  }
  
  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  }

  // on each props update form parent update state accordingly
  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.value) {
      this.setState({
        value: nextProps.value
      })
    }
  }

  /**
   * Set the wrapper ref
   */
  setWrapperRef(node) {
    this.numberInput = node
  }

  handleClickOutside(event) {
    // get the element of this inputnumber component instance
    var el = this.state.el

    // if null return
    if (el === null) return
    if (!this.numberInput && 
        !this.numberInput.inputNumberRef && 
        !this.numberInput.inputNumberRef.input) return
    
    // if clicked outside and it has the focus class, remove it
    if (el && !el.contains(event.target)) {
      //console.log("blur called", ReactDOM.findDOMNode(this))
      if (el.classList.contains('ant-input-number-focused')) {
        el.classList.remove("ant-input-number-focused")
        this.numberInput.inputNumberRef.input.blur()
      }
    } 
    // if clicked on the input number component and it doesnt have 
    // the class, then add it
    else if (el && el.contains(event.target)) {
      if (!el.classList.contains('ant-input-number-focused')) {
        el.classList += " ant-input-number-focused"
      }

      // focus if click on component regardless, improves ux
      this.numberInput.inputNumberRef.focus()
    }
  }

  onChange = (value) => {
    var isNumeric = /^\+?(0|[1-9]\d*)$/.test(value)
    if (!isNumeric) return
    if (value > this.props.max) value = this.props.max
    
    this.setState({
      value: value,
    }, () => {
      if (this.props.onChangeSuccess && this.state.meta) {
        this.props.onChangeSuccess(value, this.state.meta.iep, this.state.meta.index)
      }
    })
  }

  render() {
    return (
      <InputNumber 
        size={this.props.size}
        min={this.props.min} 
        max={this.props.max} 
        value={this.state.value}
        defaultValue={this.props.defaultValue}
        initialValue={this.props.initialValue}
        disabled={this.props.disabled}
        className={this.props.className ? this.props.className : ''}
        onChange={this.onChange}
        ref={this.setWrapperRef}
    />
    )
  }
}

export default InputNumberPickerAnt
