'use strict';
var _ = require('lodash');
var Base = require('./60_privateBase.js');

function Extension (options) {
    var originalProto = this instanceof Extension &&
        Object.getPrototypeOf(this) || Extension.prototype;

    var proxyOptions = { protected: true };
    // proxy's prototype chain is
    // proxy -> Base:Replacement -> Extension -> Base
    var proxy = Base.call(this, proxyOptions);

    var Replacement = function () {};
    var proto = Replacement.prototype =
        Object.create(Object.getPrototypeOf(proxy));

    var protectedState = _.extend({ initialX: 0 }, options);
    proto.constructor = Replacement;
    proto.reset = function () { // Override
        proxyOptions.protected.x = protectedState.initialX;
    }

    options = options || {};
    if (originalProto !== Extension.prototype && options.protected) {
        options.protected = Object.create(proxyOptions.protected);
        Object.defineProperty(options.protected, 'initialX', {
            get: function () { return protectedState.initialX; },
            set: function (val) { return (protectedState.initialX = val); }
        });
    }
    proxyOptions.protected.x = protectedState.initialX;
    var replacedThis = new Replacement();
    // Transfer proxy own (public) properties to repl.
    return replacedThis;
}
Extension.prototype = Object.create(Base.prototype);
Extension.prototype.constructor = Extension;
module.exports = Extension;
