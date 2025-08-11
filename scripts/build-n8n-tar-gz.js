const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const tar = require('tar');


const releaseDir = path.resolve(__dirname, '../');
const n8nSource = path.resolve(__dirname, '../n8n-dist');
const n8nZip = path.join(releaseDir, 'n8n-dist.tar.gz');

async function compressFolder(sourceDir, outputFile) {
  await tar.c(
    {
      gzip: false,
      file: outputFile,
      cwd: sourceDir, // compress contents of this folder
    },
    ['.'] // all files in cwd
  );
  console.log('Compression complete:', outputFile);
}

(async () => {
  try {
    console.log('Zipping n8n-dist folder...');
    await compressFolder(n8nSource, n8nZip);
    console.log('Folder zipped to:', n8nZip);
  } catch (err) {
    console.error('Error during packaging:', err);
    process.exit(1);
  }
})();
