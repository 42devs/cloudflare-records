// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: {
      dir: 'dist',
    format: 'es',
  },
  plugins: [
    resolve(),
   commonjs(),
    typescript(),
  ]
};

/* Skip type checking all .d.ts files. */
