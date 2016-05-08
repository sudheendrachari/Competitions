var app = angular.module('todo', []);
app.controller('todoController', function($scope) {
	$scope.items = {};
	var url = 'http://localhost:8090/fetch_todo';
	fetch(url).then(function(response) {
	  return response.json();
	}).then(function(data) {
	  console.log('fetch response:', data);
	  $scope.items = data;
	  $scope.$apply();

	}).catch(function() {
	  console.log("Fetch Failed");
	});
	$scope.b = [1,2,3];
	$scope.change = function(k,v) {
		var url = 'http://localhost:8090/toggle/'+v;
		fetch(url).then(function(response) {
		  return response.text();
		}).then(function(data) {
		  console.log('toggle response:', data);
		}).catch(function(err) {
			console.log( 'err:', err);
		});
	};
});

/*fetch(url).then(function(response) {
  return response.json();
}).then(function(data) {
  console.log(data);
}).catch(function() {
  console.log("Booo");
});*/