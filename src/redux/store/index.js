import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers';
import rootSaga from '../sagas';
import { bridgeTransfersLocalStorageMiddleware, initBridgeTransfersStore } from './localStorage';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  initBridgeTransfersStore(),
  composeEnhancers(applyMiddleware(sagaMiddleware, bridgeTransfersLocalStorageMiddleware)),
);

sagaMiddleware.run(rootSaga);

/* api.interceptors.response.use(null, (error) => {
  if (error.response.status === 401) {
    store.dispatch(authActions.signOut.call());
  }

  return Promise.reject(error);
}); */

export default store;
