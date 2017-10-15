import React from 'react';

import Player from '../../components/player';
import lyrics from './lyrics.json';
import songUrl from './song.mp3';

const CarryOn = () => <Player lyrics={lyrics} src={songUrl} />;

export default CarryOn;
