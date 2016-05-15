'use strict';

var Base = function (options) {
    var originalProto = this instanceof Base &&
        Object.getPrototypeOf(this) || Base.prototype;
    var Replacement = function () {};
    var proto = Replacement.prototype = Object.create(originalProto);

    var protectedState = {x : 0};
    proto.constructor = Replacement;
    proto.name = 'Base:Replacement';
    proto.next = function () { return ++protectedState.x; },
    proto.reset = function () { protectedState.x = 0; }
    Object.defineProperty(proto, 'x',
        {get: function () { return protectedState.x; }});

    options = options || {};
    if (originalProto !== Base.prototype && options.protectd) {
        options.protectd = {
            set x (val) { return (protectedState.x = val); }
        };
    }
    return new Replacement();
}
Base.prototype = { constructor: Base, name: 'Base' };
module.exports = Base;
