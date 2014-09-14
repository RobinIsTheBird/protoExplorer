(function () {
    'use strict';

    var BaseHello = function (options) {
        this._namespace = options && options.namespace || 'oldFashionedBaseHello';
        this._hello = options && options.hello || 'Hello';
        this._world = options && options.world || 'World';
        this._sampleSelector = options && options.sampleSelector || '#old-fashioned';
        this._helloSelector = options && options.helloSelector || '.base.level span.hello';
        this._worldSelector = options && options.worldSelector || '.base.level span.world';
        this._$sample = $(this._sampleSelector);
        this._$helloSpan = this._$sample.find(this._helloSelector).empty();
        this._$worldSpan = this._$sample.find(this._worldSelector).empty();
        this._$helloDiv = $(this._$helloSpan).parent('.hello');
        this._$worldDiv = $(this._$worldSpan).parent('.world');
        this._$worldEdit = $('<div class="world-edit editor hidden">' +
            '<input type="text" maxlength="30"></div>')
            .appendTo(this._$worldDiv);
        this._$worldInput = this._$worldEdit.children('input');
    };
    BaseHello.prototype = {
        constructor: BaseHello,
        greet: function () {
            this._$helloSpan.text(this._hello);
            this._$worldSpan.text(this._world);
            this._$worldEdit.css('left', this._$worldDiv.position().left);
            this._$worldSpan.on('click.' + this._namespace, this.editWorld.bind(this));
            this._$worldInput.on('change.' + this._namespace, this.commitWorld.bind(this));
            return this;
        },
        editWorld: function () {
            this._$worldEdit.removeClass('hidden');
            this._$worldInput.focus();
            return this;
        },
        commitWorld: function () {
            this._$worldSpan
                .empty()
                .text(this._$worldInput.val());
            this._$worldEdit.addClass('hidden');
            return this;
        }
    };
    var myBaseHello = new BaseHello();
    myBaseHello.greet();
})();
