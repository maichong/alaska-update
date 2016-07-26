/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-29
 * @author Liang <liang@maichong.it>
 */

import alaska from 'alaska';

export default class AppUpdate extends alaska.Model {
  static title = 'key';
  static icon = 'upload';

  static fields = {
    key: {
      type: String,
      index: true
    },
    createdAt: {
      label: 'Created At',
      type: Date
    }
  };

  preSave() {
    if (!this.createdAt) {
      this.createdAt = new Date;
    }
  }
}
