//@ts-ignore
const {ApiPromise, WsProvider} = window.polkadotApi;

import {db} from './db';

export async function testApi(wsRpcUrl: string) {
  const provider = new WsProvider(wsRpcUrl);

  const api = await ApiPromise.create({provider});

  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
  ]);

  db.reset({
    chain: chain,
    name: nodeName,
    version: nodeVersion,
  });
}
