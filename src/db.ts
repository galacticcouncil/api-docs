import {defAtom} from '@thi.ng/atom/atom';
import {defCursor} from '@thi.ng/atom/cursor';

interface State {
  api: string;
}

export const db = defAtom<State>({
  api: null,
});

export const apiCursor = defCursor(db, ['api']);
