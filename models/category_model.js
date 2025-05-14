const db = require('./db');

const Category = function (category) {
    this.category_id = category.category_id;
    this.name = category.name;
};

Category.getAll = async (where = {}) => {
    const query = `SELECT * FROM Category${  Object.keys(where).length ? ' WHERE category_id = ?' : ''}`;
    const params = Object.keys(where).length ? [where.category_id] : [];
    const rows = await db.query(query, params);
    return rows;
};

Category.create = async (category) => {
    const query = 'INSERT INTO Category (name) VALUES (?)';
    const result = await db.query(query, [category.name]);
    return result;
};

Category.update = async (id, category) => {
    const query = 'UPDATE Category SET name = ? WHERE category_id = ?';
    const result = await db.query(query, [category.name, id]);
    return result;
};

Category.delete = async (id) => {
    const query = 'DELETE FROM Category WHERE category_id = ?';
    const result = await db.query(query, [id]);
    return result;
};

module.exports = Category;