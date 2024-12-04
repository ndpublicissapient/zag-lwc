import fs from 'fs';
import { execSync } from 'child_process';

const VERSION = '0.77.1';

const COMPONENTS = [
  // 'accordion',
  // 'avatar',
  // 'carousel',
  // 'checkbox',
  // 'colorPicker',
  // 'pagination',
  // 'tabs'
  'select',
  'combobox'
];

console.log('Bundling components...');
COMPONENTS.forEach(component => {
  const componentDashCase = component.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

  // write component.js
  const file = 'component.js';
  const content = `import * as component from "@zag-js/${componentDashCase}";
export default component;`;
  fs.writeFileSync(file, content);

  // write rollup.config.js
  const rollupConfig = `
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
//import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';

export default {
  input: './component.js', // Adjust the path to your DateComboBox.js file
  output: {
    banner: '/* eslint-disable | Bundled from ZagJS | ${component} | Version ${VERSION} */', // Disables ESLint for the output
    file: './dist/${component}.js',
    format: 'esm', // or 'iife' for a self-executing function
  },
  plugins: [
    resolve(), // Helps Rollup find node_modules
    commonjs(), // Converts CommonJS modules to ES6
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'location': JSON.stringify({}), // Replace 'location' with your desired value
      preventAssignment: true
    }), // Replaces process.env.NODE_ENV with 'production' and sets 'location'
    //terser() // Minifies the output
  ]
};`
  fs.writeFileSync('rollup.config.js', rollupConfig);

  // run rollup command
  const command = `npx rollup -c --bundleConfigAsCjs`;
  console.log(`Bundling ${component}...`);
  const result = execSync(command).toString();
  console.log(result);
});