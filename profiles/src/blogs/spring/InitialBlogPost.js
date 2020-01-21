import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'
import { Helmet } from "react-helmet"
import { } from 'antd'

export default class InitialBlogPost extends Component {
  state = {
    user: null,
    person: null,
    accessLevel: null,
    loginMounted: false,
  }

  componentDidMount() {
   
  }

  render() {
    console.log("initial blog post render")
    return (
      <div>
        <Helmet>
            <meta charSet="utf-8" />
            <title>Initial Post</title>
            <meta name="description" 
                  content={"Initial Post"} 
            />
            <meta name="keywords" content={"dot it,dotit,dotitapp," +
                    "dotit special education,Special Education,IEP Goals,IEPS,IEP," +
                    "dotit IEPs,standards,standard,standard based,standard based IEP," +
                    "standard based IEP goals,software,iep software,iep goal software," +
                    "iep calendar,progress monitoring,iep progress monitoring,iep charts," +
                    "iep reports,print iep reports,printable iep reports,district reports," +
                    "district summary,school reports,school summary"} 
            />
            <meta name="google-site-verification" 
                  content="iEaOYr2I6plF2RMp4sZmlPCAnm249qe16BaIaAEQI_k" />
        </Helmet>

      <div className="overflow-hidden">

           {/** Secondary block */}
           <div className="font-18">
              <div className="font-34 font-bold">
                Initial Post
              </div>
              <div className="mb-2 font-16 text-muted">
                Published on 3/16/2019
              </div>
              <div>
                We are happy to announce the start of a dot it thought leadership blog. In the blog
                we will discuss upcoming features, status reports, and education
                related topics.
              </div>
              <div className="mt-1">
                Thanks,
              </div>
              <div className="mt-1">
                The dot it team
              </div>
           </div>
         
      </div>
      </div>
    )
  }
}