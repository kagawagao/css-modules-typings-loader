/**
 * @jest-environment node
 */
import compiler from './compiler'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import prettier from 'prettier'

const content = `interface CSSModules {
  a: string;
  b: string;
}
export const cssModules: CSSModules;
export default cssModules;`
const filePath = 'fixtures/example.module.css'
const noModulesFilePath = 'fixtures/no-modules.css'
const namedCSSFilePath = 'fixtures/named.module.css'
const lessFilePath = 'fixtures/less.module.less'

function getDeclarationFilePath(filePath) {
  return path.resolve(__dirname, filePath + '.d.ts')
}

function format(content: string) {
  const config = prettier.resolveConfig.sync(__filename)
  return prettier.format(content, {
    ...config,
    parser: 'typescript',
  })
}

test('Basic', async () => {
  await compiler(filePath)
  const output = await promisify(fs.readFile)(
    getDeclarationFilePath(filePath),
    {
      encoding: 'utf-8',
    }
  )
  expect(format(output)).toEqual(format(content))
})

test('Named export', async () => {
  await compiler(namedCSSFilePath, {
    modules: {
      namedExport: true,
    },
  })
  const output = await promisify(fs.readFile)(
    getDeclarationFilePath(namedCSSFilePath),
    {
      encoding: 'utf-8',
    }
  )

  expect(format(output)).toEqual(format(content))
})

test('No Modules', async () => {
  await compiler(noModulesFilePath, {
    modules: false,
  })
  expect(fs.existsSync(getDeclarationFilePath(noModulesFilePath))).toBe(false)
})

test('Auto Modules', async () => {
  await compiler(noModulesFilePath, {
    modules: {
      auto: true,
    },
  })
  expect(fs.existsSync(getDeclarationFilePath(noModulesFilePath))).toBe(false)
})

test('CSS Preprocessor', async () => {
  await compiler(lessFilePath)
  const output = await promisify(fs.readFile)(
    getDeclarationFilePath(lessFilePath),
    {
      encoding: 'utf-8',
    }
  )
  expect(format(output)).toEqual(format(content))
})
