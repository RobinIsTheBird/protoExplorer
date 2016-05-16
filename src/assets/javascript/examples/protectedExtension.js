'use strict';
// Assume symbolic link from node_modules to javascript directory
var _ = require('lodash');
var Base = require('javascript/examples/privateBase.js');

function Extension (options) {
    var originalProto = this instanceof Extension &&
        Object.getPrototypeOf(this) || Extension.prototype;
    options = options || {};

    // proxyOptions.protectd will be replaced with Base protectd variables
    var proxyOptions = _.extend({protectd: true}, options);
    // proxy's prototype chain is
    // proxy -> Base:Replacement -> Extension -> Base
    var proxy = Base.call(this, proxyOptions);

    var Replacement = function () {};
    var proto = Replacement.prototype =
        Object.create(Object.getPrototypeOf(proxy));

    var protectedState = _.extend({initialX: 0}, options);
    proto.constructor = Replacement;
    proto.name = 'Extension:Replacement';
    proto.reset = function () { // Override
        proxyOptions.protectd.x = protectedState.initialX;
    }

    if (originalProto !== Extension.prototype && options.protectd) {
        options.protectd = Object.create(proxyOptions.protectd);
        Object.defineProperty(options.protectd, 'initialX', {
            get: function () { return protectedState.initialX; },
            set: function (val) { return (protectedState.initialX = val); }
        });
    }
    proxyOptions.protectd.x = protectedState.initialX;
    var replacedThis = new Replacement();
    // Transfer proxy own (public) properties to repl.
    // replacedThis -> Extension:Replacement -> Base:Replacement
    //              -> Extension -> Base
    return replacedThis;
}
Extension.prototype = Object.create(Base.prototype);
Extension.prototype.constructor = Extension;
Extension.prototype.name = 'Extension';
module.exports = Extension;
