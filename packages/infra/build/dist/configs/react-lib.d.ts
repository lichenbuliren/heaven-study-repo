import * as tsup from 'tsup';

declare const reactLibConfig: tsup.Options | tsup.Options[] | ((overrideOptions: tsup.Options) => tsup.Options | tsup.Options[] | Promise<tsup.Options | tsup.Options[]>);

export { reactLibConfig };
