import type {SubmittableExtrinsicFunction} from '@polkadot/api/promise/types';
import {ApiPromise} from '@polkadot/api';

export interface ApiState {
  api: ApiPromise;
  apiDefaultTx: SubmittableExtrinsicFunction;
  apiDefaultTxSudo: SubmittableExtrinsicFunction;
  specName: string;
  specVersion: string;
  systemChain: string;
  systemName: string;
  systemVersion: string;
}

export interface Doc {
  name: string;
  doc: string;
}
