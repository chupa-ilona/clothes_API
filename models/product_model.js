const db = require('./db');


const Products = function (product) {
    this.id = product.id;
    this.name = product.name;
    this.category_id = product.category_id;
    this.price = product.price;
};

Products.getAll = async (where = {}) => {
    let query = 'SELECT * FROM Products';
    const params = [];

    const conditions = [];
    if (where.id) {
        conditions.push('id = ?');
        params.push(where.id);
    }
    if (where.name) {
        conditions.push('name LIKE ?');
        params.push(where.name);
    }
    if (where.category_id) {
        conditions.push('category_id = ?');
        params.push(where.category_id);
    }
    if (where.min_price) {
        conditions.push('price >= ?');
        params.push(where.min_price);
    }
    if (where.max_price) {
        conditions.push('price <= ?');
        params.push(where.max_price);
    }

    if (conditions.length) {
        query += ` WHERE ${  conditions.join(' AND ')}`;
    }

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
