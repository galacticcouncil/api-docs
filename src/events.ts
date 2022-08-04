import {ApiPromise, WsProvider} from '@polkadot/api';
import {db} from './db';

export async function testApi(wsRpcUrl: string) {
  const provider = new WsProvider(wsRpcUrl);

  const api = await ApiPromise.create({provider});

  const [chain, nodeName, nodeVersion, metadata] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
    api.runtimeMetadata.asLatest,
  ]);

  db.reset({
    chain: chain,
    name: nodeName,
    version: nodeVersion,
    metadata: metadata,
  });
}
