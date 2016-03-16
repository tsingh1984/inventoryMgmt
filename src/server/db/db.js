var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/inventory-mgmt');

var Todo = mongoose.model('Todo', {
	task: String,
	isCompleted: Boolean,
	isEditing: Boolean
});

var Product = mongoose.model('Product', {
	sku: String,
	name: String,
	stock: Number,
	minStockAllowed: Number,
	inventoryStatus: {type: String, enum: ['OK','WARNING','ORDER']},
});

module.exports.Todo = Todo;
module.exports.Product = Product;
