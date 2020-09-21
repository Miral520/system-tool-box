const os = require('os');
const nodeDiskInfo = require('node-disk-info');
const profile = require('../default/profile');

// 获取逻辑分区信息
const logicInfo = nodeDiskInfo.getDiskInfoSync();

// 系统信息
const osInfo = {
    type: os.type(), // 返回与 uname(3) 返回一样的操作系统名字。 例如，在 Linux 上返回 'Linux'，在 macOS 上返回 'Darwin'，在 Windows 上返回 'Windows_NT'。
    cpus: os.cpus(), // 返回一个对象数组，其中包含有关每个逻辑 CPU 内核的信息。
    userInfo: os.userInfo(), // 返回关于当前有效用户的信息。 在 POSIX 平台上，这通常是密码文件的子集。 返回的对象包含 username、 uid、 gid、 shell 和 homedir。 在 Windows 上，则 uid 和 gid 字段为 -1，且 shell 为 null。os.userInfo() 返回的 homedir 的值由操作系统提供。 这与 os.homedir() 的结果不同，其是在返回操作系统的响应之前会先查询主目录的环境变量。如果用户没有 username 或 homedir，则抛出 SystemError。
    uptime: os.uptime(), // 返回系统的正常运行时间（以秒为单位）。
    totalmem: os.totalmem(), // 以整数的形式返回系统的内存总量（以字节为单位）。
    tmpdir: os.tmpdir(), // 以字符串的形式返回操作系统的默认临时文件目录。
    release: os.release(), // 以字符串的形式返回操作系统。
    platform: os.platform(), // 返回标识操作系统平台的字符串。 该值在编译时设置。 可能的值有 'aix'、 'darwin'、 'freebsd'、 'linux'、 'openbsd'、 'sunos' 和 'win32'。
    networkInterfaces: os.networkInterfaces(), // 返回一个对象，该对象包含已分配了网络地址的网络接口。返回的对象上的每个键都标识了一个网络接口。 关联的值是一个对象数组，每个对象描述了一个分配的网络地址。
    loadavg: os.loadavg(), // 返回一个数组，包含 1、5 和 15 分钟的平均负载。
    hostname: os.hostname(), // 以字符串的形式返回操作系统的主机名。
    homedir: os.homedir(), // 返回当前用户的主目录的字符串路径。
    freemem: os.freemem(), // 以整数的形式返回空闲的系统内存量（以字节为单位）。
    endianness: os.endianness(), // 返回一个字符串，该字符串标识为其编译 Node.js 二进制文件的 CPU 的字节序。
    arch: os.arch(), // 返回为其编译 Node.js 二进制文件的操作系统的 CPU 架构。 可能的值有：'arm'、 'arm64'、 'ia32'、 'mips'、 'mipsel'、 'ppc'、 'ppc64'、 's390'、 's390x'、 'x32' 和 'x64'。
    EOL: os.EOL, // 操作系统特定的行末标志。在 POSIX 上是 \n。在 Windows 上是 \r\n。
    // screen: screenData, // 屏幕尺寸
    about: { // 关于
      // name: process.env.npm_package_name,
      name: profile.name,
      alias: profile.alias,
      version: process.env.npm_package_version, // 版本号
      // author: process.env.npm_package_author_name,
      author: profile.author,
    },
}

module.exports = {
    osInfo,
    logicInfo
}  