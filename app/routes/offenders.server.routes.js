'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var offenders = require('../../app/controllers/offenders');

	// Offenders Routes
	app.route('/offenders')
		.get(users.requiresLogin, offenders.list)
		.post(users.requiresLogin, offenders.create);


		app.route('/updateCCInfo/:offenderId')
		.post(offenders.updateCCInfo);
		
		app.route('/getPendingOrders')
		.get(offenders.pending);

		app.route('/getClientbyDL')
		.post(offenders.offenderByDl);

	app.route('/offenders/:offenderId')
		.get(offenders.read)
		.put(users.requiresLogin, offenders.hasAuthorization, offenders.update)
		.delete(users.requiresLogin, offenders.hasAuthorization, offenders.delete);

	// Finish by binding the Offender middleware
	app.param('offenderId', offenders.offenderByID);
};