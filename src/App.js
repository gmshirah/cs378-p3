import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image'
import InputGroup from 'react-bootstrap/InputGroup';
import Pagination from 'react-bootstrap/Pagination';
import Row from 'react-bootstrap/Row';

async function fetchAPIData(url) {
  return await axios({
    url: url,
    method: 'get'
  })
}

function App() {
  const [page, setPage] = useState();
  const [pageurl, setPageurl] = useState('https://dogapi.dog/api/v2/breeds');
  const [searchValue, setSearchValue] = useState("");
  const [searchError, setSearchError] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const [searchImage, setSearchImage] = useState([]);
  const [dogImage, setDogImage] = useState([]);
  const [fetchDogImage, setFetchDogImage] = useState(false);
  const [dogFact, setDogFact] = useState([]);
  const [fetchDogFact, setFetchDogFact] = useState(false);
  const [breedInfo, setBreedInfo] = useState([]);

  useEffect(() => {
    console.log("Fetching breed info...");
    setBreedInfo([]);
    async function getData() {
      const res = await fetchAPIData(pageurl);
      setBreedInfo(res.data);
      const pageString = res.data.links.current;
      const parsedStrings = pageString.split("=");
      setPage(parsedStrings[1]);
    }
    getData();
  }, [pageurl]);

  useEffect(() => {
    console.log("Fetching random image...");
    async function getData() {
      const res = await fetchAPIData('https://dog.ceo/api/breeds/image/random');
      setDogImage(res.data);
    }
    getData();
  }, [fetchDogImage]);

  useEffect(() => {
    console.log("Fetching random fact...");
    async function getData() {
      const res = await fetchAPIData('https://dogapi.dog/api/v2/facts');
      setDogFact(res.data.data[0]);
    }
    getData();
  }, [fetchDogFact]);

  const onSearchInput = ({target:{value}}) => setSearchValue(value);

  const onSearchSubmit = e => {
    e.preventDefault();
    console.log("Fetching " + searchValue + " image...");
    let breed = searchValue;
    breed = breed.toLowerCase();
    let breedArray = breed.split(" ");
    let url = 'https://dog.ceo/api/breed/';
    if (breedArray.length > 1) {
      url = url + breedArray[1] + '/';
    }
    url = url + breedArray[0] + '/';
    url = url + 'images/random';
    async function getData() {
      try {
        const res = await fetchAPIData(url);
        setSearchImage(res.data);
        breed = "";
        for (let i = 0; i < breedArray.length; i++) {
          if (i > 0) {
            breed = breed + " ";
          }
          breed = breed + breedArray[i].substring(0, 1).toUpperCase() + breedArray[i].substring(1).toLowerCase();
        }
        setSearchValue(breed);
      } catch (err) {
        console.log(searchImage);
        setSearchError(true);
      }
    }
    getData();
    setShowSearch(true);
  }

  if (showSearch) {
    if (searchError) {
      return (
        <Alert variant="danger" onClose={() => {setShowSearch(false); setSearchValue(""); setSearchError(false);}} dismissible>
          <Alert.Heading>Invalid Search</Alert.Heading>
          <p>Oh, no! We couldn't find any images of "{searchValue}". Please close this alert and try again.</p>
        </Alert>
      );
    } else {
      return (
        <Alert variant="secondary" onClose={() => {setShowSearch(false); setSearchValue("");}} dismissible>
          <Alert.Heading>{searchValue}</Alert.Heading>
          <Image rounded src={searchImage.message} />
          <Button variant="secondary" onClick={onSearchSubmit}>Another One!</Button>
        </Alert>
      );
    }
  }

  if (showImage) {
    return (
      <Alert variant="secondary" onClose={() => {setShowImage(false); setFetchDogImage(!fetchDogImage);}} dismissible>
        <Alert.Heading>Random Image</Alert.Heading>
        <Image rounded src={dogImage.message} />
        <Button variant="secondary" onClick={() => setFetchDogImage(!fetchDogImage)}>Another One!</Button>
      </Alert>
    );
  }

  if (showFact) {
    return (
      <Alert variant="secondary" onClose={() => {setShowFact(false); setFetchDogFact(!fetchDogFact);}} dismissible>
        <Alert.Heading>Random Fact</Alert.Heading>
        <p>{dogFact.attributes.body}</p>
        <Button variant="secondary" onClick={() => setFetchDogFact(!fetchDogFact)}>Another One!</Button>
      </Alert>
    );
  }

  return (
    <div className="App">
      <div className="HeadBlock">
        <Form onSubmit={onSearchSubmit}>
          <InputGroup>
            <Form.Control type="text" placeholder="Search images by breed..." onChange={onSearchInput} value={searchValue} />
            <Button variant="outline-secondary" id="searchBtn" type="submit">
              <span className="material-symbols-outlined">
                search
              </span>
            </Button>
          </InputGroup>
        </Form>
        <Row>
          <Col id="randImgBtnCol">
            <Button variant="secondary" onClick={() => setShowImage(true)}>Random Image</Button>
          </Col>
          <Col id="randFactBtnCol">
            <Button variant="secondary" onClick={() => setShowFact(true)}>Random Fact</Button>
          </Col>
        </Row>
      </div>

      { breedInfo.data ? (
        <div>
          <Accordion defaultActiveKey={breedInfo.data[0].id} flush>
          {breedInfo.data.map(breed => (
            <Accordion.Item key={breed.id} eventKey={breed.id}>
              <Accordion.Header>{breed.attributes.name}</Accordion.Header>
              <Accordion.Body>
                <p><b>About</b></p>
                <p>{breed.attributes.description}</p>
                <p><b>Life Expectancy</b></p>
                <p>{breed.attributes.life.min} - {breed.attributes.life.max} years</p>
                <p><b>Male Weight</b></p>
                <p>{breed.attributes.male_weight.min} - {breed.attributes.male_weight.max} lbs</p>
                <p><b>Female Weight</b></p>
                <p>{breed.attributes.female_weight.min} - {breed.attributes.female_weight.max} lbs</p>
                <p><b>Hypoallergenic?</b></p>
                { breed.attributes.hypoallergenic ? ( <p>Yes</p> ) : ( <p>No</p> )}
              </Accordion.Body>
            </Accordion.Item>
          ))}
          </Accordion>

          <Pagination>
            { breedInfo.links.first ? ( <Pagination.First onClick={() => setPageurl(breedInfo.links.first)} /> ) : ( <Pagination.First disabled /> )}
            { breedInfo.links.prev ? ( <Pagination.Prev onClick={() => setPageurl(breedInfo.links.prev)} /> ) : ( <Pagination.Prev disabled /> )}
            <Pagination.Item active>{page}</Pagination.Item>
            { breedInfo.links.next ? ( <Pagination.Next onClick={() => setPageurl(breedInfo.links.next)} /> ) : ( <Pagination.Next disabled /> )}
            { breedInfo.links.last ? ( <Pagination.Last onClick={() => setPageurl(breedInfo.links.last)} /> ) : ( <Pagination.Last disabled /> )}
          </Pagination>
        </div>
      ) : (
        <span></span>
      )}
    </div>
  );
}

export default App;
