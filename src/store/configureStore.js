import { applyMiddleware, compose, createStore } from 'redux'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'
import DevTools from '../components/DevTools'

export default function configureStore(initialState, history) {
  const logger = createLogger()

  const createStoreWithMiddleware = compose(
//    applyMiddleware(logger),
    DevTools.instrument()
  )(createStore)

  const store = createStoreWithMiddleware(rootReducer, initialState)

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
