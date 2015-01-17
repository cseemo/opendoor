'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('errors'),
	Payment = mongoose.model('Payment'),

	Workorder = mongoose.model('Workorder'),
	_ = require('lodash');
	var Authorize = require('auth-net-types')
	  , _AuthorizeCIM = require('auth-net-cim')
	  , AuthorizeCIM = new _AuthorizeCIM({
	    // api: '78HDftF7Gs',
	    // key: '83H8U65tX3ekuFrD', //Chads TEst API
	    api: '5hB56Vus',
	    key: '37HmG92v4J2yDsMp', //Budget Actual API
	    sandbox: false //true // false
	  });
	  var moment = require('moment');
	  var Offender = mongoose.model('Offender'),
	  offenders = require('../../app/controllers/offenders');

	  var async = require('async');

	  // var q = require('q');
// var Workorder = require('Workorder');
// var workorders = require('../../app/controllers/workorders');

	exports.getPaymentProfiles = function(req, res){
		console.log('Getting Payment Profiles');
			AuthorizeCIM.getCustomerProfile(req.body.offender.merchantCustomerId, function(err, response) {
				if(err) {
					console.log('Error getting Profile for ', req.body.offender.merchantCustomerId);
					res.status(300).send('No Paymetn Profiles');
				}else{
					console.log('Profile Response: ', response);
				console.log('Payment Profiles', response.profile.paymentProfiles);
				res.status(200).send(response);
				}

				


			});


	};

		exports.checkPastDue = function(req, res) {
			console.log('Checking Past Due: ', req.body);
			console.log('ID: ', req.body.id);
			var today = moment();
			console.log('Today is: ', today);
			Payment.find({
				dueDate: {
					$lte: today
				},
				status: 'Due',
				offender: req.body.id
			}).sort('-created').populate('user', 'displayName').exec(function(err, payments) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				console.log('We found '+payments.length+' past due payments!!!! ');
				res.jsonp(payments);
			}
		});
	};



	var createMonthlyCharge = function() {
		//GO thru each Offender and create a new Charge for them
		//This should run one time per month...right now every month on the 1st
		//may need to modify library in order to run this code on a specific date for each customer
		//Perhaps every day at 5am we run a function to check each customer's BillDate and then run this functio
		//YES -- DO THAT!!!
		console.log('Creating Monthly Fee');
		// var startDate = moment().hours(0).minutes(0).seconds(0);

		//  var today = new moment();
		//  var convertedPretty = moment(today).format("MM/DD/YYYY hh:mm:ss");
		//  var tomorrow = moment().add(1, 'days').hours(0).minutes(0).seconds(0);
	 //     var t = tomorrow._d;
	 //     startDate = startDate._d;
	 //     var startDate2 = moment(startDate).format("YYYY-M-DTHH:mm:ss");
	 //     var endDate2= moment(t).format("YYYY-M-DTHH:mm:ss");
	 //     console.log('Tomorrow: ', t);
	 //     console.log('Start Date: ', startDate2);
	 //     console.log('End Date: ', endDate2);




		Offender.find().sort('-created').populate('user', 'displayName').exec(function(err, offenders) {
			if (err) {
				return res.status(400).send({
					message: err //errorHandler.getErrorMessage(err)
				});
			} else {
				// console.log('Offenders List: ', offenders);
				var nextMonth = moment().add(15, 'days').hours(0).minutes(0).seconds(0);

				async.forEach(offenders, function(item, callback){
					console.log('Client ', item.displayName);
					console.log('Bill Date is: ', item.billDate);
					var d = new Date();
					var n = d.getDate();
					console.log('Todays date is: ', n);
					n = n-1;


					if(item.billDate == n ){
						console.log('Today is this customers bill date -- need to generate a charge');
							var payment = new Payment({
						    pmtType: 'Monthly Fee',
						    dueDate: nextMonth,
						    offender: item._id,
						    status: 'Due',
						    notes: 'Autogenerated Invoice',
						    amount: '65',
							});
								
							payment.save(function(err) {
								if (err) {
									return res.status(400).send({
										message: errorHandler.getErrorMessage(err)
									});
								} else {
								// res.jsonp(payment);
								console.log('Payment for '+item.displayName);
								// callback();
								}
							});
						} else {
							console.log('Not '+item.displayName+'\'s bill date...move on.');
						}

						}, function(err){
								console.log('Finished Making Monthly Fees');
							})
				}
		});
	};


//Mess with Cron Job -- need to schedule things
// -- New Payment Due every 30th day after Install
// -- New appointment every 30th day after Install
// -- New REset Function every 90th day after last deployment

var CronJob = require('cron').CronJob;

var job = new CronJob({
  cronTime: '0 10 18 * * 0-6',
  //Every minute at :00 - 7 days per week: '0 */1 * * * 1-7'
  onTick: function() {
  	console.log('Ontick called');
  	var today = new moment();
  	// var startDate = moment().hours(0).minutes(0).seconds(0);
	var convertedPretty = moment(today).format("MM/DD/YYYY hh:mm:ss");
	
    console.log('Running Ontick!!', convertedPretty);
    createMonthlyCharge();
  },
  start: false,
  // timeZone: "America/Los_Angeles"
});

