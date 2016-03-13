import React from 'react';

import { Provider } from 'react-redux'
import DevTools from './DevTools'
import Map from './Map'

export default function ({store}) {
  return (
    <Provider store={store}>
      <div>
        <Map/>
        {/dev/.test(process.env.NODE_ENV) && (
          <div className='devtools'>
            <DevTools />
          </div>
        )}
      </div>
    </Provider>
  )
}
