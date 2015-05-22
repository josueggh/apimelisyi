function items(){
  var item = this;

  item.categories = [
    'MLM1743',
    'MLM1459',
    'MLV1459',
    'MLM1763',
  ];
} 

angular.module('app', ['components'])
  .controller('Items', items);
