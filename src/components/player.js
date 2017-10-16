import PropTypes from 'prop-types';
import React, {Component} from 'react';
import clockTime from 'clock-time';
import glamorous from 'glamorous';
import {KEY_SPACE} from 'keycode-js';
import {Howl} from 'howler';
import {mix, size, triangle} from 'polished';

import PlayBar from './play-bar';
import lyricsPropType from '../util/lyrics-prop-type';
import {PADDING_SMALL, PADDING_SMALLER} from '../variables';
import {goodCharactersPattern} from '../pages/format';

const Wrapper = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  userSelect: 'none',
  overflow: 'hidden'
});

const PlayControls = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  width: '100%',
  padding: PADDING_SMALL,
  backgroundColor: 'lightgray'
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

const Lyrics = glamorous.div({
  flexGrow: 1,
  overflow: 'auto'
});

const Verse = glamorous.div({
  marginBottom: '1.5em',
  fontSize: 24
});

const Line = glamorous.div({
  lineHeight: 1.5
});

function getWordColorFromProps(props) {
  if (props.active) {
    return 'red';
  } else if (props.tagged) {
    return 'black';
  }
  return 'gray';
}

const Word = glamorous.span(props => {
  const styles = {
    color: getWordColorFromProps(props)
  };

  if (!props.tagged) {
    return styles;
  }

  return {
    ...styles,
    cursor: 'pointer',
    ':hover': {
      color: mix(0.5, props.active ? 'red' : 'black', 'gray')
    }
  };
});

const specialCharactersPattern = /[,)?]/;

function isHyphen(text) {
  return text === '-';
}

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
    this.toggleRate = this.toggleRate.bind(this);

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

    if (this.props.onLoad) {
      this.props.onLoad();
    }
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

  getCurrentTime() {
    return this.audio.seek();
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

  selectWord(time) {
    this.audio.seek(time);
    this.setState({
      currentTime: time,
      selectedWord: time
    });
  }

  toggleRate() {
    const currentRate = this.audio.rate();
    this.audio.rate(currentRate === 1 ? 0.5 : 1);
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
      let onClick;
      let active = false;
      let text = word;
      const isTagged = Array.isArray(word);
      if (isTagged) {
        const time = word[1];
        text = word[0];
        active = this.state.currentTime >= time;
        onClick = this.selectWord.bind(this, time);
      }

      let needsSpace =
        !isHyphen(text) &&
        (goodCharactersPattern.test(text) ||
          specialCharactersPattern.test(text));
      const nextWord = line[index + 1];
      if (needsSpace && nextWord) {
        const nextText = Array.isArray(nextWord) ? nextWord[0] : nextWord;
        needsSpace =
          !isHyphen(nextText) && !specialCharactersPattern.test(nextText);
      }

      return (
        <Word
          active={active}
          key={index.toString()}
          onClick={onClick}
          tagged={isTagged}
        >
          {text}
          {needsSpace && ' '}
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
      <Lyrics>
        <a onClick={this.toggleRate}>Slow it down</a>
        {this.props.lyrics.map((verse, index) => (
          <Verse key={index.toString()}>{this.renderVerse(verse)}</Verse>
        ))}
      </Lyrics>
    );
  }

  render() {
    if (!this.state.loaded) {
      return 'Loading...';
    }

    return (
      <Wrapper className={this.props.className}>
        {this.renderLyrics()}
        {this.renderPlayControls()}
      </Wrapper>
    );
  }
}

Player.propTypes = {
  className: PropTypes.string.isRequired,
  lyrics: lyricsPropType.isRequired,
  onLoad: PropTypes.func,
  src: PropTypes.string.isRequired
};

export default Player;
