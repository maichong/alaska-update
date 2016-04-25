/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-29
 * @author Liang <liang@maichong.it>
 */

import Alaska from 'alaska';

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

  async postInit() {
    let MAIN = this.alaska.main;
    if (MAIN.config('autoUpdate')) {
      MAIN.pre('mount', async () => {
        //检查更新脚本
        let dir = MAIN.dir + '/updates/';
        try {
          await this.run('Update', { dir })
        } catch (error) {
          console.error(error.stack);
          process.exit(1);
        }
      });
    }
  }
}
