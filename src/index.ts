import { parse } from 'acorn'
import { simple as simpleWalk } from 'acorn-walk'
// import loaderUtils from 'loader-utils'
import * as webpack from 'webpack'
import fs from 'fs'
import { promisify } from 'util'
import prettier from 'prettier'

// const schema = {
//   type: 'object',
//   properties: {},
// }

const loader: webpack.loader.Loader = function (content: string, sourceMap) {
  const callback = this.async()
  const declarationPath = this.resourcePath + '.d.ts'
  const parsed = parse(content, {
    sourceType: 'module',
  })

  const keys = []

  simpleWalk(parsed, {
    ExpressionStatement(node) {
      simpleWalk(node, {
        // console.log(node)
        AssignmentExpression(node: any) {
          simpleWalk(node, {
            Property(node: any) {
              const key = node.key.value
              keys.push(key)
            },
          })
        },
      })
    },
    ExportNamedDeclaration(node) {
      simpleWalk(node, {
        VariableDeclarator(node: any) {
          keys.push(node.id.name)
        },
      })
    },
  })

  if (!keys.length) {
    callback(undefined, content)
    return
  }

  const declarations = keys.map((key) => `${key}: string;`).join('\n')

  const fileContent = `
  interface CSSModules {
    ${declarations}
  }
  export const cssModules: CSSModules
  export default cssModules
`

  const formattedContent = prettier.format(fileContent, {
    parser: 'typescript',
  })

  promisify(fs.writeFile)(declarationPath, formattedContent, {
    encoding: 'utf-8',
  })
    .then(() => {
      callback(undefined, content)
    })
    // istanbul ignore next
    .catch(
      /* istanbul ignore next */ (err) => {
        callback(err, content)
      }
    )
}

export default loader
