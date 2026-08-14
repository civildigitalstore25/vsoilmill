const fs = require('fs');
const path = require('path');
const https = require('https');

const categories = [
  {
    name: '15kg-tins.jpg',
    url: 'https://images.unsplash.com/photo-1541256942802-7b29531f0df8?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: '5l-cans.jpg',
    url: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: '1l-bottles.jpg',
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'uthukuli-ghee.jpg',
    url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'herbal-oils.jpg',
    url: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80'
  }
];

const destDir = path.join(__dirname, '../public/images/categories');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function main() {
  for (const cat of categories) {
    const dest = path.join(destDir, cat.name);
    console.log(`Downloading ${cat.name}...`);
    try {
      await download(cat.url, dest);
      console.log(`Downloaded ${cat.name}`);
    } catch (e) {
      console.error(`Error downloading ${cat.name}:`, e.message);
    }
  }
}

main();
