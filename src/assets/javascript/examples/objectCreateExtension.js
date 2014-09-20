(function ($, Base) {
    'use strict';

    function Extension (options) {
        options = options || {};
        Base.call(this, options);
        if (options.hasOwnProperty('x')) {
            this._privateState.x = options.x;
        }
    }
    Extension.prototype = Object.create(Base.prototype);
    $.extend(Extension.prototype, {
        constructor: Extension,
        prev: function () {
            return --this._privateState.x;
        }
    });
    return Extension;
})();
