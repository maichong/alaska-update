'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _alaska = require('alaska');

var _alaska2 = _interopRequireDefault(_alaska);

var _fs = require('mz/fs');

var fs = _interopRequireWildcard(_fs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
    let service = this;
    let alaska = this.alaska;
    let mainService = alaska.mainService();
    mainService.post('launch', _asyncToGenerator(function* () {
      //检查更新脚本
      console.log(mainService.dir);
      let dir = mainService.dir + '/updates/';
      let files;
      try {
        files = yield fs.readdir(dir);
      } catch (error) {
        return;
      }
      if (files.length) {
        let AppUpdate = service.model('AppUpdate');
        for (let file of files) {
          let has = yield AppUpdate.count({ key: file });
          if (!has) {
            console.log('Apply update script ', file);
            let original = global.__service;
            global.__service = mainService;
            let mod = require(dir + file);
            global.__service = original;

            if (!(typeof mod.default === 'function')) {
              console.log(`Update script "${ file }" must export a function as default!`);
              process.exit();
            }

            yield mod.default();
            yield new AppUpdate({ key: file }).save();
          }
        }
      }
    }));
  }
}
exports.default = UpdateService;