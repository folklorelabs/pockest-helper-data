require('dotenv').config();
const fs = require('fs');
const fetchFromSheet = require('./syncMonsterSheetData/fetchFromSheet');

const DATA_DIR = './';
const MONSTER_FILE = 'monsters';
const MONSTER_RANGE = 'Live!A:I';
const HASHES_FILE = 'hashes';
const HASHES_RANGE = 'LiveHashes!A:B';

(async () => {
  const monsters = await fetchFromSheet(MONSTER_RANGE);
  const hashes = await fetchFromSheet(HASHES_RANGE);
  if (!await fs.existsSync(DATA_DIR)) {
    await fs.mkdirSync(DATA_DIR);
  }
  await fs.writeFileSync(`${DATA_DIR}/${MONSTER_FILE}.json`, JSON.stringify(monsters, null, 4));
  await fs.writeFileSync(`${DATA_DIR}/${MONSTER_FILE}.min.json`, JSON.stringify(monsters));
  await fs.writeFileSync(`${DATA_DIR}/${HASHES_FILE}.json`, JSON.stringify(hashes, null, 4));
  await fs.writeFileSync(`${DATA_DIR}/${HASHES_FILE}.min.json`, JSON.stringify(hashes));
})();
