import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the TypeScript config file
const tsConfigPath = path.resolve(__dirname, '../next.config.ts');
// Path where the compiled JS file should be
const compiledJsPath = path.resolve(__dirname, '../next.config.compiled.js');

try {
  // Compile the TypeScript file
  console.log('Compiling next.config.ts...');

  // First compile to a temporary file
  const tempOutFile = path.resolve(__dirname, '../next.config.temp.js');
  execSync(
    `npx tsc ${tsConfigPath} --target es2015 --module commonjs --outDir ${path.dirname(tempOutFile)}`,
    {
      stdio: 'inherit',
    },
  );

  // Then rename the file to the expected name
  const compiledFileName = path.basename(tsConfigPath).replace('.ts', '.js');
  const actualCompiledPath = path.resolve(
    path.dirname(tempOutFile),
    compiledFileName,
  );

  if (fs.existsSync(actualCompiledPath)) {
    fs.renameSync(actualCompiledPath, compiledJsPath);
    console.log(`Successfully compiled next.config.ts to ${compiledJsPath}`);
  } else {
    throw new Error(`Compiled file not found at ${actualCompiledPath}`);
  }
} catch (error) {
  console.error('Error compiling next.config.ts:', error);
  process.exit(1);
}
