import { StringUtil } from '../../src/common/util/StringUtil';
import {describe, expect, test} from '@jest/globals';

describe('1 + 1', () => {
  test('1 + 1 = 2', () => {
    expect(StringUtil.add(1,1)).toBe(2)
  })
})