import {defAtom} from '@thi.ng/atom/atom';
import {defCursor} from '@thi.ng/atom/cursor';

import {ApiPromise} from '@polkadot/api';

export interface SystemInfo {
  chain: String;
  name: String;
  version: String;
}

export interface State {
  system: SystemInfo;
  api: ApiPromise;
  ready: Boolean;
}

export const db = defAtom<State>({
  system: null,
  api: null,
  ready: false,
});

export const systemCursor = defCursor(db, ['system']);
