'use strict';
// Assume symbolic link from node_modules to javascript directory
var _ = require('lodash');
var Extension = require('javascript/examples/privateExtension.js');

function Grand (options) {
    var originalProto = this instanceof Grand &&
        Object.getPrototypeOf(this) || Grand.prototype;
    options = options || {};

    // proxyOptions.protectd will be replaced with
    // Extension protectd variables
    var proxyOptions = _.extend({protectd: true}, options);
    // proxy's prototype chain is
    // proxy -> Extension:Replacement -> Base:Replacement
    //       -> Grand -> Extension -> Base
    var proxy = Extension.call(this, proxyOptions);

    var Replacement = function () {};
    var proto = Replacement.prototype =
        Object.create(Object.getPrototypeOf(proxy));

    var protectedState = _.extend({incr: 10}, options);
    proto.constructor = Replacement;
    proto.name = 'Grand:Replacement';
    // x has a public getter on the proxy,
    // but only has a protected setter in proxyOptions.
    proto.shiftNext = function () {
        proxyOptions.protectd.x = proxy.x + protectedState.incr;
        return proxy.x;
    }

    if (originalProto !== Grand.prototype && options.protectd) {
        options.protectd = Object.create(proxyOptions.protectd);
        Object.defineProperty(options.protectd, 'incr', {
            get: function () { return protectedState.incr; },
            set: function (val) { return (protectedState.incr = val); }
        });
    }
    if (protectedState.incr < 0) {
        proxyOptions.protectd.x =
            proxyOptions.protectd.initialX = -proxyOptions.protectd.initialX;
    }
    var replacedThis = new Replacement();
    // Transfer proxy own (public) properties to repl.
    // replacedThis' prototype chain is
    // replacedThis -> Grand:replacement
    //              -> Extension:Replacement
    //              -> Base:Replacement
    //              -> Grand -> Extension -> Base
    return replacedThis;
}
Grand.prototype = Object.create(Extension.prototype);
Grand.prototype.constructor = Grand;
Grand.prototype.name = 'Grand';
module.exports = Grand;
