'use strict';

angular.module('core').controller('NavController', ['$scope', 'Authentication', 'Menus', '$location', '$http',
	function($scope, Authentication, Menus, $location, $http) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		$scope.isAdmin = false;

		// $scope.getUserInfo = function(){
		// 	console.log('Getting User');
		// 	console.log($scope.authentication.user.roles);


		// }();


$scope.hideHeader=true;
// 				//console.log('Where am I? %o', $location.$$path);
var myurl = $location.$$path.slice(0,9);
//console.log('Myr URL', myurl);
if(myurl==='/approve/'){
	//console.log('Approving!!!');
	$scope.customerSee = true;
}else{
	$scope.customerSee = false;
}



		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);