import React, {Component} from 'react';

import PlayBar from './play-bar';
import carryOn from '../audio/carry-on.mp3';

const words = {
  0: 'yo',
  2: 'hi',
  2.552: 'hello',
  6.3333: 'statik'
};

const wordKeys = Object.keys(words)
  .map(Number)
  .sort();

class App extends Component {
  constructor(props) {
    super(props);

    this.onLoadedData = this.onLoadedData.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onPlaying = this.onPlaying.bind(this);
    this.onPlayBarClick = this.onPlayBarClick.bind(this);
    this.playPause = this.playPause.bind(this);
    this.updateTime = this.updateTime.bind(this);

    this.state = {
      currentTime: 0,
      duration: 0,
      loaded: false,
      playing: false
    };
  }

  onLoadedData(event) {
    this.audio = event.target;
    this.setState({
      loaded: true,
      duration: event.target.duration
    });
  }

  onPause() {
    this.setState({playing: false});
  }

  onPlaying() {
    this.setState({playing: true});
    requestAnimationFrame(this.updateTime);
  }

  onPlayBarClick(percent) {
    // TODO: replace with lodash/round
    const precision = 6; // decimal places to round the number to
    const factor = 10 ** precision;
    const nextTime =
      Math.round(this.audio.duration * percent * factor) / factor;
    this.audio.currentTime = nextTime;
    this.setState({currentTime: nextTime});
  }

  playPause() {
    if (!this.audio.paused) {
      this.audio.pause();
      return;
    }

    this.audio.play();
  }

  updateTime() {
    this.setState({currentTime: this.audio.currentTime});
    if (!this.audio.paused) {
      requestAnimationFrame(this.updateTime);
    }
  }

  renderPlayer() {
    if (!this.state.loaded) {
      return 'Loading...';
    }

    let key = wordKeys[0];
    for (let i = 0; i < wordKeys.length; i++) {
      const wordKey = wordKeys[i];
      if (this.state.currentTime < wordKey) {
        break;
      }
      key = wordKey;
    }

    return (
      <div>
        <div>{words[key]}</div>
        <a onClick={this.playPause}>{this.state.playing ? 'Pause' : 'Play'}</a>
        <div>
          <PlayBar
            onClick={this.onPlayBarClick}
            percentPlayed={this.state.currentTime / this.state.duration}
          />
        </div>
        <div>{this.state.currentTime}</div>
        <div>{this.state.duration}</div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <audio
          onLoadedData={this.onLoadedData}
          onPause={this.onPause}
          onPlaying={this.onPlaying}
          src={carryOn}
        />
        {this.renderPlayer()}
      </div>
    );
  }
}

export default App;
