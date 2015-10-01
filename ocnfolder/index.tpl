<!DOCTYPE html>
<html ng-app="ocntoolsSearchApp">
<head>
    <meta charset="UTF-8">
    <title></title>
    <link rel="stylesheet" href="bower_components/bootstrap-css/css/bootstrap.min.css">
    <link rel="stylesheet" href="bower_components/angular/angular-csp.css">
    <link rel="stylesheet" href="styles/main.css">
</head>
<body ng-controller="SearchCtrl" ng-cloak>
<%= search-index-template %>

    <script src="bower_components/jquery/dist/jquery.min.js"></script>
    <script src="bower_components/bootstrap-css/js/bootstrap.min.js"></script>
    <script src="bower_components/angular/angular.min.js"></script>
    <script src="bower_components/pouchdb/dist/pouchdb.min.js"></script>
    <script src="bower_components/lunr.js/lunr.min.js"></script>
    <script src="scripts/app.js"></script>
    <script src="scripts/controllers/searchCtrl.js"></script>
</body>
</html>
