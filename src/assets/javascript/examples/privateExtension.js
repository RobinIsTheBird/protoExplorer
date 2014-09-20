(function ($, Base) {
    'use strict';

    function Extension (options) {
        options = options || {};
        var privateState = $.extend({}, options, {
            initialX: 0,
            increment: 10
        });
        var rebase = options.base instanceof Extension &&
            options.base || Extension.prototype;
        var proxyOptions = {
            protected: true,
            base: rebase
        };
        var proxy = new Base(proxyOptions);
        var Replacement = function () {};
        Replacement.prototype = Object.create(Object.getPrototypeOf(proxy));
        $.extend(Replacement.prototype, {
            constructor: Replacement,
            reset: function () { // Override
                proxyOptions.protected.x = privateState.initialX;
            },
            shiftNext: function () {
                proxyOptions.protected.x = proxyOptions.protected.x + privateState.increment;
                return proxyOptions.x;
            }
        });
        if (rebase !== Extension.prototype && options.protected) {
            options.protected = Object.create(proxyOptions.protected);
            $.extend(options.protected, {
                get initialX () {
                    return privateState.initialX;
                },
                set initialX (_x) {
                    privateState.initialX = _x;
                    return privateState.initialX;
                },
                get increment () {
                    return privateState.increment;
                },
                set increment (_inc) {
                    privateState.increment = _inc;
                    return privateState.increment;
                }
            });
        }
        var repl = new Replacement();
        repl.x = privateState.initialX;
        return repl;
    }
    Extension.prototype = Object.create(Base.prototype);
    $.extend(Extension.prototype, {
        constructor: Extension
    });
})();
