'use strict';

// Deals controller
angular.module('deals').controller('DealsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Leads', 'Deals',
	function($scope, $stateParams, $location, Authentication, Leads, Deals ) {
		$scope.authentication = Authentication;

$scope.myspeed = $scope.dslspeed;

		$scope.mySpeeds = [
{name: '1.5', value: '1.5Mbps/896Kbps',svalue: '1.5M/896K'},
{name: '3.0', value: '3Mbps/896Kbps',svalue: '3M/896K'},
{name: '7.0', value: '7Mbps/896Kbps',svalue: '7M/896K'},
{name: '7.2', value: '7Mbps/2Mbps',svalue: '7M/2M'},
{name: '7.5', value: '7Mbps/5Mbps',svalue: '7M/5M'},
{name: '12.0', value: '12Mbps/896Kbps',svalue: '12M/896K'},
{name: '12.2', value: '12Mbps/2Mbps',svalue: '12M/2M'},
{name: '12.5', value: '12Mbps/5Mbps',svalue: '12M/5M'},
{name: '20.0', value: '20Mbps/896Kbps',svalue: '20M/896K'},
{name: '20.2', value: '20Mbps/2Mbps',svalue: '20M/2M'},
{name: '20.5', value: '20Mbps/5Mbps',svalue: '20M/5M'},
{name: '40.5', value: '40Mbps/5Mbps',svalue: '40M/5M'},
{name: '40.20', value: '40Mbps/20Mbps',svalue: '40M/20M'},
{name: '60.30', value: '60Mbps/30Mbps',svalue: '60M/30M'},
{name: '80.40', value: '80Mbps/40Mbps',svalue: '80M/40M'},
{name: '100.12', value: '100Mbps/12Mbps',svalue: '100M/12M'},
];

$scope.myTerms = [
{name: '12 Months', value: '1'},
{name: '24 Months', value: '2'},
{name: '36 Months', value: '3'},
//{name: '60 Months', value: '60'},
];

$scope.myModem = [
{name: 'None', value: 'None'},
{name: 'Lease', value: 'Lease'},
{name: 'Purchase', value: 'Purchase'},
];

$scope.myNRC = [
{name: 'No', value: 'No'},
{name: 'Yes', value: 'Yes'},
];

$scope.myCredits = [
{name: '0', value: '$0'},
{name: '100', value: '$100'},
{name: '200', value: '$200'},
{name: '300', value: '$300'},
];

$scope.myIP = [
{name: 'Dynamic', value: 'Dynamic'},
{name: 'Static', value: 'Single Static IP'},
{name: 'StaticBlock', value: 'Block of 8 Static IPs'},
];


$scope.myLOA = [
{name: 'No, Just a Quote', value: 0},
{name: 'Local & Long Distance', value: 1},
{name: 'Local, LD, and Toll Free', value: 2},
];

$scope.mymodem = $scope.myModem[0];
$scope.myterm = $scope.myTerms[2];
$scope.nrc = $scope.myNRC[1];
$scope.mycredits = $scope.myCredits[0];
$scope.myip= $scope.myIP[0];
$scope.loa= $scope.myLOA[0];



$scope.dslspeed = function(){
console.log('This : %o',this);

return $scope.deal.dslspeed;
};


		// Create new Deal
		$scope.testme = function(){
//window.alert(this.name);
	var deal = new Deals ({
				name: this.name,
				user: this.user,
				contact: this.contact,
				btn: this.btn
			});
	deal.$save(function(response) {
				$location.path('deals/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			console.log(deal);

		};

		$scope.create = function() {
			window.alert('uh oh');
			var deal = new Deals ({
				name: this.name,
				user: this.user,
				contact: this.contact,
				btn: this.btn
			});
	deal.$save(function(response) {
				$location.path('deals/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			console.log(deal);
};

		// Remove existing Deal
		$scope.remove = function( deal ) {
			if ( deal ) { deal.$remove();

				for (var i in $scope.deals ) {
					if ($scope.deals [i] === deal ) {
						$scope.deals.splice(i, 1);
					}
				}
			} else {
				$scope.deal.$remove(function() {
					$location.path('deals');
				});
			}
		};

		// Update existing Deal
		$scope.update = function() {
			var deal = $scope.deal ;
console.log('Dealcontroller Deal: %o',deal);
			deal.$update(function() {
				$location.path('deals/' + deal._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Deals
		$scope.find = function() {
			$scope.deals = Deals.query();

		};

		// Find existing Deal
		$scope.findOne = function() {
			$scope.deal = Deals.get({ 
				dealId: $stateParams.dealId
			});

		};
	}
]);