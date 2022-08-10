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
