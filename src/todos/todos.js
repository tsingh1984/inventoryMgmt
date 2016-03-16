import _ from 'lodash';

export default function($scope, todoFactory){

	let params = {
		createHasInput: false
	};

	todoFactory.getTasks($scope);
	
	const { createTask, 
			onSaveClick, 
			onDeleteClick, 
			watchCreateTaskInput, 
			onCompletedClick,
			onCancelClick,
			onEditClick } = todoFactory;

	$scope.onCompletedClick = _.partial(onCompletedClick);

	$scope.onEditClick = _.partial(onEditClick);
	
	$scope.onCancelClick = _.partial(onCancelClick);

	$scope.onSaveClick = _.partial(onSaveClick, $scope);

	$scope.onDeleteClick = _.partial(onDeleteClick, $scope);

	$scope.createTask = _.partial(createTask, $scope, params);
	
	$scope.$watch('createTaskInput', _.partial(watchCreateTaskInput, params, $scope));
}