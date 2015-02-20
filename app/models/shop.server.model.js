'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Shop Schema
 */
var ShopSchema = new Schema({
	name: {
		type: String,
		default: 'Service Center Name',
		// required: 'Please fill Shop name',
		trim: true

	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	address: {
			type: String,
			trim: true,
			default: 'Street Address'
			// required: 'We Need the Shop\'s Physical Address',
	},
	city: {
			type: String,
			trim: true,
			default: 'City'
	},
	state: {
			type: String,
			trim: true,
			default: 'State'
	},
	zipcode: {
			type: String,
			trim: true,
			default: 'Zipcode'
	},
	email: {
			type: String,
			trim: true,
			default: 'Email Address'
	},
	fax: {
			type: String,
			trim: true,
			default: null
	},
	telephone: {
			type: String,
			trim: true,
			default: null
	},
	alttelephone: {
			type: String,
			trim: true,
			default: null
	},
	primarycontactname: {
			type: String,
			trim: true,
			default: 'Owner Name'
	},
	altcontactname: {
			type: String,
			trim: true,
			default: 'Alternate Contact'
	},
	signertitle: {
			type: String,
			trim: true,
			
	},
	signer: {
			type: String,
			trim: true,

	},
	signDate: {
			type: Date,
			default: null
			
	},
	techname: {
			type: String,
			trim: true,
			default: 'Trained Tech Name'

	},
	techphone: {
			type: String,
			trim: true,
			default: null

	},
	hoursMon: {
		type: String,
		trim: true,
		default: '8am-5pm'
	},
	hoursTue: {
		type: String,
		trim: true,
		default: '8am-5pm'
	},
	hoursWed: {
		type: String,
		trim: true,
		default: '8am-5pm'
	},
	hoursThu: {
		type: String,
		trim: true,
		default: '8am-5pm'
	},
	hoursFri: {
		type: String,
		trim: true,
		default: '8am-5pm'
	},
	hoursSat: {
		type: String,
		trim: true,
		default: 'Closed'
	},
	hoursSun: {
		type: String,
		trim: true,
		default: 'Closed'
	},
	complete: {
		type: String,
		default: null
	},
	agreementSent: {
		type: String,
		default: null
	},
	counterSigned: {
		type: String,
		default: null
	},
	notes: {
		type: String,
		trim: true
	},
	rate: {
		type: String,
		trim: true,
		default: 'Standard'
	},
	district: {
		type: String,
		trim: true,
		default: '000'
	},
		installType: {
		type: String,
		trim: true,
		default: 'Standard'
	},
		shopHourly: {
		type: Number,
		trim: true,
		default: 0
	},

	

});

mongoose.model('Shop', ShopSchema);