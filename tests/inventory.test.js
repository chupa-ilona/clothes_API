const inventoryController = require('../controllers/inventory_controllers');
const Inventory = require('../models/inventory_model');
const db = require('../models/db');

// Мокуємо модель Inventory
jest.mock('../models/inventory_model');

describe('Inventory Controller CRUD Tests', () => {
  let req, res;
  
  // Перед кожним тестом налаштовуємо req та res
  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  // Після всіх тестів закриваємо з'єднання з базою даних
  afterAll(async () => {
    // Перевіряємо чи є метод close або end у db
    if (db.close && typeof db.close === 'function') {
      await db.close();
    } else if (db.pool && typeof db.pool.end === 'function') {
      await db.pool.end();
    }
    
    // Додаткова затримка для завершення всіх асинхронних операцій
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  // Create - тест для створення запису інвентарю
  it('createInventory - створює новий запис інвентарю', async () => {
    // Підготовка
    const inventoryData = {
      product_id: 1,
      size_id: 'L',
      quantity: 10
    };
    req.body = inventoryData;
    Inventory.create.mockResolvedValue({ insertId: 1 });

    // Виконання
    await inventoryController.createInventory(req, res);

    // Перевірка
    expect(Inventory.create).toHaveBeenCalledWith({
      product_id: inventoryData.product_id,
      size_id: inventoryData.size_id,
      quantity: inventoryData.quantity
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      id: 1,
      product_id: inventoryData.product_id,
      size_id: inventoryData.size_id,
      quantity: inventoryData.quantity
    }));
  });

  // Read - тест для отримання запису інвентарю
  it('getInventoryById - повертає запис інвентарю за ID', async () => {
    // Підготовка
    const inventoryId = 1;
    const inventory = { 
      inventory_id: inventoryId, 
      product_id: 1, 
      size_id: 'L', 
      quantity: 10 
    };
    req.params.id = inventoryId;
    Inventory.getAll.mockResolvedValue([inventory]);

    // Виконання
    await inventoryController.getInventoryById(req, res);

    // Перевірка
    expect(Inventory.getAll).toHaveBeenCalledWith({ inventory_id: inventoryId });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(inventory);
  });

  // Read All - тест для отримання всіх записів інвентарю
  it('getInventory - повертає всі записи інвентарю', async () => {
    // Підготовка
    const inventoryItems = [
      { inventory_id: 1, product_id: 1, size_id: 'L', quantity: 10 },
      { inventory_id: 2, product_id: 2, size_id: 'M', quantity: 5 }
    ];
    Inventory.getAll.mockResolvedValue(inventoryItems);

    // Виконання
    await inventoryController.getInventory(req, res);

    // Перевірка
    expect(Inventory.getAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(inventoryItems);
  });

  // Update - тест для оновлення запису інвентарю
  it('updateInventory - оновлює існуючий запис інвентарю', async () => {
    // Підготовка
    const inventoryId = 1;
    const inventoryData = {
      product_id: 2,
      size_id: 'XL',
      quantity: 15
    };
    req.params.id = inventoryId;
    req.body = inventoryData;
    Inventory.update.mockResolvedValue({ affectedRows: 1 });

    // Виконання
    await inventoryController.updateInventory(req, res);

    // Перевірка
    expect(Inventory.update).toHaveBeenCalledWith(inventoryId, {
      product_id: inventoryData.product_id,
      size_id: inventoryData.size_id,
      quantity: inventoryData.quantity
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Запис оновлено',
      id: inventoryId,
      product_id: inventoryData.product_id,
      size_id: inventoryData.size_id,
      quantity: inventoryData.quantity
    }));
  });

  // Delete - тест для видалення запису інвентарю
  it('deleteInventory - видаляє запис інвентарю', async () => {
    // Підготовка
    const inventoryId = 1;
    req.params.id = inventoryId;
    Inventory.delete.mockResolvedValue({ affectedRows: 1 });

    // Виконання
    await inventoryController.deleteInventory(req, res);

    // Перевірка
    expect(Inventory.delete).toHaveBeenCalledWith(inventoryId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Запис успішно видалено'
    }));
  });
});