import { Config } from '@remotion/cli/config'
import { crearWebpackOverride } from './webpack.mjs'

// `remotion studio` y `remotion render` se lanzan desde video/.
Config.overrideWebpackConfig(crearWebpackOverride(process.cwd()))
