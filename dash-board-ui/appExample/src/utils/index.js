/*
 * @description: 工具类
 * @Date: 2022-10-12 11:30:43
 */
import { sha256 } from 'js-sha256'
/**
 * 获取uuid
 */
export function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16) | 0 : 'r&0x3' | '0x8').toString(16)
  })
}
/**
 * 密码加密
 * @param message
 * @param salt
 * @returns {*}
 */
export function msgEncode(message, salt) {
  return sha256(sha256(message) + salt)
}
