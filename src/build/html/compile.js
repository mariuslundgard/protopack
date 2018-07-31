'use strict'

const path = require('path')

function joinUrlPath (...args) {
  return args
    .filter(Boolean)
    .map(arg => {
      if (arg.startsWith('./')) {
        return arg.substr(2)
      }
      return arg
    })
    .join('/')
}

function resolveUrl (config, uri) {
  return joinUrlPath(
    config.baseUrl,
    path.relative(config.basePath, config.dirPath),
    uri
  )
}

function compileAttrValue (nodeName, attrs, attrKey, config) {
  switch (true) {
    case nodeName === 'a' && attrKey === 'href':
    case nodeName === 'img' && attrKey === 'src':
    case nodeName === 'link' && attrKey === 'href':
    case nodeName === 'script' && attrKey === 'src':
      return resolveUrl(config, attrs[attrKey])
    default:
      return attrs[attrKey]
  }
}

function compileAttrs (nodeName, attrs, config) {
  return Object.keys(attrs)
    .map(key => ` ${key}="${compileAttrValue(nodeName, attrs, key, config)}"`)
    .join('')
}

const voidTagNames = [
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'menuitem',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
]

function compile (node, config) {
  if (typeof node === 'string') {
    return node
  }

  switch (node.type) {
    case '#document': {
      let doctype = ''
      if (node.doctype) {
        doctype = `<${node.doctype}>`
      }
      return `${doctype}${node.children
        .map(child => compile(child, config))
        .join('')}`
    }

    case 'comment':
      return `<!--${node.value}-->`

    case 'element':
      const isVoid = ~voidTagNames.indexOf(node.name)
      return [
        `<${node.name}${compileAttrs(node.name, node.attrs, config)}>`,
        node.children.map(child => compile(child, config)).join(''),
        isVoid ? '' : `</${node.name}>`
      ].join('')

    default:
      return `<!-- #${node.type} -->`
  }
}

module.exports = compile
