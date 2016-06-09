/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../../t6s-core/core/libsdef/mocha.d.ts" />
/// <reference path="../../t6s-core/core/libsdef/node.d.ts" />
/// <reference path="../../scripts/server/ClientCall.ts" />

var assert = require("assert");

describe('ClientCall', function() {
	describe('#constructor', function () {
		it('should properly set the parameters', function () {
			var res = function () {
				return "une super fonction";
			};

			var params = {"params1": "toto"};

			var client = new ClientCall("hash", params, res);

			assert.equal(client.getCallHash(), "hash", "The hash is not the one excepted :"+client.getCallHash());
			assert.equal(client.getCallParams(), params, "The params is not as expected :"+client.getCallParams());
			assert.equal(client.getCallCallback(), res, "The callback is not as expected :"+client.getCallCallback());
		})
	})
});