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

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  onMouseDown(event) {
    const percent = this.getPercent(event.clientX);
    this.props.onDragStart(percent);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove(event) {
    const percent = this.getPercent(event.clientX);
    this.props.onDrag(percent);
  }

  onMouseUp(event) {
    const percent = this.getPercent(event.clientX);
    this.props.onDragEnd(percent);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  getPercent(clientX) {
    let offsetLeft = 0;
    let node = this.wrapper;
    while (node) {
      offsetLeft += node.offsetLeft;
      node = node.offsetParent;
    }

    const percent = (clientX - offsetLeft) / this.wrapper.offsetWidth;
    if (percent > 1) {
      return 1;
    } else if (percent < 0) {
      return 0;
    }

    return percent;
  }

  render() {
    return (
      <Wrapper
        innerRef={node => {
          this.wrapper = node;
        }}
        onMouseDown={this.onMouseDown}
      >
        <InnerWrapper>
          <Bar style={{transform: `scaleX(${this.props.percentPlayed})`}} />
        </InnerWrapper>
      </Wrapper>
    );
  }
}

PlayBar.propTypes = {
  onDrag: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  percentPlayed: PropTypes.number.isRequired
};

export default PlayBar;
