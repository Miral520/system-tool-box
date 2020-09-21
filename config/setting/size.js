const mainSize = { // 主窗口
    min: {
      width: 310,
      height: 345,
    },
    init: {
      width: 1366,
      height: 800,
    },
};

const previewSize = { // 预览窗口
    min: {
      width: 180,
      height: 150,
    },
    init: {
      width: 550,
      height: 300,
    },
    large: {
      width: 1200,
      height: 800,
    },
    shawdow: 20,
    titleBar: 40,
};

module.exports = {
    mainSize, 
    previewSize,
}