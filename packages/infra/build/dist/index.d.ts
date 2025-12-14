export { nodeLibConfig } from './configs/node-lib.js';
export { reactLibConfig } from './configs/react-lib.js';
import { Options } from 'tsup';

declare const createConfig: (options?: Options) => Options | Options[] | ((overrideOptions: Options) => Options | Options[] | Promise<Options | Options[]>);

export { createConfig };
