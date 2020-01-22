import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import '../styles/GlobalStyle.css'
import { Helmet } from "react-helmet"
import { Layout, BackTop} from 'antd'
var CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup')
const Content = Layout.Content

export default class Home extends Component {
  state = {
    user: null,
    person: null,
    accessLevel: null,
    loginMounted: false,
    height: 0, 
    width: 0,
  }

  componentDidMount() {
    this.updateWindowDimensions()
    window.addEventListener("resize", this.updateWindowDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions)
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
  };

  scrollToPreviewVideo() {
    var previewContainerEl = document.getElementById('preview-video-container')
    var y = previewContainerEl.getBoundingClientRect().top + window.scrollY
    y -= 60
    window.scroll({
      top: y,
      behavior: 'smooth'
    })
  }

  render() {
    return (
     
      <div className="">

        <Helmet>
            <meta charSet="utf-8" />
            <link href="https://fonts.googleapis.com/css?family=Caveat" 
              rel="stylesheet" />
            <title>Paw Call</title>
            <meta name="description" 
  content={"Dr. Scott Stevenson Veterinary Services in your home or on the phone. "+
"Call 828.699.8299 to schedule today!"} 
            />
            <meta name="keywords" content={"pawcall, paw call, pawcall.chat,"+
            "scott stevenson, scott stevenson vet, scott stevenson hendersonville"+
            "stevenson veternarian, stevenson vet, stevenson vet hendersonville nc"+
            "veterinarians hendersonville, veterinarians hendersonville nc"+
            "vet house call, vet house calls, vet at home care, pet at home care"+
            "scott stevenson house call, scott stevenson paw call, paw call vet"+
            "paw call vet services, paw call veterinarian, vet phone consultation"+
            "vet hendersonville, vet consultation, pet consultation hendersonville nc"+
            "vet transylvania, vet polk county, pet consultation transylvania nc"+ 
            "vet henderson county nc, vet asheville nc, pet consultation buncombe nc"+ 
            "vet polk county sc, vet asheville nc, pet consultation buncombe nc"} 
            />
            <meta name="google-site-verification" 
                  content="iEaOYr2I6plF2RMp4sZmlPCAnm249qe16BaIaAEQI_k" />

<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"/>
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lobster"/>

<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
<link rel="manifest" href="/site.webmanifest"/>
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
<meta name="msapplication-TileColor" content="#da532c"/>
<meta name="theme-color" content="#f7f7f7"/>
        </Helmet>
      <BackTop visibilityHeight={1500}/>
      
      <CSSTransitionGroup
          transitionName="example"
          transitionAppear={true}
          transitionAppearTimeout={300}
          transitionEnter={false}
          transitionLeave={false}>
     <div className="overflow-hidden ">
      <Layout className="content ">
            <Layout>
              <Content className="">
                

{/* 
              <div id="loading">
        <div id="spinner"></div>
    </div> */}
    <div id="magnify">
        <h1 onclick="closemagnify()"><i class="fas fa-times"></i></h1>
        <div id="img_here"></div>
    </div>
    <header id="header" class="animated slideInDown" style={{animationDelay:'1.8s'}}>
        <table>
            <tr>
                <td id="logo">yourname.</td>
                <td id="navigation">
                    <a href="#work">work</a>
                    <a href="#bio">about</a>
                    <a href="">blog</a>
                    <a href="#contact">contact</a>
                </td>
            </tr>
        </table>
    </header>
    <table id="top_part">
        <tr>
            <td id="about" class="animated slideInLeft" style={{animationDelay:'2s'}}>
                <h1>this is where you put your about or tagline</h1>
                <button class="btn_one">Hire Me</button>
                <table>
                    <tr>
                        <td class="animated zoomIn" style={{animationDelay:'2s'}}><a class="social"><i class="fab fa-facebook"></i></a></td>
                        <td class="animated zoomIn" style={{animationDelay:'2s'}}><a class="social"><i class="fab fa-twitter"></i></a></td>
                        <td class="animated zoomIn" style={{animationDelay:'2s'}}><a class="social"><i class="fab fa-instagram"></i></a></td>
                        <td class="animated zoomIn" style={{animationDelay:'2s'}}><a class="social"><i class="fab fa-dribbble"></i></a></td>
                        <td class="animated zoomIn" style={{animationDelay:'2s'}}><a class="social"><i class="fab fa-medium"></i></a></td>
                    </tr>
                </table>
            </td>
            <td id="rightImage" class="animated jackInTheBox" style={{animationDelay:'2s'}}></td>
        </tr>
    </table>
    <div id="work">
        <h1>work</h1>
        <div id="photos">
            <img onclick="magnify($(this).attr('src'))" alt="img" src="https://images.unsplash.com/photo-1547922657-b370d1687eb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80"/>
            <img onclick="magnify($(this).attr('src'))" alt="img" src="https://images.unsplash.com/photo-1549375463-8cbc18ca3f24?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80"/>
            <img onclick="magnify($(this).attr('src'))" alt="img" src="https://images.unsplash.com/photo-1549366021-9f761d450615?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=650&q=80"/>
            <img onclick="magnify($(this).attr('src'))" alt="img" src="https://images.unsplash.com/photo-1549309019-a1d77aeae74f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"/>
            <img onclick="magnify($(this).attr('src'))" alt="img" src="https://images.unsplash.com/photo-1547149666-769b42053e67?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=564&q=80"/>
            <img onclick="magnify($(this).attr('src'))" alt="img" src="https://images.unsplash.com/photo-1547950515-e652d0f50b1b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"/>
            <img onclick="magnify($(this).attr('src'))" alt="img" src="https://images.unsplash.com/photo-1545342084-d03fe58ea023?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=633&q=80"/>
        </div>
    </div>
    <div id="bio">
        <h1>about</h1>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
    </div>
    <div id="contact">
        <h1>contact</h1>
            <table>
                <tr>
                    <td>
                        <div id="inner_div">
                            <table id="inner_table">
                                <tr>
                                    <td><i class="fas fa-phone"></i> &nbsp; +1 234 567 8910</td>
                                </tr>
                                <tr>
                                    <td><i class="fas fa-at"></i> &nbsp; yourname@email.com</td>
                                </tr>
                                 <tr>
                                    <td><i class="fas fa-fax"></i> &nbsp; +1 234 567 8910</td>
                                </tr>
                                <tr>
                                    <td><i class="fas fa-map-marker-alt"></i>
                                    <div id="address">
                                        Street 123,
                                        blah blah city,
                                        blah blah country
                                    </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <a class="social"><i class="fab fa-facebook"></i></a>
                                        <a class="social"><i class="fab fa-twitter"></i></a>
                                        <a class="social"><i class="fab fa-instagram"></i></a>
                                        <a class="social"><i class="fab fa-dribbble"></i></a>
                                        <a class="social"><i class="fab fa-medium"></i></a>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </td>
                    <td>
                        <form>
                            <input type="text" placeholder="name" required/>
                            <input type="email" placeholder="email" required/>
                            <textarea placeholder="your message" required rows="5"></textarea>
                            <button class="btn_one">send</button>
                        </form> 
                    </td>
                </tr>
            </table>
    </div>
    <div id="footer">
        made on earth by a human  <a href="https://imfunniee.github.io">imfunniee</a>
    </div>
    {/* <script src="index.js" type="text/javascript"></script> */}




          </Content>
          </Layout>
          </Layout>
      </div>
      </CSSTransitionGroup>
      </div>
     
    )
  }
}