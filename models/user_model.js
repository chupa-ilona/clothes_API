const db = require('./db');

// constructor
// eslint-disable-next-line func-names
const User = function (user) {
    this.id = user.id;
    this.username = user.username;
    this.password = user.password;
    this.role = user.role;
    this.created_at = user.created_at;
};

User.getAll = async (where = {}) => {
    const query = `SELECT * FROM users${  Object.keys(where).length ? ' WHERE id = ?' : ''}`;
    const params = Object.keys(where).length ? [where.id] : [];
    const rows = await db.query(query, params);
    return rows;
};

User.create = async (user) => {
    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    const result = await db.query(query, [user.username, user.password, user.role]);
    return result;
};

User.update = async (id, user) => {
    const query = 'UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?';
    const result = await db.query(query, [user.username, user.password, user.role, id]);
    return result;
};

User.delete = async (id) => {
    const query = 'DELETE FROM users WHERE id = ?';
    const result = await db.query(query, [id]);
    return result;
};

module.exports = User;