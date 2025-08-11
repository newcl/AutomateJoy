const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const releaseDir = path.resolve(__dirname, '../dist');
const n8nSource = path.resolve(__dirname, '../n8n-dist');
const n8nZip = path.join(releaseDir, 'n8n-dist.zip');

async function zipFolder(sourceDir, outPath) {
  const output = fs.createWriteStream(outPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', resolve);
    archive.on('error', reject);

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

(async () => {
  try {
    console.log('Zipping n8n-dist folder...');
    await zipFolder(n8nSource, n8nZip);
    console.log('Folder zipped to:', n8nZip);

    // Now do your existing archiver logic for the final package:
    const exeName = fs.readdirSync(releaseDir).find(f => f.endsWith('.exe'));
    if (!exeName) {
      console.error('No portable exe found in release folder!');
      process.exit(1);
    }

    // Copy start cmd
    const startCmdSource = path.resolve(__dirname, '../startup.cmd');
    const startCmdTarget = path.join(releaseDir, 'startup.cmd');
    fs.copyFileSync(startCmdSource, startCmdTarget);

    const outputZipPath = path.join(releaseDir, 'MyApp_with_n8n.zip');
    console.log('Creating final delivery package...');
    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`Final package created: ${outputZipPath} (${archive.pointer()} bytes)`);
    });
    archive.on('error', err => { throw err; });

    archive.pipe(output);
    archive.file(path.join(releaseDir, exeName), { name: exeName });
    archive.file(n8nZip, { name: 'n8n-dist.zip' });
    archive.finalize();
  } catch (err) {
    console.error('Error during packaging:', err);
    process.exit(1);
  }
})();
