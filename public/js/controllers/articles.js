function ArticlesController($scope, Articles, $location, $routeParams) {
    $scope.articles = [];
    $scope.article = {};

    $scope.create = function () {
        var article = new Articles({
            title: this.title,
            content: this.content
        });
        
        article.$save(function (res) {
            $location.path('articles/' + res._id);
        });
        
        this.title = '';
        this.content = '';
    };
    
    $scope.find = function (query) {
        Articles.query(query, function (articles) {
            $scope.articles = articles;
        });
    };
    
    $scope.findOne = function () {
        console.log('$routeParams.articleId: ', $routeParams.articleId);
        Articles.get({
            articleId: $routeParams.articleId
        }, function (article) {
            $scope.article = article;
        });
    };
    
    $scope.update = function () {
        var article = $scope.article;

        if (!article.updated) {
            article.updated = [];
        }

        article.updated.push(new Date().getTime());
        article.$update(function () {
            $location.path('articles/' + article._id);
        })
    };
}