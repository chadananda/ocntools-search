<!DOCTYPE html>
<html ng-app="ocntoolsSearchApp">
<head>
    <meta charset="UTF-8">
    <title>Ocntools Search App</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <style><%= main-css %></style>
</head>
<body ng-controller="SearchCtrl" ng-cloak>
<%= search-index-template %>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.6/angular.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pouchdb/4.0.3/pouchdb.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lunr.js/0.5.12/lunr.min.js"></script>
    <script><%= app-js %></script>
</body>
</html>
