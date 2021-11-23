/*
 * @Author: your name
 * @Date: 2021-09-30 18:02:38
 * @LastEditTime: 2021-11-18 14:05:28
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /nice-todo-nest/src/utils/utils.ts
 */


import * as crypto from 'crypto';

/**
 * Make salt 制作密码盐
 */
export function makeSalt(): string {
  return crypto.randomBytes(3).toString('base64');
}

/**
 * Encrypt password
 * @param password 原始密码
 * @param salt 密码盐
 */
export function encryptPassword(password: string, salt: string): string {
  if (!password || !salt) {
    return '';
  }
  const tempSalt = Buffer.from(salt, 'base64');
  return (
    // 10000 代表迭代次数 16代表长度
    crypto.pbkdf2Sync(password, tempSalt, 10000, 16, 'sha1').toString('base64')
  );
}

/**
 * 生成8位编码
 * @param num 
 * @returns 
 */
export const generate8Code = (num: number): string => {
  const str = "2367820149QWERTYUIOPASDFGHJKLZXCVBNM1456789";
  let res = '#';
  for (let i = 0; i < num; i++) {
    res += str[Math.floor(Math.random() * str.length)];
  }
  return res;
}

// 数组扁平化
export const flatten = (arr: any[]): any[] => {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}

/**
 * 成功返回
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const success = (code= 10000, data: any): any => {
  return {
    code: code,
    data: data,
    msg: 'success',
  }
}