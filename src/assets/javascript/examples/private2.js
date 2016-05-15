'use strict';

function Base (options) {
    options = options || {};
    var privateState = {x : 0};
    var Replacement = function () {};
    var proto = Replacement.prototype = Object.create(Base.prototype);
    proto.constructor = Replacement;
    Object.defineProperty(proto, 'x', {
        get: function () { return privateState.x; }});
    proto.next = function () { return ++privateState.x;
    return new Replacement();
}
Base.prototype = {constructor: Base};
module.exports = Base;
