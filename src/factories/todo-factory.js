import angular from 'angular';
import _ from 'lodash';

const todoFactory = angular.module('app.todoFactory',[])

.factory('todoFactory', ($http) => {

	function getTasks($scope) {
		$http.get('/todos').success(response => {
			$scope.todos = response.todos;
		});
	}

	function createTask($scope, params) {
		if (!$scope.createTaskInput) { return; } //ignore empty tasks

		$http.post('/todos', {
			task: $scope.createTaskInput,
			isCompleted: false,
			isEditing: false
		}).success(response => {
			getTasks($scope);	
			$scope.createTaskInput = '';
		});
	}

	function onSaveClick($scope, todo) {
		//update Task with user edited task
		$http.put(`/todos/${todo._id}`, {task: todo.updatedTask}).success(
			response => {
				getTasks($scope);
				todo.isEditing = false;
			});
	}

	function onDeleteClick($scope, todoToDelete){
		//_.remove($scope.todos, todo => todo.task===todoToDelete.task);
		$http.delete(`/todos/${todoToDelete._id}`).success(
			response => {
				getTasks($scope);
			});
	}

	function onCompletedClick(todo) {
		todo.isCompleted = !todo.isCompleted;
	}

	function onCancelClick(todo) {
		todo.isEditing = false;
	}

	function onEditClick(todo) {
		todo.updatedTask = todo.task;
		todo.isEditing = true;
	}

	function watchCreateTaskInput(params, $scope, val){
		const createHasInput = params.createHasInput;

		if(!val && createHasInput) {
			$scope.todos.pop();
		 	params.createHasInput = false;
		} else if (val && ! createHasInput) {
			$scope.todos.push({task: val, isCompleted: false });
		 	params.createHasInput = true;
		} else if (val && createHasInput) {
			$scope.todos[$scope.todos.length -1].task = val;
		}
	}
	return {
		getTasks,
		createTask,
		onSaveClick,
		onDeleteClick,
		watchCreateTaskInput,
		onCompletedClick,
		onCancelClick,
		onEditClick
	};

});

export default todoFactory;