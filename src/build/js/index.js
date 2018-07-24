'use strict'

const path = require('path')
const rollup = require('rollup')

// Rollup plugins
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')
const {uglify} = require('rollup-plugin-uglify')
// function html () {
//   return {
//     name: 'html',
//     resolveId (importee, importer) {
//       return null
//     }
//   }
// }

const babelOpts = {
  presets: [
    [
      require.resolve('babel-preset-env'),
      {
        modules: false,
        targets: {
          browsers: ['last 2 versions', 'IE 10']
        }
      }
    ]
  ],
  plugins: [
    require.resolve('babel-plugin-external-helpers'),
    require.resolve('babel-plugin-transform-class-properties'),
    require.resolve('babel-plugin-transform-flow-strip-types'),
    require.resolve('babel-plugin-transform-object-rest-spread'),
    [require.resolve('babel-plugin-transform-react-jsx'), {pragma: 'h'}]
  ]
}

async function buildJs (config) {
  const plugins = [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    babel({
      ...babelOpts,
      babelrc: false,
      include: path.resolve(config.basePath, '**')
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      )
    }),
    process.env.NODE_ENV === 'production' && uglify()
  ]

  const inputOpts = {
    input: config.input,
    plugins
  }

  const outputOpts = {
    file: config.output,
    format: 'es',
    sourcemap: true
  }

  const bundle = await rollup.rollup(inputOpts)

  await bundle.write(outputOpts)

  return [
    {
      type: 'js',
      input: {
        path: config.input
      },
      output: {
        path: config.output
      }
    },
    {
      type: 'js.map',
      input: null,
      output: {
        path: config.output + '.map'
      }
    }
  ]
}

module.exports = buildJs
