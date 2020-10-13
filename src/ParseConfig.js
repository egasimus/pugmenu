const load  = require('pug-load').string
const lex   = require('pug-lexer')
const parse = require('pug-parser')

const {createContext, runInContext} = require('vm')
const {readdirSync} = require('fs')

module.exports = function parseConfig (source) {

  const {nodes} = load(source, { lex, parse })
  return walk(nodes)

  function walk (nodes, context=createContext({})) {

    const eval = x => {
      console.debug('eval',x,context)
      return runInContext(x, context)
    }

    console.log(nodes)

    return nodes.map(node=>{
      switch (node.type) {
        case 'Text': return Text(node)
        case 'Tag':  return Tag(node)
        case 'Each': return Each(node)
        case 'Code': return Code(node)
        default: throw NotImplemented(node)
      }
    })

    function Text ({val}) {
      return val
    }

    function Tag ({name,attrs,block}) {
      const add = (obj, {name, val})=>{
        console.debug(`add: ${name}=${val}`)
        return Object.assign(obj, {[name]: eval(val)})
      }
      const result = {
        ...attrs.reduce(add, {}),
        type: name,
        kids: walk(block.nodes, context)
      }
      console.debug(JSON.stringify(result))
      return result
    }

    function Each ({val, obj, block:{nodes}}) {
      console.log('->',nodes[0])
      const files = readdirSync(eval(obj))
      return {type:'List', nodes: [].concat(...files.map(file=>{
        const newContext = createContext({...context, [val]: file})
        return walk(nodes, newContext)
      }))}
    }

    function Code (node) {
      return eval(node.val)
    }

    function NotImplemented ({type,line,column}) {
      return new Error(`unimplemented node type ${type} at ${line}:${column}`)
    }

  }

}
