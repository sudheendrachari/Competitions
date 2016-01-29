var dataStore;
var initializeLeanModal = function() {
	jQuery('.modal-trigger').leanModal();
};
var initjQuery = function($) {
    $(function() {
        function storageAvailable(type) {
            try {
                var storage = window[type],
                    x = '__storage_test__';
                storage.setItem(x, x);
                storage.removeItem(x);
                return true;
            } catch (e) {
                return false;
            }
        }

        if (storageAvailable('localStorage')) {
            console.log('localStorage available');
            dataStore = localStorage;
        } else if (storageAvailable('sessionStorage')) {
            console.log('sessionStorage only available');
            dataStore = localStorage;
        }
        $('#nav-search-bar').click(function() {
            $('#logo-container').animate({
                'width': '0%'
            }, {
                duration: 500,
                queue: false
            });
            $('#nav-search-bar').animate({
                'width': '100%'
            }, {
                duration: 500,
                queue: false
            });
        });
        $('#nav-search-bar').focusout(function() {
            $('#nav-search-bar').animate({
                'width': '40%'
            }, {
                duration: 500,
                queue: false
            });
            $('#logo-container').animate({
                'width': '60%'
            }, {
                duration: 500,
                queue: false
            });
        });
        $('.button-collapse').sideNav();
        initializeLeanModal($);
        $('.tooltipped').tooltip({
            delay: 50
        });
    }); // end of document ready
};

initjQuery(jQuery); // end of jQuery name space


var FETCH_BOOKS = 'https://capillary.0x10.info/api/books?type=json&query=list_books';
// var bookmarks = [];
// 'use strict';
var capillary = angular.module('capillary', ['ngResource']);
capillary.controller('bookhub', function($scope, $resource, $http) {
    $scope.title = "BookHub";
    $scope.totalBooks = 0;
    $scope.bCount = 0;
    $resource(FETCH_BOOKS).get().$promise.then(function(res) {
        $scope.books = res.books;
        $scope.totalBooks = res.books.length;
        $scope.books.forEach(function(b) {
            if (dataStore && JSON.parse(dataStore.getItem('capillaryDataStore:' + b.id))) {
            	$scope.bCount++;
                b.bm = true;
            } else {
                b.bm = false;
            }
        });
    });
    var rx;
    $scope.search_input = '';
    $scope.showBookmarks = false;
    $scope.initializeLeanModal = initializeLeanModal;
    $scope.$watch('search_input', function(s) {
        rx = new RegExp('^' + ($scope.search_input || '.*'), 'ig');
        if (!$scope.books) return;
        var empty = true;
        $scope.books.forEach(function(book) {
        	if((book.name.search(rx) > -1) || (book.author.search(rx) > -1) || (book.rating.search(rx) > -1)){
        		empty = false;
        		jQuery('#bookTile'+book.id).show();
        	}else{
        		jQuery('#bookTile'+book.id).hide();
        	}
        });
        if (empty) { $scope.noresults ='No Results';} else {$scope.noresults = false; }
    });

    $scope.addBm = function(bId) {
        var selected = $scope.books.filter(function(bkmrk) {
            return bkmrk.id === bId;
        })[0];
        selected.bm = !selected.bm;
        dataStore.setItem('capillaryDataStore:' + bId, selected.bm);
        if (selected.bm) {
        	$scope.bCount++;
        } else{
        	$scope.bCount--;
        } 
    };
    var filterByBookmarks = function(showBm) {
        if (showBm) {
        	$scope.title = 'BookHub | Bookmarks';
            jQuery('.bookTile').not('.fav').hide();
        } else {
        	$scope.title = 'BookHub';
            jQuery('.bookTile').not('.fav').show();
        }

    };
    $scope.toggleBookmarks = function() {
        $scope.showBookmarks = !$scope.showBookmarks;
        filterByBookmarks($scope.showBookmarks);
    };
});

capillary.directive('initializeModal', function() {
    return function(scope) {
        if (scope.$last) { // all are rendered
            initjQuery(jQuery);
        }
    };
});
