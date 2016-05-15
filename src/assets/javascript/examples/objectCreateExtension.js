'use strict';

function Extension (options) {
    options = options || {};
    Base.call(this, options);
    if (options.hasOwnProperty('x')) {
        this._privateState.x = options.x;
    }
}
var proto = Extension.prototype = Object.create(Base.prototype);
proto.constructor = Extension;
proto.prev = function () { return --this._privateState.x; };
module.exports = Extension;
