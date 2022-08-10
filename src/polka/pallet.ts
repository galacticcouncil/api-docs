import type {
  MetadataLatest,
  PalletMetadataLatest,
} from '@polkadot/types/interfaces/metadata';

import type {Doc} from './types';

export interface PalletDoc extends Doc {}

export function listPallets(metadata: MetadataLatest): Array<PalletDoc> {
  return metadata.pallets
    .filter(
      (pallet: PalletMetadataLatest) =>
        pallet.storage.isSome ||
        pallet.calls.isSome ||
        !pallet.constants.isEmpty ||
        pallet.events.isSome ||
        pallet.errors.isSome
    )
    .map(
      (pallet: PalletMetadataLatest) => <PalletDoc>{name: pallet.name.toHuman()}
    )

    .sort(function (a: {name: string}, b: {name: string}) {
      return a.name.localeCompare(b.name);
    });
}
