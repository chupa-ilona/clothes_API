const createError = require('http-errors');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'Clothing Inventory API',
            description: 'API Documentation for Clothing Inventory Management Service'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server'
            }
        ],
        components: {
            schemas: {
                Category: {
                    type: 'object',
                    properties: {
                        category_id: { type: 'integer' },
                        name: { type: 'string' }
                    }
                },
                Size: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        description: { type: 'string' }
                    }
                },
                Product: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        category_id: { type: 'integer' },
                        price: { type: 'number' }
                    }
                },
                Inventory: {
                    type: 'object',
                    properties: {
                        inventory_id: { type: 'integer' },
                        product_id: { type: 'integer' },
                        size_id: { type: 'string' },
                        quantity: { type: 'integer' }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        username: { type: 'string' },
                        password: { type: 'string' },
                        role: { type: 'string', enum: ['admin', 'worker'] },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                }
            }
        }
    },
    apis: [
        './routes/*.js',
        './controllers/*.js'
    ]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;