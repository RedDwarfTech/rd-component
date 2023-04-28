import { combineReducers } from 'redux';
import pay from '@/reducer/pay/PayReducer';
import iapproduct from '@/reducer/iapproduct/IapProductReducer';

const rootReducer = combineReducers({
  pay,
  iapproduct
})

export default rootReducer;