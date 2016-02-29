/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-29
 * @author Liang <liang@maichong.it>
 */


const service = __service;

export default class AppUpdate extends service.Model {
  static fields = {
    key: {
      type: String,
      index: true
    },
    createdAt: {
      type: Date
    }
  };

  preSave() {
    if (!this.createdAt) {
      this.createdAt = new Date;
    }
  }
}
