import React from 'react';

// import Player from '../../components/player';
import Editor from '../../components/editor';
import lyrics from './lyrics.json';
import songUrl from './song.mp3';

const CarryOn = () => <Editor lyrics={lyrics} src={songUrl} />;

export default CarryOn;
