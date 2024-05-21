import { parse } from 'acorn';
import { simple as simpleWalk } from 'acorn-walk';
// import loaderUtils from 'loader-utils'
import fs from 'fs';
import { promisify } from 'util';
import * as webpack from 'webpack';

// const schema = {
//   type: 'object',
//   properties: {},
// }

const loader: webpack.LoaderDefinition = async function (content: string) {
  const declarationPath = this.resourcePath + '.d.ts';
  const parsed = parse(content, {
    sourceType: 'module',
    ecmaVersion: 'latest',
  });

  const namedExportKeys: string[] = [];
  const nestedExportKeys: string[] = [];

  simpleWalk(parsed, {
    ExpressionStatement(node) {
      simpleWalk(node, {
        // console.log(node)
        AssignmentExpression(node: any) {
          simpleWalk(node, {
            Property(node: any) {
              const key = node.key.value;
              nestedExportKeys.push(key);
            },
          });
        },
      });
    },
    ExportNamedDeclaration(node) {
      simpleWalk(node, {
        VariableDeclarator(node: any) {
          namedExportKeys.push(node.id.name);
        },
      });
    },
  });

  if (!nestedExportKeys.length && !namedExportKeys.length) {
    return content;
  }

  const nestedExportDeclarations = nestedExportKeys.map((key) => `${key}: string;`).join('\n');

  const namedExportDeclarations = namedExportKeys.map((key) => `export const ${key}: string;`).join('\n');

  const nestedContent = nestedExportKeys.length
    ? `
  interface CSSModules {
    ${nestedExportDeclarations}
  }
  export const styles: CSSModules
  export default styles
`
    : '';

  const namedContent = namedExportKeys.length ? namedExportDeclarations : '';

  const fileContent = [nestedContent, namedContent].join('\n');

  const prettier = (await import('prettier')).default;

  const config = await prettier.resolveConfig(declarationPath);

  const formattedContent = await prettier.format(fileContent, {
    ...config,
    parser: 'typescript',
  });

  try {
    await promisify(fs.writeFile)(declarationPath, formattedContent, {
      encoding: 'utf-8',
    });
  } catch (error) {}
  return content;
};

export default loader;
