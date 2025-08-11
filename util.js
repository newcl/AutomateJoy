const path = require('path');
const fs = require('fs');
const tar = require('tar');

// Your function here (or import it if in another file)
async function extractTarGzWithProgress(tarFile, outputDir, onProgress) {
  const stat = fs.statSync(tarFile);
  const totalSize = stat.size;

  console.log(`extracting from ${tarFile} to ${outputDir}`);
  let processedBytes = 0;

  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(tarFile);

    readStream.on('data', chunk => {
      processedBytes += chunk.length;
      if (onProgress) {
        onProgress(processedBytes / totalSize);
      }
    });

    readStream.on('error', reject);

    readStream
      .pipe(
        tar.x({
          C: outputDir,
        })
      )
      .on('error', reject)
      .on('end', () => {
        resolve();
      });
  });
}

// Test call:
(async () => {
  
  const testTarFile = String.raw`C:\Users\chenl\AppData\Local\Programs\pody\resources\n8n-dist.tar`;

  const outputFolder = String.raw`C:\Users\chenl\AppData\Local\Programs\pody\resources\n8n-dist`;

  // Make sure output folder exists or create it
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  try {
    await extractTarGzWithProgress(testTarFile, outputFolder, progress => {
      process.stdout.write(`Progress: ${(progress * 100).toFixed(2)}%\r`);
    });
    console.log('\nExtraction complete!');
  } catch (err) {
    console.error('Extraction failed:', err);
  }
})();