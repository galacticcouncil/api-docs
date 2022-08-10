import type {
  MetadataLatest,
  PalletMetadataLatest,
  PalletConstantMetadataLatest,
  StorageEntryMetadataLatest,
} from '@polkadot/types/interfaces/metadata';

import type {
  SiLookupTypeId,
  Si1Variant,
} from '@polkadot/types/interfaces/scaleInfo';

import {unwrapStorageType} from '@polkadot/types/primitive/StorageKey';
import {getSiName} from '@polkadot/types/metadata/util';
import {unwrapStorageInput} from './utils';

function lookupName(metadata: MetadataLatest, index: number) {
  const typeDef = metadata.lookup.getTypeDef(index);
  return metadata.lookup.getName(index) || typeDef.type;
}

function lookupVariant(
  metadata: MetadataLatest,
  index: number,
  variantName: String
) {
  const assetType = metadata.lookup.types.at(index);
  const variant = assetType.type.def.asVariant;
  return variant.variants.filter(
    (v: Si1Variant) => v.name.toString() === variantName
  )[0];
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
): StorageEntryMetadataLatest {
  const storage = lookupPalletMetadata(metadata, palletName).storage;
  if (storage.isSome) {
    return storage.value.items.filter(
      (storage: StorageEntryMetadataLatest) =>
        storage.name.toString() === storageName
    )[0];
  }
}

export function lookupStorageInputLegacy(
  metadata: MetadataLatest,
  storageEntry: StorageEntryMetadataLatest
): String {
  return unwrapStorageInput(metadata.registry, storageEntry.type);
}

export function lookupStorageInput(
  metadata: MetadataLatest,
  storageEntry: StorageEntryMetadataLatest
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
  storageEntry: StorageEntryMetadataLatest
): String {
  return unwrapStorageType(
    metadata.registry,
    storageEntry.type,
    storageEntry.modifier.isOptional
  );
}

export function lookupStorageOutput(
  metadata: MetadataLatest,
  storageEntry: StorageEntryMetadataLatest
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
): PalletConstantMetadataLatest {
  const constants = lookupPalletMetadata(metadata, palletName).constants;
  return constants.filter(
    (constant: PalletConstantMetadataLatest) =>
      constant.name.toString() === constantName
  )[0];
}

export function lookupConstantTypeLegacy(
  metadata: MetadataLatest,
  storageEntry: PalletConstantMetadataLatest
): String {
  return getSiName(metadata.registry.lookup, storageEntry.type);
}

export function lookupExtrinsicMetadata(
  metadata: MetadataLatest,
  palletName: String,
  extrinsicName: String
): Si1Variant {
  const calls = lookupPalletMetadata(metadata, palletName).calls;
  const assetTypeId = calls.value.type.toNumber();
  return lookupVariant(metadata, assetTypeId, extrinsicName);
}

export function lookupErrorMetadata(
  metadata: MetadataLatest,
  palletName: String,
  errorName: String
): Si1Variant {
  const errors = lookupPalletMetadata(metadata, palletName).errors;
  const assetTypeId = errors.value.type.toNumber();
  return lookupVariant(metadata, assetTypeId, errorName);
}

export function lookupEventMetadata(
  metadata: MetadataLatest,
  palletName: String,
  eventName: String
): Si1Variant {
  const events = lookupPalletMetadata(metadata, palletName).events;
  const assetTypeId = events.value.type.toNumber();
  return lookupVariant(metadata, assetTypeId, eventName);
}
