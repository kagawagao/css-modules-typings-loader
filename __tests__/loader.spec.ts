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
const declarationFilePath = path.resolve(__dirname, filePath + '.d.ts')

function format(content: string) {
  return prettier.format(content, {
    parser: 'typescript',
  })
}

test('Basic', async () => {
  await compiler(filePath)
  const output = await promisify(fs.readFile)(declarationFilePath, {
    encoding: 'utf-8',
  })
  expect(format(output)).toEqual(format(content))
})

test('Named export', async () => {
  await compiler(filePath, {
    modules: {
      namedExport: true,
    },
  })
  const output = await promisify(fs.readFile)(declarationFilePath, {
    encoding: 'utf-8',
  })

  expect(format(output)).toEqual(format(content))
})
