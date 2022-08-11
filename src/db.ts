import {defAtom} from '@thi.ng/atom/atom';
import {defCursor} from '@thi.ng/atom/cursor';
import type {MetadataLatest} from '@polkadot/types/interfaces/metadata';
import type {RouterLocation} from '@vaadin/router';
import type {ApiState} from './polka/types';
import type {AssetDoc} from './polka/assets';

export interface Api {
  apiState: ApiState;
  metadata: MetadataLatest;
  assets: Array<AssetDoc>;
  node: string;
}

export interface State {
  api: Api;
  location: RouterLocation;
}

export const db = defAtom<State>({
  api: null,
  location: null,
});

export const apiCursor = defCursor(db, ['api']);
export const locationCursor = defCursor(db, ['location']);
