import path from 'path'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'

const babelOpts = {
  presets: [
    [
      'env',
      {
        modules: false,
        targets: {
          node: '10.8'
        }
      }
    ]
  ],
  plugins: ['transform-flow-strip-types', 'transform-object-rest-spread']
}

const external = [
  'autoprefixer',
  'chalk',
  'child_process',
  'chokidar',
  'cssnano',
  'express',
  'fs',
  'htmlparser2',
  'mkdirp',
  'path',
  'postcss',
  'postcss-custom-properties',
  'postcss-import',
  'postcss-nesting',
  'ramda',
  'resolve',
  'rimraf',
  'rollup',
  'rollup-plugin-babel',
  'rollup-plugin-uglify',
  'rollup-plugin-node-resolve',
  'rollup-plugin-replace',
  'util'
]

export default [
  {
    input: path.resolve(__dirname, 'src/index.js'),
    output: {
      file: path.resolve(__dirname, 'dist/protopack.es.js'),
      format: 'es'
    },
    external,
    plugins: [
      resolve({
        exclude: 'node_modules/**'
      }),
      babel({
        babelrc: false,
        ...babelOpts
      })
    ]
  },
  {
    input: path.resolve(__dirname, 'src/index.js'),
    output: {
      file: path.resolve(__dirname, 'dist/protopack.js'),
      format: 'cjs',
      exports: 'named'
    },
    external,
    plugins: [
      resolve({
        exclude: 'node_modules/**'
      }),
      babel({
        babelrc: false,
        ...babelOpts
      })
    ]
  }
]
