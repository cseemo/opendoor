'use strict';

// Payments controller
angular.module('payments').controller('PaymentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Payments', '$filter', 
	function($scope, $stateParams, $location, Authentication, Payments, $filter ) {
		$scope.authentication = Authentication;

		// Create new Payment
		$scope.create = function() {
			// Create new Payment object
			var payment = new Payments ({
				name: this.name
			});

			// Redirect after save
			payment.$save(function(response) {
				$location.path('payments/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.findPmtSummary = function(){
			var pmts = Payments.query({
				status: 'Paid',
				
			});
			pmts.$promise.then(function(stuff){
				console.log('Stuff: ', stuff);

		
			console.log('Pmts: ', pmts);
			 $scope.sumpayments = $filter('orderBy')(pmts, '-paidDate');
  			console.log('SumPayments: ', $scope.sumpayments);
  		})



		};

		// Remove existing Payment
		$scope.remove = function( payment ) {
			if ( payment ) { payment.$remove();

				for (var i in $scope.payments ) {
					if ($scope.payments [i] === payment ) {
						$scope.payments.splice(i, 1);
					}
				}
			} else {
				$scope.payment.$remove(function() {
					$location.path('payments');
				});
			}
		};

		// Update existing Payment
		$scope.update = function() {
			var payment = $scope.payment ;

			payment.$update(function() {
				$location.path('payments/' + payment._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Payments
		$scope.find = function() {
			$scope.payments = Payments.query();
		};

		// Find existing Payment
		$scope.findOne = function() {
			$scope.payment = Payments.get({ 
				paymentId: $stateParams.paymentId
			});
		};
	}
]);