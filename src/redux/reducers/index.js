import { combineReducers } from 'redux';
import userReducer from './user';
import errorsReducer from './errors';
import walletReducer from './wallet';
import assemblyReducer from './assembly';
import votingReducer from './voting';
import lawReducer from './law';
import blockchainReducer from './blockchain';
import democracyReducer from './democracy';

const rootReducer = combineReducers({
  user: userReducer,
  errors: errorsReducer,
  wallet: walletReducer,
  assembly: assemblyReducer,
  voting: votingReducer,
  law: lawReducer,
  blockchain: blockchainReducer,
  democracy: democracyReducer,
});

export default rootReducer;
