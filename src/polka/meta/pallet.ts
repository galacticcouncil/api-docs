import {ApiPromise} from '@polkadot/api';

export interface PalletDoc {
  name: string;
}

export function listPallets(api: ApiPromise): Array<PalletDoc> {
  return Object.keys(api.query)
    .filter((s) => !s.startsWith('$'))
    .sort()
    .filter((n) => Object.keys(api.query[n]).length)
    .map((value) => <PalletDoc>{name: value});
}
