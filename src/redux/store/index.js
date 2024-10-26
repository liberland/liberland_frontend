import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers';
import rootSaga from '../sagas';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  // Redux devtools extension crashes when redux is storing thirdweb API results since they contain bigint.
  // This block will not execute unless you're a dev with the correct extension
  // Adds serialization for bigint types and prevents crash
  window.BigInt.prototype.toJSON = function toJSON() { return this.toString(); };
}

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware)),
);

sagaMiddleware.run(rootSaga);

export default store;
