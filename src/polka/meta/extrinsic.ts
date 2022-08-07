import {ApiPromise} from '@polkadot/api';
import {getTypeDef} from '@polkadot/types/create';
import type {TypeDef} from '@polkadot/types/types';
import type {SubmittableExtrinsicFunction} from '@polkadot/api/types';

export interface ExtrinsicDoc {
  name: string;
  input: string;
  doc: any;
}

interface ParamDef {
  name: string;
  type: TypeDef;
}

function getParams({
  meta,
}: SubmittableExtrinsicFunction<'promise'>): ParamDef[] {
  return meta.args.map(
    ({name, type, typeName}): {name: string; type: TypeDef} => ({
      name: name.toString(),
      type: {
        ...getTypeDef(type.toString()),
        ...(typeName.isSome ? {typeName: typeName.unwrap().toString()} : {}),
      },
    })
  );
}

export function listExtrinsics(
  api: ApiPromise,
  sectionName: string,
  filter?: (section: string, method?: string) => boolean
): Array<ExtrinsicDoc> {
  const section = api.tx[sectionName];
  const isAllowed = !filter || filter(sectionName);

  if (!section || Object.keys(section).length === 0 || !isAllowed) {
    return [];
  }

  return Object.keys(section)
    .filter((s) => !s.startsWith('$') && (!filter || filter(sectionName, s)))
    .sort()
    .map((value) => {
      const method = section[value];
      // TODO: Extrinsics type
      //const params = getParams(method);
      //console.log(params);

      const inputs = method.meta.args
        .map((arg) => arg.name.toString())
        .join(', ');
      return <ExtrinsicDoc>{name: value, input: inputs, doc: method.meta.docs};
    });
}
