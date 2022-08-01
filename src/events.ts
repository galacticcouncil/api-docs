import {ApiPromise, WsProvider} from '@polkadot/api';

export async function initApi(wsRpcUrl: string): Promise<ApiPromise> {
  const provider = new WsProvider(wsRpcUrl);
  const api = await ApiPromise.create({
    initWasm: false,
    provider,
    // this seems not to make any difference anymore
    types: {
      RuntimeDbWeight: {
        read: 'Weight',
        write: 'Weight',
      },
    },
  });

  console.log('Api is ready');
  return api;
}

export async function testApi(wsRpcUrl: string) {
  const provider = new WsProvider(wsRpcUrl);

  const api = await ApiPromise.create({provider});

  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
  ]);

  console.log(
    `You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`
  );
}
