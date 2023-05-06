import { combineReducers } from 'redux';
import pay from '@/reducer/pay/PayReducer';
import iapproduct from '@/reducer/iapproduct/IapProductReducer';
import user from '@/reducer/user/UserReducer';
import file from '@/reducer/file/FileReducer';
import order from '@/reducer/order/OrderReducer';

const rdRootReducer = combineReducers({
  pay,
  iapproduct,
  user,
  file,
  order
})

export default rdRootReducer;