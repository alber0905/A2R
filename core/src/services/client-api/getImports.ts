import path from 'path';
import ts from 'typescript';

import { ImportItem } from './client-api';

// '../../services/sockets' => '../dist/services/sockets'
// './getSocket' => '../dist/client-api/getSocket'
// '../../util/out' => '../dist/util/out'

// clientApiPath = /node_modules/a2r/server/



const getClientImportPath = (clientApiPath: string, importPath: string): string => {
  return importPath;
};

const getClauseIdentifier = (importPath: string, alias?: string): string => {
  if (alias) {
    return alias;
  }
  return path.basename(importPath, path.extname(importPath));
}

const getImportClause = ({ importPath, alias, namedImports }: ImportItem): ts.ImportClause => {
  if (namedImports && namedImports.length) {
    return ts.createImportClause(
      alias ? ts.createIdentifier(alias) : undefined,
      ts.createNamedImports(
        namedImports.map(
          (i): ts.ImportSpecifier => ts.createImportSpecifier(undefined, ts.createIdentifier(i)),
        ),
      ),
    );
  }
  return ts.createImportClause(
    ts.createIdentifier(getClauseIdentifier(importPath, alias)),
    undefined,
  );
};

const getImports = (
  printer: ts.Printer,
  sourceFile: ts.SourceFile,
  clientApiPath: string,
  imports: ImportItem[],
): string => {
  const declarations = imports.map((importInfo): string => {
    const { importPath } = importInfo;
    const clientImportPath = getClientImportPath(clientApiPath, importPath);
    const importClause = getImportClause(importInfo);
    const node = ts.createImportDeclaration(
      undefined,
      undefined,
      importClause,
      ts.createStringLiteral(clientImportPath),
    );

    return printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
  });

  return declarations.join('\n');
};

export default getImports;
