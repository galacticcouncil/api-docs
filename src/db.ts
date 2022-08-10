import {defAtom} from '@thi.ng/atom/atom';
import type {ApiState, Doc} from './polka/types';
import type {AssetDoc} from './polka/assets';

export interface State {
  apiState: ApiState;
  ready: Boolean;
  lookup: any;
  assets: Array<AssetDoc>;
  pallets: Array<Doc>;
}

export const db = defAtom<State>({
  apiState: null,
  ready: false,
  lookup: null,
  assets: null,
  pallets: null,
});
