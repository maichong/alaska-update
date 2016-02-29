/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-29
 * @author Liang <liang@maichong.it>
 */


import Alaska from 'alaska';
import * as fs from 'mz/fs';

/**
 * @class UpdateService
 */
export default class UpdateService extends Alaska.Service {
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
    mainService.post('launch', async function () {
      //检查更新脚本
      console.log(mainService.dir);
      let dir = mainService.dir + '/updates/';
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
            let original = global.__service;
            global.__service = mainService;
            let mod = require(dir + file);
            global.__service = original;

            if (!(typeof mod.default === 'function')) {
              console.log(`Update script "${file}" must export a function as default!`);
              process.exit();
            }

            await mod.default();
            await (new AppUpdate({ key: file })).save();
          }
        }
      }
    });
  }
}

