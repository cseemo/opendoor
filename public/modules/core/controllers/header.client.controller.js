'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$location', '$cookieStore', '$http', '$filter', 
	function( $scope, Authentication, Menus, $location, $cookieStore, $http, $filter) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

	


		$scope.numNotifications = $scope.authentication.user.notifications.length;
		//if( ! Authentication.user ) $location.path('/signin');
		if( Authentication.user ) {
			//console.log('Logged In ');
			$scope.canSee=true;
		}

		if( ! Authentication.user ) {
			//console.log('not logged in');
			$scope.canSee=false;

		}


$scope.clockedIn = false;

//Need to write code to check Mongoose for open Timeclock
//Have cookies stored - need to deal w them also
$scope.clockedInVal = 'Clocked-Out';


$scope.clockIn= function(type) {
	//console.log('Got Here');
	$scope.clockedIn = true;
	
	var date = Date.now();
	var time = $filter('date')(new Date(date), 'h:mma');

	////console.log('timecard %o',$scope);
		$scope.clockedInVal = 'Clocked-In';
			switch(type){
				case 'break': 
			toastr.info('You have been clocked-in for break at '+time);
			$cookieStore.put('breakEnd', Date.now());
			
			break;

			case 'lunch': 
			toastr.info('You have been clocked-in for lunch at '+time);
			$cookieStore.put('lunchEnd', Date.now());
			break;

			case 'shift': 
			toastr.info('You have been clocked-in at '+time);
			$cookieStore.put('shiftStart', Date.now());
			break;
			}
			
	$http.get('/awesome/clock').success(function(data) {
	
	//console.log('Response %o',data);
	//window.alert('Response');
}).error(function(data) {

//console.log('Error: ' + data);
});

		};


		$scope.clockOut = function(type) {
			$scope.clockedIn = false;
			$scope.clockedInVal = 'Clocked-Out';
			var date = Date.now()
	var time = $filter('date')(new Date(date), 'h:mma');

			switch(type){
				case 'break': 
			toastr.info('You have been clocked-out for break at '+time);
			$cookieStore.put('breakStart', Date.now());
				$scope.clockedInVal = 'At Break';
			break;

			case 'lunch': 
			toastr.info('You have been clocked-out for lunch at '+time);
			$cookieStore.put('lunchStart', Date.now());
				$scope.clockedInVal = 'At Lunch';
			break;

			case 'shift': 
			toastr.info('You have been clocked-out at '+time);
			$cookieStore.put('shiftEnd', Date.now());
			break;
			}

				$http.get('/awesome/clock').success(function(data) {
	
	//console.log('Response %o',data);
	//window.alert('Response');
}).error(function(data) {

//console.log('Error: ' + data);
});

};
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);