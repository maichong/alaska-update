/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-28
 * @author Liang <liang@maichong.it>
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('mz/fs');

var fs = _interopRequireWildcard(_fs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

class Update extends service.Sled {

  exec() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const service = _this.service;
      const MAIN = service.alaska.main;
      const dir = _this.data.dir;
      if (!dir) {
        throw new ReferenceError('alaska-update sled Update data.dir is required');
      }

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
            let mod = alaska.util.include(dir + file, true, { service: MAIN, alaska: MAIN.alaska });

            if (!(typeof mod === 'function')) {
              console.log(`Update script "${ file }" must export a async function as default!`);
              process.exit();
            }

            yield mod();
            yield new AppUpdate({ key: file }).save();
          }
        }
      }
    })();
  }
}
exports.default = Update;