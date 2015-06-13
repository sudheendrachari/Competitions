/* magic.js */
 
 
var exponential = angular.module('exponential', []);
 
exponential.controller('CurrencyCtrl', function($scope) {
 
	var API_ENDPOINT = 'http://openexchangerates.org/api/';
	var API_ID = '?app_id=26ccf6e1bdd64daeac3faf3aa87420ea';
	var currency_type_url =  API_ENDPOINT+'currencies.json'+API_ID;
	var latest_json_url = API_ENDPOINT+'latest.json'+API_ID;
	var curreny_type, currency;
	$scope.currency_type={};
	$scope.currency={};
	$scope.baseCurrency="USD";
	$scope.baseAmount = 1;
	$scope.error_msg = false;
	$.getJSON(currency_type_url , function( data ) {
		$scope.$apply(function(){
			$scope.currency_type = data;
		});
		$('#base_cur,#alt_cur').selectpicker('refresh');
	});
	$.getJSON(latest_json_url , function( data ) {
		$scope.$apply(function(){
			$scope.currency = data;
		});
	});	
	$scope.$watch("baseCurrency", function(newValue, oldValue) {
		if (newValue && newValue!=='USD') {
		console.log(latest_json_url+'&base='+newValue);
		$.getJSON(latest_json_url+'&base='+newValue , function( data ) {
			$scope.$apply(function(){
				$scope.currency = data;
				$scope.error_msg = false;
			});		
		}).error(function(err) { 
			if (err.status == 403) {
				$scope.$apply(function(){
					$scope.error_msg = 'Sorry, this costs... Changing base currency is only Enterprise/Unlimited customers. Only USD allowed';
				});
			};
		 });
	}
	});
/*Object.prototype.getKey = function(value){
  for(var key in this){
    if(this[key] == value){
      return key;
    }
  }
  return null;
};*/
$scope.sortNumeric = function  () {
	console.log(cArr);
	var cArr = $scope.otherCurrencies;
	var cType = $scope.currency.rates;
	var nasc = $scope.nasc;
	var new_arr = [];
	for (var i = 0; i < cArr.length; i++) {
		new_arr[i] = cType[cArr[i]];
	};
	bubbleSort(new_arr, cArr, nasc);
	$scope.nasc = !$scope.nasc;	
}
$scope.sortAlpha = function  () {
	if ($scope.aasc) {
	$scope.otherCurrencies.sort();
	}
	else{
	$scope.otherCurrencies.sort();
	$scope.otherCurrencies.reverse();	
	}
	$scope.aasc = !$scope.aasc
}
 
var bubbleSort =  function (a,b,c)
{
    var swapped;
    do {
        swapped = false;
        for (var i=0; i < a.length-1; i++) {
        	if (c) {
            if (a[i] > a[i+1]) {
            	a[i+1] = [a[i], a[i] = a[i+1]][0];
            	b[i+1] = [b[i], b[i] = b[i+1]][0];
                swapped = true;
            }
        }else{
            if (a[i] < a[i+1]) {
            	a[i+1] = [a[i], a[i] = a[i+1]][0];
            	b[i+1] = [b[i], b[i] = b[i+1]][0];
                swapped = true;
            }        	
        }
        }
    } while (swapped);
}
 
 
	//$scope.curreny_type = {"AED":"United Arab Emirates Dirham","AFN":"Afghan Afghani","ALL":"Albanian Lek","AMD":"Armenian Dram"};
	//$scope.currency = {"disclaimer":"ex","license":"Data","timestamp":1418457646,"base":"USD","rates":{"AED":3.672749,"AFN":57.795,"ALL":112.641399,"AMD":463.7}}
 
	$(function  () {
		$('#base_cur,#alt_cur').selectpicker();
	});
	//$scope.baseCurrency="ALL";
	//$scope.baseAmount = 1;
 
	
});
 