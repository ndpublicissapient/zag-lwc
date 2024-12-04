import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
//import terser from '@rollup/plugin-terser';
import replace from "@rollup/plugin-replace";

export default {
  input: "./component.js", // Adjust the path to your DateComboBox.js file
  output: {
    banner:
      "/* eslint-disable | Bundled from ZagJS | combobox | Version 0.77.1 */", // Disables ESLint for the output
    file: "./dist/combobox.js",
    format: "esm" // or 'iife' for a self-executing function
  },
  plugins: [
    resolve(), // Helps Rollup find node_modules
    commonjs(), // Converts CommonJS modules to ES6
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      location: JSON.stringify({}), // Replace 'location' with your desired value
      preventAssignment: true
    }) // Replaces process.env.NODE_ENV with 'production' and sets 'location'
    //terser() // Minifies the output
  ]
};
