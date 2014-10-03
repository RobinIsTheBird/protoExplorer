(function () {
    'use strict';

    function stopPropagation (ev) {
        if (!!ev) {
            ev.stopPropagation();
        }
    }
    function preventDefault (ev) {
        if (!!ev) {
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
            name: 'BaseHello Replacement',
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
                get $worldInput () {
                    return privateState.$worldInput;
                },
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
        constructor: BaseHello,
        name: 'BaseHello'
    };
    var myBaseHello = new BaseHello();
    myBaseHello.greet();

    var HelloList = function (options) {
        options = options || {};
        var buttonFeedbackOff = function () {
            if (!privateState.$choiceDropdown.is('.hidden')) {
                toggleButtonFeedback();
            }
        };
        var toggleButtonFeedback = function (ev) {
            var $arrow = privateState.$choiceButton.children('div');
            stopPropagation(ev);
            privateState.$choiceDropdown.toggleClass('hidden');
            $arrow.toggleClass('down-arrow up-arrow');
            $arrow.empty()
                .text($arrow.is('.down-arrow') ? 'Expand Choices' : 'Collapse Choices');
                handleBodyClick(!privateState.$choiceDropdown.is('hidden'));
        };
        var handleInputChange = function (on) {
            this.handleCommitment(false);
            proxyOptions.protected.$worldInput.off('change.' + HelloList.namespace);
            if (on) {
                proxyOptions.protected.$worldInput.on('change.' + HelloList.namespace, addChoice.bind(this));
            }
        };
        var addChoice = function (ev) {
            var val = proxyOptions.protected.$worldInput.val();
            this.commitWorld(ev);
            if (0 === $.grep(privateState.worldList, function (option) {
                return val === option;
            }).length) {
                privateState.$choiceDropdown.find('li>a').off('click.' + HelloList.namespace);
                privateState.worldList.push(val);
                privateState.worldList.sort(function (a, b) {
                    a = a.toLowerCase();
                    b = b.toLowerCase();
                    if (a < b) {
                        return -1;
                    } else if (b < a) {
                        return 1;
                    }
                    return 0;
                });
                privateState.$choiceDropdown.empty();
                privateState.worldList.forEach(function (aWorld) {
                    $('<li><a href="#">' + aWorld + '</a></li>')
                        .appendTo(privateState.$choiceDropdown)
                        .children('a')
                        .data('val', aWorld);
                });
                buttonFeedbackOff();
                privateState.$choiceDropdown.find('li>a').on('click.' + HelloList.namespace, preventDefault);
            }
        };
        var prepareToChoose = function (ev) {
            stopPropagation(ev);
            this.handleInputChange(false);
            privateState.$choiceDropdown.on('click.' + HelloList.namespace, 'li>a', choose.bind(this));
        };
        var choose = function (ev) {
            var val = $(ev.target).data('val');
            stopPropagation(ev);
            preventDefault(ev);
            buttonFeedbackOff();
            proxyOptions.protected.$worldInput.val(val);
            this.commitWorld();
            privateState.$choiceDropdown.off('click.' + HelloList.namespace);
            this.handleInputChange(true);
        };
        var handleBodyClick = function (on) {
            var click = 'click.' + HelloList.namespace;
            $('body').off(click);
            if (on) {
                $('body').one(click, function (ev) {
                    if (ev.target !== proxyOptions.protected.$worldInput.get(0) &&
                        !privateState.$choiceDropdown.is($(ev.target)) &&
                        0 === privateState.$choiceDropdown.has($(ev.target)).length) {
                        buttonFeedbackOff();
                    }
                });
            }
        };
        var privateState = {};
        var rebase = options.base instanceof HelloList && options.base || HelloList.prototype;
        var proxyOptions = $.extend({}, {
            helloSelector: '.first.level span.hello',
            worldSelector: '.first.level span.world'
        }, options, {
            protected: true,
            base: rebase
        });
        var proxy = new BaseHello(proxyOptions);
        var Replacement = function () {};
        Replacement.prototype = Object.create(Object.getPrototypeOf(proxy));
        $.extend(Replacement.prototype, {
            sup: '?',
            constructor: Replacement,
            name: 'HelloList Replacement',
            render: function () {
                proxy.render();
                privateState.$choiceButton = $('<button class="world-choice ">' +
                    '<div class="down-arrow">Expand Choices</div></button>')
                    .appendTo(proxyOptions.protected.$worldEdit);
                privateState.$choiceDropdown = $( '<ul class="world-choice drop-down hidden"><li><a href="#">' +
                    proxyOptions.protected.world +
                    '</a></li></ul>')
                    .appendTo(proxyOptions.protected.$worldEdit);
                privateState.$choiceDropdown.find('a')
                    .data('val', proxyOptions.protected.world);
                return this;
            },
            handleInputChange: handleInputChange,
            addChoice: addChoice,
            prepareToChoose: prepareToChoose,
            choose: choose,
            listen: function () {
                proxy.listen();
                privateState.$choiceButton.on('click.' + HelloList.namespace, toggleButtonFeedback.bind(this));
                privateState.$choiceDropdown.on('mousedown.' + HelloList.namespace, prepareToChoose.bind(this));
                privateState.$choiceDropdown.on('click.' + HelloList.namespace, 'li>a', choose.bind(this));
                this.handleInputChange(true);
                privateState.$choiceDropdown.find('li>a').on('click.' + HelloList.namespace, preventDefault);
                return this;
            }
        });
        privateState.worldList = [ proxyOptions.protected.world ];
        privateState.$choiceButton = null;
        privateState.$choiceDropdown = null;
        if (rebase != HelloList.prototype && options.protected) {
            // Property definitions on Object.create are necessary because
            // $.extend does not preserve getters and setters.
            options.protected = Object.create(proxyOptions.protected, {
                worldListCount: {
                    get: function () {
                        return privateState.worldList.length;
                    },
                    enumerable: true,
                    configurable: false
                },
                worldListItems: {
                    get: function () {
                        return privateState.worldList.slice(0);
                    },
                    enumerable: true,
                    configurable: false
                },
                $choiceButton: {
                    get: function () {
                        return privateState.$choiceButton;
                    },
                    enumerable: true,
                    configurable: false
                },
                $choiceDropdown: {
                    get: function () {
                        return privateState.$choiceDropdown;
                    },
                    enumerable: true,
                    configurable: false
                },
                toggleButtonFeedback: {
                    value: toggleButtonFeedback,
                    writeable: false,
                    enumerable: true,
                    configurable: false
                },
                buttonFeedbackOff: {
                    value: buttonFeedbackOff,
                    writeable: false,
                    enumerable: true,
                    configurable: false
                },
                handleInputChange: {
                    value: handleInputChange,
                    writeable: false,
                    enumerable: true,
                    configurable: false
                },
            });
        }
        return new Replacement();
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
        name: 'HelloList',
        constructor: HelloList
    });
    var myHelloList = new HelloList();
    myHelloList.greet();

    var HelloTypeahead = function (options) {
        options = options || {};
        options.helloSelector = options.helloSelector || '.second.level span.hello';
        options.worldSelector = options.worldSelector || '.second.level span.world';
        var listen = function () {
            proxy.listen();
            handleStartTypeahead(true);
            proxyOptions.protected.$worldEdit.on('world-edit-commit.' + HelloTypeahead.namespace + ' ' +
                'world-edit-done.' + HelloTypeahead.namespace, endTypeahead);
            return this;
        };
        var handleStartTypeahead = function (on) {
            proxyOptions.protected.$worldSpan.off('click.' + HelloTypeahead.namespace);
            if (on) {
                proxyOptions.protected.$worldSpan.on('click.' + HelloTypeahead.namespace, startTypeahead);
            }
        };
        var startTypeahead = function () {
            proxyOptions.protected.$worldInput.off('keyup.' + HelloTypeahead.namespace);
            proxyOptions.protected.$worldInput.on('keyup.' + HelloTypeahead.namespace, doTypeahead);
        };
        var endTypeahead = function () {
            proxyOptions.protected.$worldInput.off('keyup.' + HelloTypeahead.namespace);
            proxyOptions.protected.$choiceDropdown
                .find('li')
                .removeClass('hidden')
                .find('a')
                .removeClass('hidden');
            proxyOptions.protected.buttonFeedbackOff();
        };
        var doTypeahead = function (ev) {
            var BACKSPACE = 8;
            var found;
            var count;
            var val = proxyOptions.protected.$worldInput.val();
            if ('!'.charCodeAt(0) < ev.which < '~'.charCodeAt(0) || BACKSPACE === ev.which) {
                found = $.grep(proxyOptions.protected.worldListItems, function (option) {
                    return 0 === option.indexOf(val);
                });
                count = found.length;
                proxyOptions.protected.$choiceDropdown
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
                if (0 < count && proxyOptions.protected.$choiceDropdown.is('.hidden') ||
                    0 === count && !proxyOptions.protected.$choiceDropdown.is('.hidden')) {
                    proxyOptions.protected.toggleButtonFeedback();
                }
            }
        };
        var privateState = {};
        var rebase = options.base instanceof HelloTypeahead && options.base || HelloTypeahead.prototype;
        var proxyOptions = $.extend({}, {
            helloSelector: '.second.level span.hello',
            worldSelector: '.second.level span.world'
        }, options, {
            protected: true,
            base: rebase
        });
        var proxy = new HelloList(proxyOptions);
        var Replacement = function () {};
        Replacement.prototype = Object.create(Object.getPrototypeOf(proxy));
        $.extend(Replacement.prototype, {
            sup: '?',
            constructor: Replacement,
            name: 'HelloList Replacement',
            listen: listen
        });
        if (rebase != HelloTypeahead.prototype && options.protected) {
            options.protected = Object.create(proxyOptions.protected);
        }
        return new Replacement();
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
        name: 'HelloTypeahead',
        constructor: HelloTypeahead
    });
    var myHelloTypeahead = new HelloTypeahead();
    myHelloTypeahead.greet();
})();
