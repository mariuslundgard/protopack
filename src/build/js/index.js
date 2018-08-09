// @flow

import path from 'path'
import {chain} from 'ramda'
import {rollup} from 'rollup'

// rollup plugins
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import {uglify} from 'rollup-plugin-uglify'

import type {BuildEntry, BuildResult} from '../../types'

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
    [require.resolve('babel-plugin-transform-react-jsx'), {pragma: 'h'}],
    require.resolve('babel-plugin-syntax-dynamic-import')
  ]
}

async function jsBuilder (config: BuildEntry): Promise<BuildResult[]> {
  const plugins = [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    babel({
      ...babelOpts,
      babelrc: false,
      include: path.resolve(config.input.basePath, '**')
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      )
    }),
    process.env.NODE_ENV === 'production' && uglify()
  ]

  const outputInfo = path.parse(config.output.path)

  const inputOpts = {
    input: {
      [outputInfo.name]: config.input.path
    },
    plugins,
    experimentalCodeSplitting: true
  }

  const outputOpts = {
    dir: path.dirname(config.output.path),
    format: 'es',
    sourcemap: true
  }

  const bundle = await rollup(inputOpts)
  const result = await bundle.write(outputOpts)

  return chain(
    name => [
      {
        type: 'js',
        input: {
          basePath: config.input.basePath,
          path: path.join(config.input.dirPath, name)
        },
        output: {
          basePath: config.output.basePath,
          path: path.join(config.output.dirPath, name)
        }
      },
      {
        type: 'js',
        input: {
          basePath: config.input.basePath,
          path: path.join(config.input.dirPath, name + '.map')
        },
        output: {
          basePath: config.output.basePath,
          path: path.join(config.output.dirPath, name + '.map')
        }
      }
    ],
    Object.keys(result.output)
  )
}

export default jsBuilder
