/**
 * @jest-environment node
 */
import compiler from './compiler'
import path from 'path'
import fs from 'fs'

const filePath = 'fixtures/example.module.css'
const noModulesFilePath = 'fixtures/no-modules.css'
const namedCSSFilePath = 'fixtures/named.module.css'
const lessFilePath = 'fixtures/less.module.less'

function getDeclarationFilePath(filePath: string) {
  return path.resolve(__dirname, filePath + '.d.ts')
}

test('Basic', async () => {
  await compiler(filePath)
  const { default: cssModules } = await import(getDeclarationFilePath(filePath))
  expect(cssModules.a).toBeDefined()
  expect(cssModules.b).toBeDefined()
})

test('Named export', async () => {
  await compiler(namedCSSFilePath, {
    modules: {
      namedExport: true,
    },
  })

  const { cssModules } = await import(getDeclarationFilePath(filePath))
  expect(cssModules.a).toBeDefined()
  expect(cssModules.b).toBeDefined()
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

  const { default: cssModules } = await import(getDeclarationFilePath(filePath))
  expect(cssModules.a).toBeDefined()
  expect(cssModules.b).toBeDefined()
})
