var app= angular.module('souvik',[
	'ui.router'
	]);

app.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
	.state('home',{
		url:'/home',
		templateUrl: 'partials/home_template.html',
		controller: 'homeCtrl'
	})

	$urlRouterProvider.otherwise('/home');
})