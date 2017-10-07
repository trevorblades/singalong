import React, {Component} from 'react';

import PlayBar from './play-bar';
import carryOn from '../audio/carry-on.mp3';

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

  render() {
    return (
      <div>
        <audio
          onLoadedData={this.onLoadedData}
          onPause={this.onPause}
          onPlaying={this.onPlaying}
          src={carryOn}
        />
        {this.state.loaded && (
          <div>
            <a onClick={this.playPause}>
              {this.state.playing ? 'Pause' : 'Play'}
            </a>
            <div>
              <PlayBar
                onClick={this.onPlayBarClick}
                percentPlayed={this.state.currentTime / this.state.duration}
              />
            </div>
            <div>{this.state.currentTime}</div>
            <div>{this.state.duration}</div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
