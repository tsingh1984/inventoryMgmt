import _ from 'lodash';

export default function($scope, inventoryFactory){
	let params = {
		addProduct: false,
		editMode: false
	};

	$scope.editOnClick = () => {
		$scope.editMode = true;
	};

	$scope.editOffClick = () => {
		$scope.editMode = false;
	};

	$scope.onAddProductClick = () => {
		$scope.addProduct = true;
	};

	$scope.onAddProductCancelClick = () => {
		$scope.addProduct = false;
	};

	$scope.onEditClick = product => {
		product.isEditing = true;
	}
	
	$scope.onEditCancelClick = product => {
		product.isEditing = false;
	}

	inventoryFactory.getProducts($scope); 
	
	const { onAddStockClick,
			onSubtractStockClick,
			createProduct,
			onSaveClick,
			onDeleteClick,
			getWebsiteData
			} = inventoryFactory;

	$scope.createProduct = _.partial(createProduct, $scope);
	$scope.onAddStockClick = _.partial(onAddStockClick, $scope);
	$scope.onSubtractStockClick = _.partial(onSubtractStockClick, $scope);
	$scope.onSaveClick = _.partial(onSaveClick, $scope);
	$scope.onDeleteClick = _.partial(onDeleteClick, $scope);
	$scope.getWebsiteData = _.partial(getWebsiteData, $scope);

}