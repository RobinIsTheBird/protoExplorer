'use strict';

function Base () {
    var privateState = {x : 0};
    Object.defineProperty(this, 'x', {
        get: function () { return privateState.x; }});
    this.next = function () { return ++privateState.x; };
}
Base.prototype = {constructor: Base};
module.exports = Base;
