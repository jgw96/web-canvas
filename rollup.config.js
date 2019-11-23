import resolve from 'rollup-plugin-node-resolve';
import minify from 'rollup-plugin-babel-minify';
import minifyHTML from 'rollup-plugin-minify-html-literals';

export default {
	input: ['build/web-canvas.js'],
	output: {
		file: 'dist/web-canvas.js',
    format: 'es',
		sourcemap: true
	},
	plugins: [
    resolve(),
    minifyHTML(),
    minify()
  ]
};