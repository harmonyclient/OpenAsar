const request = require('request');
const fs = require('original-fs'); // Use original-fs, not Electron's modified fs
const { createHash } = require('crypto');
const { dialog, app } = require('electron');
const { join } = require('path');

const asarPath = join(require.main.filename, '..');
const downloadPath = join(asarPath, '..', 'app.asar.download');

const asarUrl = `https://github.com/GooseMod/OpenAsar/releases/download/${oaVersion.split('-')[0]}/app.asar`;

const getAsarHash = () => createHash('sha512').update(fs.readFileSync(asarPath)).digest('hex');

module.exports = async () => { // (Try) update asar
  log('AsarUpdate', 'Updating...');

  if (!oaVersion.includes('-')) return;

  const originalHash = getAsarHash();

  await new Promise((res) => {
    const file = fs.createWriteStream(downloadPath);

    file.on('finish', () => {
      file.close();
      res();
    });

    request.get(asarUrl).on('response', r => r.pipe(file));
  });

  if (fs.readFileSync(downloadPath, 'utf8').startsWith('<')) return log('AsarUpdate', 'Download error');

  fs.copyFileSync(downloadPath, asarPath); // Overwrite actual app.asar
  fs.unlinkSync(downloadPath); // Delete downloaded temp file
};