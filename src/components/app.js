import React, {Component} from 'react';
import glamorous from 'glamorous';
import {KEY_PERIOD, KEY_SPACE} from 'keycode-js';
import {Howl} from 'howler';
import {triangle} from 'polished';

import PlayBar from './play-bar';
import carryOn from '../audio/carry-on.mp3';

const Player = glamorous.div({
  userSelect: 'none'
});

const PlayBarWrapper = glamorous.div({
  position: 'relative'
});

const Marker = glamorous.div({
  ...triangle({
    pointingDirection: 'top',
    width: 8,
    height: 8,
    foregroundColor: 'black'
  }),
  position: 'absolute',
  transform: 'translateX(-50%)'
});

const hot2 =
  '{"25.387413":"Besides","25.51412":"the","25.650221":"fact","25.786238":"a","26.098068":"n***a","26.346295":"never","26.491243":"been","26.74616":"as","27.081993":"swank","27.314045":"as","27.443488":"me","27.954447":"I","28.114071":"like","28.323824":"that","28.693904":"Until","28.818163":"I","28.977861":"shine","29.153994":"I","29.361932":"sit","29.570212":"patiently,","30.578036":"so","30.746084":"light","31.138373":"that","31.312367":"I’m","31.432432":"folding","31.625675":"back","31.760503":"scroll","32.093051":"a","32.291784":"pack","32.41792":"and","32.728264":"roll","33.032759":"a","33.323799":"fatty","33.459245":"smokes","33.600589":"heavy","34.136714":"Not","34.353108":"even","34.496216":"over","34.72824":"mad","35.064524":"I’m","35.337018":"thinking","35.464118":"what","35.680497":"they","35.817911":"probably","36.032609":"should","36.32835":"have","36.553082":"did","36.696505":"before","36.909098":"him"}';

class App extends Component {
  constructor(props) {
    super(props);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onPlayBarDragStart = this.onPlayBarDragStart.bind(this);
    this.onPlayBarDrag = this.onPlayBarDrag.bind(this);
    this.onPlayBarDragEnd = this.onPlayBarDragEnd.bind(this);
    this.playPause = this.playPause.bind(this);
    this.updateTime = this.updateTime.bind(this);

    const bars =
      'I’m on my girls and soaring foreign under them heels It ain’t about the Ralph though tell your horse chill';
    this.state = {
      currentTime: 0,
      dragging: false,
      duration: 0,
      loaded: false,
      playing: false,
      markedWords: JSON.parse(hot2),
      unmarkedWords: bars.split(' '),
      selectedWord: null
    };
  }

  componentWillMount() {
    this.audio = new Howl({
      src: [carryOn],
      onload: this.onLoad,
      onpause: this.onPause,
      onplay: this.onPlay
    });
  }

  onKeyDown(event) {
    switch (event.keyCode) {
      case KEY_SPACE:
        event.preventDefault();
        this.playPause();
        break;
      case KEY_PERIOD:
        this.markWord();
        break;
      default:
        break;
    }
  }

  onLoad() {
    window.addEventListener('keydown', this.onKeyDown);
    this.setState({
      loaded: true,
      duration: this.audio.duration()
    });
  }

  onPause() {
    this.setState({playing: false});
  }

  onPlay() {
    this.setState({playing: true});
    requestAnimationFrame(this.updateTime);
  }

  onPlayBarDragStart(percent) {
    this.setState({
      currentTime: this.audio.duration() * percent,
      dragging: true
    });
  }

  onPlayBarDrag(percent) {
    this.setState({currentTime: this.audio.duration() * percent});
  }

  onPlayBarDragEnd(percent) {
    const currentTime = this.audio.duration() * percent;
    this.audio.seek(currentTime);
    this.setState(
      {
        currentTime,
        dragging: false
      },
      this.updateTime
    );
  }

  playPause() {
    if (this.audio.playing()) {
      this.audio.pause();
      return;
    }

    this.audio.play();
  }

  updateTime() {
    if (!this.state.dragging) {
      this.setState({currentTime: this.audio.seek()});
      if (this.audio.playing()) {
        requestAnimationFrame(this.updateTime);
      }
    }
  }

  markWord() {
    this.setState(prevState => ({
      markedWords: {
        ...prevState.markedWords,
        [this.audio.seek()]: prevState.unmarkedWords[0]
      },
      unmarkedWords: prevState.unmarkedWords.slice(1)
    }));
  }

  selectWord(mark) {
    const currentTime = parseFloat(mark);
    this.audio.seek(currentTime);
    this.setState({
      currentTime,
      selectedWord: currentTime
    });
  }

  render() {
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
        <PlayBarWrapper>
          <PlayBar
            onDrag={this.onPlayBarDrag}
            onDragEnd={this.onPlayBarDragEnd}
            onDragStart={this.onPlayBarDragStart}
            percentPlayed={this.state.currentTime / this.state.duration}
          />
          {this.state.selectedWord !== null && (
            <Marker
              style={{
                left: `${this.state.selectedWord / this.state.duration * 100}%`
              }}
            />
          )}
        </PlayBarWrapper>
        <div>{this.state.currentTime}</div>
        <div>{this.state.duration}</div>
        <p style={{width: 420, lineHeight: 1.5}}>
          {marks.map(mark => [
            <a key={mark} onClick={() => this.selectWord(mark)}>
              {this.state.markedWords[mark]}
            </a>,
            ' '
          ])}
        </p>
        {/* <textarea readOnly value={JSON.stringify(this.state.markedWords)} /> */}
        <h3>Unmarked</h3>
        <ul>
          {this.state.unmarkedWords.map((unmarkedWord, index) => (
            <li key={index.toString()}>{unmarkedWord}</li>
          ))}
        </ul>
      </Player>
    );
  }
}

export default App;
