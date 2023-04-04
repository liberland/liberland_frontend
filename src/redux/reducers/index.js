import { combineReducers } from 'redux';
import userReducer from './user';
import errorsReducer from './errors';
import walletReducer from './wallet';
import assemblyReducer from './assembly';
import votingReducer from './voting';
import legislationReducer from './legislation';
import blockchainReducer from './blockchain';
import democracyReducer from './democracy';
import officesReducer from './offices';
import registriesReducer from './registries';
import identityReducer from './identity';

const rootReducer = combineReducers({
  user: userReducer,
  errors: errorsReducer,
  wallet: walletReducer,
  assembly: assemblyReducer,
  voting: votingReducer,
  legislation: legislationReducer,
  blockchain: blockchainReducer,
  democracy: democracyReducer,
  offices: officesReducer,
  registries: registriesReducer,
  identity: identityReducer,
});

export default rootReducer;
