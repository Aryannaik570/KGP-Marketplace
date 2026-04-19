import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'deleted_mocks.json');

export const deletedIds = {
  add: (id) => {
    let ids = new Set();
    try {
      if (fs.existsSync(dbPath)) {
        ids = new Set(JSON.parse(fs.readFileSync(dbPath, 'utf8')));
      }
    } catch (e) {}
    ids.add(id);
    fs.writeFileSync(dbPath, JSON.stringify(Array.from(ids)));
  },
  has: (id) => {
    try {
      if (fs.existsSync(dbPath)) {
        const ids = new Set(JSON.parse(fs.readFileSync(dbPath, 'utf8')));
        return ids.has(id);
      }
    } catch (e) {}
    return false;
  }
};
