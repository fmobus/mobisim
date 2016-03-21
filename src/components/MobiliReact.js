import React from 'react';

import { Provider } from 'react-redux'

import DevTools from './DevTools'
import Map from './Map'

const MobiliReact = function ({store}) {
  let containerStyles = { width: '100%', height: '100%', position: 'fixed', margin: 0 };

  return (
    <Provider store={store}>
      <div style={containerStyles}>
        <Map />
        {/dev/.test(process.env.NODE_ENV) && (
          <div className='devtools'>
            <DevTools />
          </div>
        )}
      </div>
    </Provider>
  )
}

export default (MobiliReact)
