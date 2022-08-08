import {ApiPromise} from '@polkadot/api';
import {getSiName} from '@polkadot/types/metadata/util';
import type {ConstantCodec} from '@polkadot/types/metadata/decorate/types';

export interface ConstDoc {
  name: string;
  type: string;
  doc: string;
}

export function listConst(
  api: ApiPromise,
  sectionName: string
): Array<ConstDoc> {
  const section = api.consts[sectionName];

  if (!section || Object.keys(section).length === 0) {
    return [];
  }

  return Object.keys(section)
    .filter((s) => !s.startsWith('$'))
    .sort()
    .map((value) => {
      const method = section[value] as ConstantCodec;
      const type = getSiName(api.registry.lookup, method.meta.type);
      const doc = method.meta.docs.join(' ');
      return <ConstDoc>{name: value, type: type, doc: doc};
    });
}
