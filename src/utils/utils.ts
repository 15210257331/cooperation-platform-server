import * as crypto from 'crypto';

/**
 * Make salt 制作密码盐
 */
export function makeSalt(): string {
  return crypto.randomBytes(3).toString('base64');
}

/**
 * 生成四位验证码
 * @returns 
 */
export function createCode(): string {
  return '1234'.split('').map(() => Math.floor(Math.random() * 10)).join('');
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

// 解密腾讯云的api 秘钥   7 9 
export const tengxunyunApiDecode = (value: string) => {
  let result = value.split('');
  result.splice(6, 2);
  return result.join('');
}
