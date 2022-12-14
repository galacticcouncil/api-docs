import {ApiPromise, WsProvider} from '@polkadot/api';
import type {ChainType} from '@polkadot/types/interfaces';
import type {ApiState} from './types';

import {apiCursor} from './../db';
import {listAssets} from './assets';

interface ChainData {
  systemChain: string;
  systemChainType: ChainType;
  systemName: string;
  systemVersion: string;
}

async function retrieve(api: ApiPromise): Promise<ChainData> {
  const [systemChain, systemChainType, systemName, systemVersion] =
    await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.chainType(),
      api.rpc.system.name(),
      api.rpc.system.version(),
    ]);

  return {
    systemChain: (systemChain || '<unknown>').toString(),
    systemChainType,
    systemName: systemName.toString(),
    systemVersion: systemVersion.toString(),
  };
}

async function loadOnReady(api: ApiPromise): Promise<ApiState> {
  const {systemChain, systemChainType, systemName, systemVersion} =
    await retrieve(api);

  console.log(`Chain: ${systemChain} (${systemChainType.toString()})`);

  const defaultSection = Object.keys(api.tx)[0];
  const defaultMethod = Object.keys(api.tx[defaultSection])[0];
  const apiDefaultTx = api.tx[defaultSection][defaultMethod];
  const apiDefaultTxSudo =
    (api.tx.system && api.tx.system.setCode) || apiDefaultTx;
  return {
    api,
    apiDefaultTx,
    apiDefaultTxSudo,
    specName: api.runtimeVersion.specName.toString(),
    specVersion: api.runtimeVersion.specVersion.toString(),
    systemChain,
    systemName,
    systemVersion,
  };
}

export async function createApi(
  apiUrl: string,
  onError: (error: unknown) => void
) {
  try {
    const provider = new WsProvider(apiUrl);
    const api = new ApiPromise({
      provider: provider,
    });

    api
      .on('connected', () => console.log('API connected'))
      .on('disconnected', () => console.log('API disconnected'))
      .on('error', () => console.log('API error'))
      .on('ready', () => {
        console.log('API ready');
        loadOnReady(api)
          .then((apiState: ApiState) => {
            const metadata = apiState.api.runtimeMetadata.asLatest;
            const assets = listAssets(metadata);
            apiCursor.reset({
              apiState: apiState,
              node: apiUrl,
              metadata: metadata,
              assets: assets,
            });
          })
          .catch(onError);
      });
  } catch (error) {
    onError(error);
  }
}
