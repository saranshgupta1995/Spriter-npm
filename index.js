'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Spriter = function () {
    function Spriter(context, spriteSheet, spriteW, spriteH) {
        var globalFrameCount = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var globalFrameRate = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;

        _classCallCheck(this, Spriter);

        this.ctx = context;
        this.spriteSheet = spriteSheet;
        this.globalFrameRate = globalFrameRate;
        this.globalFrameCount = globalFrameCount;
        this.globalSpriteWidth = spriteW;
        this.globalSpriteHeight = spriteH;
        this.spriteModes = {};
        this.__resetFrameParams();
        this.loc = {
            x: 0,
            y: 0
        };
        this.currentAnimMode = '';
        this.data = {};
    }

    _createClass(Spriter, [{
        key: 'setLocation',
        value: function setLocation(x, y) {
            this.loc = { x: x, y: y };
        }
    }, {
        key: '__resetFrameParams',
        value: function __resetFrameParams() {
            this.spriteIndex = 0;
            this.currentFrameNumber = 0;
        }
    }, {
        key: '__getPascalCased',
        value: function __getPascalCased(str) {
            return str.slice(0, 1).toUpperCase() + str.slice(1);
        }
    }, {
        key: '__getGlobalProp',
        value: function __getGlobalProp(prop) {
            return 'global' + this.__getPascalCased(prop);
        }

        /**
         * @access private
         * @memberof Spriter
         * @param {String} mode The name of the animation mode
         * @param {String} prop The name of the property
         */

    }, {
        key: '__getPreferred',
        value: function __getPreferred(mode, prop) {
            return this.spriteModes[mode][prop] || this[this.__getGlobalProp(prop)];
        }
    }, {
        key: '__setupModeParams',
        value: function __setupModeParams(options, mode) {
            var _this = this;

            options.animName = mode;
            options.followPath = !!options.pattern;
            if (options.followPath) {
                options.decodedPath = options.pattern.map(function (point) {
                    return [point[0] * _this.__getPreferred(mode, 'spriteWidth'), point[1] * _this.__getPreferred(mode, 'spriteHeight')];
                });
            }
        }

        /**
         * 
         * @param {string} string mode 
         * @param {Object} options 
         */

    }, {
        key: 'addMode',
        value: function addMode(mode, options) {
            this.spriteModes[mode] = options;
            this.__setupModeParams(options, mode);
        }
    }, {
        key: 'playNext',
        value: function playNext(mode) {
            this.ctx.clearRect(this.loc.x, this.loc.y, this.__getPreferred(mode, 'spriteWidth'), this.__getPreferred(mode, 'spriteHeight'));
            if (!(this.currentAnimMode === mode)) {
                this.__resetFrameParams();
            }
            this.currentAnimMode = mode;
            this.next(this.ctx, this.spriteModes[mode]);
        }

        /**
         * @param {CanvasRenderingContext2D} context 
         * @param {Number} frameX 
         * @param {Number} frameY 
         * @param {Number} frameW 
         * @param {Number} frameH 
         */

    }, {
        key: 'next',
        value: function next(context, opts) {
            var spriteStartX = opts.spriteStartX,
                animName = opts.animName,
                spriteStartY = opts.spriteStartY,
                frameW = opts.frameW,
                frameH = opts.frameH,
                decodedPath = opts.decodedPath,
                followPath = opts.followPath,
                positionFunction = opts.positionFunction;

            var pos = positionFunction();
            this.setLocation(pos.x, pos.y);
            context.drawImage(this.spriteSheet, decodedPath ? decodedPath[this.spriteIndex][0] : spriteStartX + this.spriteIndex * this.__getPreferred(animName, 'spriteWidth'), decodedPath ? decodedPath[this.spriteIndex][1] : spriteStartY, this.__getPreferred(animName, 'spriteWidth'), this.__getPreferred(animName, 'spriteHeight'), this.loc.x, this.loc.y, frameW || this.__getPreferred(animName, 'spriteWidth'), frameH || this.__getPreferred(animName, 'spriteHeight'));
            this.currentFrameNumber += 1;
            if (this.currentFrameNumber === this.globalFrameRate) {
                this.spriteIndex += 1;
                this.currentFrameNumber = 0;
            }
            if (this.spriteIndex === (followPath ? decodedPath.length : this.globalFrameCount)) {
                this.spriteIndex = 0;
                this.currentFrameNumber = 0;
            }
        }
    }, {
        key: '__getCurrentPreferred',
        value: function __getCurrentPreferred(prop) {
            return this.__getPreferred(this.currentAnimMode, prop);
        }
    }, {
        key: 'hasWithin',
        value: function hasWithin(x, y) {
            return x > this.loc.x && x < this.loc.x + this.__getCurrentPreferred('spriteWidth') && y > this.loc.y && y < this.loc.y + this.__getCurrentPreferred('spriteHeight');
        }
    }, {
        key: 'checkCollisionWith',
        value: function checkCollisionWith(targetElement) {

            for (var i = 0; i < this.__getCurrentPreferred('spriteWidth'); i++) {
                for (var j = 0; j < this.__getCurrentPreferred('spriteHeight'); j++) {
                    if (targetElement.hasWithin(this.loc.x + i, this.loc.y + j)) return true;
                }
            }
            return false;
        }
    }]);

    return Spriter;
}();

module.exports = {
    Spriter: Spriter
};