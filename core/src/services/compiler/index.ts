import ts from 'typescript';

import { CompilerFileInfo } from './compiler';
import getModuleInfo from './getModuleInfo';
import getProjectPath from '../../tools/getProjectPath';
import reportDiagnostic from '../../util/reportDiagnostic';
import compileOptions from './compileOptions';
import formatHost from './formatHost';

const compileFile = async (
  rootFile: string,
  outDir: string,
  rootDir?: string,
): Promise<CompilerFileInfo | null> => {
  const moduleInfo = await getModuleInfo(rootFile);

  const program = ts.createProgram([rootFile], {
    ...compileOptions,
    outDir,
    rootDir: rootDir || (await getProjectPath()),
  });

  const emitResult = program.emit();
  const diagnostics = [
    ...ts.getPreEmitDiagnostics(program),
    ...emitResult.diagnostics,
    ...program.getSyntacticDiagnostics(),
  ];

  if (diagnostics && diagnostics.length) {
    diagnostics.forEach((diagnostic): void => {
      reportDiagnostic(diagnostic, formatHost);
    });
  }

  return moduleInfo;
};

export * from './compiler';

export default compileFile;
