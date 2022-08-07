import {defAtom} from '@thi.ng/atom/atom';

import type {ApiState} from './polka/types';

export interface State {
  apiState: ApiState;
  ready: Boolean;
}

export const db = defAtom<State>({
  apiState: null,
  ready: false,
});