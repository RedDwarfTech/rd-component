import { combineReducers } from 'redux';
import pay from '@/reducer/pay/PayReducer';
import iapproduct from '@/reducer/iapproduct/IapProductReducer';
import user from '@/reducer/user/UserReducer';
import file from '@/reducer/file/FileReducer';

const rdRootReducer = combineReducers({
  pay,
  iapproduct,
  user,
  file
})

export default rdRootReducer;