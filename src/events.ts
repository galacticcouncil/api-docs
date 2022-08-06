import {ApiPromise, WsProvider} from '@polkadot/api';
import {db, SystemInfo} from './db';

import {listStorage} from './metadata/storage';

export async function testApi(wsRpcUrl: string) {
  const provider = new WsProvider(wsRpcUrl);

  const api = await ApiPromise.create({provider});

  const sectionName = 'assetRegistry';

  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
  ]);

  db.reset({
    system: <SystemInfo>{chain: chain, name: nodeName, version: nodeVersion},
    api: api,
    ready: true,
  });

  const section = api.query[sectionName];
  const cnst = api.consts[sectionName];

  console.log(section);
  console.log(cnst);
  console.log(listStorage(api, sectionName));
}
