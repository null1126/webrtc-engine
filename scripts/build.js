import { select, intro, outro, isCancel, cancel } from '@clack/prompts';
import { execSync } from 'child_process';
import { exit, cwd } from 'process';
import path from 'path';
import fs from 'fs/promises';

/**
 * 同步文档到包目录
 * @param {string} packageName 包名
 * @returns {Promise<boolean>} 是否同步成功
 */
const syncDocs = async (packageName) => {
  try {
    intro('同步文档到包目录');
    const dirName = packageName.includes('/') ? packageName.split('/').pop() : packageName;
    const packagePath = path.resolve(cwd(), 'packages', dirName);
    if (!fs.access(packagePath)) {
      throw new Error(`找不到目录: ${packagePath}，请检查 packageName 是否正确`);
    }
    const filesToSync = ['README.md', 'README_zh.md', 'LICENSE'];
    for (const file of filesToSync) {
      const source = path.resolve(cwd(), file);
      const target = path.resolve(packagePath, file);
      await fs.copyFile(source, target);
      intro(`✅ 已同步 ${file} 到 ${packageName}`);
    }
  } catch (error) {
    outro('同步文档到包目录失败', {
      text: '同步文档到包目录失败!',
      textColor: 'red',
    });
    throw error;
  }
};

/**
 * 发布到 npm
 * @returns {Promise<string>} 发布结果
 */
const publishPackage = async (packageName) => {
  try {
    await syncDocs(packageName);
    intro('发布中...');
    const dirName = packageName.includes('/') ? packageName.split('/').pop() : packageName;
    const packagePath = path.resolve(cwd(), 'packages', dirName);
    if (!fs.access(packagePath)) {
      throw new Error(`找不到目录: ${packagePath}，请检查 packageName 是否正确`);
    }
    const result = await execSync(`pnpm publish --no-git-checks --access public`, {
      stdio: 'inherit',
      cwd: packagePath,
      shell: true,
    });
    outro('发布完成', {
      text: '发布完成!',
      textColor: 'green',
    });
    return result;
  } catch (error) {
    outro('发布失败', {
      text: '发布失败!',
      textColor: 'red',
    });
    throw error;
  }
};

/**
 * 构建
 * @returns {Promise<string>} 构建结果
 */
const buildPackage = async (packageName) => {
  try {
    intro('构建中...');
    const result = await execSync(`pnpm run build --filter=${packageName}`, { stdio: 'inherit' });
    outro('构建完成', {
      text: '构建完成!',
      textColor: 'green',
    });
    return result;
  } catch (error) {
    outro('构建失败', {
      text: '构建失败!',
      textColor: 'red',
    });
    throw error;
  }
};

/**
 * 更新版本号
 * @param {string} version 版本号: major | minor | patch
 * @returns {Promise<string>} 更新后的版本号
 */
const updateVersion = async (packageName, versionOption) => {
  try {
    intro('更新版本号');
    await execSync(`pnpm -F ${packageName} exec npm version ${versionOption}`, {
      stdio: 'inherit',
    });
    outro('版本号更新完成', {
      text: '版本号更新完成!',
      textColor: 'green',
    });
    return true;
  } catch (error) {
    outro('版本号更新失败', {
      text: '版本号更新失败!',
      textColor: 'red',
    });
    throw error;
  }
};

/**
 * 请选择更新哪个版本号?
 * @returns {Promise<string>} 版本号: major | minor | patch
 */
const selectUpdateVersion = async () => {
  const version = await select({
    message: '请选择更新哪个版本号?',
    options: [
      { label: '不更新', value: '' },
      { label: '主版本号', value: 'major' },
      { label: '次版本号', value: 'minor' },
      { label: '补丁版本号', value: 'patch' },
    ],
  });
  if (isCancel(version)) {
    cancel('已取消更新版本号操作');
    exit(0);
  }
  return version;
};

/**
 * 请选择要构建的包?
 * @returns {Promise<string>} 构建的包: @webrtc-player/core
 */
const selectBuildPackage = async () => {
  const packages = await select({
    message: '请选择要构建的包?',
    options: [{ label: '@webrtc-player/core', value: '@webrtc-player/core' }],
  });
  if (isCancel(packages)) {
    cancel('已取消发布操作');
    exit(0);
  }
  return packages;
};

/**
 * 请选择是否要发布到 npm?
 * @returns {Promise<string>} 发布选项: yes | no
 */
const selectPublish = async () => {
  const publish = await select({
    message: '请选择是否要发布到 npm?',
    options: [
      { label: '是', value: 'yes' },
      { label: '否', value: 'no' },
    ],
  });
  if (isCancel(publish)) {
    cancel('已取消发布操作');
    exit(0);
  }
  return publish;
};

/**
 * 构建并发布
 * @returns {Promise<void>}
 *
 * 具体流程：
 * 1. 选择要构建的包
 * 2. 开始构建
 * 3. 选择要更新的版本号
 * 4. 是否发布到 npm
 */
export const buildAndPublish = async () => {
  const packageName = await selectBuildPackage();
  await buildPackage(packageName);
  const versionOption = await selectUpdateVersion();
  if (versionOption !== '') {
    await updateVersion(packageName, versionOption);
  }
  const publishOption = await selectPublish();
  if (publishOption === 'no') {
    exit(0);
  }
  await publishPackage(packageName);
};
