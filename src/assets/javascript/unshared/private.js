(function () {
    'use strict';

    function stopPropagation (ev) {
        if (!!ev) {
            ev.stopPropagation();
        }
    }
    function preventDefault (ev) {
        if (!ev) {
            ev.preventDefault();
        }
    }

    var BaseHello = function (options) {
        options = options || {};
        var privateState = $.extend({
            hello: 'Hello',
            world: 'World',
            sampleSelector: '#private',
            helloSelector: '.base.level span.hello',
            worldSelector: '.base.level span.world'
        }, options);
        privateState.$sample = $(privateState.sampleSelector);
        privateState.$helloSpan = privateState.$sample.find(privateState.helloSelector);
        privateState.$worldSpan = privateState.$sample.find(privateState.worldSelector);
        privateState.$helloDiv = $(privateState.$helloSpan).parent('.hello');
        privateState.$worldDiv = $(privateState.$worldSpan).parent('.world');
        privateState.$worldEdit = privateState.$worldInput = null;
        var rebase = options.base instanceof BaseHello && options.base || BaseHello.prototype;
        var Replacement = function () {};
        Replacement.prototype = Object.create(rebase);
        $.extend(Replacement.prototype, {
            constructor: Replacement,
            greet: function () {
                this.render();
                privateState.$helloSpan.text(privateState.hello);
                privateState.$worldSpan.text(privateState.world);
                privateState.$worldEdit.css('left', privateState.$worldDiv.position().left);
                this.listen();
                return this;
            },
            render: function () {
                privateState.$helloSpan.empty();
                privateState.$worldSpan.empty();
                privateState.$worldEdit = $('<div class="world-edit editor hidden">' +
                    '<input type="text" maxlength="30"></div>')
                    .appendTo(privateState.$worldDiv);
                privateState.$worldInput = privateState.$worldEdit.children('input');
                return this;
            },
            listen: function () {
                privateState.$worldSpan.on('click.' + BaseHello.namespace, this.editWorld.bind(this));
                this.handleCommitment(true);
                return this;
            },
            handleCommitment: function (on) {
                privateState.$worldInput.off('change.' + BaseHello.namespace);
                if (on) {
                    privateState.$worldInput.on('change.' + BaseHello.namespace, this.commitWorld.bind(this));
                }
                return this;
            },
            editWorld: function (ev) {
                stopPropagation(ev);
                privateState.$worldInput
                    .val(privateState.world);
                privateState.$worldEdit.removeClass('hidden');
                privateState.$worldInput
                    .focus();
                $('body').off('click.' + BaseHello.namespace);
                $('body').one('click.' + BaseHello.namespace, function (ev) {
                    if (ev.target !== privateState.$worldInput.get(0)) {
                        privateState.$worldEdit.addClass('hidden');
                        privateState.$worldEdit.trigger('world-edit-done');
                    }
                }.bind(this));
                return this;
            },
            commitWorld: function (ev) {
                privateState.world = privateState.$worldInput.val();
                privateState.$worldSpan
                    .empty()
                    .text(privateState.world);
                privateState.$worldEdit.addClass('hidden');
                privateState.$worldEdit.trigger('world-edit-committed');
                return this;
            }
        });
        if (rebase !== BaseHello.prototype && options.protected) {
            options.protected = {
                get $worldEdit () {
                    return privateState.$worldEdit;
                },
                get $sample () {
                    return privateState.$sample;
                },
                get $helloSpan () {
                    return privateState.$helloSpan;
                },
                get $worldSpan () {
                    return privateState.$worldSpan;
                },
                get $helloDiv () {
                    return privateState.$helloDiv;
                },
                get $worldDiv () {
                    return privateState.$worldDiv;
                },
                get hello () {
                    return privateState.hello;
                },
                set hello (_hello) {
                    privateState.hello = _hello;
                    return privateState.hello;
                },
                get world () {
                    return privateState.world;
                },
                set world (_world) {
                    privateState.world = _world;
                    return privateState.world;
                }
            };
        }
        return new Replacement();
    };
    Object.defineProperty(BaseHello, 'namespace', {
        writable: false,
        enumerable: true,
        configurable: false,
        value: 'privateBaseHello'
    });
    BaseHello.prototype = {
        constructor: BaseHello
    };
    var myBaseHello = new BaseHello();
    myBaseHello.greet();

    var HelloList = function (options) {
        options = options || {};
        options.helloSelector = options.helloSelector || '.first.level span.hello';
        options.worldSelector = options.worldSelector || '.first.level span.world';
        BaseHello.call(this, options);
        this._worldList = [ this._world ];
    };
    Object.defineProperty(HelloList, 'namespace', {
        writable: false,
        enumerable: true,
        configurable: false,
        value: 'privateHelloList'
    });
    var hlp = HelloList.prototype = Object.create(BaseHello.prototype);
    $.extend(hlp, {
        sup: BaseHello.prototype,
        constructor: HelloList,
        render: function () {
            hlp.sup.render.call(this);
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
            hlp.sup.listen.call(this);
            this._$choiceButton.on('click.' + HelloList.namespace, this.toggleButtonFeedback.bind(this));
            this._$choiceDropdown.on('mousedown.' + HelloList.namespace, this.prepareToChoose.bind(this));
            this._$choiceDropdown.on('click.' + HelloList.namespace, 'li>a', this.choose.bind(this));
            this.handleInputChange(true);
            this._$choiceDropdown.find('li>a').on('click.' + HelloList.namespace, preventDefault);
            return this;
        },
        handleInputChange: function (on) {
            this.handleCommitment(false);
            this._$worldInput.off('change.' + HelloList.namespace);
            if (on) {
                this._$worldInput.on('change.' + HelloList.namespace, this.addChoice.bind(this));
            }
            return this;
        },
        handleBodyClick: function (on) {
            $('body').off('click.' + HelloList.namespace);
            if (on) {
                $('body').one('click.' + HelloList.namespace, function (ev) {
                    if (ev.target !== this._$worldInput.get(0) &&
                        !this._$choiceDropdown.is($(ev.target)) &&
                        0 === this._$choiceDropdown.has($(ev.target)).length) {
                        this.buttonFeedbackOff();
                    }
                }.bind(this));
            }
            return this;
        },
        buttonFeedbackOff: function () {
            if (!this._$choiceDropdown.is('.hidden')) {
                this.toggleButtonFeedback();
            }
            return this;
        },
        toggleButtonFeedback: function (ev) {
            var $arrow = this._$choiceButton.children('div');
            stopPropagation(ev);
            this._$choiceDropdown.toggleClass('hidden');
            $arrow.toggleClass('down-arrow up-arrow');
            $arrow.empty()
                .text($arrow.is('.down-arrow') ? 'Expand Choices' : 'Collapse Choices');
            this.handleBodyClick(!this._$choiceDropdown.is('hidden'));
            return this;
        },
        prepareToChoose: function (ev) {
            stopPropagation(ev);
            this.handleInputChange(false);
            this._$choiceDropdown.on('click.' + HelloList.namespace, 'li>a', this.choose.bind(this));
            return this;
        },
        choose: function (ev) {
            var val = $(ev.target).data('val');
            stopPropagation(ev);
            preventDefault(ev);
            this.buttonFeedbackOff();
            this._$worldInput.val(val);
            this.commitWorld();
            this._$choiceDropdown.off('click.' + HelloList.namespace);
            this.handleInputChange(true);
            return this;
        },
        addChoice: function (ev) {
            var val = this._$worldInput.val();
            this.commitWorld(ev);
            if (0 === $.grep(this._worldList, function (option) {
                return val === option;
            }).length) {
                this._$choiceDropdown.find('li>a').off('click.' + HelloList.namespace);
                this._worldList.push(val);
                this._worldList.sort(function (a, b) {
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
                this._worldList.forEach(function (aWorld) {
                    $('<li><a href="#">' + aWorld + '</a></li>')
                        .appendTo(this._$choiceDropdown)
                        .children('a')
                        .data('val', aWorld);
                }.bind(this));
                this.buttonFeedbackOff();
                this._$choiceDropdown.find('li>a').on('click.' + HelloList.namespace, preventDefault);
            }
            return this;
        }
    });
//    var myHelloList = new HelloList();
//    myHelloList.greet();

    var HelloTypeahead = function (options) {
        options = options || {};
        options.helloSelector = options.helloSelector || '.second.level span.hello';
        options.worldSelector = options.worldSelector || '.second.level span.world';
        HelloList.call(this, options);
    };
    Object.defineProperty(HelloTypeahead, 'namespace', {
        writable: false,
        enumerable: true,
        configurable: false,
        value: 'objectCreateHelloTypeahead'
    });
    var htp = HelloTypeahead.prototype = Object.create(HelloList.prototype);
    $.extend(htp, {
        sup: HelloList.prototype,
        constructor: HelloTypeahead,
        listen: function () {
            htp.sup.listen.call(this);
            this.handleStartTypeahead(true);
            // this._$worldInput.on('change.' + HelloTypeahead.namespace, this.endTypeahead.bind(this));
            this._$worldEdit.on('world-edit-commit.' + HelloTypeahead.namespace + ' ' +
                'world-edit-done.' + HelloTypeahead.namespace, this.endTypeahead.bind(this));
            return this;
        },
        handleStartTypeahead: function (on) {
            this._$worldSpan.off('click.' + HelloTypeahead.namespace);
            if (on) {
                this._$worldSpan.on('click.' + HelloTypeahead.namespace, this.startTypeahead.bind(this));
            }
            return this;
        },
        startTypeahead: function () {
            this._$worldInput.off('keyup.' + HelloTypeahead.namespace);
            this._$worldInput.on('keyup.' + HelloTypeahead.namespace, this.doTypeahead.bind(this));
            return this;
        },
        endTypeahead: function () {
            this._$worldInput.off('keyup.' + HelloTypeahead.namespace);
            this._$choiceDropdown
                .find('li')
                .removeClass('hidden')
                .find('a')
                .removeClass('hidden');
            this.buttonFeedbackOff();
            return this;
        },
        doTypeahead: function (ev) {
            var BACKSPACE = 8;
            var found;
            var count;
            var val = this._$worldInput.val();
            if ('!'.charCodeAt(0) < ev.which < '~'.charCodeAt(0) || BACKSPACE === ev.which) {
                found = $.grep(this._worldList, function (option) {
                    return 0 === option.indexOf(val);
                });
                count = found.length;
                this._$choiceDropdown
                    .find('li')
                    .each(function () {
                        var $li = $(this);
                        var $a = $li.children('a');
                        var aData = $a.data('val');
                        if (0 === found.length || aData !== found[0]) {
                            $li.addClass('hidden');
                        } else {
                            $li.removeClass('hidden');
                            found.shift();
                        }
                    });
                if (0 < count && this._$choiceDropdown.is('.hidden') ||
                    0 === count && !this._$choiceDropdown.is('.hidden')) {
                    this.toggleButtonFeedback();
                }
            }
        }
    });
//    var myHelloTypeahead = new HelloTypeahead();
//    myHelloTypeahead.greet();
})();
