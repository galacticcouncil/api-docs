import {defAtom} from '@thi.ng/atom/atom';

interface State {
  chain: string;
  name: string;
  version: string;
}

export const db = defAtom<State>({
  chain: null,
  name: null,
  version: null
});
