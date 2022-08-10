import {defAtom} from '@thi.ng/atom/atom';
import type {MetadataLatest} from '@polkadot/types/interfaces/metadata';
import type {ApiState} from './polka/types';
import type {AssetDoc} from './polka/assets';

export interface State {
  apiState: ApiState;
  ready: Boolean;
  metadata: MetadataLatest;
  assets: Array<AssetDoc>;
}

export const db = defAtom<State>({
  apiState: null,
  ready: false,
  metadata: null,
  assets: [],
});
