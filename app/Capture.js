import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import styles from './styles.css';
import bootstrap from './bootstrap/css/bootstrap.css';


class Capture extends Component {
  constructor(props) {
    super(props);

    this.state = {
      constraints: { audio: false, video: { width: 400, height: 300 } }
    };

    this.handleStartClick = this.handleStartClick.bind(this);
    this.takePicture = this.takePicture.bind(this);
    this.clearPhoto = this.clearPhoto.bind(this);
  };

  componentDidMount() {
    const constraints = this.state.constraints;
    const getUserMedia = (params) => (
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

    this.clearPhoto();
  };

  clearPhoto() {
    const canvas = document.querySelector('canvas');
    const photo = document.getElementById('photo');
    const context = canvas.getContext('2d');
    const { width, height } = this.state.constraints.video;
    context.fillStyle = '#FFF';
    context.fillRect(0, 0, width, height);

    const data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);

  }

  handleStartClick(event) {
    event.preventDefault();
    this.takePicture();
  }

  takePicture() {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    const video = document.querySelector('video');
    const photo = document.getElementById('photo');
    const { width, height } = this.state.constraints.video;

    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    const data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }

  render() {
    return (
        <div className={ styles.capture }>
        <Camera handleStartClick={ this.handleStartClick } />
        <canvas id="canvas" className={ styles.picSize } hidden></canvas>
        <Photo />
        </div>
    );
  }
}

const Camera = (props) => (
    <div className="camera" className={ styles.box }>
    <video id="video" className={ styles.picSize }></video>
    <button type="button" className= {bootstrap.btn + ' ' + bootstrap['btn-primary']} >Primary</button>
    <a id="startButton" onClick={ props.handleStartClick } className={ styles.button }>
    Take photo
    </a>
    </div>
);

const Photo = (props) => (
    <div className="output" className={ styles.box }>
    <img id="photo" alt="Your photo" className={ styles.picSize }/>
    <a id="saveButton" onClick={ props.handleSaveClick } className={ styles.button }>
      Save Photo
    </a>
    </div>
);

export default Capture;
