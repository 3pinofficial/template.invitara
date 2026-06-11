const fs = require('fs');
const path = require('path');

function copyFolderRecursiveSync(source, target) {
  let files = [];

  // Check if folder needs to be created or integrated
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }

  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        const curTarget = path.join(targetFolder, file);
        fs.copyFileSync(curSource, curTarget);
        console.log(`Copied: ${curSource} -> ${curTarget}`);
      }
    });
  }
}

try {
  const src = '/Users/jai/3pin/Invitara/saas_1/public';
  const dest = '/Users/jai/3pin/Invitara/invitara.templates';
  
  // Copy all subfolders of src directly into dest/public
  const subdirs = fs.readdirSync(src);
  subdirs.forEach(file => {
    const fullPath = path.join(src, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      copyFolderRecursiveSync(fullPath, path.join(dest, 'public'));
    } else {
      const destPath = path.join(dest, 'public', file);
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(fullPath, destPath);
      console.log(`Copied: ${fullPath} -> ${destPath}`);
    }
  });
  console.log('Copy completed successfully!');
} catch (err) {
  console.error('Error during copy:', err);
  process.exit(1);
}
