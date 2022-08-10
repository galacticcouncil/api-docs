import type {
  MetadataLatest,
  PalletMetadataLatest,
  PalletConstantMetadataV14,
  StorageEntryMetadataV14,
} from '@polkadot/types/interfaces/metadata';

import type {
  SiLookupTypeId,
  Si1Variant,
} from '@polkadot/types/interfaces/scaleInfo';

import {unwrapStorageType} from '@polkadot/types/primitive/StorageKey';
import {unwrapStorageInput} from './utils';

function lookupName(metadata: MetadataLatest, index: number) {
  const typeDef = metadata.lookup.getTypeDef(index);
  return metadata.lookup.getName(index) || typeDef.type;
}

export function lookupPalletMetadata(
  metadata: MetadataLatest,
  palletName: String
): PalletMetadataLatest {
  return metadata.pallets.filter(
    (pallet: PalletMetadataLatest) => pallet.name.toString() === palletName
  )[0];
}

export function lookupStorageMetadata(
  metadata: MetadataLatest,
  palletName: String,
  storageName: String
): StorageEntryMetadataV14 {
  const storage = lookupPalletMetadata(metadata, palletName).storage;
  if (storage.isSome) {
    return storage.value.items.filter(
      (storage: StorageEntryMetadataV14) =>
        storage.name.toString() === storageName
    )[0];
  }
}

export function lookupStorageInputLegacy(
  metadata: MetadataLatest,
  storageEntry: StorageEntryMetadataV14
): String {
  return unwrapStorageInput(metadata.registry, storageEntry.type);
}

export function lookupStorageInput(
  metadata: MetadataLatest,
  storageEntry: StorageEntryMetadataV14
): String {
  console.log(storageEntry);
  const type = storageEntry.type;
  if (type.isMap) {
    const {key} = type.asMap;
    const typeDef = metadata.lookup.getTypeDef(key.toNumber());
    console.log(typeDef);
    return typeDef.type;
  } else {
    return null;
  }
}

function formatTypeResult(type: String, isOptional: Boolean): String {
  if (isOptional) {
    return 'Option<' + type + '>';
  } else {
    return type;
  }
}

export function lookupStorageOutputLegacy(
  metadata: MetadataLatest,
  storageEntry: StorageEntryMetadataV14
): String {
  return unwrapStorageType(
    metadata.registry,
    storageEntry.type,
    storageEntry.modifier.isOptional
  );
}

export function lookupStorageOutput(
  metadata: MetadataLatest,
  storageEntry: StorageEntryMetadataV14
): String {
  const type = storageEntry.type;
  const isOptional = storageEntry.modifier.isOptional;
  if (type.isMap) {
    const {value} = type.asMap;
    const typeName = lookupName(metadata, value.toNumber());
    return formatTypeResult(typeName, isOptional);
  } else if (type.isPlain) {
    const t = lookupName(metadata, type.asPlain.toNumber());
    return formatTypeResult(t, isOptional);
  } else {
    return null;
  }
}

export function lookupConstantsMetadata(
  metadata: MetadataLatest,
  palletName: String,
  constantName: String
): PalletConstantMetadataV14 {
  const constants = lookupPalletMetadata(metadata, palletName).constants;
  return constants.filter(
    (constant: PalletConstantMetadataV14) =>
      constant.name.toString() === constantName
  )[0];
}

export function lookupExtrinsicMetadata(
  metadata: MetadataLatest,
  palletName: String,
  extrinsicName: String
): Si1Variant {
  const calls = lookupPalletMetadata(metadata, palletName).calls;
  const assetTypeId = calls.value.type.toNumber();
  const assetType = metadata.lookup.types.at(assetTypeId);
  const variant = assetType.type.def.asVariant;
  return variant.variants.filter(
    (v: Si1Variant) => v.name.toString() === extrinsicName
  )[0];
}
