import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor() {

    super();

    this.state = {
      className: '',
      viewUrl: ''
    };

    this._onDragEnter = this._onDragEnter.bind(this);
    this._onDragLeave = this._onDragLeave.bind(this);
    this._onDragOver = this._onDragOver.bind(this);
    this._onDrop = this._onDrop.bind(this);

  }

  componentDidMount() {
    window.addEventListener('mouseup', this._onDragLeave);
    window.addEventListener('dragenter', this._onDragEnter);
    window.addEventListener('dragover', this._onDragOver);
    window.addEventListener('drop', this._onDrop);
    document.getElementById('upload-zone').addEventListener('dragleave', this._onDragLeave);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this._onDragLeave);
    window.removeEventListener('dragenter', this._onDragEnter);
    window.addEventListener('dragover', this._onDragOver);
    document.getElementById('upload-zone').removeEventListener('dragleave', this._onDragLeave);
    window.removeEventListener('drop', this._onDrop);
  }

  _uploadFiles(files) {
    let formData = new FormData();

    for(var i = 0; i < files.length; i++) {
      formData.append("photos[" + i + "]", files[i]);
    }

    let xhr = new XMLHttpRequest();

    xhr.onload = (result) => {
      console.log(result.target.responseText);
      // const response = JSON.parse(result.target.responseText);
      // if (response.error === false) {
      //   const url = 'http://localhost:3000/'+response.folderId;
      //   this.setState({ viewUrl: url });
      // }
    };

    xhr.open('POST', '/upload', true);
    xhr.send(formData);
  }

  _onDragEnter(e) {
    this.setState({ className: 'draghover' });
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
  
  _onDragOver(e) {
    this.setState({ className: 'draghover' });
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  
  _onDragLeave(e) {
    this.setState({className: ''});
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
  
  _onDrop(e) {
    e.preventDefault();
    let files = e.dataTransfer.files;
    this._uploadFiles(files);
    console.log('Files dropped: ', files);
    // Upload files
    this.setState({className: ''});
    return false;
  }

  render() {
    return (
      <div className="App">
        <div className="outer">
          <div className="middle">
            <div className="inner">
              <div id="upload-zone" className={this.state.className}>
                <i className="fa fa-cloud-upload fa-4x"></i>
                <br />
                <p>Drop upload here</p>
                <input type="text" id="url" size="32" className="" value={this.state.viewUrl} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
