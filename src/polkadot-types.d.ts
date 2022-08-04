interface PolkadotApi {
  WsProvider: WsProvider;
  HttpProvider: HttpProvider;
  ApiPromise: ApiPromise;
}

interface PolkadotTypes {
  TypeDefInfo: TypeDefInfo;
}

declare var polkadotApi: PolkadotApi;
declare var polkadotTypes: PolkadotTypes;
