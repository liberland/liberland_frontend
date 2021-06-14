import { all } from 'redux-saga/effects';
import * as authSagas from './auth';

export default function* rootSaga() {
  yield all([
    // AUTH
    authSagas.signInWatcher(),
    authSagas.verifySessionWatcher(),
    authSagas.signOutWatcher(),
  ]);
}
