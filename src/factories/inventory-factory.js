import angular from 'angular';
import _ from 'lodash';

//List Of Packages Listed On The Website, contains: List of SKU's which make the package, and the Quantity of SKU in each PKG
const PKG_TO_PROD_ARRAY = {"PKG-001": {}, 
						   "PKG-002": {sku: ["LV-001"], quantity: [6]  }, 
						   "PKG-003": {sku: ["LV-004"], quantity: [6]  }, 
						   "PKG-004": {sku: ["LW-001"], quantity: [12] }, 
						   "PKG-005": {sku: ["LM-001","LM-003","LM-004"], quantity: [1,1,1] }};

//List Of Rare Items and Quantities which we wish to keep in our Personal Collection.
//999 indicates an Item that is no longer available on the Market, 
//Any quantity we have or purchase in the future should stay in the Person Collectio
const RARE_PROD_MIN_COLLECTION_STOCK = [{sku: "LMJ-001", quantity: 999},
										{sku: "LMJ-002", quantity: 3},
										{sku: "LMJ-003", quantity: 3},
										{sku: "LMJ-004", quantity: 999},
										{sku: "LMJ-005", quantity: 3},
										{sku: "LMJ-006", quantity: 2},
										{sku: "LMJ-007", quantity: 3},
										{sku: "LMJ-008", quantity: 999},
										{sku: "LMJ-009", quantity: 0},
										{sku: "LMJ-010", quantity: 999},
										{sku: "LMJ-011", quantity: 999},
										{sku: "LMJ-012", quantity: 3},
										{sku: "LMJ-013", quantity: 3},
										{sku: "LMJ-014", quantity: 999},
										{sku: "LMJ-015", quantity: 3},
										{sku: "LMJ-016", quantity: 2},
										{sku: "LMJ-017", quantity: 3},
										{sku: "LMJ-018", quantity: 2},
										{sku: "LMJ-019", quantity: 999},
										{sku: "LM-029" , quantity: 1}, 
										{sku: "LM-015" , quantity: 2},
										{sku: "LM-018" , quantity: 1},
										{sku: "LM-075" , quantity: 1},
										{sku: "LM-078" , quantity: 1},
										{sku: "LM-036" , quantity: 1},
										{sku: "LM-019" , quantity: 1},
										{sku: "LM-030" , quantity: 1},
										{sku: "LM-024" , quantity: 3},
										{sku: "LM-002" , quantity: 13}];

const MAX_PROD_UPDATE_LIMIT = 100;



