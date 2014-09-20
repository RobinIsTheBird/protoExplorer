(function () {
    'use strict';

    function Base () {
        this._privateState = { x: 0 };
    }
    Base.prototype = {
        constructor: Base,
        next: function () { return ++this._privateState.x; }
    };
    return Base;
}) ();
