import { parse } from 'acorn';
import { simple as simpleWalk } from 'acorn-walk';
// import loaderUtils from 'loader-utils'
import * as webpack from 'webpack';
import fs from 'fs';
import { promisify } from 'util';

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

  const keys: string[] = [];

  simpleWalk(parsed, {
    ExpressionStatement(node) {
      simpleWalk(node, {
        // console.log(node)
        AssignmentExpression(node: any) {
          simpleWalk(node, {
            Property(node: any) {
              const key = node.key.value;
              keys.push(key);
            },
          });
        },
      });
    },
    ExportNamedDeclaration(node) {
      simpleWalk(node, {
        VariableDeclarator(node: any) {
          keys.push(node.id.name);
        },
      });
    },
  });

  if (!keys.length) {
    return content;
  }

  const declarations = keys.map((key) => `${key}: string;`).join('\n');

  const fileContent = `
  interface CSSModules {
    ${declarations}
  }
  export const cssModules: CSSModules
  export default cssModules
`;

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
