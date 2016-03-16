import angular from 'angular';
import uiRouter from 'angular-ui-router';
import todosFactory from 'factories/todo-factory';
import todosController from 'todos/todos';
import inventoryFactory from 'factories/inventory-factory';
import inventoryController from 'inventory/inventory';

const app = angular.module('app',
							[uiRouter, 
							todosFactory.name,
							inventoryFactory.name]);

app.config(($stateProvider, $urlRouterProvider, $locationProvider) => {
	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('todos', {
			url: '/',
			template: require('todos/todos.html'),
			controller: todosController
		})
		
		.state('about', {
			url: '/about',
			template: require('about/about.html')
		})

		.state('inventory', {
			url: '/inventory',
			template: require('inventory/inventory.html'),
			controller: inventoryController
		});

	//$locationProvider.html5Mode(true);  //trun back on after DEV, figure out what is going
});

export default app;