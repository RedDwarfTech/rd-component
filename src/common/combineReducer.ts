import { combineReducers } from 'redux';
import pay from '@/reducer/pay/PayReducer';
import iapproduct from '@/reducer/iapproduct/IapProductReducer';
import user from '@/reducer/user/UserReducer';
import file from '@/reducer/file/FileReducer';
import order from '@/reducer/order/OrderReducer';
import sys from '@/reducer/sys/SysReducer';

const rdRootReducer = combineReducers({
  pay,
  iapproduct,
  user,
  file,
  order,
  sys
})

export default rdRootReducer;