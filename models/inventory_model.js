const db = require('./db');

// constructor
// eslint-disable-next-line func-names
const Inventory = function (inventory) {
    this.inventory_id = inventory.inventory_id;
    this.product_id = inventory.product_id;
    this.size_id = inventory.size_id;
    this.quantity = inventory.quantity;
};

Inventory.getAll = async (where = {}) => {
    try {
        let query = 'SELECT * FROM Inventory';
        const params = [];
        if (where.inventory_id) {
            query += ' WHERE inventory_id = ?';
            params.push(where.inventory_id);
        }
        console.log('Executing query:', query, 'with params:', params);
        const rows = await db.query(query, params);
        console.log('Query result:', rows);
        return rows;
    } catch (error) {
        console.error('Error in Inventory.getAll:', error);
        throw error;
    }
};

Inventory.create = async (inventory) => {
    try {
        const query = 'INSERT INTO Inventory (product_id, size_id, quantity) VALUES (?, ?, ?)';
        const result = await db.query(query, [inventory.product_id, inventory.size_id, inventory.quantity]);
        return result;
    } catch (error) {
        console.error('Error in Inventory.create:', error);
        throw error;
    }
};

Inventory.update = async (id, inventory) => {
    try {
        const query = 'UPDATE Inventory SET product_id = ?, size_id = ?, quantity = ? WHERE inventory_id = ?';
        const result = await db.query(query, [inventory.product_id, inventory.size_id, inventory.quantity, id]);
        return result;
    } catch (error) {
        console.error('Error in Inventory.update:', error);
        throw error;
    }
};

Inventory.delete = async (id) => {
    try {
        const query = 'DELETE FROM Inventory WHERE inventory_id = ?';
        const result = await db.query(query, [id]);
        return result;
    } catch (error) {
        console.error('Error in Inventory.delete:', error);
        throw error;
    }
};

module.exports = Inventory;
