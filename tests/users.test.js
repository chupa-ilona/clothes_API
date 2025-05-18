const userController = require('../controllers/user_controllers');
const User = require('../models/user_model');
const db = require('../models/db');

jest.mock('../models/user_model');

describe('User Controller CRUD Tests', () => {
  let req, res;
  
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

  afterAll(async () => {
    
    if (db.close && typeof db.close === 'function') {
      await db.close();
    } else if (db.pool && typeof db.pool.end === 'function') {
      await db.pool.end();
    }
    
    
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  
  it('createUser - створює нового користувача', async () => {
    
    const userData = {
      username: 'testuser',
      password: 'password12345',
      role: 'admin'
    };
    req.body = userData;
    User.create.mockResolvedValue({ insertId: 1 });

    
    await userController.createUser(req, res);

    
    expect(User.create).toHaveBeenCalledWith(userData);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      id: 1,
      username: userData.username
    }));
  });

  
  it('getUserById - повертає користувача за ID', async () => {
    
    const userId = 1;
    const user = { id: userId, username: 'testuser', role: 'admin' };
    req.params.id = userId;
    User.getAll.mockResolvedValue([user]);

    
    await userController.getUserById(req, res);

    
    expect(User.getAll).toHaveBeenCalledWith({ id: userId });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  
  it('updateUser - оновлює існуючого користувача', async () => {
    
    const userId = 1;
    const userData = {
      username: 'updateduser',
      password: 'newpassword12345',
      role: 'worker'
    };
    req.params.id = userId;
    req.body = userData;
    User.update.mockResolvedValue({ affectedRows: 1 });

    
    await userController.updateUser(req, res);

    
    expect(User.update).toHaveBeenCalledWith(userId, userData);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Користувача оновлено'
    }));
  });

  
  it('deleteUser - видаляє користувача', async () => {
    
    const userId = 1;
    req.params.id = userId;
    User.delete.mockResolvedValue({ affectedRows: 1 });

    
    await userController.deleteUser(req, res);

    
    expect(User.delete).toHaveBeenCalledWith(userId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Користувача успішно видалено'
    }));
  });
});