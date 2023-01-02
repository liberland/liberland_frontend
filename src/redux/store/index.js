import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers';
import rootSaga from '../sagas';
// import api from '../../api';
import { authActions } from '../actions';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware)),
);

sagaMiddleware.run(rootSaga);

/* api.interceptors.response.use(null, (error) => {
  if (error.response.status === 401) {
    store.dispatch(authActions.signOut.call());
  }

  return Promise.reject(error);
}); */

export default store;
