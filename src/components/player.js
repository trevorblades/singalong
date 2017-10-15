import PropTypes from 'prop-types';
import React, {Component} from 'react';
import clockTime from 'clock-time';
import glamorous from 'glamorous';
import {KEY_PERIOD, KEY_SPACE} from 'keycode-js';
import {Howl} from 'howler';
import {size, triangle} from 'polished';

import PlayBar from './play-bar';
import {PADDING_SMALL, PADDING_SMALLER} from '../variables';

const Wrapper = glamorous.div({
  userSelect: 'none'
});

const PlayControls = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  position: 'relative'
});

const Time = glamorous.div({
  flexShrink: 0
});

const PlayButton = glamorous.a({
  flexShrink: 0,
  ...size(36),
  borderRadius: '50%',
  marginRight: PADDING_SMALL,
  border: '2px solid black'
});

const PlayBarWrapper = glamorous.div({
  flexGrow: 1,
  margin: `0 ${PADDING_SMALLER}px`,
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

const Verse = glamorous.div({});
const Line = glamorous.div({});
const Word = glamorous.span({});

class Player extends Component {
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

    this.state = {
      currentTime: 0,
      dragging: false,
      duration: 0,
      loaded: false,
      playing: false,
      selectedWord: null
    };
  }

  componentWillMount() {
    this.audio = new Howl({
      src: [this.props.src],
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
        this.tagWord();
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

  tagWord() {
    console.log(this.audio.seek());
  }

  selectWord(time) {
    this.audio.seek(time);
    this.setState({
      currentTime: time,
      selectedWord: time
    });
  }

  renderPlayControls() {
    return (
      <PlayControls>
        <PlayButton onClick={this.playPause}>
          {this.state.playing ? 'Pause' : 'Play'}
        </PlayButton>
        <Time>{clockTime(this.state.currentTime * 1000)}</Time>
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
        <Time>{clockTime(this.state.duration * 1000)}</Time>
      </PlayControls>
    );
  }

  renderLine(line) {
    return line.map((word, index) => {
      const isTagged = Array.isArray(word);
      return (
        <Word
          key={index.toString()}
          onClick={isTagged ? () => this.selectWord(word[1]) : null}
        >
          {isTagged ? word[0] : word}
        </Word>
      );
    });
  }

  renderVerse(verse) {
    return verse.map((line, index) => (
      <Line key={index.toString()}>{this.renderLine(line)}</Line>
    ));
  }

  renderLyrics() {
    return (
      <div>
        {this.props.lyrics.map((verse, index) => (
          <Verse key={index.toString()}>{this.renderVerse(verse)}</Verse>
        ))}
      </div>
    );
  }

  render() {
    if (!this.state.loaded) {
      return 'Loading...';
    }

    return (
      <Wrapper>
        {this.renderPlayControls()}
        {this.renderLyrics()}
      </Wrapper>
    );
  }
}

Player.propTypes = {
  lyrics: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(
          PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        )
      ])
    )
  ).isRequired,
  src: PropTypes.string.isRequired
};

export default Player;
