import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'
import ZoomInModal from '../../home/ZoomInModal'
import { Helmet } from "react-helmet"
import { Row, Col } from 'antd'

export default class SpringForward3StepsToANewBeginning extends Component {
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
            <title>Spring Forward: 3 Steps to a New Beginning</title>
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
                Spring Forward: 3 Steps to a New Beginning
              </div>
              <div className="mb-2 font-16 text-muted">
                Published on 3/25/2019
              </div>
              <Row gutter={32} className="mt-4 pt-1" type={'flex'}>
                <Col   
                  xs={{ span: 24, offset: 0 }} 
                  sm={{ span: 24, offset: 0 }} 
                  md={{ span: 24, offset: 0 }} 
                  lg={{ span: 24, offset: 0 }} 
                  xl={{ span: 8, offset: 0 }} 
                >
                  <ZoomInModal
                    imgSrc={'/spring-forward-3-steps-to-a-new-beginning/image2.png'} 
                    additionalClassNames={'w-100 mb-2 max-w-350'}
                  />
                </Col>
                <Col  
                  xs={{ span: 24, offset: 0 }} 
                  sm={{ span: 24, offset: 0 }} 
                  md={{ span: 24, offset: 0 }} 
                  lg={{ span: 24, offset: 0 }} 
                  xl={{ span: 16, offset: 0 }} 
                >
                  <div className="font-bold mb-1 font-20 mt-minus-6">
                    Data Evaluation: Face Reality
                  </div>
                  <div>
                    Evaluate your data to create understanding and urgency. 
                    Do you have any achievement gaps? Are there weak content 
                    areas? Where are there students tumbling into tier 3? It 
                    is important to couple the harsh reality with glimmers of 
                    hope. Tell authentic stories or share examples about what 
                    IS working and think about how to replicate it. 
                  </div>
                </Col>
              </Row>
              <Row gutter={32} className="mt-4 pt-1" type={'flex'}>
                <Col  
                  xs={{ span: 24, offset: 0 }} 
                  sm={{ span: 24, offset: 0 }} 
                  md={{ span: 24, offset: 0 }} 
                  lg={{ span: 24, offset: 0 }} 
                  xl={{ span: 8, offset: 0 }} 
                >
                  <ZoomInModal
                    imgSrc={'/spring-forward-3-steps-to-a-new-beginning/image1.png'} 
                    additionalClassNames={'w-100 mb-2 max-w-350'}
                  />
                </Col>
                <Col  
                  xs={{ span: 24, offset: 0 }} 
                  sm={{ span: 24, offset: 0 }} 
                  md={{ span: 24, offset: 0 }} 
                  lg={{ span: 24, offset: 0 }} 
                  xl={{ span: 16, offset: 0 }} 
                >
                  <div className="font-bold mb-1 font-20 mt-minus-6">
                    Leadership: Choose influencers over innovators.
                  </div>
                  <div>
                    The biggest predictor of MTSS success is buy in. 
                    Your innovators may “get it” but if they are not 
                    the people everybody listens to, they are not likely 
                    to be your best choice. Influencers are the 15% that 
                    are well informed, connected and respected. The other 
                    85% of your staff will not adopt MTSS until these 
                    influencers do. Put them on your leadership team 
                    and your job is a whole lot easier. 
                  </div>
                </Col>
              </Row>
              <Row gutter={32} className="mt-4 pt-1" type={'flex'}>
                <Col  
                  xs={{ span: 24, offset: 0 }} 
                  sm={{ span: 24, offset: 0 }} 
                  md={{ span: 24, offset: 0 }} 
                  lg={{ span: 24, offset: 0 }} 
                  xl={{ span: 8, offset: 0 }} 
                >
                  <ZoomInModal
                    imgSrc={'/spring-forward-3-steps-to-a-new-beginning/image3.png'} 
                    additionalClassNames={'w-100 mb-2 max-w-350'}
                  />
                </Col>
                <Col 
                  xs={{ span: 24, offset: 0 }} 
                  sm={{ span: 24, offset: 0 }} 
                  md={{ span: 24, offset: 0 }} 
                  lg={{ span: 24, offset: 0 }} 
                  xl={{ span: 16, offset: 0 }} 
                >
                  <div className="font-bold mb-1 font-20 mt-minus-6">
                    MTSS: Share the core vision.
                  </div>
                  <div>
                    The reason MTSS turns into a MESS is that we 
                    ignore its most foundational principle. Help 
                    everyone understand that 80% of our students 
                    must be responding to core WITHOUT intervention. 
                    Try not to stress about putting all your students 
                    into tiers. Work on tier one learning plans 
                    using universal design for learning strategies 
                    and measure the response in a few classrooms 
                    or a grade level.
                  </div>
                </Col>
              </Row>
           </div>
         
      </div>
      </div>
    )
  }
}