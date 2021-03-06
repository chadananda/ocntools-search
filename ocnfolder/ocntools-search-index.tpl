<div class="container-fluid">
    <div class="row">
        <h2 class="col-md-5">{{ contents.count }} Documents, {{ contents.totalSize }}mb</h2>
        <div class="col-md-7">
            <div class="input-group" id="search-box">
                <span class="input-group-btn">
                    <button class="btn btn-default" ng-click="search()">
                        <i class="glyphicon glyphicon-search"></i>
                    </button>
                </span>
                <input type="text" class="form-control" placeholder="search"
                       ng-model="fulltextSearch" ng-keyup="$event.keyCode == 13 && search()">
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-5" id="menu">
            <div class="panel panel-default list-group fixed-height">
                <div class="panel-body">
                    <div ng-include="'filesTree'"></div>
                </div>
            </div>
        </div>
        <div class="col-md-7">
            <div class="panel panel-default fixed-height">
                <div class="panel-body">
                    <div ng-show="nothingFound">
                        <h3>No results</h3>
                        <div>Documents containing given sentence are not found</div>
                    </div>
                    <div ng-repeat="r in searchResults" class="form-group">
                        <div class="found-file">
                            <i class="glyphicon glyphicon-file"></i>
                            <span>
                                <a ng-href="{{ r.doc.url }}" target="_blank">{{ r.doc.name }}</a> -
                                (<ng-pluralize count="r.sentences.length"
                                               when="{'one': '1 hit', 'other': '{} hits'}"></ng-pluralize>)
                            </span>
                        </div>
                        <div ng-repeat="s in r.sentences|orderBy:blockIdNumeric">
                            <div class="found-sentence row">
                                <div class="col-sm-2"><span ng-if="s.blockId">block: {{ s.blockId }}</span></div>
                                <div class="col-sm-10">{{ s.text }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/ng-template" id="filesTree">
    <div ng-repeat="file in contents.files">
        <a class="list-group-item" ng-href="{{ file.url }}" target="_blank">
            <i class="glyphicon glyphicon-file" style="margin-left: {{ indent * 15 }}px"></i> {{ file.name }}
        </a>
    </div>
    <div ng-repeat="dir in contents.directories">
        <a class="list-group-item" data-toggle="collapse" data-target="#l{{ indent }}{{ $index }}" data-parent="#menu">
            <i class="glyphicon glyphicon-folder-open" style="margin-left: {{ (indent - 1) * 15 }}px"></i> {{ dir.name }}
        </a>
        <div id="l{{ indent }}{{ $index }}" class="sublinks collapse">
            <div ng-include="'filesTree'" ng-init="contents = dir.contents; indent = indent + 1;"></div>
        </div>
    </div>
</script>