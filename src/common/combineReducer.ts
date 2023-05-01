import { combineReducers } from 'redux';
import pay from '@/reducer/pay/PayReducer';
import iapproduct from '@/reducer/iapproduct/IapProductReducer';
import user from '@/reducer/user/UserReducer';

const rdRootReducer = combineReducers({
  pay,
  iapproduct,
  user
})

export default rdRootReducer;