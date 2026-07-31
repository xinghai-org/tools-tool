import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execPromise = promisify(exec);

// Windows 方案：比较盘符
function isSameDriveWindows(path1, path2) {
  const drive1 = path.parse(path1).root;
  const drive2 = path.parse(path2).root;
  return drive1 === drive2;
}

// Linux/macOS 方案：比较设备 ID
async function isSameDeviceLinux(path1, path2) {
  try {
    const stat1 = await fs.stat(path1);
    const stat2 = await fs.stat(path2);
    
    // 比较设备 ID（dev 属性）
    return stat1.dev === stat2.dev;
  } catch (err) {
    console.error('获取设备信息失败:', err);
    return false;
  }
}

// 统一接口
export async function isSameFileSystem(path1, path2) {
  if (process.platform === 'win32') {
    return isSameDriveWindows(path1, path2);
  } else {
    return await isSameDeviceLinux(path1, path2);
  }
}

// 使用示例
const same = await isSameFileSystem(
  'F:\\Downloads\\test\\testa',
  'D:\\testb'
);
console.log(same); // false