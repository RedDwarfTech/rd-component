import { combineReducers } from 'redux';
import user from '@/reducer/user/UserReducer';
import file from '@/reducer/file/FileReducer';
import order from '@/reducer/order/OrderReducer';
import sys from '@/reducer/sys/SysReducer';

const rdRootReducer = combineReducers({
  user,
  file,
  order,
  sys
})

export default rdRootReducer;