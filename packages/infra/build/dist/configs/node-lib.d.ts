import * as tsup from 'tsup';

declare const nodeLibConfig: tsup.Options | tsup.Options[] | ((overrideOptions: tsup.Options) => tsup.Options | tsup.Options[] | Promise<tsup.Options | tsup.Options[]>);

export { nodeLibConfig };
