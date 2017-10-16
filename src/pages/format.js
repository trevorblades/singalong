import React, {Component} from 'react';
import glamorous from 'glamorous';
import {size} from 'polished';

const Wrapper = glamorous.div({
  display: 'flex',
  ...size('100%'),
  position: 'absolute',
  top: 0,
  left: 0
});

const TextArea = glamorous.textarea({
  width: '50%',
  height: '100%',
  resize: 'none'
});

const FormattedTextArea = glamorous(TextArea)({
  fontFamily: 'monospace',
  whiteSpace: 'pre'
});

function focusAndSelect(event) {
  event.target.focus();
  event.target.select();
}

const goodCharacters = /\w-'‘’*/;
export const goodCharactersPattern = new RegExp(`[${goodCharacters.source}]+`);
const wordsPattern = new RegExp(
  `${goodCharactersPattern.source}(?=(\\W|$))|[^${goodCharacters}\\s]`,
  'g'
);

class Format extends Component {
  constructor(props) {
    super(props);
    this.onTextChange = this.onTextChange.bind(this);
    this.state = {
      text: '',
      formatted: ''
    };
  }

  onTextChange(event) {
    const text = event.target.value;
    const verses = text
      .trim()
      .split(/\n{2,}/)
      .map(verse => {
        const lines = verse.split(/\n/);
        const words = lines.map(line => line.match(wordsPattern));
        return words.filter(Boolean);
      });
    this.setState({
      text,
      formatted: JSON.stringify(verses, null, 2)
    });
  }

  render() {
    return (
      <Wrapper>
        <TextArea onChange={this.onTextChange} value={this.state.text} />
        <FormattedTextArea
          readOnly
          onClick={focusAndSelect}
          value={this.state.formatted}
        />
      </Wrapper>
    );
  }
}

export default Format;
