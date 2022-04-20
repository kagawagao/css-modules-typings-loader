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

const loader: webpack.LoaderDefinition = function (content: string, sourceMap) {
  const callback = this.async()
  const declarationPath = this.resourcePath + '.d.ts'
  const parsed = parse(content, {
    sourceType: 'module',
    ecmaVersion: 'latest',
  })

  const classes: Record<string, string> = {}

  simpleWalk(parsed, {
    ExpressionStatement(node) {
      simpleWalk(node, {
        AssignmentExpression(node: any) {
          simpleWalk(node, {
            Property(node: any) {
              const key = node.key.value
              const value = node.value.value
              classes[key] = value
            },
          })
        },
      })
    },
    ExportNamedDeclaration(node) {
      simpleWalk(node, {
        VariableDeclarator(node: any) {
          const key = node.id.name
          const value = node.init.value
          classes[key] = value
        },
      })
    },
  })

  const keys = Object.keys(classes)

  if (!keys.length) {
    callback(undefined, content)
    return
  }

  // const declarations = keys.map((key) => `${key}: string;`).join('\n')

  const fileContent = `
  export const cssModules = ${JSON.stringify(classes, null, 2)}
  export default cssModules
`
  const prettierConfig = prettier.resolveConfig.sync(declarationPath)

  const formattedContent = prettier.format(fileContent, {
    ...prettierConfig,
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
