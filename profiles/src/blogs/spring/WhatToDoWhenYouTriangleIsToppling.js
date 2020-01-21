import React, { Component } from 'react'
import '../../styles/GlobalStyle.css'
import { Helmet } from "react-helmet"
import { Row, Col } from 'antd'

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
            <title>What to Do When Your Triangle is Toppling</title>
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
                What to Do When Your Triangle is Toppling
              </div>
              <div className="mb-2 font-16 text-muted">
                Published on 3/23/2019
              </div>
              <Row className="mt-4">
                <Col span={8}>
                  <img 
                    height={200}
                    src={'/what-to-do-when-your-triangle-is-toppling-images/image3.png'} 
                    alt={'img'}
                  />
                </Col>
                <Col span={16}>
                  <div>
                    As we meet new people in the field, the results 
                    from the last benchmarks hit like a lightning 
                    bolt of clarity.  Now is the time of year 
                    when the truth is coming to light. Too many 
                    students are tumbling into Tier 3. Way too few are 
                    not growing as our new friends had hoped. It feels 
                    like a disaster. 
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <div className="font-bold mt-4 mb-2">
                    Face Reality.
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <div className="">
                    It is very hard to admit that your students’ 
                    experiences are being grown in some infertile 
                    soil. Low expectations, assignments that 
                    do not align to standards, too much time in 
                    weak instruction, and lack of engagement make
                     a rocky start to a high quality core. 
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <div className="mt-2">
                    It can be very confusing and disheartening to
                     realize your instruction is based on some 
                     false premises. You are not alone. MTSS was 
                     never meant to be a pathway to special education, 
                     but lots of people still perceive it that way. 
                     Lots of people imagined that pulling kids out 
                     of core and teaching them off grade level skills 
                     would close the gap. Lots of people ignored 
                     the core and jumped straight into intervention. 
                     Lots of people omitted classroom assignments 
                     and assessments from the conversation in favor 
                     of research based tools and tests. We did this 
                     ourselves and we learned the hard way, too. Face 
                     the reality that some things will have to go. 
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <div className="font-bold mt-4 mb-2">
                    Find Fertile Ground.
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <div className="mt-1 mb-4">
                    So now what? We have found that the best 
                    way forward is to hover about the wreckage 
                    and look for potential. Find what’s working 
                    and imagine how you might refocus.  Change 
                    is hard, but it doesn’t have to be all that 
                    painful. Build trust in the higher purpose 
                    of access for ALL. Begin breaking up old 
                    ways of thinking and find fertile ground 
                    for new growth.  As you collaborate about 
                    instruction, begin to look for 4 key success 
                    indicators in your teaching staff. Your goal 
                    is to find exemplars of success indicators 
                    to build upon for next year. By finding 
                    exemplars in your building, you will be 
                    able to make a plan of how to replicate 
                    these key success indicators in the future. 
                  </div>
                </Col>
              </Row>
              <Row>
              <Col span={10}>
                  <img 
                    height={500}
                    src={'/what-to-do-when-your-triangle-is-toppling-images/image2.png'} 
                    alt={'img'}
                  />
                </Col>
                <Col span={14}>
                  <div className="mt-1">
                    One key success indicator to look for 
                    is access to prior knowledge before 
                    teaching.  Are we asking the students 
                    to think about what they know about a 
                    topic before teaching the topic? Are we 
                    documenting students’ thinking?
                  </div>
                  <div className="mt-2">
                    Another key success indicator is 
                    giving students multiple ways to 
                    show their understanding of the 
                    lesson objective. Some examples for 
                    students demonstrating understanding 
                    are: make a poster, create a timeline, 
                    and think of test questions with a 
                    matching answer key. 
                  </div>
                  <div className="mt-2">
                    Thirdly, look for use of types of graphic organizers. 
                    These can include: concept maps, compare and 
                    contrast Venn diagrams, and story maps. 
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <div className="mt-4">
                    Lastly, pay close attention to conversations with students. 
                    Are we asking eliciting questions in order to help
                     support students to explain their thinking. 
                     Types of questioning are: How do you know? 
                     Can you describe your reasoning? Where will 
                     you use this information? By finding your 
                     exemplary performers now, you will  be able 
                     to think about how you can cultivate these 
                     key success indicators in the future.
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <div className="font-bold mt-4 mb-4">
                    Let the Sun Shine on the Standards.
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <img 
                    height={200}
                    src={'/what-to-do-when-your-triangle-is-toppling-images/image4.png'} 
                    alt={'img'}
                  />
                </Col>
                <Col span={16}>
                  <div className="mt-1">
                  Thank you friends who are using
                  <img 
                    height={32}
                    src={'/what-to-do-when-your-triangle-is-toppling-images/image5.png'} 
                    alt={'img'}
                    className="ml-1 mr-1 va-minus-3"
                  />
                  to shed light on standards based 
                  instruction for all.  Together we are 
                  fostering illuminating conversations 
                  that strengthen the core. Everyday we 
                  are experiencing clarity, success, 
                  abundance and happiness in learning 
                  environments with amazing educators 
                  and the students they love. 
                  <img 
                    height={24}
                    src={'/what-to-do-when-your-triangle-is-toppling-images/image1.jpg'} 
                    alt={'img'}
                    className="ml-1 mr-1 va-minus-3"
                  />
                  </div>
                </Col>
              </Row>
           </div>
         
      </div>
      </div>
    )
  }
}