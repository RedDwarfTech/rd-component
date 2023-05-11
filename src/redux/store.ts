import { createStore, compose } from 'redux'
import reducer from '@/common/combineReducer';
import { enhancer } from 'addon-redux'

export const store = createStore(reducer, {}, enhancer)