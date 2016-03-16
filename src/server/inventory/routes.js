var mongoose = require('mongoose');
var Product = require('server/db/db').Product; //Schema from db file
var express = require('express');
var router = express.Router();
var WooCommerceAPI = require('woocommerce-api');




router.get('/', function(req,res) {

	Product.find(function(err,results) {
		if (err) { console.log(err); }
		res.send({ products: results });
	});
});

router.get('/websiteData', function(req,res) {
	var WooCommerce = new WooCommerceAPI({

	});

	WooCommerce.get('products?filter[limit]=-1', function(err, data, response) {
		if (err) { console.log(err); }
		res.send(response);
	});
});

router.post('/websiteData', function(req,res) {

	var updateData = req.body.updateData;

	var WooCommerce = new WooCommerceAPI({

	});

	WooCommerce.post('products/bulk', updateData, function(err, data, response) {
		console.log(data);
		if (err) { console.log(err); }
		res.send(response);
	});
});


router.post('/', function(req, res) {
	console.log("IN MAKE NEW PROD PART");

	var product = new Product(req.body);
	product.save(function(err) {
		if(err){ console.log(err); }
		res.send('PRODUCT SAVED');
	});
});

router.put('/:id', function(req,res){
	var id = req.params.id;
	Product.update({ _id: mongoose.Types.ObjectId(id) },{
		$set: { sku: req.body.sku,
				name: req.body.name,
				stock: req.body.stock,
				minStockAllowed: req.body.minStockAllowed, 
				inventoryStatus: req.body.inventoryStatus}
	}, function(err){
		if(err) { console.log(err); }
		res.send('PRODUCT UPDATED');
	});
});

router.delete('/:id', function(req,res) {
	var id = req.params.id;
	Product.remove({_id: mongoose.Types.ObjectId(id)}, function(err){
		if(err) { console.log(err); }
		res.send('PRODUCT DELETED');		
	});
});


module.exports = router;