import PropTypes from 'prop-types';
import React, {Component} from 'react';
import glamorous from 'glamorous';

import {PADDING_SMALLEST} from '../variables';

const Wrapper = glamorous.div({
  padding: `${PADDING_SMALLEST}px 0`,
  cursor: 'pointer'
});

const InnerWrapper = glamorous.div({
  backgroundColor: 'gray',
  pointerEvents: 'none'
});

const Bar = glamorous.div({
  height: 4,
  backgroundColor: 'red',
  transformOrigin: 'left'
});

class PlayBar extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    const percent =
      (event.clientX - event.target.offsetLeft) / event.target.offsetWidth;
    this.props.onClick(percent);
  }

  render() {
    return (
      <Wrapper onClick={this.onClick}>
        <InnerWrapper>
          <Bar style={{transform: `scaleX(${this.props.percentPlayed})`}} />
        </InnerWrapper>
      </Wrapper>
    );
  }
}

PlayBar.propTypes = {
  onClick: PropTypes.func.isRequired,
  percentPlayed: PropTypes.number.isRequired
};

export default PlayBar;
