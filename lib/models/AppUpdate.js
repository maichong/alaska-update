'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-29
 * @author Liang <liang@maichong.it>
 */

class AppUpdate extends service.Model {

  preSave() {
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
  }
}
exports.default = AppUpdate;
AppUpdate.title = 'key';
AppUpdate.fields = {
  key: {
    type: String,
    index: true
  },
  createdAt: {
    label: 'Created At',
    type: Date
  }
};