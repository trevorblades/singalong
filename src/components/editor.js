import PropTypes from 'prop-types';
import React, {Component} from 'react';
import glamorous from 'glamorous';
import {KEY_PERIOD} from 'keycode-js';
import {size} from 'polished';

import Player from './player';
import lyricsPropType from '../util/lyrics-prop-type';
import {
  FormattedTextArea,
  goodCharactersPattern,
  stringifyLyrics
} from '../pages/format';

const Wrapper = glamorous.div({
  display: 'flex',
  ...size('100%'),
  position: 'absolute',
  top: 0,
  left: 0
});

class Editor extends Component {
  constructor(props) {
    super(props);

    this.onPlayerLoad = this.onPlayerLoad.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.state = {
      lyrics: props.lyrics,
      formatted: stringifyLyrics(props.lyrics)
    };
  }

  onPlayerLoad() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  onKeyDown() {
    if (event.keyCode === KEY_PERIOD) {
      this.tagWord();
    }
  }

  tagWord() {
    const time = this.player.getCurrentTime();
    for (
      let verseIndex = 0;
      verseIndex < this.state.lyrics.length;
      verseIndex++
    ) {
      const verse = this.state.lyrics[verseIndex];
      for (let lineIndex = 0; lineIndex < verse.length; lineIndex++) {
        const line = verse[lineIndex];
        for (let wordIndex = 0; wordIndex < line.length; wordIndex++) {
          const word = line[wordIndex];
          if (!Array.isArray(word) && goodCharactersPattern.test(word)) {
            this.setState(prevState => {
              const lyrics = [
                ...prevState.lyrics.slice(0, verseIndex),
                [
                  ...verse.slice(0, lineIndex),
                  [
                    ...line.slice(0, wordIndex),
                    [word, time],
                    ...line.slice(wordIndex + 1)
                  ],
                  ...verse.slice(lineIndex + 1)
                ],
                ...prevState.lyrics.slice(verseIndex + 1)
              ];

              return {
                lyrics,
                formatted: stringifyLyrics(lyrics)
              };
            });
            return;
          }
        }
      }
    }
  }

  render() {
    return (
      <Wrapper>
        <Player
          lyrics={this.state.lyrics}
          onLoad={this.onPlayerLoad}
          ref={node => {
            this.player = node;
          }}
          src={this.props.src}
        />
        <FormattedTextArea readOnly value={this.state.formatted} />
      </Wrapper>
    );
  }
}

Editor.propTypes = {
  lyrics: lyricsPropType.isRequired,
  src: PropTypes.string.isRequired
};

export default Editor;
