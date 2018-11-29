import React from 'react';
import ReactDOM from 'react-dom';

import App from './App.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

const renderApp = () => {
	ReactDOM.render(<App />, document.getElementById('app'));
}


document.addEventListener('DOMContentLoaded', () => renderApp());