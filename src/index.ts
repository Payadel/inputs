/**
 * The entrypoint for the action.
 */
/* istanbul ignore file */

import run from './main'
import { DEFAULT_INPUTS } from './configs'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run(DEFAULT_INPUTS)
