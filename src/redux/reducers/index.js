import { combineReducers } from 'redux';
import userReducer from './user';
import errorsReducer from './errors';

const rootReducer = combineReducers({
  user: userReducer,
  errors: errorsReducer,
});

export default rootReducer;
