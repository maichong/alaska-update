/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-28
 * @author Liang <liang@maichong.it>
 */

import fs from 'mz/fs';
import alaska from 'alaska';
import AppUpdate from '../models/AppUpdate';

export default class Update extends alaska.Sled {

  async exec() {
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
      for (let file of files) {
        let has = await AppUpdate.count({ key: file });
        if (!has) {
          console.log('Apply update script ', file);
          let mod = alaska.util.include(dir + file, true);

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
