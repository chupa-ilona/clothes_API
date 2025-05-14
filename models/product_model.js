const db = require('./db');

// constructor
// eslint-disable-next-line func-names
const Products = function (product) {
    this.id = product.id;
    this.name = product.name;
    this.category_id = product.category_id;
    this.price = product.price;
};

Products.getAll = async (where = {}) => {
    const query = `SELECT * FROM Products${  Object.keys(where).length ? ' WHERE id = ?' : ''}`;
    const params = Object.keys(where).length ? [where.id] : [];
    const rows = await db.query(query, params);
    return rows;
};

Products.create = async (product) => {
    const query = 'INSERT INTO Products (name, category_id, price) VALUES (?, ?, ?)';
    const result = await db.query(query, [product.name, product.category_id, product.price]);
    return result;
};

Products.update = async (id, product) => {
    const query = 'UPDATE Products SET name = ?, category_id = ?, price = ? WHERE id = ?';
    const result = await db.query(query, [product.name, product.category_id, product.price, id]);
    return result;
};

Products.delete = async (id) => {
    const query = 'DELETE FROM Products WHERE id = ?';
    const result = await db.query(query, [id]);
    return result;
};

module.exports = Products;