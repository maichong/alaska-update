'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _alaska = require('alaska');

var _alaska2 = _interopRequireDefault(_alaska);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @copyright Maichong Software Ltd. 2016 http://maichong.it
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @date 2016-02-29
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @author Liang <liang@maichong.it>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

/**
 * @class UpdateService
 */
class UpdateService extends _alaska2.default.Service {
  constructor(options, alaska) {
    options = options || {};
    options.id = 'alaska-update';
    options.dir = __dirname;
    super(options, alaska);
  }

  postInit() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let MAIN = _this.alaska.main;
      if (MAIN.config('autoUpdate')) {
        MAIN.pre('mount', _asyncToGenerator(function* () {
          //检查更新脚本
          let dir = MAIN.dir + '/updates/';
          try {
            yield _this.run('Update', { dir });
          } catch (error) {
            console.error(error.stack);
            process.exit(1);
          }
        }));
      }
    })();
  }
}
exports.default = UpdateService;