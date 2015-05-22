function meliAPI(resource){
  var meliAPI = resource('https://api.mercadolibre.com/categories/:id', {},{
    read : {method: 'get'}
  });
  return meliAPI;
}

function selectionComponent(meliAPI){
  return {
    restrict : 'E',
    transclue : true,
    scope : {
      start  : '='
    },
    controller : function( $scope , $element){
      $scope.selectors = [];
      
      $scope.load = function(idItem , mainId){

          if( typeof mainId != "undefined"){
            $scope.selectors = $scope.selectors.slice( 0, mainId+1);
          }

          meliAPI.read({'id': idItem}, function(data){
            $scope.selectors.push( {'id': $scope.selectors.length , 'items': data.children_categories } );
          })
      };

      $scope.load($scope.start );
    },
    template: [
      '<div class="selector">',
        '<selector-component ',
          ' ng-repeat="selector in selectors" ',
          ' items="selector.items" ',
          ' id="selector.id" ',
          ' onselect="load" >',
        '</selector-component>',
      '</div>'
    ].join(''),
    replace : true
  };
} 


function selectorComponent( ){
  return {
    require : '^selectionComponent',
    restrict: 'E',
    transclue: true,
    scope : {
      id : '=',
      items : '=',
      onselect : '=',
    },
    controller: function($scope,$element){
      $scope.actualId = null;
      $scope.choose = function( itemId , parentId){
        $scope.actualId = itemId;
        $scope.onselect( itemId, parentId);
      }
    },
    template : [
      '<div class="item-collection">',
        '<ul>',
          '<li ng-repeat="item in items" ng-click="choose(item.id, id)" ng-class="{selected: item.id == actualId}" >',
            '{{item.name}}',
          '</li>',
        '</ul>',
      '</div>'
    ].join(''),
    replace : true,
  }
}

angular.module('components', ['ngResource'])
  .service('meli' , ['$resource', meliAPI ])
  .directive('selectionComponent', ['meli',selectionComponent])
  .directive('selectorComponent', selectorComponent );