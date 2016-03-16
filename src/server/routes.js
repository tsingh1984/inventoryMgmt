var todoRoutes = require('server/todos/routes');
var inventoryRoutes = require('server/inventory/routes');

module.exports = function routes(app) {
	app.use('/todos', todoRoutes);
	app.use('/inventory', inventoryRoutes);
};