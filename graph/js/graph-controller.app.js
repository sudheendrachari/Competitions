(function() {
    'use strict';
    angular.module('app')
        .controller('GraphController', GraphController);
    GraphController.$inject = ['$scope', '$mdToast'];

    function GraphController($scope, $mdToast) {
        let scope = this;
        scope.name = "asdf";
        scope.text = "asdfdsff";
        scope.rerender = 0;
        scope.data = { nodes: [], links: [] };
        scope.generateGraph = generateGraph;
        scope.toast = showToast;
        //---//

        function showToast(msg) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(msg)
                .position('bottom right')
                .hideDelay(3000)
            );
        }

        function letterDensity(name, text) {
            let obj = {},
                nameHash = {},
                whiteSpace = /\s/g;
            name.replace(whiteSpace, '').split('').forEach(function(letter) {
                nameHash[letter] = true;
            });
            text.replace(whiteSpace, '').split('').forEach(function(letter) {
                if (nameHash[letter]) {
                    obj[letter] = obj[letter] || 0;
                    obj[letter]++;
                }
            });
            return obj;
        }

        function generateGraph() {
            let density = letterDensity(scope.name, scope.text),
                g = 1, letter, val = 0;
            scope.data.nodes = [];
            scope.data.links = [];
            for (letter in density) {
                if (density.hasOwnProperty(letter)) {
                    scope.data.links.push({
                        source: g,
                        target: 0,
                        value: 20 * density[letter]
                    });
                    scope.data.nodes.push({
                        name: letter,
                        group: ++g,
                        value: 5 * density[letter]
                    });
                    val += 5 * density[letter];
                }
            }
            scope.data.nodes.unshift({ "name": scope.name, group: g, value: 40 });
            scope.rerender++;
            showToast('Drag nodes to see them in action!');
        }
    }
})();
