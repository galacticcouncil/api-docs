import {polkadot, chain, Config} from 'capi';

function metadata(config: Config) {
  const root = chain(config).metadata().read();
  root.run().then((meta) => console.log(meta));
}

function events(config: Config, pallet: string) {
  const root = chain(config).pallet(pallet).entry('Events').read();
  root.run().then((s) => console.log(s));
}