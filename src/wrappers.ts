import {TypeDefInfo} from '@polkadot/types';

export const unwrapInfo = (info: number) => TypeDefInfo[info] || '';
