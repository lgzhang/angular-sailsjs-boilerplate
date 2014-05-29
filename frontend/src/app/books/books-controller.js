/**
 * Just an example controller to list all authors.
 *
 * @todo Refactor data fetching
 */
(function() {
    'use strict';

    angular.module('frontend.example.books')
        .controller('BooksController',
            [
                '$scope', '$http', '$sailsSocket',
                function($scope, $http, $sailsSocket) {
                    // Initialize data
                    $scope.itemCount = 0;
                    $scope.items = [];
                    $scope.itemsPerPage = 10;
                    $scope.currentPage = 1;
                    $scope.loading = true;
                    $scope.loaded = false;

                    // Initialize used title items
                    $scope.titleItems = [
                        {title: 'Title', column: 'title'},
                        {title: 'Author', column: 'author'},
                        {title: 'Year', column: 'releaseDate'}
                    ];

                    // Initialize default sort data
                    $scope.sort = {
                        column: 'releaseDate',
                        direction: false
                    };

                    // Function to change sort column / direction on list
                    $scope.changeSort = function(item) {
                        var sort = $scope.sort;

                        if (sort.column === item.column) {
                            sort.direction = !sort.direction;
                        } else {
                            sort.column = item.column;
                            sort.direction = true;
                        }

                        if ($scope.currentPage === 1) {
                            $scope.fetchData();
                        } else {
                            $scope.currentPage = 1;
                        }
                    };

                    // Scope function to fetch data count and actual data
                    $scope.fetchData = function() {
                        $scope.loading = true;

                        // Data query specified parameters
                        var parameters = {
                            limit: $scope.itemsPerPage,
                            skip: ($scope.currentPage - 1) * $scope.itemsPerPage,
                            sort: $scope.sort.column + ' ' + ($scope.sort.direction ? 'ASC' : 'DESC')
                        };

                        // Fetch data count
                        $sailsSocket
                            .get('http://wunder.sytes.net:1339/book/count/')
                            .success(function(response) {
                                $scope.itemCount = response.count;
                            });

                        // Fetch data items
                        $sailsSocket
                            .get('http://wunder.sytes.net:1339/book/', {
                                params: parameters
                            })
                            .success(function(response) {
                                $scope.items = response;

                                $scope.loaded = true;
                                $scope.loading = false;
                            });
                    };

                    $scope.$watch('currentPage', function() {
                        $scope.fetchData();
                    });
                }
            ]
        );
}());
