import React, {Component} from 'react';
import glamorous from 'glamorous';

import PlayBar from './play-bar';
import carryOn from '../audio/carry-on.mp3';

const Player = glamorous.div({
  userSelect: 'none'
});

class App extends Component {
  constructor(props) {
    super(props);

    this.onLoadedData = this.onLoadedData.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onPlaying = this.onPlaying.bind(this);
    this.onPlayBarDragStart = this.onPlayBarDragStart.bind(this);
    this.onPlayBarDrag = this.onPlayBarDrag.bind(this);
    this.onPlayBarDragEnd = this.onPlayBarDragEnd.bind(this);
    this.playPause = this.playPause.bind(this);
    this.updateTime = this.updateTime.bind(this);

    const bars =
      'Besides the fact a n***a never been as swank as me I like that Until I shine I sit patiently, so light that';
    this.state = {
      currentTime: 0,
      dragging: false,
      duration: 0,
      loaded: false,
      playing: false,
      markedWords: {},
      unmarkedWords: bars.split(' ')
    };
  }

  onLoadedData(event) {
    this.audio = event.target;
    this.setState({
      loaded: true,
      duration: event.target.duration
    });

    window.addEventListener('keydown', this.onKeyDown);
  }

  onKeyDown(event) {
    // TODO: replace with keycode-js
    switch (event.keyCode) {
      case 32:
        this.playPause();
        break;
      case 190:
        this.markWord();
        break;
      default:
        break;
    }
  }

  onPause() {
    this.setState({playing: false});
  }

  onPlaying() {
    this.setState({playing: true});
    requestAnimationFrame(this.updateTime);
  }

  onPlayBarDragStart(percent) {
    this.setState({
      currentTime: this.audio.duration * percent,
      dragging: true
    });
  }

  onPlayBarDrag(percent) {
    this.setState({currentTime: this.audio.duration * percent});
  }

  onPlayBarDragEnd(percent) {
    // TODO: replace with lodash/round
    const precision = 6; // decimal places to round the number to
    const factor = 10 ** precision;
    const nextTime =
      Math.round(this.audio.duration * percent * factor) / factor;
    this.audio.currentTime = nextTime;
    this.setState({
      currentTime: nextTime,
      dragging: false
    });
  }

  playPause() {
    if (!this.audio.paused) {
      this.audio.pause();
      return;
    }

    this.audio.play();
  }

  updateTime() {
    if (!this.state.dragging) {
      this.setState({currentTime: this.audio.currentTime});
      if (!this.audio.paused) {
        requestAnimationFrame(this.updateTime);
      }
    }
  }

  markWord() {
    this.setState(prevState => ({
      markedWords: {
        ...prevState.markedWords,
        [this.audio.currentTime]: prevState.unmarkedWords[0]
      },
      unmarkedWords: prevState.unmarkedWords.slice(1)
    }));
  }

  renderPlayer() {
    if (!this.state.loaded) {
      return 'Loading...';
    }

    let word;
    let marks = Object.keys(this.state.markedWords);
    if (marks.length) {
      marks = marks.map(Number).sort();
      for (let i = 0; i < marks.length; i++) {
        const mark = marks[i];
        if (this.state.currentTime < mark) {
          break;
        }
        word = this.state.markedWords[mark];
      }
    }

    return (
      <Player>
        <h2>{word || '--'}</h2>
        <a onClick={this.playPause}>{this.state.playing ? 'Pause' : 'Play'}</a>
        <div>
          <PlayBar
            onDrag={this.onPlayBarDrag}
            onDragEnd={this.onPlayBarDragEnd}
            onDragStart={this.onPlayBarDragStart}
            percentPlayed={this.state.currentTime / this.state.duration}
          />
        </div>
        <div>{this.state.currentTime}</div>
        <div>{this.state.duration}</div>
        <h3>Marked</h3>
        <ul>
          {marks.map(mark => (
            <li key={mark}>{`${mark}: ${this.state.markedWords[mark]}`}</li>
          ))}
        </ul>

        <h3>Unmarked</h3>
        <ul>
          {this.state.unmarkedWords.map((unmarkedWord, index) => (
            <li key={index.toString()}>{unmarkedWord}</li>
          ))}
        </ul>
      </Player>
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
