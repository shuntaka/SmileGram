import React, { Component } from 'react';
import { render } from 'react-dom';
import { Grid, Row, Col, Button } from 'react-bootstrap';

import Menu from './Menu';
import IPhone from './IPhone';
import Photo from './Photo';

import '../node_modules/bootstrap/scss/bootstrap.scss';
import '../devices.css/assets/scss/devices.scss';

import appStyles from './appStyles.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      constraints: { audio: false, video: { width: 400, height: 300 } },
    };

    this.handleShutterClick = this.handleShutterClick.bind(this);
    this.takePicture = this.takePicture.bind(this);
    this.clearPhoto = this.clearPhoto.bind(this);
  }

  componentDidMount() {
    const constraints = this.state.constraints;
    const getUserMedia = params => (
      new Promise((successCallback, errorCallback) => {
        navigator.webkitGetUserMedia.call(navigator, params, successCallback, errorCallback);
      })
    );

    getUserMedia(constraints)
    .then((stream) => {
      const video = document.querySelector('video');
      const vendorURL = window.URL || window.webkitURL;

      video.src = vendorURL.createObjectURL(stream);
      video.play();
    })
    .catch((err) => {
      console.log(err);
    });

      /* this.clearPhoto(); */
  }
  clearPhoto() {
    const canvas = document.querySelector('canvas');
    const photo = document.getElementById('photo');
    const photoContainer = document.getElementById('photoContainer');
    const context = canvas.getContext('2d');
    const { width, height } = this.state.constraints.video;
    context.fillStyle = '#FFF';
    context.fillRect(0, 0, width, height);

    const data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }

  takePicture() {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    const video = document.querySelector('video');
    const photo = document.getElementById('photo');
    const uploadButton = document.getElementById('uploadButton');

    const { width, height } = this.state.constraints.video;

    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    const data = canvas.toDataURL('image/png');
    this.clearPhoto();
    photo.setAttribute('src', data);
    uploadButton.removeAttribute('disabled');
  }

  handleShutterClick(event) {
    event.preventDefault();
    this.takePicture();
  }

  handleUploadClick(event) {
    event.preventDefault();
    alert('saved');
  }

  render() {
    return (
      <div className={appStyles.app}>
        <Grid className="h-100">
          <Menu />
          <Row className="justify-content-center">
            <IPhone onClick={this.handleShutterClick} />
          </Row>
          <Row className="h-45 justify-content-center align-content-center">
            <Photo onClick={this.handleUploadClick} />
          </Row>
        </Grid>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
