import {ApiPromise} from '@polkadot/api';
import {unwrapStorageType} from '@polkadot/types/primitive/StorageKey';
import {getSiName} from '@polkadot/types/metadata/util';
import type {StorageEntry} from '@polkadot/types/primitive/types';
import type {StorageEntryTypeV14} from '@polkadot/types/interfaces';
import type {Registry} from '@polkadot/types/types';

export interface StorageDoc {
  name: string;
  input: string;
  output: string;
}

function unwrapStorageInput(registry: Registry, type: StorageEntryTypeV14) {
  if (type.isMap) {
    const {hashers, key} = type.asMap;
    if (hashers.length === 1) {
      return getSiName(registry.lookup, key);
    } else {
      const si = registry.lookup.getSiType(key).def;
      if (si.isTuple) {
        return si.asTuple.map((t) => getSiName(registry.lookup, t)).join(', ');
      } else {
        return si.asHistoricMetaCompat.toString();
      }
    }
  }
}

export function listStorage(
  api: ApiPromise,
  sectionName: string
): Array<StorageDoc> {
  const section = api.query[sectionName];

  if (!section || Object.keys(section).length === 0) {
    return [];
  }

  return Object.keys(section)
    .sort()
    .map((value) => {
      const {
        meta: {docs, modifier, name, type},
      } = section[value] as unknown as StorageEntry;
      const output = unwrapStorageType(api.registry, type, modifier.isOptional);
      const input = unwrapStorageInput(api.registry, type);
      return <StorageDoc>{name: value, input: input, output: output};
    });
}
