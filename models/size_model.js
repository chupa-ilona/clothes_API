const db = require('./db');

// constructor
// eslint-disable-next-line func-names
const Size = function (size) {
    this.id = size.id;
    this.description = size.description;
};

Size.getAll = async (where = {}) => {
    const query = `SELECT * FROM Size${  Object.keys(where).length ? ' WHERE id = ?' : ''}`;
    const params = Object.keys(where).length ? [where.id] : [];
    const rows = await db.query(query, params);
    return rows;
};

Size.create = async (size) => {
    const query = 'INSERT INTO Size (id, description) VALUES (?, ?)';
    const result = await db.query(query, [size.id, size.description]);
    return result;
};

Size.update = async (id, size) => {
    const query = 'UPDATE Size SET description = ? WHERE id = ?';
    const result = await db.query(query, [size.description, id]);
    return result;
};

Size.delete = async (id) => {
    const query = 'DELETE FROM Size WHERE id = ?';
    const result = await db.query(query, [id]);
    return result;
};

module.exports = Size;