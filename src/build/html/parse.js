// @flow

/* eslint-disable no-use-before-define */

import htmlparser from 'htmlparser2'

type CommentNode = {type: 'comment', value: string}
type ElementNode = {type: 'element', name: string, children: Node[]}
type Node = ElementNode | CommentNode | string

type DocumentNode = {
  type: '#document',
  doctype: string | null,
  children: Node[]
}

type AST = {
  document: DocumentNode,
  imports: any[]
}

function parse (str: string) {
  const result: AST = {
    document: {
      type: '#document',
      doctype: null,
      children: []
    },
    imports: []
  }

  let node = result.document
  let stack = [node]

  function push (n: Node) {
    if (typeof node === 'string') {
      throw new Error('Cannot append to text nodes')
    }
    if (node.type === 'comment') {
      throw new Error('Cannot append to comment nodes')
    }
    node.children.push(n)
    node = n
    stack.push(n)
  }

  function pop () {
    stack.pop()
    node = stack[stack.length - 1]
  }

  const parser = new htmlparser.Parser(
    {
      onprocessinginstruction (name, value) {
        if (name === '!doctype') {
          result.document.doctype = value
        }
      },
      oncomment (value) {
        push({type: 'comment', value})
        pop()
      },
      onopentag (name, attrs) {
        push({type: 'element', name, attrs, children: []})
        if (name === 'script' && attrs.src) {
          result.imports.push({type: 'js', input: attrs.src})
        }
        if (name === 'link' && attrs.rel === 'stylesheet' && attrs.href) {
          result.imports.push({type: 'css', input: attrs.href})
        }
        if (name === 'link' && attrs.rel === 'import' && attrs.href) {
          result.imports.push({type: 'html', input: attrs.href})
        }
      },
      ontext (text) {
        push(text)
        pop()
      },
      onclosetag (tagname) {
        pop()
      }
    },
    {decodeEntities: true}
  )

  parser.write(str)
  parser.end()

  return result
}

export default parse
