'use strict';
var lv = angular.module('lv', ['datatables', 'ngResource', 'ngAudio']);
lv.controller('showCase', function($scope, $resource, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, ngAudio, $http) {
    $scope.alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    $scope.dictionary = [];
    $scope.bookmarks = {};
    $scope.message = '';
    $scope.api_hits = '';
    $scope.empty = true;
    $scope.clickHandler = function clickHandler(info) {
        // $scope.audio_url = info.audio_url;
        $scope.selectedWord = info.word;
    };

    //Backend URI's
    var ADD_FAVOURITE = $resource('http://localhost:8080/saveBookmark', {
        word: '@word',
        desc: '@desc'
    });
    var FETCH_DICTIONARY = $resource('http://localhost:8080/fetchData/:alphabet', {
        alphabet: '@alphabet'
    });
    var FETCH_BOOKMARKS = $resource('http://localhost:8080/fetchBookmarks');
    var CLEAR_BOOKMARKS = $resource('http://localhost:8080/clearBookmarks');
    var API_HITS = $resource('https://letsventure.0x10.info/api/dictionary.php?type=json&query=api_hits');
    $scope.DOWNLOAD_BOOKMARKS = 'http://localhost:8080/downloadBookmarks';

    (function api_hits() {
        API_HITS.get().$promise.then(function(res) {
           $scope.api_hits = res.api_hits;
        });
    }());

    function rowCallback(row, data) {
        $('td', row).unbind('click');
        $('td', row).bind('click', function() {
            $scope.$apply(function() {
                $scope.clickHandler(data);
            });
        });
        return row;
    }
    $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers')
        .withDisplayLength(10).withOption('rowCallback', rowCallback);
    $scope.dtColumnDefs = [
        DTColumnBuilder.newColumn('word').withTitle('Word'),
        DTColumnBuilder.newColumn('description').withTitle('Description'),
        DTColumnBuilder.newColumn('audio_url').withTitle(' ').notVisible(),
        DTColumnDefBuilder.newColumnDef(0).notSortable()
    ];

    $scope.selectAlphabet = function(alphabet) {
        FETCH_DICTIONARY.query({
            alphabet: alphabet
        }).$promise.then(function(dictionary) {
            $scope.dictionary = dictionary;
        });
    };

    var fetchBookmarks = function fetchBookmarks() {
        FETCH_BOOKMARKS.get().$promise.then(function(res) {
            $scope.bookmarks = res;
            if (Object.keys(res).length -2 > 0) {
                $scope.empty = false;
            }
            else{
                $scope.empty = true;
            }
        });
    };
    fetchBookmarks();
    
    
    $scope.addFavourite = function(index, $event) {
        var item = $scope.dictionary[index];
            ADD_FAVOURITE.get({
                    word: item.word,
                    desc: item.description
                })
                .$promise.then(function(res) {
                    console.log(item.word, 'added to Favourites');
                    fetchBookmarks();
                });
    };
    $scope.clearAll = function() {
        CLEAR_BOOKMARKS.get().$promise.then(function(res) {
            $scope.bookmarks = {};
             $scope.empty = true;
            console.log('Bookmarks cleared!');
        });
    };
    $scope.downloadBookmarks = function() {
        /*DOWNLOAD_BOOKMARKS.get().$promise.then(function(res) {
            console.log(res);
            console.log('Favourites Downloded to PDF!');
        });*/
        $http.get('http://localhost:8080/downloadBookmarks').then(function(res) {
            console.log(res);
        });
    };



    //default to 'A'
    $scope.selectAlphabet('A');




    //bootstrap aplhabetical navigation menu
    $(function() {
        var options = {
            initLetter: 'A',
            includeAll: false,
            includeNums: false,
            includeOther: false,
            showCounts: false,
            onClick: function(letter) {
                $scope.selectAlphabet(letter.toUpperCase());
            }

        };
        $('#alphaNav').listnav(options);
    });


});

lv.directive('toggleClass', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                attrs.toggleClass.split(' ').forEach(function(tclass) {
                    element.toggleClass(tclass);
                });
                
            });
        }
    };
});
