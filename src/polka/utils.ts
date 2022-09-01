import {getSiName} from '@polkadot/types/metadata/util';
import type {StorageEntryTypeV14} from '@polkadot/types/interfaces';
import type {Registry} from '@polkadot/types/types';

export function unwrapStorageInput(
  registry: Registry,
  type: StorageEntryTypeV14
) {
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

export function createTypeTree(lookup: any) {
  const hashTable = Object.create(null);
  lookup.forEach((l: any) => (hashTable[l.id] = {...l, sub: []}));
  const dataTree = [];
  lookup.forEach((l: any) => {
    if (l.parentId) {
      hashTable[l.parentId].sub.push(hashTable[l.id]);
    } else {
      dataTree.push(hashTable[l.id]);
    }
  });
  return dataTree[0];
}

const leadingUppercaseReg = new RegExp('^[A-Z]+$|^[A-Z]'); // Select leading uppercase

export function decapitalize(s: string): string {
  const start = leadingUppercaseReg.exec(s)[0];
  const rest = s.split(leadingUppercaseReg)[1];
  return start.toLowerCase() + rest;
}
