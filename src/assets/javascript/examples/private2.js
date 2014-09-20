(function () {
    'use strict';

    function Base (options) {
        options = options || {};
        var privateState = { x : 0 };
        var Replacement = function () {};
        Replacement.prototype = {
            constructor: Replacement,
            get x () {
                return privateState.x;
            },
            next: function () {
                return ++privateState.x;
            }
        };
        return new Replacement();
    }
    Base.prototype = {
        constructor: Base
    };
    return Base;
})();
