/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-28
 * @author Liang <liang@maichong.it>
 */

'use strict';

import * as fs from 'mz/fs';

export default class Update extends service.Sled {

  async exec() {
    const service = this.service;
    const MAIN = service.alaska.main;
    const dir = this.data.dir;
    if (!dir) {
      throw new ReferenceError('alaska-update sled Update data.dir is required');
    }

    let files;
    try {
      files = await fs.readdir(dir);
    } catch (error) {
      return;
    }
    if (files.length) {
      let AppUpdate = service.model('AppUpdate');
      for (let file of files) {
        let has = await AppUpdate.count({ key: file });
        if (!has) {
          console.log('Apply update script ', file);
          let mod = alaska.util.include(dir + file, true, { service: MAIN, alaska: MAIN.alaska });

          if (!(typeof mod === 'function')) {
            console.log(`Update script "${file}" must export a async function as default!`);
            process.exit();
          }

          await mod();
          await (new AppUpdate({ key: file })).save();
        }
      }
    }
  }
}
