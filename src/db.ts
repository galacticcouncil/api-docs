import {defAtom} from '@thi.ng/atom/atom';

export interface State {
  chain: any;
  name: any;
  version: any;
  metadata: any;
}

export const db = defAtom<State>({
  chain: null,
  name: null,
  version: null,
  metadata: null
});
