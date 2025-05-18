const categoryController = require('../controllers/category_controllers');
const Category = require('../models/category_model');
const db = require('../models/db');

// Мокуємо модель Category
jest.mock('../models/category_model');

describe('Category Controller CRUD Tests', () => {
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

  // Create - тест для створення категорії
  it('createCategory - створює нову категорію', async () => {
    // Підготовка
    const categoryData = {
      name: 'Тестова категорія'
    };
    req.body = categoryData;
    Category.create.mockResolvedValue({ insertId: 1 });
    
    // Виконання
    await categoryController.createCategory(req, res);
    
    // Перевірка
    expect(Category.create).toHaveBeenCalledWith(categoryData);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      id: 1,
      name: categoryData.name
    }));
  });

  // Read - тест для отримання категорії
  it('getCategoryById - повертає категорію за ID', async () => {
    // Підготовка
    const categoryId = 1;
    const category = { category_id: categoryId, name: 'Тестова категорія' };
    req.params.id = categoryId;
    Category.getAll.mockResolvedValue([category]);
    
    // Виконання
    await categoryController.getCategoryById(req, res);
    
    // Перевірка
    expect(Category.getAll).toHaveBeenCalledWith({ id: categoryId });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(category);
  });

  // Update - тест для оновлення категорії
  it('updateCategory - оновлює існуючу категорію', async () => {
    // Підготовка
    const categoryId = 1;
    const categoryData = {
      name: 'Оновлена категорія'
    };
    req.params.id = categoryId;
    req.body = categoryData;
    Category.update.mockResolvedValue({ affectedRows: 1 });
    
    // Виконання
    await categoryController.updateCategory(req, res);
    
    // Перевірка
    expect(Category.update).toHaveBeenCalledWith(categoryId, categoryData);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Категорію оновлено',
      id: categoryId,
      name: categoryData.name
    }));
  });

  // Delete - тест для видалення категорії
  it('deleteCategory - видаляє категорію', async () => {
    // Підготовка
    const categoryId = 1;
    req.params.id = categoryId;
    Category.delete.mockResolvedValue({ affectedRows: 1 });
    
    // Виконання
    await categoryController.deleteCategory(req, res);
    
    // Перевірка
    expect(Category.delete).toHaveBeenCalledWith(categoryId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Категорію успішно видалено'
    }));
  });
});