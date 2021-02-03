/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1583983864991_8413";

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  exports.mysql = {
    client: {
      // host
      host: "localhost",
      // 端口号
      port: "3306",
      // 用户名
      user: "root",
      // 密码
      password: "whyshinia",
      // 数据库名
      database: "bigScreen"
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false
  };

  const logger = {
    logger: {
      appLogName: `${appInfo.name}-web.log`,
      coreLogName: "egg-web.log",
      agentLogName: "egg-agent.log",
      errorLogName: "common-error.log",
      level: "DEBUG"
    }
  };

  return {
    ...config,
    ...userConfig,
    ...logger
  };
};
