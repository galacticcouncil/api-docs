const {TypeDefInfo} = window.polkadotTypes;

import {
  MetadataLatest,
  PalletStorageMetadataLatest,
  StorageEntryTypeLatest,
} from '@polkadot/types/interfaces/metadata';

// Unwrap single type (low level)
export function unwrapStorageType(
  type: StorageEntryTypeLatest,
  metadata: MetadataLatest
) {
  if (type.isPlain) {
    return {plain: metadata.lookup.types[type.asPlain.unwrap().toNumber()]};
  } else {
    return type;
  }
}

// Unwrap storage type
export function unwrapStorage(
  storage: PalletStorageMetadataLatest,
  metadata: MetadataLatest
) {
  return storage.items.map((storageItem) => {
    const type = unwrapStorageType(storageItem.type, metadata);
    return {...storageItem, type};
  });
}

export const unwrapInfo = (info: number) => TypeDefInfo[info] || '';
