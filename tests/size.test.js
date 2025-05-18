const sizeController = require('../controllers/size_controllers');
const Size = require('../models/size_model');
const db = require('../models/db');

// Мокуємо модель Size
jest.mock('../models/size_model');

describe('Size Controller CRUD Tests', () => {
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

  // Create - тест для створення розміру
  it('createSize - створює новий розмір', async () => {
    // Підготовка
    const sizeData = {
      id: 'XL',
      description: 'Extra Large'
    };
    req.body = sizeData;
    Size.create.mockResolvedValue({ affectedRows: 1 });

    // Виконання
    await sizeController.createSize(req, res);

    // Перевірка
    expect(Size.create).toHaveBeenCalledWith({
      id: sizeData.id,
      description: sizeData.description
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      id: sizeData.id,
      description: sizeData.description
    }));
  });

  // Read - тест для отримання розміру
  it('getSizeById - повертає розмір за ID', async () => {
    // Підготовка
    const sizeId = 'XL';
    const size = { 
      id: sizeId, 
      description: 'Extra Large'
    };
    req.params.id = sizeId;
    Size.getAll.mockResolvedValue([size]);

    // Виконання
    await sizeController.getSizeById(req, res);

    // Перевірка
    expect(Size.getAll).toHaveBeenCalledWith({ id: sizeId });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(size);
  });

  // Read All - тест для отримання всіх розмірів
  it('getAllSizes - повертає всі розміри', async () => {
    // Підготовка
    const sizes = [
      { id: 'S', description: 'Small' },
      { id: 'M', description: 'Medium' },
      { id: 'L', description: 'Large' },
      { id: 'XL', description: 'Extra Large' }
    ];
    Size.getAll.mockResolvedValue(sizes);

    // Виконання
    await sizeController.getAllSizes(req, res);

    // Перевірка
    expect(Size.getAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(sizes);
  });

  // Update - тест для оновлення розміру
  it('updateSize - оновлює існуючий розмір', async () => {
    // Підготовка
    const sizeId = 'XL';
    const sizeData = {
      description: 'Very Extra Large'
    };
    req.params.id = sizeId;
    req.body = sizeData;
    Size.update.mockResolvedValue({ affectedRows: 1 });

    // Виконання
    await sizeController.updateSize(req, res);

    // Перевірка
    expect(Size.update).toHaveBeenCalledWith(sizeId, {
      description: sizeData.description
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Розмір оновлено',
      id: sizeId,
      description: sizeData.description
    }));
  });

  // Delete - тест для видалення розміру
  it('deleteSize - видаляє розмір', async () => {
    // Підготовка
    const sizeId = 'XL';
    req.params.id = sizeId;
    Size.delete.mockResolvedValue({ affectedRows: 1 });

    // Виконання
    await sizeController.deleteSize(req, res);

    // Перевірка
    expect(Size.delete).toHaveBeenCalledWith(sizeId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Розмір успішно видалено'
    }));
  });
});