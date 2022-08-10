import type {
  MetadataLatest,
  PalletMetadataLatest,
} from '@polkadot/types/interfaces/metadata';

import type {
  SiLookupTypeId,
  Si1Variant,
} from '@polkadot/types/interfaces/scaleInfo';

import type {Doc} from './types';

export enum SectionType {
  pallet,
}

export enum AssetType {
  const = 'const',
  extrinsic = 'extrinsic',
  storage = 'storage',
  error = 'error',
  event = 'event',
}

export interface AssetDoc extends Doc {
  section: string;
  sectionType: SectionType;
  type: AssetType;
}

function listStorage(pallet: PalletMetadataLatest): Array<AssetDoc> {
  if (pallet.storage.isSome) {
    return pallet.storage.value.items.map(
      (s) =>
        <AssetDoc>{
          section: pallet.name.toHuman(),
          sectionType: SectionType.pallet,
          type: AssetType.storage,
          name: s.name.toHuman(),
          doc: s.docs.join(' '),
        }
    );
  } else {
    return [];
  }
}

function listConstants(pallet: PalletMetadataLatest): Array<AssetDoc> {
  return pallet.constants.map(
    (c) =>
      <AssetDoc>{
        section: pallet.name.toHuman(),
        sectionType: SectionType.pallet,
        type: AssetType.const,
        name: c.name.toHuman(),
        doc: c.docs.join(' '),
      }
  );
}

function variants(
  pallet: PalletMetadataLatest,
  type: AssetType,
  assetTypeId: SiLookupTypeId,
  metadata: MetadataLatest
) {
  const assetType = metadata.lookup.types.at(assetTypeId.toNumber());
  const variant = assetType.type.def.asVariant;
  return variant.variants.map(
    (v: Si1Variant) =>
      <AssetDoc>{
        section: pallet.name.toHuman(),
        sectionType: SectionType.pallet,
        type: type,
        name: v.name.toString(),
        doc: v.docs.join(' '),
      }
  );
}

function unwrapErrors(
  pallet: PalletMetadataLatest,
  metadata: MetadataLatest
): Array<AssetDoc> {
  if (pallet.errors.isSome) {
    const errorType = pallet.errors.value.type;
    return variants(pallet, AssetType.error, errorType, metadata);
  } else {
    return [];
  }
}

function unwrapExtrinsics(
  pallet: PalletMetadataLatest,
  metadata: MetadataLatest
): Array<AssetDoc> {
  if (pallet.calls.isSome) {
    const callType = pallet.calls.value.type;
    return variants(pallet, AssetType.extrinsic, callType, metadata);
  } else {
    return [];
  }
}

function unwrapEvents(
  pallet: PalletMetadataLatest,
  metadata: MetadataLatest
): Array<AssetDoc> {
  if (pallet.events.isSome) {
    const eventType = pallet.events.value.type;
    return variants(pallet, AssetType.event, eventType, metadata);
  } else {
    return [];
  }
}

export function listAssets(metadata: MetadataLatest): Array<AssetDoc> {
  return metadata.pallets
    .map((pallet: PalletMetadataLatest) => {
      const assets = [];
      assets.push(listStorage(pallet));
      assets.push(listConstants(pallet));
      assets.push(unwrapErrors(pallet, metadata));
      assets.push(unwrapExtrinsics(pallet, metadata));
      assets.push(unwrapEvents(pallet, metadata));
      return assets.flat();
    })
    .flat();
}
