// books.js
const Router = require('koa-router');

// Prefix all routes with /books
const router = new Router({
	prefix: '/productos'
});

let productos = require('../persistencia/productos.json')


/* ---------------------- Routes ----------------------- */
/* API REST Get All */
router.get('/', (ctx, next) => {
	ctx.body = {
		status: 'success',
		message: productos
	};
	next();
});

/* API REST Get x ID */
router.get('/:id', (ctx, next) => {
	let getCurrentProduct = productos.filter(function(producto) {
		if (producto.id == ctx.params.id) {
			return true;
		}
	});

	if (getCurrentProduct.length) {
		ctx.body = getCurrentProduct[0];
	} else {
		ctx.response.status = 404;
		ctx.body = {
			status: 'error!',
			message: 'producto no encontrado con ese ID'
		};
	}
	next();
});

// /* API REST Post */
router.post('/new', (ctx, next) => {
	// Check if any of the data field not empty
	if (
		!ctx.request.body.id ||
		!ctx.request.body.name ||
		!ctx.request.body.author
	) {
		ctx.response.status = 400;
		ctx.body = {
			status: 'error',
			message: 'Please enter the data'
        }
	} else {
		let newProduct = productos.push({
			id: ctx.request.body.id,
			name: ctx.request.body.name,
			author: ctx.request.body.author
		});
		ctx.response.status = 201;
		ctx.body = {
			status: 'success',
			message: `Nuevo producto incorporado id: ${ctx.request.body.id} & name: ${
				ctx.request.body.name
			}`
		};
	}
	next();
});

// /* API REST Put */
router.put('/update/:id', (ctx, next) => {
	// Check if any of the data field not empty
	if (
		!ctx.request.body.id ||
		!ctx.request.body.name ||
		!ctx.request.body.author
	) {
		ctx.response.status = 400;
		ctx.body = {
			status: 'error',
			message: 'Please enter the data'
        }
	} else {
        let id = ctx.params.id
        let index = productos.findIndex(prodcuto => prodcuto.id == id)
		productos.splice(index,1,ctx.request.body)
		ctx.response.status = 201;
		ctx.body = {
			status: 'success',
			message: `New book updated with id: ${ctx.request.body.id} & name: ${
				ctx.request.body.name
			}`
		};
	}
	next();
});

// /* API REST Delete */
router.delete('/delete/:id', (ctx, next) => {
    let id = ctx.params.id
	let index = productos.findIndex(producto => producto.id == id)
    productos.splice(index,1)
    ctx.response.status = 200;
    ctx.body = {
        status: 'success',
        message: `Book deleted with id: ${id}`
    };
	next();
});


module.exports = router;