(function ($) {
    'use strict';

    function Base (options) {
        options = options || {};
        var privateState = { x : 0 };
        var rebase = options.base instanceof Base &&
            options.base || Base.prototype;
        var Replacement = function () {};
        Replacement.prototype = Object.create(rebase);
        $.extend(Replacement.prototype, {
            constructor: Replacement,
            next: function () {
                return ++privateState.x;
            }
        });
        if (rebase !== Base.prototype && options.protected) {
            options.protected = {
                get x () {
                    return privateState.x;
                },
                set x (_x) {
                    return (privateState.x = _x);
                }
            };
        }
        return new Replacement();
    }
    Base.prototype = {
        constructor: Base
    };
})();
