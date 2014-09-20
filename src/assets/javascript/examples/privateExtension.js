(function ($, Base) {
    'use strict';

    function Extension (options) {
        options = options || {};
        var initialX = options.hasOwnProperty('x') && options.x || 0;
        var rebase = options.base instanceof Extension &&
            options.base || Extension.prototype;
        var proxyOptions = {
            protected: true,
            base: rebase
        };
        var proxy = new Base(proxyOptions);
        var Replacement = function () {};
        Replacement.prototype = Object.create(Object.getPrototypeOf(proxy));
        if (rebase !== Extension.prototype && options.protected) {
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
    Extension.prototype = Object.create(Base.prototype);
    $.extend(Extension.prototype, {
        constructor: Extension
    });
})();
