'use strict';

//Offenders service used to communicate Offenders REST endpoints
angular.module('offenders').factory('Offenders', ['$resource',
	function($resource) {
		return $resource('offenders/:offenderId', { offenderId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('FindWos', ['$resource', 'Workorders',  function($resource, Workorders){
	var findWos = {};

	findWos.findById = function(id){

	console.log('$scope.FindWorkorder: ', id);
			var workorder = Workorders.get({ 
				workorderId: id
			});
			console.log('Found our Workorder (return it):  ', workorder);
			return workorder;
		};

		return findWos;


}
]).factory('authorizeCIM', ['$http', '$resource', function($http, $resource){
	var paymentProfiles = [];
	var authorizeCIM = {};

	authorizeCIM.getPaymentProfiles = function(offender){
		console.log('Runnign Service');

		if(offender.merchantCustomerId){


			return $http({
			method: 'post',
			url: '/getPaymentProfiles/',
			 data: {
			    	offender: offender,
		
			    }
			})
			.error(function(data) {
				console.log('Error!! ', data);
				toastr.error(data);
				// $scope.error = data;
			})
			.success(function(data, status) {
					if(status === 200) {

					var paymentProfiles;
					console.log('Return Payment Profiles: ', data);
					paymentProfiles = data.profile.paymentProfiles;

					if(paymentProfiles){
						console.log('Got Payment Profiles', paymentProfiles);
						if(paymentProfiles.billTo){
							console.log('Only found one payment profile....');
							paymentProfiles = data.profile.paymentProfiles;

						}else{
							console.log('Found Many Payment Profiles');
							paymentProfiles = data.profile.paymentProfiles;
						}
						

					}else {
						console.log('Ain\'t Got any  Payment Profiles', paymentProfiles);
						// $scope.paymentProfiles = null;
						paymentProfiles = null;
					}
				// 	var i = 0;
				// 	angular.forEach($scope.paymentProfiles, function(item){
				// 	console.log('Item: ', item);
				// 	console.log('Item [i]', item[i]);
				// 	console.log('i', i);
				// 	i++;
				// })
				// 	console.log('Payment Profiles: ', $scope.paymentProfiles );
				// 	console.log('BillTo: ',$scope.paymentProfiles .billTo );
					console.log('Payment InfO: ',paymentProfiles  );
					return paymentProfiles;
					}
		});

		} else{
			console.log('No Merchant Id...');
			paymentProfiles = null;
			return paymentProfiles;
		}


		
	};

		authorizeCIM.deletePaymentProfile = function(profile, offender){
		console.log('Runnign Service to Update Payment Profile');
		console.log('Profile ', profile);
		
		console.log('Offender :', offender);
			return $http({
					method: 'post',
					url: '/updateCCInfo/'+offender._id,
					data: {
						type: 'delete',
						paymentProfileId: profile, 
						customerProfileId: offender.merchantCustomerId
					}
				}).success(function(data, status) {
					if(data.authNet==='Error'){
					
						
						
					}
						var message = 'Credit Card has been Authorized and is no on file';

							
							console.log('Message: ', message);
							
						
				}).error(function(err, data){
					// toastr.error(err);
					console.log('Data from Error Validating or Updating Creidt Card', err);
					console.log('Data from Error', data);
					

		});



		};

		authorizeCIM.newPaymentProfile = function(cardData, offender){
		console.log('Runnign Service to Update Payment Profile');
		console.log('Card Data', cardData);
		console.log('Offender :', offender);
			return $http({
					method: 'post',
					url: '/updateCCInfo/'+offender._id,
					data: {
						type: 'new',
						cardData: cardData,
						customerProfileId: offender.merchantCustomerId
					}
				}).success(function(data, status) {
					if(data.authNet==='Error'){
					
						
						
					}
						var message = 'Credit Card has been Authorized and is no on file';

							
							console.log('Message: ', message);
							
						
				}).error(function(err, data){
					// toastr.error(err);
					console.log('Data from Error Validating or Updating Creidt Card', err);
					console.log('Data from Error', data);
					

		});



		};

				authorizeCIM.voidPayment = function(profile, offender){
		console.log('Runnign Service to Update Payment Profile');
		console.log('Profile ', profile);
		
		console.log('Offender :', offender);
			return $http({
					method: 'post',
					url: '/updateCCInfo/'+offender._id,
					data: {
						type: 'delete',
						paymentProfileId: profile, 
						customerProfileId: offender.merchantCustomerId
					}
				}).success(function(data, status) {
					if(data.authNet==='Error'){
					
						
						
					}
						var message = 'Credit Card has been Authorized and is no on file';

							
							console.log('Message: ', message);
							
						
				}).error(function(err, data){
					// toastr.error(err);
					console.log('Data from Error Validating or Updating Creidt Card', err);
					console.log('Data from Error', data);
					

		});



		};


	authorizeCIM.updatePaymentProfile = function(profile, cardData, offender){
		console.log('Runnign Service to Update Payment Profile');
		console.log('Profile ', profile);
		console.log('Card Data', cardData);
		console.log('Offender :', offender);
			return $http({
					method: 'post',
					url: '/updateCCInfo/'+offender._id,
					data: {
						type: 'update',
						cardData: cardData,
						paymentProfileId: profile, 
						customerProfileId: offender.merchantCustomerId
					}
				}).success(function(data, status) {
					if(data.authNet==='Error'){
					
						
						
					}
						var message = 'Credit Card has been Authorized and is no on file';

							
							console.log('Message: ', message);
							
						
				}).error(function(err, data){
					// toastr.error(err);
					console.log('Data from Error Validating or Updating Creidt Card', err);
					console.log('Data from Error', data);
					

		});



		};


	return authorizeCIM;


}]);

