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
        this._$helloSpan = this._$sample.find(this._helloSelector);
        this._$worldSpan = this._$sample.find(this._worldSelector);
        this._$helloDiv = $(this._$helloSpan).parent('.hello');
        this._$worldDiv = $(this._$worldSpan).parent('.world');
        this._$worldEdit = this._$worldInput = null;
    };
    function stopPropagation(ev) {
        if (!!ev) {
            ev.stopPropagation();
        }
    }
    BaseHello.prototype = {
        sup: Object.prototype,
        constructor: BaseHello,
        greet: function () {
            this.render();
            this._$helloSpan.text(this._hello);
            this._$worldSpan.text(this._world);
            this._$worldEdit.css('left', this._$worldDiv.position().left);
            this.listen();
            return this;
        },
        render: function () {
            this._$helloSpan.empty();
            this._$worldSpan.empty();
            this._$worldEdit = $('<div class="world-edit editor hidden">' +
                '<input type="text" maxlength="30"></div>')
                .appendTo(this._$worldDiv);
            this._$worldInput = this._$worldEdit.children('input');
            return this;
        },
        listen: function () {
            this._$worldSpan.on('click.' + this._namespace, this.editWorld.bind(this));
            this._$worldInput.on('change.' + this._namespace, this.commitWorld.bind(this));
            return this;
        },
        editWorld: function (ev) {
            stopPropagation(ev);
            this._$worldInput
                .val(this._world);
            this._$worldEdit.removeClass('hidden');
            this._$worldInput
                .focus();
            return this;
        },
        commitWorld: function (ev) {
            stopPropagation(ev);
            this._world = this._$worldInput.val();
            this._$worldSpan
                .empty()
                .text(this._world);
            this._$worldEdit.addClass('hidden');
            return this;
        }
    };
    var myBaseHello = new BaseHello();
    myBaseHello.greet();

    var HelloList = function (options) {
        options = options || {};
        options.namespace = options.namespace || 'oldFashionedHelloList';
        options.helloSelector = options.helloSelector || '.first.level span.hello';
        options.worldSelector = options.worldSelector || '.first.level span.world';
        BaseHello.call(this, options);
        this.worldList = [ this._world ];
    };
    var hlp = HelloList.prototype = new BaseHello();
    $.extend(hlp, {
        sup: BaseHello.prototype,
        constructor: HelloList,
        render: function () {
            this.sup.render.call(this);
            this._$choiceButton = $('<button class="world-choice ">' +
                '<div class="down-arrow">Expand Choices</div></button>')
                .appendTo(this._$worldEdit);
            this._$choiceDropdown = $( '<ul class="world-choice drop-down hidden"><li><a href="#">' +
                this._world +
                '</a></li></ul>')
                .appendTo(this._$worldEdit);
            this._$choiceDropdown.find('a')
                .data('val', this._world);
            return this;
        },
        listen: function () {
            this.sup.listen.call(this);
            this._$choiceButton.on('click.' + this.namespace, this.toggleButtonFeedback.bind(this));
            this._$choiceDropdown.on('click.' + this.namespace, 'li>a', this.choose.bind(this));
            this._$worldInput.on('change.' + this.namespace, this.addChoice.bind(this));
            return this;
        },
        toggleButtonFeedback: function (ev) {
            var $arrow = this._$choiceButton.children('div');
            stopPropagation(ev);
            this._$choiceDropdown.toggleClass('hidden');
            $arrow.toggleClass('down-arrow up-arrow');
            $arrow.empty()
                .text($arrow.is('.down-arrow') ? 'Expand Choices' : 'Collapse Choices');
            return this;
        },
        choose: function (ev) {
            var val = $(ev.target).data('val');
            stopPropagation(ev);
            this._$worldInput.val(val);
            this.commitWorld();
            return this;
        },
        addChoice: function (ev) {
            var val = this._$worldInput.val();
            stopPropagation(ev);
            this.worldList.push(val);
            this.worldList.sort(function (a, b) {
                a = a.toLowerCase();
                b = b.toLowerCase();
                if (a < b) {
                    return -1;
                } else if (b < a) {
                    return 1;
                }
                return 0;
            });
            this._$choiceDropdown.empty();
            this.worldList.forEach(function (aWorld) {
                $('<li><a href="#">' + aWorld + '</a></li>')
                    .appendTo(this._$choiceDropdown)
                    .children('a')
                    .data('val', aWorld);
            }.bind(this));
            if (!this._$choiceDropdown.is('.hidden')) {
                this.toggleButtonFeedback();
            }
            return this;
        }
    });
    var myHelloList = new HelloList();
    myHelloList.greet();
})();
