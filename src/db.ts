import {defAtom} from '@thi.ng/atom/atom';

export interface State {
  chain: string;
  name: string;
  version: string;
  metadata: any;
}

export const db = defAtom<State>({
  chain: null,
  name: null,
  version: null,
  metadata: null
});
