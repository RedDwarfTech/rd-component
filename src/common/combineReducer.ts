import { combineReducers } from 'redux';
import pay from '@/reducer/pay/PayReducer';
import iapproduct from '@/reducer/iapproduct/IapProductReducer';

const rdRootReducer = combineReducers({
  pay,
  iapproduct
})

export default rdRootReducer;