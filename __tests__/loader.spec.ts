/**
 * @jest-environment node
 */
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import compiler from './compiler';

const nestedExportContent = `interface CSSModules {
   a: string;
   b: string;
 }
 export const styles: CSSModules;
 export default styles;`;

const namedExportContent = `export const a: string;
  export const b: string;`;

const filePath = 'fixtures/example.module.css';
const noModulesFilePath = 'fixtures/no-modules.css';
const namedCSSFilePath = 'fixtures/named.module.css';
const lessFilePath = 'fixtures/less.module.less';

function getDeclarationFilePath(filePath: string) {
  return path.resolve(__dirname, filePath + '.d.ts');
}

async function format(content: string) {
  const prettier = await import('prettier');
  const config = await prettier.resolveConfig(__filename);
  return prettier.format(content, {
    ...config,
    parser: 'typescript',
  });
}

test('Basic', async () => {
  await compiler(filePath);
  const output = await promisify(fs.readFile)(getDeclarationFilePath(filePath), {
    encoding: 'utf-8',
  });
  const formattedOutput = await format(output);
  const formattedContent = await format(nestedExportContent);
  expect(formattedOutput).toEqual(formattedContent);
});

test('Named export', async () => {
  await compiler(namedCSSFilePath, {
    modules: {
      namedExport: true,
    },
  });
  const output = await promisify(fs.readFile)(getDeclarationFilePath(namedCSSFilePath), {
    encoding: 'utf-8',
  });

  const formattedOutput = await format(output);
  const formattedContent = await format(namedExportContent);
  expect(formattedOutput).toEqual(formattedContent);
});

test('No Modules', async () => {
  await compiler(noModulesFilePath, {
    modules: false,
  });
  expect(fs.existsSync(getDeclarationFilePath(noModulesFilePath))).toBe(false);
});

test('Auto Modules', async () => {
  await compiler(noModulesFilePath, {
    modules: {
      auto: true,
    },
  });
  expect(fs.existsSync(getDeclarationFilePath(noModulesFilePath))).toBe(false);
});

test('CSS Preprocessor', async () => {
  await compiler(lessFilePath);
  const output = await promisify(fs.readFile)(getDeclarationFilePath(lessFilePath), {
    encoding: 'utf-8',
  });
  const formattedOutput = await format(output);
  const formattedContent = await format(nestedExportContent);
  expect(formattedOutput).toEqual(formattedContent);
});
