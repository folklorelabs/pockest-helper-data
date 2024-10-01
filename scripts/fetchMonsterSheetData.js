require('dotenv').config();
const fs = require('fs');
const fetchFromSheet = require('./syncMonsterSheetData/fetchFromSheet');

const DATA_DIR = './v2';
const MONSTER_FILE = 'monsters';
const MONSTER_RANGE = 'Live!A:Z';
const HASHES_FILE = 'hashes';
const HASHES_RANGE = 'LiveHashes!A:Z';

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

  // also ensure we manually update v1 hashes for now to reduce reporting
  const LEGACY_EGG_IDS = ['W', 'G', 'Y', 'B', 'R', 'L'];
  const PLAN_REGEX = /^(\d*)([A|B|C][L|R])([T|S|P])([1-6])$/;
  const monstersV1 = monsters.map((m) => {
    if (!m?.planId) return m;
    const planIdSplit = PLAN_REGEX.exec(m.planId);
    const planEggString = planIdSplit[1];
    const planEggInt = parseInt(planEggString, 10);
    const planEggLetter = LEGACY_EGG_IDS[planEggInt - 1];
    if (!planEggLetter) return m;
    const planRouteId = planIdSplit[2];
    const primaryStatLetter = planIdSplit[3];
    const planAgeString = planIdSplit[4];
    const plan = `${planEggLetter}${planAgeString}${planRouteId}${primaryStatLetter}`;
    return {
      ...m,
      plan,
    }
  });
  await fs.writeFileSync(`./${MONSTER_FILE}.json`, JSON.stringify(monstersV1, null, 4));
  await fs.writeFileSync(`./${MONSTER_FILE}.min.json`, JSON.stringify(monstersV1));
  await fs.writeFileSync(`./${HASHES_FILE}.json`, JSON.stringify(hashes, null, 4));
  await fs.writeFileSync(`./${HASHES_FILE}.min.json`, JSON.stringify(hashes));
})();