const inventoryFactory = angular.module('app.inventoryFactory',[])
.factory('inventoryFactory', ($http) => {
	
	function getWebsiteData($scope) {
		console.log("GET WEBSITE DATA");
		$http.get('/inventory/websiteData').success(response => {
			$scope.websiteProdcuts = response;
			compareInventory($scope);
		});
	}

	function compareInventory($scope) {
		var websiteProducts = $scope.websiteProdcuts.products;
		$scope.websiteProductUpdateData = [];
		
		for( var i in websiteProducts ){
			if( $scope.websiteProductUpdateData.length == MAX_PROD_UPDATE_LIMIT ) { postUpdatedWebsiteProducts($scope); }

			if(websiteProducts[i].sku.indexOf("PKG") > -1){
				//UPDATE PACKAGES....
				//No Packages listed in Warehouse List, so calculate how many packages we could sell with current stock levels. 
				var pkgDetails = PKG_TO_PROD_ARRAY[websiteProducts[i].sku];
				updatePackageProducts($scope, websiteProducts[i].id, pkgDetails);
			} else { 
				updateWebsiteInventoryQuantity($scope, websiteProducts[i]);
			}
		}
		//console.log($scope.websiteProductUpdateData);
		postUpdatedWebsiteProducts($scope);
	}

	function postUpdatedWebsiteProducts($scope) {
		if( ($scope.websiteProductUpdateData[0] != null) ){

			$http.post('/inventory/websiteData', {updateData: {products: $scope.websiteProductUpdateData} }).success(response => {
				console.log(response);	
			});
		}	
	}

	function updateWebsiteInventoryQuantity($scope, websiteProduct) {
		var inHouseProducts = $scope.products;

		for(var i in inHouseProducts) {
			if(inHouseProducts[i].sku == websiteProduct.sku && inHouseProducts[i].stock != websiteProduct.stock_quantity) {
				// Checks an array of RARE ITEMS to calculate how many to keep in our collection.
				var collectionDetails = RARE_PROD_MIN_COLLECTION_STOCK.filter(function(e) { return (e.sku === websiteProduct.sku); });
				if( collectionDetails.length == 1) { 
					updateRareProducts($scope, websiteProduct, inHouseProducts[i], collectionDetails[0].quantity);
				} else {
					$scope.websiteProductUpdateData.push({id: websiteProduct.id, stock_quantity: inHouseProducts[i].stock });	
				}
			} 
		}
	}

	function updateRareProducts($scope, websiteProduct, inHouseProduct, minCollectionStock){

		if((inHouseProduct.stock - minCollectionStock) <= 0) {
			$scope.websiteProductUpdateData.push({id: websiteProduct.id, stock_quantity: 0, in_stock: false }); 
		} else {
			$scope.websiteProductUpdateData.push({id: websiteProduct.id, stock_quantity: (inHouseProduct.stock - minCollectionStock), in_stock: true }); 
		}	
	}

	function updatePackageProducts($scope, websiteProductID, pkgDetails){
		//console.log("*" + websiteProduct.sku + ":  + website stock = "  + websiteProduct.stock_quantity); 
		var inHouseProducts = $scope.products;
		var lowestStockPossible = 10000; 
		var packageProducts = [];
		
		for (var i = pkgDetails.sku.length - 1; i >= 0; i--) {
			var foundProduct = inHouseProducts.filter(function(e) {
					return (e.sku === pkgDetails.sku[i]);
			})
			packageProducts.push(foundProduct[0]);
		};	

		
		for (var i in packageProducts) {
			for(var j in pkgDetails.sku) {
				if (packageProducts[i].sku == pkgDetails.sku[j] && 
					packageProducts[i].stock / pkgDetails.quantity[j] < lowestStockPossible) {
						lowestStockPossible =  (packageProducts[i].stock - (packageProducts[i].stock % pkgDetails.quantity[j]))/pkgDetails.quantity[j];
				}
			}
		}

		$scope.websiteProductUpdateData.push({ id: websiteProductID, stock_quantity: lowestStockPossible }); 
	}

	function getProducts($scope) {
		console.log("INSIDE GET PRODUCTS");
		$http.get('/inventory').success(response => {
			$scope.products = response.products;
		});
	}

	function createProduct($scope) {
		console.log("IN createProduct");
		if (!$scope.data.createProductSKU || !$scope.data.createProductName || !$scope.data.createProductStock) { return; } //ignore empty fields

		$http.post('/inventory', {
			sku: $scope.data.createProductSKU,
			name: $scope.data.createProductName,
			stock: $scope.data.createProductStock,
			minStockAllowed: 3,
			inventoryStatus: "OK"
		}).success(response => {
			getProducts($scope);	
			$scope.data.createProductSKU = '';
			$scope.data.createProductName = '';
			$scope.data.createProductStock = '';
		});
	}

	function onAddStockClick($scope, product) {
		product.stock += 1;
		updateInventoryStatus(product);
		updateProductByID($scope, product);
	}

	function onSubtractStockClick($scope, product) {
		product.stock -= 1;
		updateInventoryStatus(product);
		updateProductByID($scope, product);
	}

	function onSaveClick($scope, product) {
		console.log("IN onSaveClick");

		updateInventoryStatus(product);
		$http.put(`/inventory/${product._id}`, {sku: product.sku.toString(),
												name: product.name.toString(), 
												stock: product.stock,
												minStockAllowed: product.minStockAllowed, 
												inventoryStatus: product.inventoryStatus 
												}).success(
			response => {
				getProducts($scope);
				console.log(product);
				//$scope.editMode = false;
			});	
	}

	function updateProductByID($scope, product) {
		console.log(product);
		$http.put(`/inventory/${product._id}`, {sku: product.sku,
												name: product.name, 
												stock: product.stock,
												minStockAllowed: product.minStockAllowed, 
												inventoryStatus: product.inventoryStatus 
												}).success(
			response => {
				getProducts($scope);
			});	
	}

	function updateInventoryStatus(product){
		if (product.stock <= product.minStockAllowed && product.stock > 0) {
			product.inventoryStatus = "WARNING";
		} else if (product.stock <= product.minStockAllowed && product.stock <= 0) {
			product.inventoryStatus = "ORDER";
		} else {
			product.inventoryStatus = "OK";
		}
	}

	function onDeleteClick($scope, product) {

		$http.delete(`/inventory/${product._id}`).success(
			response => {
				getProducts($scope);
			});
	}



	return {
		onAddStockClick,
		onSubtractStockClick,
		createProduct,
		onSaveClick,
		getProducts,
		onDeleteClick,
		getWebsiteData
	};

});

export default inventoryFactory;