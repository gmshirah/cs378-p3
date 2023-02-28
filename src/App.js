import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image'
import Row from 'react-bootstrap/Row';

async function fetchAPIData(url) {
  return await axios({
    url: url,
    method: 'get'
  })
}

function App() {
  const [show, setShow] = useState(true);
  const [dogImage, setDogImage] = useState([]);
  const [fetchDogImage, setFetchDogImage] = useState(false);

  useEffect(() => {
    console.log("Fetching random image...");
    async function getData() {
      const res = await fetchAPIData('https://dog.ceo/api/breeds/image/random');
      setDogImage(res.data);
    }
    getData();
  }, [fetchDogImage]);


  if (show) {
    return (
      <Alert variant="secondary" onClose={() => {setShow(false); setFetchDogImage(!fetchDogImage);}} dismissible>
        <Alert.Heading>Random Image</Alert.Heading>
        <Image rounded src={dogImage.message} />
        {/* <Image rounded src="https:\/\/images.dog.ceo\/breeds\/collie-border\/n02106166_6569.jpg" /> */}
        <Button variant="secondary" onClick={() => setFetchDogImage(!fetchDogImage)}>Another One!</Button>
      </Alert>
    );
  }

  return (
    <div className="App">
      <div className="HeadBlock">
        <Form.Control type="text" placeholder="Search images by breed..." />
        <Row>
          <Col id="randImgBtnCol">
            <Button variant="secondary" onClick={() => setShow(true)}>Random Image</Button>
          </Col>
          <Col id="randFactBtnCol">
            <Button variant="secondary">Random Fact</Button>
          </Col>
        </Row>
      </div>

      <Accordion defaultActiveKey={['0']} flush>
        <Accordion.Item eventKey='0'>
          <Accordion.Header>Border Collie</Accordion.Header>
          <Accordion.Body>
            <p><b>About</b></p>
            <p>The Border Collie is a medium-sized breed of herding dog from the borders of England and Scotland. These dogs are medium in size, with a thick double coat of fur to protect them from the cold. They have an energetic and intelligent demeanor, with an instinct for herding and working. They are highly trainable and obedient, but require firm and consistent training to be obedient. They are loyal and devoted to their family, with an independent nature that makes them well suited for herding and guard work.</p>
            <p><b>Life Expectancy</b></p>
            <p>12 - 16 years</p>
            <p><b>Male Weight</b></p>
            <p>20 - 30 lbs</p>
            <p><b>Female Weight</b></p>
            <p>17 - 25 lbs</p>
            <p><b>Hypoallergenic?</b></p>
            <p>No</p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default App;