// console.log('Job.start about to executie!!');

job.start();


// createMonthlyCharge();

var workorderByID = function(id, cb) { 
	console.log('Looking for WOrk Order', id);

	Workorder.findById(id).populate('user', 'displayName').exec(function(err, workorder) {
		if (err) return next(err);
		if (! workorder) return next(new Error('Failed to load Workorder ' + id));
		// req.workorder = workorder ;
		console.log('Got the workorder');
		cb(workorder);
	});
};


var chargeCard = function(req, res){
	console.log('Got here', req);
};

var makePayment = function(req, res, pmt) {
	console.log('Making payment...', pmt);

	//if Payment Opt is credit card -- run Auth.net Integration
	

// 	var workCharge;
// 	if(req.workorder.type==='New Install') {
// 		workCharge = 189;
	
// 	}else{
// 		workCharge = 50;
// 	}
	
// 	var totalCharge = workCharge*1.0985;
// 	totalCharge = totalCharge.toFixed(2);
// 	var invoiceNumber = 6544;
// 	var stateTax = +totalCharge-workCharge;
// 	stateTax = stateTax.toFixed(2);
// 	var taxState = 'KS';

// console.log('Total Charge: ', totalCharge);
// console.log('Work Order Charge: ', workCharge);
// console.log('Tax Amount: ', stateTax);

// 	var transaction = {
//   amount: totalCharge,
//   tax: {
//     amount: stateTax,
//     name: 'State Tax',
//     description: taxState
//   },
//   // shipping: {
  //   amount: 5.00,
  //   name: 'FedEx Ground',
  //   description: 'No Free Shipping Option'
  // },
// 	  customerProfileId: cus.merchantCustomerId,
// 	  customerPaymentProfileId: cus.paymentProfileId,
//   order: {
//     invoiceNumber: Date.now(),
//     description: 'Work at '+req.workorder.serviceCenter
//   },
//   billTo: {
//   	firstName: cus.firstName,
//   	lastName: cus.lastName,
//   	address: cus.billingAddress
//   }
// };

// AuthorizeCIM.createCustomerProfileTransaction('AuthCapture' /* AuthOnly, CaptureOnly, PriorAuthCapture */, transaction, function(err, response) {
// 	if(err){
// 		console.log('Error Charging Card', err);
// 		res.status(400).send('ERROR: '+err);
// 	}
// 	if(response){
// 		console.log('Card has been charged!!', response);
// 		res.status(200).send(response);
// 	}
// });



res.jsonp(pmt);


};
/**
 * Create a Payment
 */
exports.create = function(req, res) {
	var payment = new Payment(req.body);
	payment.user = req.user;

	payment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// res.jsonp(payment);
			makePayment(req, res, payment);
		}
	});
};


//Get Payments associated with a specific offender
exports.getByOffender = function(req, res) { 
	console.log('Get Payment By OFfender: ', req.body);
	
	var id = req.body.id;
	console.log('Offender ID: ', id);
	console.log('Type of Request: ', req.body.choose);
	if(req.body.choose==='due'){
		Payment.find().where({offender: id, status: 'Due'}).populate('user', 'displayName').exec(function(err, payment) {
		if (err) return err;
		if (! payment) return new Error('Failed to load Payment ' + id);
		// req.workorder = workorder ;
		// console.log('Found Payments: ', payment);
		res.status(200).send(payment);
	});

	}else{

		Payment.find().where({offender: id}).populate('user', 'displayName').exec(function(err, payment) {
		if (err) return err;
		if (! payment) return new Error('Failed to load Payment ' + id);
		// req.workorder = workorder ;
		// console.log('Found Payments: ', payment);
		res.status(200).send(payment);
	});

	}

		
};

/**
 * Show the current Payment
 */
exports.read = function(req, res) {
	res.jsonp(req.payment);
};

/**
 * Update a Payment
 */
exports.update = function(req, res) {
	var payment = req.payment ;

	payment = _.extend(payment , req.body);

	payment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(payment);
		}
	});
};

/**
 * Delete an Payment
 */
exports.delete = function(req, res) {
	var payment = req.payment ;

	payment.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(payment);
		}
	});
};

/**
 * List of Payments
 */
exports.list = function(req, res) { Payment.find(req.query).sort('-created').populate('user', 'displayName').exec(function(err, payments) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(payments);
		}
	});
};

/**
 * Payment middleware
 */
exports.paymentByID = function(req, res, next, id) { Payment.findById(id).populate('user', 'displayName').exec(function(err, payment) {
		if (err) return next(err);
		if (! payment) return next(new Error('Failed to load Payment ' + id));
		req.payment = payment ;
		next();
	});
};

/**
 * Payment authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.payment.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};