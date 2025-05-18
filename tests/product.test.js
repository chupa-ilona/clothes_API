const productController = require('../controllers/product_controllers');
const Products = require('../models/product_model');
const db = require('../models/db');

// Мокуємо модель Products
jest.mock('../models/product_model');

describe('Product Controller CRUD Tests', () => {
  let req, res;
  
  // Перед кожним тестом налаштовуємо req та res
  beforeEach(() => {
    req = {
      body: {},
      params: {}
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

  // Create - тест для створення продукту
  it('createProduct - створює новий продукт', async () => {
    // Підготовка
    const productData = {
      name: 'Тестовий продукт',
      category_id: 1,
      price: 99.99
    };
    req.body = productData;
    Products.create.mockResolvedValue({ insertId: 1 });

    // Виконання
    await productController.createProduct(req, res);

    // Перевірка
    expect(Products.create).toHaveBeenCalledWith({
      name: productData.name,
      category_id: productData.category_id,
      price: productData.price
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      id: 1,
      name: productData.name,
      category_id: productData.category_id,
      price: productData.price
    }));
  });

  // Read - тест для отримання продукту
  it('getProductById - повертає продукт за ID', async () => {
    // Підготовка
    const productId = 1;
    const product = { 
      id: productId, 
      name: 'Тестовий продукт', 
      category_id: 1, 
      price: 99.99 
    };
    req.params.id = productId;
    Products.getAll.mockResolvedValue([product]);

    // Виконання
    await productController.getProductById(req, res);

    // Перевірка
    expect(Products.getAll).toHaveBeenCalledWith({ id: productId });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(product);
  });

  // Read All - тест для отримання всіх продуктів
  it('getAllProducts - повертає всі продукти', async () => {
    // Підготовка
    const products = [
      { id: 1, name: 'Продукт 1', category_id: 1, price: 99.99 },
      { id: 2, name: 'Продукт 2', category_id: 2, price: 149.99 }
    ];
    Products.getAll.mockResolvedValue(products);

    // Виконання
    await productController.getAllProducts(req, res);

    // Перевірка
    expect(Products.getAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(products);
  });

  // Update - тест для оновлення продукту
  it('updateProduct - оновлює існуючий продукт', async () => {
    // Підготовка
    const productId = 1;
    const productData = {
      name: 'Оновлений продукт',
      category_id: 2,
      price: 149.99
    };
    req.params.id = productId;
    req.body = productData;
    Products.update.mockResolvedValue({ affectedRows: 1 });

    // Виконання
    await productController.updateProduct(req, res);

    // Перевірка
    expect(Products.update).toHaveBeenCalledWith(productId, {
      name: productData.name,
      category_id: productData.category_id,
      price: productData.price
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Продукт оновлено',
      id: productId,
      name: productData.name,
      category_id: productData.category_id,
      price: productData.price
    }));
  });

  // Delete - тест для видалення продукту
  it('deleteProduct - видаляє продукт', async () => {
    // Підготовка
    const productId = 1;
    req.params.id = productId;
    Products.delete.mockResolvedValue({ affectedRows: 1 });

    // Виконання
    await productController.deleteProduct(req, res);

    // Перевірка
    expect(Products.delete).toHaveBeenCalledWith(productId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Продукт успішно видалено'
    }));
  });
});