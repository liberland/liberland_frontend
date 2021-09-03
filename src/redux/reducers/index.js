import { combineReducers } from 'redux';
import userReducer from './user';
import errorsReducer from './errors';
import walletReducer from './wallet';
import assemblyReducer from './assembly';

const rootReducer = combineReducers({
  user: userReducer,
  errors: errorsReducer,
  wallet: walletReducer,
  assembly: assemblyReducer,
});

export default rootReducer;
