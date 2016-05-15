(function ($) {
    'use strict';

    function Base () {
        var privateState = { x : 0 };
        $.extend(this, {
            get x () {
                return privateState.x;
            },
            next: function () {
                return ++privateState.x;
            }
        });
    }
    Base.prototype = { constructor: Base };
    return Base;
})();
