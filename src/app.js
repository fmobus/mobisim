import React from 'react';
import ReactDOM from 'react-dom';

import configureStore from './store/configureStore';
import MobiliReact from './components/MobiliReact';

const store = configureStore(window.__INITIAL_STATE__)

ReactDOM.render(<MobiliReact store={store} />, document.getElementById('container'));
