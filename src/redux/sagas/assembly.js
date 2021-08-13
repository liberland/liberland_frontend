import { put, takeLatest, call } from 'redux-saga/effects';

import { assemblyActions } from '../actions';

import api from '../../api';

// WORKERS
function* addMyDraftWorker(action) {
  try {
    const { pdfFile } = action.payload;
    // eslint-disable-next-line no-console
    console.log('pdfFile', pdfFile);
    const sendsData = new FormData();
    yield sendsData.append('pdffile', pdfFile);
    const { data: { textFromPdf } } = yield call(api.post, 'assembly/add_new_draft', sendsData, { headers: { 'Content-Type': 'multipart/form-data' } });
    yield put(assemblyActions.addMyDraft.success);
    // eslint-disable-next-line no-console
    console.log('textFromPdf', textFromPdf);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('e', e);
    yield put(assemblyActions.addMyDraft.failure(e));
  }
}

// WATCHERS

function* addMyDraftWatcher() {
  try {
    yield takeLatest(assemblyActions.addMyDraft.call, addMyDraftWorker);
  } catch (e) {
    yield put(assemblyActions.addMyDraft.failure(e));
  }
}

export {
  addMyDraftWatcher,
  addMyDraftWorker,
};
