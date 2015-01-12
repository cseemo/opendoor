'use strict';


// Offenders controller
angular.module('offenders').controller('OffendersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Offenders', 'Shops', 'Workorders', '$filter', '$modal', '$log', '$http', 
	function($scope, $stateParams, $location, Authentication, Offenders, Shops, Workorders, $filter, $modal, $log, $http) {
		$scope.authentication = Authentication;
		$scope.pendingOrder = true;
		// Create new Offender
		$scope.pastDue = false;
		$scope.signedUpStatus = 'Get Authorization Signed';
		
		
		$scope.installFee = '65.00';

		$scope.checklist = [
		{item: 'Set Appointment Date', click: 'setAppt'},
		{item: 'Customer Check-In', click: 'checkIn'},
		{item: 'Inspect Vehicle', click: 'inspected'},
		{item: 'Inventory Device', click: 'checkOutDevice'},
		{item: 'Have Customer Watch Training Video', click: 'customerVideo'},
		{item: $scope.signedUpStatus, click: 'installPaperwork'},

		{item: 'Collect Payment', click: 'openpmt'},
		{item: 'Complete Service', click: 'complete'}
		];

		$scope.checklist2 = [
		{item: 'Schedule a New Service', click: 'setNewWO'},
		{item: 'Accept Customer Payment', click: 'openpmt'},
		// {item: 'Inspect Vehicle', click: 'inspected'},
		// {item: 'Inventory Device', click: 'checkOutDevice'},
		// {item: 'Have Customer Watch Training Video', click: 'customerVideo'},
		// {item: $scope.signedUpStatus, click: 'installPaperwork'},
		// {item: 'Collect Payment', click: 'getMoney'},
		// {item: 'Installation Complete', click: 'complete'}
		];

		
		$scope.saveMe = function() {
			console.log('Save it!!');
			$scope.offender.$update().then(function(){
				console.log('Saved');
			});


		};
		
		$scope.findClient = function() {
			console.log('Looking for client', $scope.dLNumber);
			$http({
					method: 'post',
					
					url: '/getClientbyDL', 
					data: {
						'dl': $scope.dLNumber,
						
						
								},
								
						})
					.success(function(data, status) {

						console.log('Yeah!!!', data);
						console.log('Got Offender', status);

      				// $location.path('offenders/' + data[0]._id);
      				$scope.offender = data[0];
      				// $scope.offender.$promise.then(function(){

      					console.log('Promise done');
      					$scope.offender.assignedShop = $scope.authentication.user.shop;
      					console.log('Authentication Shop: ', $scope.authentication.user.shop);
      					// $scope.update();
					// $location.path('neworder/' + $scope.offender._id);
	      			
	      			console.log($scope.offender);

	      			var modalInstance;
       
        console.log('Getting Offender', $scope.offender._id);
		      	var MYoffender = Offenders.get({ 
				offenderId: $scope.offender._id
					});
		      	MYoffender.$promise.then(function(){
		      		console.log('Offender finished', MYoffender);
		      		


        modalInstance = $modal.open({
          templateUrl: 'shopModalContent.html',
          controller: 'ModalInstanceCtrl',
          resolve: {
            items: function() {
              return $scope.workOrderTypes;
            }, 
             workorder: function() {
             	console.log('Sending workorder info');
	              return null
	            },
            offender: function() {
		      	return MYoffender
		      	
		      }

            },
            
           
		  });

		      	});



      
            });
         
        
		};

		$scope.getPmtDetail = function(id) {
			console.log('Opening Payment Details', id);
			
			var modalInstance;
        var offender = $scope.offender;
        modalInstance = $modal.open({
          templateUrl: 'pmtDetailContent.html',
          controller: 'paymentDetailCtrl',
          resolve: {
            offender: function() {
              return $scope.offender;
            },
             workorders: function() {
              return $scope.workorders;
            }, 
            payment: function() {
            	return $scope.payments[id]
            }
          }
        });

		};

		      $scope.openPmt = function() {
      	console.log('Opening Modal');
        var modalInstance;
        var offender = $scope.offender;
        modalInstance = $modal.open({
          templateUrl: 'pmtModalContent.html',
          controller: 'paymentCtrl',
          size: 'lg',
          resolve: {
            offender: function() {
              return $scope.offender;
            },
             workorders: function() {
              return $scope.workorders;
            },
             payments: function() {
              return $scope.payments;
            } 
            
          }
        });
        modalInstance.result.then(function(selectedItem, offender) {
          $scope.selected = selectedItem;
        }, function() {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

		$scope.clicked = function(data, index) {
			console.log('Clicked; ', data);
			console.log('Workorder: ', $scope.workorder);
			if(data==='checkIn') $scope.checkInCustomer(index);
			if(data==='setAppt') $scope.setApptModal();
			if(data==='complete') $scope.completeOrder();
			if(data==='checkOutDevice') $scope.checkOutDevice();
			if(data==='inspected') $scope.inspection();
			if(data==='customerVideo') $scope.customerVideo();
			if(data==='installPaperwork') $scope.getAuth();
			if(data==='setNewWO') $scope.setNewWO();
			if(data==='openpmt') $scope.openPmt();

			$scope.progress=$scope.progress+10;
			

			// console.log('Offender: ', $scope.offender);
		};


		$scope.customerVideo = function() {
			$scope.workorder = $scope.findWorkOrder($scope.workorder._id);
				// console.log('Wo is: ', wo);
				$scope.workorder.$promise.then(function() {
					var wo = $scope.workorder;
					console.log('Got the work order promise complete', $scope.workorder);
					wo.customerVideo = Date.now();
					wo.status = 'Customer Training Video';

				
					wo.$update(function(){
					console.log('Update complete!', wo);

				});
				});


		};

		$scope.inspection = function() {
			$scope.workorder = $scope.findWorkOrder($scope.workorder._id);
				// console.log('Wo is: ', wo);
				$scope.workorder.$promise.then(function() {
					var wo = $scope.workorder;
					console.log('Got the work order promise complete', $scope.workorder);
					wo.inspected = Date.now();
					wo.status = 'Inspection Complete';

				
					wo.$update(function(){
					console.log('Update complete!', wo);

				});
				});


		};

		

		$scope.getAuth = function() {
			console.log('Authorizing WOrk', $scope.workorder._id);
			var modalInstance;
	        var offender = $scope.offender;
	        modalInstance = $modal.open({
	          templateUrl: 'agreement.html',
	          controller: 'ModalInstanceCtrl',
	          resolve: {
	            items: function() {
	              return $scope.workOrderTypes;
	            }, 
	             workorder: function() {
	              return $scope.workorder._id;
	            },
	            offender: function() {
	              return $scope.offender;
	            }
	          }
	        });
	        modalInstance.result.then(function(selectedItem, offender) {
	          $scope.selected = selectedItem;
	        }, function() {
	          $log.info('Modal dismissed at: ' + new Date());
	        });
      };



		$scope.checkOutDevice = function() {
			console.log('Checking Out Device', $scope.workorder._id);
			var modalInstance;
	        var offender = $scope.offender;
	        modalInstance = $modal.open({
	          templateUrl: 'checkOutDevice.html',
	          controller: 'ModalInstanceCtrl',
	          resolve: {
	            items: function() {
	              return $scope.workOrderTypes;
	            }, 
	             workorder: function() {
	              return $scope.workorder._id;
	            },
	            offender: function() {
	              return $scope.offender;
	            }
	          }
	        });
	        modalInstance.result.then(function(selectedItem, offender) {
	          $scope.selected = selectedItem;
	        }, function() {
	          $log.info('Modal dismissed at: ' + new Date());
	        });
      };




		$scope.completeOrder = function() {
			console.log('WE are completing the work order!');
			var modalInstance;
	        var offender = $scope.offender;
	        modalInstance = $modal.open({
	          templateUrl: 'completeOrder.html',
	          controller: 'ModalInstanceCtrl',
	          resolve: {
	            items: function() {
	              return $scope.workOrderTypes;
	            }, 
	             workorder: function() {
	              return $scope.workorder._id;
	            },
	            offender: function() {
	              return $scope.offender;
	            }
	          }
	        });
	        modalInstance.result.then(function(selectedItem, offender) {
	          $scope.selected = selectedItem;
	        }, function() {
	          $log.info('Modal dismissed at: ' + new Date());
	        });


			// console.log($scope.workorder);
			// $scope.workorder = $scope.findWorkOrder($scope.workorder._id);
			// 	// console.log('Wo is: ', wo);
			// 	$scope.workorder.$promise.then(function() {
			// 		var wo = $scope.workorder;
			// 		console.log('Got the work order promise complete', $scope.workorder);
			// 		wo.completed = Date.now();
			// 		wo.status = 'Complete';

				
			// 		wo.$update(function(){
			// 		console.log('Update complete!', wo);

			// 	});
			// 	});



		};


		$scope.checkItem = function(row) {
			window.alert('Row is: '+ row);
			console.log('Checking ', this);

			

		};
		$scope.checkInCustomer = function(row) {
			toastr.info('Customer has arrived: '+ Date.now());
			console.log('Checking ', this);

				$scope.workorder = $scope.findWorkOrder($scope.workorder._id);
				// console.log('Wo is: ', wo);
				$scope.workorder.$promise.then(function() {
					var wo = $scope.workorder;
					console.log('Got the work order promise complete', $scope.workorder);
					wo.checkIn = Date.now();
					wo.status = 'In Process';

				
					wo.$update(function(){
					console.log('Update complete!', wo);

				});
				});
			

		};


   $scope.setApptModal = function() {
      	console.log('Opening Modal');
        var modalInstance;
        var offender = $scope.offender;
        modalInstance = $modal.open({
          templateUrl: 'setApptModal.html',
          controller: 'ModalInstanceCtrl',
          resolve: {
            items: function() {
              return $scope.workOrderTypes;
            }, 
             workorder: function() {
              return $scope.workorder._id;
            },
            offender: function() {
              return $scope.offender;
            }
          }
        });
        modalInstance.result.then(function(selectedItem, offender) {
          $scope.selected = selectedItem;
        }, function() {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

      $scope.updateCCInfo = function() {
      	console.log('Updating Credit Card Info');

      	$scope.offender.$promise.then(function() {

      		console.log('Credit Card:', $scope.offender);
	      	$scope.offender.cardExp =  $scope.expYear+'-'+$scope.expMonth;
	      	// $scope.offender.cardExp = $scope.cardExp;
			// $scope.offender.cardCVV = $scope.cardCVV;
			// $scope.offender.cardNumber = $scope.cardNumber;
			$scope.offender.last4 = $scope.cardNumber.slice(-4);

			// console.log
			console.log('OFfender Updating: ', $scope.offender);
	      	$scope.offender.$update(function() {
	      		console.log('Offender info to send: ', $scope.offender);
     			$http({
					method: 'post',
					url: '/updateCCInfo/'+$scope.offender._id,
					
					data: {
						cardNumber: $scope.cardNumber,
						CVV: $scope.cardCVV,
						expDate: $scope.expYear+'-'+$scope.expMonth
					}
				})
					.success(function(data, status) {
							if(status === 200) {
								
							console.log('Return Data: ', data);
							toastr.success(data);

							console.log('Card info?? ', $scope.offender);
							$scope.cardExp = '';
							$scope.cardCVV = '';
							$scope.cardNumber = '';




							}
				}).error(function(err, data){
					toastr.error(err);
					console.log('Data from Error Validating or Updating Creidt Card');


				});
});
     	});

      };



		$scope.create = function() {
			// Create new Offender object

		var mainPhone = $filter('tel')(this.mainPhone);
		var altPhone = $filter('tel')(this.altPhone);
		var cardExp;
		var last4;

		if($scope.offenderCC){
				
				cardExp =  $scope.expYear+'-'+$scope.expMonth;
				
				last4 = $scope.offenderCC.slice(-4);

				}


			var offender = new Offenders ({
				firstName: this.firstName,
				lastName: this.lastName,
				mainPhone: mainPhone, 
				altPhone: altPhone, 
				offenderEmail: this.offenderEmail, 
				billingAddress: this.billingAddress, 
				billingCity: this.billingCity, 
				billingState: this.billingState, 
				billingZipcode: $scope.billingZipcode, 
				stateReportTo: $scope.stateReportTo, 
				vehicleMake: $scope.vehicleMake, 
				vehicleYear: $scope.vehicleYear,
				vehicleModel: $scope.vehicleModel,
				driverNumber: $scope.driverNumber, 
				cardNumber: $scope.offenderCC,
				cardCVV: $scope.creditCardCCV,
				cardExp: cardExp,
				dobMO: $scope.dobMO,
				dobDAY: $scope.dobDAY,
				dobYR: $scope.dobYR,
				last4: last4
			});

			// Redirect after save
			offender.$save(function(response) {
				$location.path('offenders/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		//Offender List Table Stuff

  $scope.tableData = {
      searchKeywords: '',
    };
    $scope.filteredOffenders= [];
    $scope.row = '';
    $scope.numPerPageOpt = [3, 5, 10, 20];
    $scope.numPerPage = $scope.numPerPageOpt[2];
    $scope.currentPage = 1;
    //$scope.currentPageDeals= $scope.getinit;
    $scope.currentpageOffenders= [];



    $scope.select = function(page) {
    	 
      var end, start;
      start = (page - 1) * $scope.numPerPage;
      end = start + $scope.numPerPage;
      //////////////console.log('Start '+start+' and End '+end);
      $scope.currentPage = page;
     
      return $scope.currentPageOffenders = $scope.filteredOffenders.slice(start, end);


    };

    $scope.onFilterChange = function() {
      $scope.select(1);
      $scope.currentPage = 1;
      return $scope.row = '';
    };
    $scope.onNumPerPageChange = function() {
      $scope.select(1);
      return $scope.currentPage = 1;
    };
    $scope.onOrderChange = function() {
      $scope.select(1);
      return $scope.currentPage = 1;
    };
    $scope.search = function() {
      //////////////console.log('Keywords: ', $scope.tableData.searchKeywords);
      $scope.filteredOffenders = $filter('filter')($scope.offenders, $scope.tableData.searchKeywords);

      return $scope.onFilterChange();
    };

     $scope.searchPending = function() {
      //////////////console.log('Keywords: ', $scope.tableData.searchKeywords);
      $scope.filteredOffenders = $filter('filter')($scope.offenders, $scope.tableData.searchKeywords);

      // {companyname: $scope.tableData.searchKeywords},

      /*$scope.filteredRegistrations = $filter('filter')($scope.registrations, {
        firstName: $scope.searchKeywords,
        lastName: $scope.searchKeywords,
        confirmationNumber: $scope.searchKeywords,
      });*/
      return $scope.onFilterChange();
    };


    $scope.order = function(rowName) {
    	//////////////console.log('Reordering by ',rowName);
    	//////////////console.log('Scope.row ', $scope.row);
      if ($scope.row === rowName) {
        return;
      }
      $scope.row = rowName;
      $scope.filteredOffenders = $filter('orderBy')($scope.filteredOffenders, rowName);
      //////////////console.log(rowName);
      return $scope.onOrderChange();
    };
    $scope.setCurrentOffender = function(ind) {
      $scope.currentOffender = $scope.filteredOffenders.indexOf(ind);
    };

    $scope.init = function() {
    	console.log('Getting Offenders');
    	$scope.offenders = Offenders.query();
    	$scope.offenders.$promise.then(function() {
				// $scope.search();
				$scope.filteredOffenders = $scope.offenders;
				return $scope.select($scope.currentPage);
				});	
	

    };

	$scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
   $scope.state = $scope.states[2];
   $scope.stateReportTo = $scope.states[4];

   $scope.vehicles = [
		'Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 'Dodge',
		'FIAT', 'Ford', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 'Kia',
		'Land Rover', 'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz', 'MINI', 'Mitsubishi',
		'Nissan', 'Scion', 'Smart', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Volkswagen',
		'Volvo', 'Porsche', 'Other',
	];
	$scope.vehicleMake = $scope.vehicles[29];
	$scope.deviceIssues = ['None', 'Loose Cord', 'Won\'t Charge', 'Keeps Saying He\'s Drunk'];
	$scope.deviceIssue = $scope.deviceIssues[0];

		$scope.vehicleYears = function() {
				var y = [];
				for(var i = new Date().getFullYear() + 1; i >= 1900; i--) {
					y.push(i);
				}
				return y;
			}();

					$scope.expYears = function() {
				var y = [];
				for(var i = new Date().getFullYear(); i <= new Date().getFullYear() + 7 ; i++) {
					y.push(i);
				}
				return y;
			}();
			// $scope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct', 'Nov','Dec'];
			$scope.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
			$scope.expMonth = $scope.months[1];
			$scope.expYear = $scope.expYears[2];
			
		
		$scope.vehicleYear = $scope.vehicleYears[1];


		$scope.oneAtATime = true;



  $scope.groups = [
    {
      title: 'Dynamic Group Header - 1',
      content: 'Dynamic Group Body - 1'
    },
    {
      title: 'Dynamic Group Header - 2',
      content: 'Dynamic Group Body - 2'
    }
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.status = {
    isFirstOpen: true,
    isFirstDisabled: false
  };


//Modal Stuff for New Work Order
      $scope.workOrderTypes = ['New Install', 'Calibration', 'Reset', 'Removal'];
      $scope.serviceTypes = ['Calibration', 'Reset', 'Removal'];
      

      $scope.open = function() {
      	console.log('Opening Modal');
        var modalInstance;
        var offender = $scope.offender;
        modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          resolve: {
            items: function() {
              return $scope.workOrderTypes;
            }, 
            offender: function() {
              return $scope.offender;
            },
            workorder: function() {
              return $scope.workorder;
            }
          }
        });
        modalInstance.result.then(function(selectedItem, offender) {
          $scope.selected = selectedItem;
        }, function() {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

      //       $scope.openShopModal = function() {
      // 	console.log('Opening Shop Modal');
      //   var modalInstance;
      //   var offender = $scope.offender;
      //   console.log('Scope Offender: ', $scope.offender);
      //   modalInstance = $modal.open({
      //     templateUrl: 'shopModalContent.html',
      //     controller: 'ModalInstanceCtrl',
      //     resolve: {
      //       items: function() {
      //         return $scope.serviceTypes;
      //       }, 
      //       offender: function() {
      //         return $scope.offender;
      //       },
      //       workorder: function() {
      //         return $scope.workorder;
      //       }
      //     }
      //   });
      //   // modalInstance.result.then(function(selectedItem, offender) {
      //   //   $scope.selected = selectedItem;
      //   // }, function() {
      //   //   $log.info('Modal dismissed at: ' + new Date());
      //   // });
      // };


      //Table for Work Orders per Offender
      $scope.getWorkOrders = function(){
     	console.log($scope.offender);
     	$scope.offender.$promise.then(function() {
     			$http({
					method: 'get',
					url: '/orderByOffender/'+$scope.offender._id,
					})
					.success(function(data, status) {
							if(status === 200) {
								
							console.log('Return Data: ', data);
							$scope.workorders = data;
							}
				});

     	});
				


};

      $scope.getPayments = function(){
     	console.log('Getting Modal Payments for: ', $scope.offender);
     	$scope.offender.$promise.then(function() {
     			$http({
					method: 'post',
					url: '/pmtsByOffender/',
					data: {
						id: $scope.offender._id,
						choose: 'all'
					}
					})
					.success(function(data, status) {
							if(status === 200) {
								
							console.log('Return Payments Data: ', data);
							$scope.payments = data;
							}
				});

     	});
				


};


		// Remove existing Offender
		$scope.remove = function( offender ) {
			if ( offender ) { offender.$remove();

				for (var i in $scope.offenders ) {
					if ($scope.offenders [i] === offender ) {
						$scope.offenders.splice(i, 1);
					}
				}
			} else {
				$scope.offender.$remove(function() {
					$location.path('offenders');
				});
			}
		};

		// Update existing Offender
		$scope.update = function() {
			var offender = $scope.offender ;

			offender.$update(function() {
				$location.path('offenders/' + offender._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Offenders
		$scope.find = function() {
			$scope.offenders = Offenders.query();

			
		};

		var getInfo = function(id) {
			console.log('ID is: ', id);
			 $scope.pendingWorkType = 'Install';
		};
		

		$scope.findPending = function() {
			$http({
		method: 'get',
		url: '/getPendingOrders',
			})
		.success(function(data, status) {
			
				console.log('Return Data: ', data);
				$scope.offenders = data;
				$scope.filteredOffenders = data;
				$scope.select($scope.currentPage);

				
			});



		};

		$scope.pickWO = function(row){
			console.log('PIcking Work Order', row);
			console.log($scope.workorders[row]);

			

			var modalInstance = $modal.open({
          templateUrl: 'workOrderModal.html',
          controller: 'workOrderCtrl',
          resolve: {
             workorder: function() {
             	console.log('Sending workorder info');
	              return $scope.workorders[row]
	            },
            offender: function() {
		      	return $scope.offender
		      	
		      }

            },
            
           
		  });

		};

				$scope.setNewWO = function(row){
			console.log('PIcking Work Order', row);
			console.log($scope.workorders[row]);

			

			var modalInstance = $modal.open({
          templateUrl: 'setNewWOModal.html',
          controller: 'NEWworkOrderCtrl',
          resolve: {
             
            offender: function() {
		      	return $scope.offender
		      	
		      }

            },
            
           
		  });

		};

		

		$scope.findWorkOrder = function(id) {
     		console.log('Workorder: ', id);
			$scope.workorder = Workorders.get({ 
				workorderId: id
			});
			console.log('Found our Workorder:  ', $scope.workorder);
			return $scope.workorder;

		};

		// Find existing Offender
		$scope.findOne = function() {
			console.log('Finding an Offender');
			$scope.offender = Offenders.get({ 
				offenderId: $stateParams.offenderId
			});
			checkPastDue($stateParams.offenderId);
		};

		var checkPastDue = function(id) {
			console.log('Checking for Past Due Amount: ', id);

				$http({
				method: 'post',
				url: '/checkpastdue',
				data: {
					id: id
				}

					})
				.success(function(data, status) {
					if(data.length > 0){
						$scope.pastDue = true;
						angular.forEach(data, function(item){
							console.log('Item Amount: ', item.amount);
						})



					}
					console.log('Got our Past Due Data', data);





				})

		};


		$scope.findOne2 = function() {
			$scope.offender = Offenders.get({ 
				offenderId: $stateParams.offenderId
			});

			$scope.offender.$promise.then(function(){
				$scope.workorders = $scope.getWorkOrders();

				if($scope.offender.pendingWorkOrder){
					console.log('This client has a pending work order...');

						$http({
							method: 'get',
							url: '/workorders/'+$scope.offender.pendingWorkOrder,
								})
							.success(function(data, status) {
									if(status === 200) {
										//$scope.currentPrice = data.price;
							//console.log('Data: ',data);
							//console.log('Data.Response: %o',data._id);
							checkPastDue($stateParams.offenderId);
							console.log('Return Data Workorder: ', data);
							$scope.workorder = data;
							console.log('Got Workorder Check if anything has been done yet: ', $scope.workorder);

							$scope.signedUpStatus = 'Get'+$scope.workorder.type+' Authorization Signed';
							console.log('Signedup Status: ', $scope.signedUpStatus);
							var progress = 0;

							if($scope.workorder.apptDate){
								console.log('This baby has an Appointment Date already!!');
								console.log("STuff: ", $scope.checklist[0]);
								$scope.checklist[0]['strike'] = "done-true" ;
								progress = progress+15;


							}
							if($scope.workorder.checkIn){
								console.log('This baby has been checked in already!!');
								console.log("STuff: ", $scope.checklist[1]);
								$scope.checklist[1]['strike'] = "done-true" ;
								$scope.checklist[1].selected;
								progress = progress+15;
							}

							if($scope.workorder.inspected){
								console.log('This baby has been inspected already!!');
								console.log("STuff: ", $scope.checklist[2]);
								$scope.checklist[2]['strike'] = "done-true" ;
								progress = progress+15;
							}

							if($scope.workorder.customerVideo){
								console.log('Customer Video Already Watched!!');
								console.log("STuff: ", $scope.checklist[4]);
								$scope.checklist[4]['strike'] = "done-true" ;
								progress = progress+15;
							}
							if($scope.workorder.authSigned){

								console.log('Install Agreement Already Signed');
								console.log("STuff: ", $scope.checklist[5]);
								$scope.checklist[5]['strike'] = "done-true" ;
								progress = progress+15;
							}

							if($scope.workorder.deviceSN || $scope.workorder.type!=='New Install'){
								console.log('Workorder Already has Serial Number Assigned');
								console.log("STuff: ", $scope.checklist[3]);
								$scope.checklist[3]['strike'] = "done-true" ;
								progress = progress+15;
							}
							if($scope.workorder.authCode || $scope.workorder.amount==='0'){
								console.log('Workorder Alrady Paid For');
								console.log("STuff: ", $scope.checklist[6]);
								$scope.checklist[6]['strike'] = "done-true" ;
								progress = progress+15;
							}
							if($scope.workorder.completed){
								console.log('Workorder Alrady Completed');
								console.log("STuff: ", $scope.checklist[7]);
								$scope.checklist[7]['strike'] = "done-true" ;
								progress = progress+15;
							}

							$scope.progress = progress;

							}
						});








				}else{
					console.log('We have no pending work orders');
				}
				




			});
		};
			
	}




  ]).controller('ModalInstanceCtrl', [
    '$scope', '$modalInstance', 'items', 'offender', 'Devices', 'Authentication', '$http', 'Workorders', 'Shops', 'workorder', '$location',  function($scope, $modalInstance, items, offender, Devices, Authentication, $http, Workorders, Shops, workorder, $location) {
     $scope.authentication = Authentication;
     $scope.shops = Shops.query();
     $scope.offender = offender;

     $scope.getDevices = function(){
     	console.log('Finding Devices in Shop Inventory');
     	 $scope.availableDevices = Devices.query({status: 'Pending Deployment', shopId: Authentication.user.shop});

     	$scope.availableDevices.$promise.then(function(){
     		console.log('Got Pending Devices for this Shop', $scope.availableDevices);

     		 // $scope.availableDevices = $filter('filter')($scope.devices, {status: 'Available'});
     		 // console.log('$scope.availableDevices', $scope.availableDevices);

     	})


     };

     $scope.addDevice = function(row) {
     	console.log('Adding device to Offender:' , offender);
     	$scope.deviceChosen = true;
     	var device = $scope.availableDevices[row];
     	console.log('Device: ', device);
     	$scope.offender.deviceSN = $scope.availableDevices[row]['serialNumber'];
     	$scope.offender.device = $scope.availableDevices[row]['_id'];
     	console.log('Offender: ', $scope.offender);
     	$scope.availableDevices.splice(row, 1);
     	$scope.offender.$update();
     	
     	device.status = 'Deployed';
        $scope.deviceSN = device.serialNumber;
       console.log('Device: ', device);
       
  
        // $modalInstance.dismiss('Device Incentoried');
      



     };

    
    


     $scope.findWorkOrder = function(id) {
     		console.log('Workorder: ', workorder);
     		if(id) workorder = id;
			$scope.workorder = Workorders.get({ 
				workorderId: workorder
			});
			console.log('Found our Workorder:  ', $scope.workorder);

			// 	$scope.workorder.$promise.then(function(){

			// 		console.log('Going after our OFfender');
			// 		console.log('Found our Workorder Offender:  ', $scope.workorder.offender);


			// 		var offender = Offenders.get({ 
			// 	offenderId: $scope.workorder.offender
			// });
		};

	  $scope.termoptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '24', '36', 'Other'];
	  $scope.installFee = 65;
	  $scope.serviceTypes = ['Calibration', 'Reset', 'Removal'];
      

      $scope.items = items;
      $scope.selected = {
        item: $scope.items[0]
      };
      $scope.whomCus = true;
      $scope.chosen = items[0];
      $scope.subjectText = ' Authorization from Budget Ignition Interlock';
      $scope.sendToOptions = ['Customer', 'Service Center', 'Court', 'Attorney', 'Other'];
      $scope.sendTo = $scope.sendToOptions[0];
      // console.log('Our Offender Is: ', offender);
      $scope.emailSubject = $scope.chosen+$scope.subjectText;
      $scope.offender = offender;
      $scope.emailAddress = offender.offenderEmail;
      $scope.toWhomName = $scope.offender.firstName+' '+$scope.offender.lastName;

      $scope.changeSvcCenter = function(){
      	console.log('Name is: ', this);
      	// $scope.serviceCenter = name;
      	// console.log('Service Center: ', $scope.shops[name]['name']);
      	// console.log('Service Center: ', $scope.serviceCenter);


      };

      $scope.changeWho = function(){
      	console.log('Changing who', $scope.sendTo);
      	if($scope.sendTo==='Customer'){
      			$scope.emailAddress = offender.offenderEmail;
      			$scope.subjectText = ' Authorization from Budget Ignition Interlock';
      			$scope.emailSubject = $scope.chosen+$scope.subjectText;
      			$scope.toWhomName = $scope.offender.displayName;
      			$scope.whomCus = true;
      	}else{
      		$scope.emailAddress = null;
      		$scope.subjectText = ' Work Authorization for '+offender.firstName+' '+offender.lastName+' from Budget Ignition Interlock ';
      		$scope.emailSubject = $scope.chosen+$scope.subjectText;
      		$scope.toWhomName = $scope.toWhoName;
      		$scope.whomCus = false;
      	}
      


      };

		      	$scope.myShop = function(){
		      		console.log('Getting myshop: ', $scope.authentication.user.shop);
		      		var myShop = Shops.get({ 
				shopId: $scope.authentication.user.shop
					});
		      	myShop.$promise.then(function(){
		      		console.log('Shop Promise finished', myShop);
		      		
		      		$scope.myShopInfo = myShop;
		      		$scope.serviceCenter = myShop;

		      	});
		      };

            $scope.changeType = function(){
      	console.log('Changing Type', $scope.chosen);

      	$scope.emailSubject = $scope.chosen+' Authorization from Budget Ignition Interlock';


      };


  		$scope.schedule = function() {
  			console.log('Scheduling Appointment');
  			$modalInstance.close();
  			console.log('Scope.workorder', $scope.workorder);
  			console.log($scope.dt);
  			var wo = $scope.workorder;
  			var date = $scope.dt;
				var time = $scope.mytime;
				var datetime = new Date(date.getFullYear(), 
					date.getMonth(), 
					date.getDate(), 
					time.getHours(), 
					time.getMinutes(), 
					time.getSeconds());
				console.log('Date Time: ', datetime);
				datetime.toUTCString();
				console.log('Converted Date Time: ', datetime);
				// wo.apptDate = Date.now();
				wo.apptDate = datetime;
				console.log('WHTFFF!!', wo);
				wo.status = 'Scheduled';
				console.log('WO', wo);
				wo.$update(function(){
					console.log('Update complete!', wo);

				});
				
  		};

  		$scope.deviceCheckout = function() {
        $modalInstance.close();
        console.log($scope.deviceSN);
        console.log($scope.deviceNotes);
        console.log('workorder: ', workorder);
        console.log('Workorder?? ', $scope.workorder);
        $scope.findWorkOrder();
        $scope.workorder.$promise.then(function(){
	       	console.log($scope.workorder);
	         $scope.workorder.deviceNotes = $scope.deviceNotes;
	        $scope.workorder.deviceSN = $scope.deviceSN;
	        $scope.workorder.$update(function(){
					console.log('Update complete!', $scope.workorder);

				});


        });
    

    };

    //Work Order Authorization Options
   //  $scope.sendeSign = function() {
   //  	$modalInstance.close();
  	// 		console.log('Sending eSign');
  	// 		 $scope.findWorkOrder();
   //      	$scope.workorder.$promise.then(function(){
  	// 		var Id = $scope.workorder._id;
  	// 		// $location.path('/workorderauth/'+Id);
  	// 		window.open('/#!/workorderauth/'+Id);
  	// 	});
  	// };

  	$scope.eSignHere = function() {
    	$modalInstance.close();
  			console.log('Signing Here');
  			 $scope.findWorkOrder();
        	$scope.workorder.$promise.then(function(){
  			var Id = $scope.workorder._id;
  			// $location.path('/workorderauth/'+Id);
  			window.open('/#!/workorderauth/'+Id);
  		});


  	};

  	$scope.printAuth = function() {
    	$modalInstance.close();
  			console.log('Printing Work Auth');
  			 $scope.findWorkOrder();
        	$scope.workorder.$promise.then(function(){
  			var Id = $scope.workorder._id;
  					$http({
  					method: 'get',
					responseType: 'arraybuffer',
					url: '/viewWorkOrder/'+Id, 
					
								
						})
					.success(function(data, status) {
					
					$scope.sending = false;
					$scope.results = true;
					//////console.log('Data from LOA?? %o',data);
					toastr.info('Please print the following document...');
						$scope.myresults = 'Email Sent!';
						
						

						var file = new Blob([data], {type: 'application/pdf'});
			     		var fileURL = URL.createObjectURL(file);
			     		window.open(fileURL);
			     	});

				});



  	};

      	$scope.complete = function() {
  			console.log('Work Order Complete');
  			$modalInstance.close();


  			 $scope.findWorkOrder();
       		 $scope.workorder.$promise.then(function(){
	  				var wo = $scope.workorder;
	  				wo.completed = Date.now();
					console.log('WHTFFF!!', wo);
					wo.status = 'Complete';
					wo.techName = $scope.techName;
					wo.orderNotes = $scope.orderNotes;
					console.log('WO', wo);
					wo.$update(function(){
					console.log('Update complete!', wo);

					$scope.offender.pendingWorkOrder = null;
		  			$scope.offender.pendingWorkType = null;
		  			if(wo.type==='New Install'){
		  				var d = new Date();
						var n = d.getDate();
		  				console.log('n is: ', n);
		  				$scope.offender.billDate = n;

		  			}
		  			
		  			$scope.offender.$update();
				});

			});
				
  		};

  		$scope.sendingEmail = function() {
  			console.log('Sending Email Now');
  			$modalInstance.close();
  			$scope.findWorkOrder();
       		 $scope.workorder.$promise.then(function(){

  			console.log('Offender: ', $scope.offender);
  			console.log('Work Order: ', $scope.workorder);
  			console.log('User: ', $scope.authentication.user);
  			

  			$scope.workorder.email = $scope.offender.offenderEmail;
		     // $scope.workorder.type =  'New Install';
		     $scope.workorder.subject = 'Authorization for Budget Ignition Interlock';
		     $scope.workorder.toWhom = 'Customer';
		     // $scope.workorder.serviceCenter = 'Need to get SVC CEnter Name';
		     $scope.workorder.toWhomName =  $scope.offender.firstName+' '+ $scope.offender.lastName;

  			        			$http({
					method: 'post',
					responseType: 'arraybuffer',
					url: '/work/order', 
					data: {
						'user': $scope.authentication.user,
						'offender': $scope.offender,
						'workinfo': $scope.workorder
						
								},
								
						})
					.success(function(data, status) {
					
					$scope.sending = false;
					$scope.results = true;
					//////console.log('Data from LOA?? %o',data);
					toastr.success('Success! Email was sent...');
						$scope.myresults = 'Email Sent!';
						
						

						var file = new Blob([data], {type: 'application/pdf'});
			     		var fileURL = URL.createObjectURL(file);
			     		window.open(fileURL);
			     		
			     		


								});
				});

			
  		};

  		$scope.shopOrder = function() {
        $modalInstance.close($scope.selected.item);
        $scope.offender.assignedShop = $scope.serviceCenter._id;
        $scope.offender.pendingWorkType = $scope.chosen;
        console.log($scope.offender);
        console.log('Service Center Name: ', $scope.serviceCenter.name);
        var shopAddy = $scope.serviceCenter.address+' '+$scope.serviceCenter.city+' '+$scope.serviceCenter.state+' '+$scope.serviceCenter.zipcode;
        console.log('Service Addy: ', shopAddy);
        


        console.log($scope);

        	var chargeAmount = '0';

        	if($scope.chosen==='New Install'){
        		chargeAmount = $scope.installFee;
        	} 
        	if($scope.chosen==='Reset') {
        		chargeAmount = '50';
        	}
        	if($scope.chosen==='Removal') {
        		chargeAmount = '75';
        	}
        	if($scope.chosen==='Calibration') {
        		chargeAmount = '0';
        	}
        	console.log('Charge Amount: ', chargeAmount);
        	console.log('$scope.installFee = ', $scope.installFee);
        	

        	//Save New Work Order
        		var workorder = new Workorders ({
				serviceCenter: $scope.serviceCenter.name,
				svcAddress: shopAddy,
				offender: $scope.offender._id,
				type: $scope.chosen,
				shopId: $scope.serviceCenter._id, 
				amount: chargeAmount
				
			});

        		console.log('Work Order: ', workorder);
			// Redirect after save
			workorder.$save(function(response) {
					$scope.workOrder._id = response._id;
					$scope.offender.pendingWorkOrder = response._id;
					$scope.offender.term = $scope.term;
        			$scope.offender.$update();

        			$scope.workOrder.email = $scope.offender.offenderEmail;

			console.log('Work order status...', $scope.workOrder);

        			$http({
					method: 'post',
					responseType: 'arraybuffer',
					url: '/work/order', 
					data: {
						'user': $scope.authentication.user,
						'offender': $scope.offender,
						'workinfo': $scope.workOrder
						
								},
								
						})
					.success(function(data, status) {
					
					$scope.sending = false;
					$scope.results = true;
					//////console.log('Data from LOA?? %o',data);
					toastr.success('Success! Email was sent...');
						$scope.myresults = 'Email Sent!';
						
						

						// var file = new Blob([data], {type: 'application/pdf'});
			   //   		var fileURL = URL.createObjectURL(file);
			   //   		window.open(fileURL);
			     		
			     		


								});

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});


      };


      $scope.ok = function() {
        $modalInstance.close($scope.selected.item);
        $scope.offender.assignedShop = $scope.serviceCenter._id;
        $scope.offender.pendingWorkType = $scope.chosen;
        console.log($scope.offender);
        console.log('Service Center Name: ', $scope.serviceCenter.name);
        var shopAddy = $scope.serviceCenter.address+' '+$scope.serviceCenter.city+' '+$scope.serviceCenter.state+' '+$scope.serviceCenter.zipcode;
        console.log('Service Addy: ', shopAddy);
        

        $scope.workOrder = {
        	email: $scope.emailAddress,
        	type: $scope.chosen,
        	subject: $scope.emailSubject,
        	content: $scope.emailText,
        	toWhom: $scope.sendTo,
        	serviceCenter: $scope.serviceCenter.name,
        	svcAddress: shopAddy,
        	toWhomName: $scope.toWhomName

        };

               

        	var chargeAmount = '0';

        	if($scope.chosen==='New Install'){
        		chargeAmount = $scope.installFee;
        	} 
        	if($scope.chosen==='Reset') {
        		chargeAmount = '50';
        	}
        	if($scope.chosen==='Removal') {
        		chargeAmount = '75';
        	}
        	if($scope.chosen==='Calibration') {
        		chargeAmount = '0';
        	}
        	console.log('Charge Amount: ', chargeAmount);
        	console.log('$scope.installFee = ', $scope.installFee);
        	

        	//Save New Work Order
        		var workorder = new Workorders ({
				serviceCenter: $scope.serviceCenter.name,
				svcAddress: shopAddy,
				offender: $scope.offender._id,
				type: $scope.chosen,
				shopId: $scope.serviceCenter._id, 
				amount: chargeAmount
				
			});

        		console.log('Work Order: ', workorder);
			// Redirect after save
			workorder.$save(function(response) {
					// $scope.workOrder._id = response._id;
					$scope.offender.pendingWorkOrder = response._id;
					$scope.offender.term = $scope.term;
        			$scope.offender.$update();
        			workorder.email = $scope.offender.offenderEmail;
        			workorder.subject = $scope.emailSubject;


			console.log('Work order status...', $scope.workOrder);

        			$http({
					method: 'post',
					responseType: 'arraybuffer',
					url: '/work/order', 
					data: {
						'user': $scope.authentication.user,
						'offender': $scope.offender,
						'workinfo': workorder
						
								},
								
						})
					.success(function(data, status) {
					
					$scope.sending = false;
					$scope.results = true;
					//////console.log('Data from LOA?? %o',data);
					toastr.success('Success! Email was sent...');
						$scope.myresults = 'Email Sent!';
						
						

						var file = new Blob([data], {type: 'application/pdf'});
			     		var fileURL = URL.createObjectURL(file);
			     		window.open(fileURL);
			     		
			     		


								});

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});


      };


      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };




 $scope.today = function() {
        return $scope.dt = new Date();
      };
      $scope.today();
      $scope.showWeeks = true;
      $scope.toggleWeeks = function() {
        return $scope.showWeeks = !$scope.showWeeks;
      };
      $scope.clear = function() {
        return $scope.dt = null;
      };
      $scope.disabled = function(date, mode) {
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
      };
      $scope.toggleMin = function() {
        var _ref;
        return $scope.minDate = (_ref = $scope.minDate) != null ? _ref : {
          "null": new Date()
        };
      };
      $scope.toggleMin();
      $scope.openCalendar = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        return $scope.opened = true;
      };
      $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 7
      };
      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
      $scope.format = $scope.formats[0];
   

$scope.mytime = $scope.dt;
      $scope.hstep = 1;
      $scope.mstep = 5;
      $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
      };
      $scope.ismeridian = true;
      $scope.toggleMode = function() {
        return $scope.ismeridian = !$scope.ismeridian;
      };


      $scope.update = function() {
        var d;
        d = new Date();
        d.setHours(14);
        d.setMinutes(0);
        return $scope.mytime = d;
      };

      $scope.changed = function() {
        return //////////console.log('Time changed to: ' + $scope.mytime);
      };

      return $scope.clear = function() {
        return $scope.mytime = null;
};


    }
  ]).controller('paymentDetailCtrl', ['$scope', '$modalInstance', 'offender', 'Authentication', '$http', 'Workorders', 'Shops', '$location', 'payment', 'Payments',  function($scope, $modalInstance, offender, Authentication, $http, Workorders, Shops, $location, payment, Payments) {
     $scope.authentication = Authentication;
     $scope.payment = payment;

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');

      };

      		$scope.findWorkOrder = function(id) {
     		console.log('Workorder: ', id);
			$scope.workorder = Workorders.get({ 
				workorderId: id
			});
			console.log('Found our Workorder:  ', $scope.workorder);
			return $scope.workorder;

		};


			$scope.expYears = function() {
				var y = [];
				for(var i = new Date().getFullYear(); i <= new Date().getFullYear() + 7 ; i++) {
					y.push(i);
				}
				return y;
			}();
			// $scope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct', 'Nov','Dec'];
			$scope.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
			$scope.expMonth = $scope.months[1];
			$scope.expYear = $scope.expYears[2];

			 $scope.ok = function() {
			 	var amount = $scope.payment.amount;
			 	var dueDate = $scope.payment.dueDate;
			 	console.log('$scope.payment', $scope.payment);
        $modalInstance.close();
        console.log('Saving Payment Info');
        console.log($scope.payment._id);
        	var payment = Payments.get({ 
				paymentId: $scope.payment._id
			});
			payment.$promise.then(function(){
				console.log('Payment Promise Complete');
				console.log('Payment is: ', payment);
			payment.amount = amount;
			payment.dueDate = dueDate;

			console.log('Payment now: ', payment);
			payment.$update();


			});
			


    };
			
		



 }]).controller('workOrderCtrl', ['$scope', '$modalInstance', 'offender', 'Authentication', '$http', 'Workorders', 'Shops', '$location', 'workorder', 'Payments',  function($scope, $modalInstance, offender, Authentication, $http, Workorders, Shops, $location, workorder, Payments) {
     $scope.authentication = Authentication;
     $scope.shops = Shops.query();
    $scope.offender = offender;
    $scope.workorder = workorder;

    $scope.changeSvcCenter = function(){
    		var amt = $scope.workorder.amount;
      		$scope.workorder = $scope.findWorkOrder($scope.workorder._id);
			$scope.workorder.$promise.then(function() {
				$scope.workorder.amount = amt;
				 var shopAddy = $scope.serviceCenter.address+' '+$scope.serviceCenter.city+' '+$scope.serviceCenter.state+' '+$scope.serviceCenter.zipcode;
       
				$scope.workorder.svcAddress = shopAddy;
				$scope.offender.assignedShop = $scope.serviceCenter._id;
				$scope.workorder.shopId = $scope.serviceCenter._id;
				$scope.workorder.serviceCenter = $scope.serviceCenter.name;
				$scope.offender.assignedShop = $scope.serviceCenter._id;
        		
        		$scope.offender.$update();
        		$scope.workorder.$update();


			});


      };

    //Get Workorder Provider
    $scope.findWorkOrder = function(id) {
     		console.log('Workorder: ', id);
			$scope.workorder = Workorders.get({ 
				workorderId: id
			});
			console.log('Found our Workorder:  ', $scope.workorder);
			return $scope.workorder;

		};

    //Delete Work Order
    // Remove existing Workorder
		$scope.remove = function(  ) {
			console.log('Removing WOrk Order');
			console.log('Offender: ', $scope.offender);
			if($scope.offender.pendingWorkOrder===$scope.workorder._id){
				console.log('This is a pending order');
				$scope.offender.pendingWorkOrder = null
				$scope.offender.pendingWorkType = null;
				$scope.offender.$update();
			}
			var url = $location.url();
			console.log('Location: ', url);
			console.log('$scope.workorder: ', $scope.workorder);
			$scope.workorder = $scope.findWorkOrder($scope.workorder._id);
			$scope.workorder.$promise.then(function() {

					$scope.workorder.$remove(function() {
						
						$modalInstance.close('Deleted');
						toastr.success('Workorder has been deleted');
						// $location.path('reload');
						setTimeout(function(){ 
							window.location.reload();
						}, 1500);
						
					});
			});
			
		};

		 $scope.cancel = function() {
        $modalInstance.dismiss('cancel');

      };



      $scope.ok = function() {


      	console.log('Ok Pressed ', $scope.workorder);
      	console.log('Serivce Fee: ', $scope.workorder.amount);
      	var amt = $scope.workorder.amount;
      		$scope.workorder = $scope.findWorkOrder($scope.workorder._id);

			$scope.workorder.$promise.then(function() {
				$scope.workorder.amount = amt;
		console.log('Workorder to Save/Modify ', $scope.workorder);
        $modalInstance.close('Saving Work Order');
       
        console.log($scope.offender);
     
			// Redirect after save
			
			$scope.offender.$update();
        	$scope.workorder.$update(function(){

        			console.log('Saved....reloading Page: ');
        			setTimeout(function(){ 
							window.location.reload();
						}, 500);
        			
        		});

		})
		};







 }]).controller('NEWworkOrderCtrl', ['$scope', '$modalInstance', 'offender', 'Authentication', '$http', 'Workorders', 'Shops', '$location', 'Payments',  function($scope, $modalInstance, offender, Authentication, $http, Workorders, Shops, $location, Payments) {
     $scope.authentication = Authentication;
     $scope.shops = Shops.query();
    $scope.offender = offender;
    $scope.items = ['Calibration', 'Reset', 'Removal'];
    $scope.emailSubject = 'New Work Order Appointment';



    $scope.scheduleNew = function(){
    	console.log('Scheduling New Work Order');
    	// $modalInstance.close('New Work Order');
    	console.log('Getting our shop');
      		
		console.log('Getting myshop: ', $scope.wochosen );
		var myShop = Shops.get({ 
			shopId: $scope.authentication.user.shop
		});
		myShop.$promise.then(function(){
			console.log('Shop Promise finished', myShop);
      		
      		
	      	$scope.serviceCenter = myShop;
	        
	        $scope.offender.pendingWorkType = $scope.chosen;
	        console.log($scope.offender);
	        console.log('Service Center Name: ', $scope.serviceCenter.name);
	        var shopAddy = $scope.serviceCenter.address+' '+$scope.serviceCenter.city+' '+$scope.serviceCenter.state+' '+$scope.serviceCenter.zipcode;
	        console.log('Service Addy: ', shopAddy);
	        

	        	var chargeAmount = '0';

	        
	        	if($scope.chosen==='Reset') {
	        		chargeAmount = '50';
	        	}
	        	if($scope.chosen==='Removal') {
	        		chargeAmount = '75';
	        	}
	        	if($scope.chosen==='Calibration') {
	        		chargeAmount = '0';
	        	}
	        	console.log('Charge Amount: ', chargeAmount);
	        	console.log('$scope.installFee = ', $scope.installFee);
	        	
	        	//Get Appointment Date/Time
	        	var date = $scope.dt;
				var time = $scope.mytime;
				var datetime = new Date(date.getFullYear(), 
					date.getMonth(), 
					date.getDate(), 
					time.getHours(), 
					time.getMinutes(), 
					time.getSeconds());
				console.log('Appt Date Time: ', datetime);
				datetime.toUTCString();
				console.log('Converted Appointment: ', datetime);

	        	//Save New Work Order
	        		var workorder = new Workorders ({
					serviceCenter: $scope.serviceCenter.name,
					svcAddress: shopAddy,
					offender: $scope.offender._id,
					type: $scope.chosen,
					shopId: $scope.serviceCenter._id, 
					amount: chargeAmount,
					apptDate: datetime
					
				});

        		console.log('Work Order: ', workorder);
			// Redirect after save
			workorder.$save(function(response) {
					// $scope.workOrder._id = response._id;
					$scope.offender.pendingWorkOrder = response._id;
					$scope.offender.pendingWorkType = workorder.type;
        			$scope.offender.$update();
        			workorder.email = $scope.offender.offenderEmail;
        			workorder.toWhomName = $scope.offender.displayName;
        			workorder.subject = $scope.emailSubject;



			console.log('Work order status...', workorder);

        			$http({
					method: 'post',
					responseType: 'arraybuffer',
					url: '/work/order', 
					data: {
						'user': $scope.authentication.user,
						'offender': $scope.offender,
						'workinfo': workorder
						
								},
								
						})
					.success(function(data, status) {
					
					$scope.sending = false;
					$scope.results = true;
					//////console.log('Data from LOA?? %o',data);
					toastr.success('Success! Email was sent to '+$scope.offender.offenderEmail);
					$scope.myresults = 'Email Sent!';
					$modalInstance.close('New Work Order');

					$location.path('/pending');
						
						

						// var file = new Blob([data], {type: 'application/pdf'});
			   //   		var fileURL = URL.createObjectURL(file);
			     		// window.open(fileURL);
			     		
			     		


								});

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

	});


    };

    $scope.changeSvcCenter = function(){
    		var amt = $scope.workorder.amount;
      		$scope.workorder = $scope.findWorkOrder($scope.workorder._id);
			$scope.workorder.$promise.then(function() {
				$scope.workorder.amount = amt;
				 var shopAddy = $scope.serviceCenter.address+' '+$scope.serviceCenter.city+' '+$scope.serviceCenter.state+' '+$scope.serviceCenter.zipcode;
       
				$scope.workorder.svcAddress = shopAddy;
				$scope.offender.assignedShop = $scope.serviceCenter._id;
				$scope.workorder.shopId = $scope.serviceCenter._id;
				$scope.workorder.serviceCenter = $scope.serviceCenter.name;
				$scope.offender.assignedShop = $scope.serviceCenter._id;
        		
        		$scope.offender.$update();
        		$scope.workorder.$update();


			});


      };



    		 $scope.cancel = function() {
        $modalInstance.dismiss('cancel');

      };



      $scope.ok = function() {


      	console.log('Ok Pressed ', $scope.workorder);
      	console.log('Serivce Fee: ', $scope.workorder.amount);
      	var amt = $scope.workorder.amount;
      		$scope.workorder = $scope.findWorkOrder($scope.workorder._id);

			$scope.workorder.$promise.then(function() {
				$scope.workorder.amount = amt;
		console.log('Workorder to Save/Modify ', $scope.workorder);
        $modalInstance.close('Saving Work Order');
       
        console.log($scope.offender);
     
			// Redirect after save
			
			$scope.offender.$update();
        	$scope.workorder.$update(function(){

        			console.log('Saved....reloading Page: ');
        			setTimeout(function(){ 
							window.location.reload();
						}, 500);
        			
        		});

		})
		};




 $scope.today = function() {
        return $scope.dt = new Date();
      };
      $scope.today();
      $scope.showWeeks = true;
      $scope.toggleWeeks = function() {
        return $scope.showWeeks = !$scope.showWeeks;
      };
      $scope.clear = function() {
        return $scope.dt = null;
      };
      $scope.disabled = function(date, mode) {
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
      };
      $scope.toggleMin = function() {
        var _ref;
        return $scope.minDate = (_ref = $scope.minDate) != null ? _ref : {
          "null": new Date()
        };
      };
      $scope.toggleMin();
      $scope.openCalendar = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        return $scope.opened = true;
      };
      $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 7
      };
      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
      $scope.format = $scope.formats[0];
   

$scope.mytime = $scope.dt;
      $scope.hstep = 1;
      $scope.mstep = 5;
      $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
      };
      $scope.ismeridian = true;
      $scope.toggleMode = function() {
        return $scope.ismeridian = !$scope.ismeridian;
      };


      $scope.update = function() {
        var d;
        d = new Date();
        d.setHours(14);
        d.setMinutes(0);
        return $scope.mytime = d;
      };

      $scope.changed = function() {
        return //////////console.log('Time changed to: ' + $scope.mytime);
      };

      return $scope.clear = function() {
        return $scope.mytime = null;
};

}]).controller('paymentCtrl', ['$scope', '$modalInstance', 'offender', 'Authentication', '$http', 'Workorders', 'Shops', '$location', 'workorders', 'Payments', 'payments', '$resource',  function($scope, $modalInstance, offender, Authentication, $http, Workorders, Shops, $location, workorders, Payments, payments, $resource) {
     $scope.authentication = Authentication;
     $scope.shops = Shops.query();
    $scope.offender = offender;
    $scope.worders = workorders;
    $scope.payments = payments;

  $scope.oneAtATime = true;

	$scope.myShop = function(){
		console.log('Getting our shop');
      		
      			console.log('Getting myshop: ', $scope.wochosen );
      				var myShop = Shops.get({ 
					shopId: $scope.wochosen.shopId
					});
      				myShop.$promise.then(function(){
      				console.log('Shop Promise finished', myShop);
      		
      		
      				$scope.serviceCenter = myShop;

      	});


      		
      		
      };

      	$scope.choosePmt = function(row){
      		$scope.onFile = true;
      		$scope.error = false;

      		console.log('Choosing Payment  Profile', $scope.paymentProfiles[row]);
      		console.log('Offender ', $scope.offender);
      		console.log('Do We have a  Workorder ', $scope.pmtchosen.workorder);
      		var wo = $scope.pmtchosen.workorder;

      							$http({
					    method: 'post',
					    url: '/chargeCCard',
					    data: {
					    	paymentProfile: $scope.paymentProfiles[row],
					    	offender: $scope.offender, 
					    	pmt: $scope.pmtchosen

					    }
					    
		
					  })
					.error(function(data) {
						console.log('Error!! ', data);
						toastr.error(data);
						$scope.error = data.error.message;
					})
					.success(function(data, status, headers, config) {
						$scope.chargeComplete = true;
						console.log('Data From Charge: ', data.directResponse);
						var resp = data.directResponse.split(',');
						console.log('4', resp[4]);
						console.log('Trans Type (11)', resp[11]);
						console.log('Trans Type (12)', resp[12]);
						console.log('OR -- Trans Type (13)', resp[13]);
						var amount = resp[9];
						var description = resp[3];
						var authCode = resp[4];
						$scope.responseNotes = description+' '+resp[51]+resp[50]+' for $'+amount+'. Authorization Code: '+authCode;
						
						// $modalInstance.close();

						// if(wo){
   			// 				console.log('This is for a work order...', wo);
   			// 				console.log('Need One Workorder ', $scope.pmtchosen.workorder);
   			// 				var ourId = $scope.pmtchosen.workorder;
   			// 				console.log('WO[0] -- why??? ', wo[0]);
   			// 				console.log('Our ID: ', ourId);

   			// 				var wos = Workorders.query({_id: ourId});
   							

   			// 				wos.$promise.then(function(){
   			// 					var workOrder = wos[0];
   			// 					console.log('Workorder ready to save: , ', workOrder);
   			// 					workOrder.authCode = authCode;
		   	// 					workOrder.pmtStatus = 'Paid';

		   	// 					workOrder.amount = amount;
		   	// 					workOrder.$update();

   			// 				});
   							

   			// 			}	else {
   			// 				console.log('No work order associated with this payment');
   			// 			}

						console.log('Payment Object: ',$scope.pmtchosen);
						var payment = Payments.get({paymentId: $scope.pmtchosen._id}, function(ret){
							$scope.payment = payment;
							console.log('Return?? :', ret);
							payment.authCode = authCode;
							payment.pmtOpt = 'Credit Card via Portal';
							payment.paidDate = Date.now();
							payment.status = 'Paid';
							payment.notes = resp[51]+'-'+resp[50]+' for $'+amount+'. Authorization Code: '+authCode;
							payment.$update();
							console.log('Payment Chosen: ', payment);
							toastr.success(resp[51]+resp[50]+' for $'+amount+'. Authorization Code: '+authCode);

						})
						
						
   						
					});

      	};

            $scope.getPayments = function(){
      	
     	console.log('Getting Modal Payments for: ', offender._id);
     	
     			$http({
					method: 'post',
					url: '/pmtsByOffender/',
					data: {
						id: offender._id,
						choose: 'due'
					}
					})
					.success(function(data, status) {
							if(status === 200) {
								
							console.log('Return Payments Modal: ', data);
							$scope.payments = data;
							}
				});


					$http({
					method: 'post',
					url: '/getPaymentProfiles/',
					 data: {
					    	offender: offender,
				
					    }
					})
					.success(function(data, status) {
							if(status === 200) {
								
							console.log('Return Payments Modal: ', data);

							$scope.paymentProfiles = data.profile.paymentProfiles;
							if($scope.paymentProfiles){
								console.log('Got Payment Profiles', $scope.paymentProfiles);

							}else {
								console.log('Ain\'t Got any  Payment Profiles', $scope.paymentProfiles);
								$scope.paymentProfiles = null;
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
							console.log('Payment InfO: ',$scope.paymentProfiles  );
							}
				});

					

     	
				


}();

      	$scope.expYears = function() {
				var y = [];
				for(var i = new Date().getFullYear(); i <= new Date().getFullYear() + 7 ; i++) {
					y.push(i);
				}
				return y;
			}();
			// $scope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct', 'Nov','Dec'];
			$scope.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
			$scope.expMonth = $scope.months[1];
			$scope.expYear = $scope.expYears[2];
			
		

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.status = {
    isFirstOpen: true,
    isFirstDisabled: false
  };
  $scope.pmtTypes = ['Monthly Fee', 'Service Fee', 'Late Fee'];

  $scope.pmtOpts = ['Cash', 'Check', 'Gift Card', 'Credit Card'];

  $scope.changepmtType = function() {
  	console.log('Changing Payment Type');
  	$scope.hide = false;


  };


$scope.chooseRow = function(row) {
	console.log('This is: ', this);
	console.log('Do we know the index', $scope);
	console.log('Row: ', row);
	$scope.hide = true;
	$scope.pmtchosen = $scope.payments[row];
	$scope.pmtAmount = $scope.payments[row]['amount'];
	$scope.payment = $scope.payments[row];
	// $scope.pmtAmount = $scope.wochosen.amount;
	// $scope.myShop();

};

$scope.makePmt = function(){
	console.log('Making Payment', $scope.pmtOpt);
	console.log('Payment Amount: ', $scope.pmtAmount);
	console.log('Work Order Assigned: ', $scope.payment);

	var payment = Payments.get({ 
				paymentId: $scope.payment._id
			});
	payment.$promise.then(function(){

		console.log('Got the payment - ready to update', payment);

		payment.status = 'Paid';
		payment.notes = $scope.payment.notes;
		payment.paidDate = Date.now();
		payment.pmtOpt = payment.pmtOpt || $scope.pmtOpt;
		payment.$update();
		 $modalInstance.dismiss('paid');
		 toastr.success('Payment applied');
	})

	// if($scope.wochosen){
	// 	var wo = $scope.wochosen;
	// 	var pmt = new Payments ({
	// 			workorder: $scope.wochosen._id,
	// 			pmtType: $scope.pmtType,
	// 			pmtOpt: $scope.pmtOpt,
	// 			offender: $scope.offender._id,
	// 			status: 'Paid',
	// 			notes: 'Nothing', 
	// 			amount: $scope.pmtAmount
				
	// 		});

	// } else {
	// 	var pmt = new Payments ({
	// 			pmtType: $scope.pmtType,
	// 			pmtOpt: $scope.pmtOpt,
	// 			offender: $scope.offender._id,
	// 			status: 'Paid',
	// 			notes: 'Nothing', 
	// 			amount: $scope.pmtAmount
				
	// 		});


	// }
	//Create New Payment
        		

        		
			// // Redirect after save
			// pmt.$save(function(response) {
			// 		console.log('Response from saving PMT: ', response);
			// 		toastr.success('Payment has been recorded for '+$scope.pmtAmount);
			// 		 $modalInstance.dismiss('complete');
			// 		 if(wo){
			// 		 	console.log('Updating Work order to paid status', wo);
			// 		 	var work = $scope.findWorkOrder(wo._id);
			// 	// console.log('Wo is: ', wo);
			// 	work.$promise.then(function() {
			// 			console.log('Got Work Order: ', work);
					 	
			// 		 	work.pmtStatus = 'Paid';
   //     				 	work.$update();
			// 		 });
			// }
					 
   //      		});


};
      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');

      };

      		$scope.findWorkOrder = function(id) {
     		console.log('Workorder: ', id);
			$scope.workorder = Workorders.get({ 
				workorderId: id
			});
			console.log('Found our Workorder:  ', $scope.workorder);
			return $scope.workorder;

		};
		$scope.payments = function() {

			$scope.offender.$promise.then(function() {
     			$http({
					method: 'post',
					url: '/pmtsByOffender/',
					data: {
						id: $scope.offender._id,
						choose: 'all'
					}
					})
					.success(function(data, status) {
							if(status === 200) {
								
							console.log('Return Payments Data: ', data);
							$scope.payments = data;
							}
				});

     	});
				


		};

				//Charge Credit Card for Work order
		$scope.chargeCard = function (type){
			$scope.newCard = true;
			$scope.error = false;
			console.log('Charge on file or new: ', type);
			console.log('Charging Credit Card Now', $scope.offender);
			console.log('Payment: ', $scope.pmtchosen);
			var pmt = $scope.pmtchosen;
			var wo;
			if($scope.pmtchosen.workorder){
				wo = Workorders.query({_id: $scope.pmtchosen.workorder});

			}else{
				wo = null;
			}
			
				console.log('Work Order: ', wo);

			var off = $scope.offender;
        	var cardNum = $scope.offenderCC ,
        	cardExp = $scope.expYear+'-'+$scope.expMonth,
        	cardCCV = $scope.creditCardCCV;

        	


						$http({
					    method: 'post',
					    url: '/chargeCCard',
					    data: {
					    	offender: off,
					    	setupProfile: true,
					    	type: type,
					    	workinfo: wo,
					    	cardNum: cardNum,
					    	cardExp: cardExp,
					    	expMonth: $scope.expMonth,
					    	expYear: $scope.expYear,
					    	ccv: cardCCV,
					    	cardZip: $scope.cardZip,
					    	cardName: $scope.cardName,
					    	pmt: pmt
					    }
					    
		
					  })
					.error(function(data) {
						console.log('Error!! ', data);
						toastr.error(data);
						$scope.error = data;
					})
					.success(function(data, status, headers, config) {
						console.log('Data From Charge: ', data.directResponse);
						$scope.chargeComplete = true;
						var resp = data.directResponse.split(',');
						console.log('4', resp[4]);
						console.log('Trans Type (11)', resp[11]);
						console.log('Trans Type (12)', resp[12]);
						console.log('OR -- Trans Type (13)', resp[13]);
						var amount = resp[9];
						var description = resp[3];
						var authCode = resp[4];
						// $modalInstance.close();
						$scope.chargeComplete = true;
						$scope.responseNotes = description+' '+resp[51]+resp[50]+' for $'+amount+'. Authorization Code: '+authCode;
						toastr.success(description+' on '+resp[51]+resp[50]+' for $'+amount+'. Authorization Code: '+authCode);
   						if(wo){
   							console.log('This is for a work order...', wo);
   							console.log('Need One Workorder ', $scope.pmtchosen.workorder);
   							var ourId = $scope.pmtchosen.workorder;
   							console.log('WO[0] -- why??? ', wo[0]);
   							console.log('Our ID: ', ourId);

   							var wos = Workorders.query({_id: ourId});
   							

   							wos.$promise.then(function(){
   								var workOrder = wos[0];
   								console.log('Workorder ready to save: , ', workOrder);
   								workOrder.authCode = authCode;
		   						workOrder.pmtStatus = 'Paid';

		   						workOrder.amount = amount;
		   						workOrder.$update();

   							});
   							

   						}	else {
   							console.log('No work order associated with this payment');
   						}
   						console.log('Do we still have payment? - can we Add AuthCode and update status', pmt);
   						var payment = Payments.get( {paymentId: pmt._id}).$promise.then(function(payment){

   							console.log('Payment about to be saved', payment);
   							$scope.payment = payment;
   							payment.status = 'Paid';
   							payment.authCode = authCode;
   							payment.pmtOpt = 'Credit Card via Portal';
   							payment.paidDate = Date.now();
   							payment.notes = 'Auth Code: '+authCode+' - '+$scope.authentication.user.displayName;
   							console.log('Payment Before Save: ', payment);
   							payment.$update();
   							console.log('Here is our Offender before we go: ----> ', $scope.offender);
   						});
   					});

			



		
			
		};


}]).controller('PaginationDemoCtrl', [
]).controller('AccordionDemoCtrl', function ($scope) {
  $scope.oneAtATime = true;

  $scope.groups = [
    {
      title: 'Dynamic Group Header - 1',
      content: 'Dynamic Group Body - 1'
    },
    {
      title: 'Dynamic Group Header - 2',
      content: 'Dynamic Group Body - 2'
    }
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.status = {
    isFirstOpen: true,
    isFirstDisabled: false
  };




});





	// $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
 //   $scope.state = $scope.states[2];
 //   $scope.stateReportTo = $scope.states[4];

 //   $scope.vehicles = [
	// 	'Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 'Dodge',
	// 	'FIAT', 'Ford', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 'Kia',
	// 	'Land Rover', 'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz', 'MINI', 'Mitsubishi',
	// 	'Nissan', 'Scion', 'Smart', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Volkswagen',
	// 	'Volvo', 'Porsche', 'Other',
	// ];
	// $scope.vehicleMake = $scope.vehicles[8];

	// 	$scope.vehicleYears = function() {
	// 			var y = [];
	// 			for(var i = new Date().getFullYear() + 1; i >= 1900; i--) {
	// 				y.push(i);
	// 			}
	// 			return y;
	// 		}();

	// 				$scope.expYears = function() {
	// 			var y = [];
	// 			for(var i = new Date().getFullYear(); i <= new Date().getFullYear() + 7 ; i++) {
	// 				y.push(i);
	// 			}
	// 			return y;
	// 		}();
	// 		$scope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct', 'Nov','Dec'];
	// 		$scope.expMonth = $scope.months[1];
	// 		$scope.expYear = $scope.expYears[2];
			
		
	// 	$scope.vehicleYear = $scope.vehicleYears[1];



	// 	// Create new Offender
	// 	$scope.$scope = function() {
	// 		console.log('Adding a new offender');
	// 		// console.log($scope.firstName);
	// 		// console.log($scope.lastName);
	// 		// console.log($scope.mainPhone);
	// 		// console.log($scope.driverNumber);
	// 		// console.log($scope.altPhone);
	// 		// Create new Offender object
	// 		console.log('First Name', this.firstName);
	// 		// var offender = new Offenders ({
	// 		// 	firstName: this.firstName
	// 			// lastName: $scope.lastName, 
	// 			// mainPhone: $scope.mainPhone, 
	// 			// altPhone: $scope.altPhone, 
	// 			// offenderEmail: $scope.offenderEmail, 
	// 			// billingAddress: $scope.billingAddress, 
	// 			// billingCity: $scope.billingCity, 
	// 			// billingState: $scope.billingState, 
	// 			// billingZipcode: $scope.billingZipcode, 
	// 			// stateReportTo: $scope.stateReportTo, 
	// 			// vehicleMake: $scope.vehicleMake, 
	// 			// vehicleYear: $scope.vehicleYear,
	// 			// driverNumber: $scope.driverNumber

	// 		// });

	// 		var offender = new Offenders ({
	// 			name: 'Ted', 
	// 			firstName: 'Steve'
	// 		});

	// 		console.log('Offender Info: ', offender);
	// 		// Redirect after save
	// 		offender.$save(function(response) {
	// 			console.log('Response: ', response);
	// 			$location.path('offenders/' + response._id);

	// 			// Clear form fields
	// 			$scope.name = '';
	// 		}, function(errorResponse) {
	// 			$scope.error = errorResponse.data.message;
	// 		});
	// 	};