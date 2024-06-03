const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./blogs.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    createdAt TEXT NOT NULL
  )`);
});

const Blog = {
  findAll: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM blogs', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM blogs WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  create: (title, content) => {
    return new Promise((resolve, reject) => {
      const createdAt = new Date().toISOString();
      db.run('INSERT INTO blogs (title, content, createdAt) VALUES (?, ?, ?)', [title, content, createdAt], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, title, content, createdAt });
        }
      });
    });
  },

  updateById: (id, updates) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE blogs SET title = ?, content = ?, createdAt = ? WHERE id = ?',
        [updates.title, updates.content, new Date().toISOString(), id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, ...updates });
          }
        }
      );
    });
  },

  deleteById: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM blogs WHERE id = ?', [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id });
        }
      });
    });
  }
};

module.exports = Blog;
