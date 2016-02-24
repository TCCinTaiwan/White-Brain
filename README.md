# [:octocat:White's Brain](https://github.com/TCCinTaiwan/White-Brain)
[![Build Status](https://travis-ci.org/TCCinTaiwan/White-Brain.svg?branch=master)](https://travis-ci.org/TCCinTaiwan/White-Brain)

## Table of Contents [↶]()
* **[Introduction](#introduction)**
* **[Demo](#demo)**
* **[Browser Support](#browser-support)**
* **[Installation](#installation)**
* **[Usage](#usage)**
* **[Features](#features)**
* **[預計功能](#_1)**
* **[Contributing](#contributing)**
* **[History](#history)**
* **[License](#license)**

## Introduction [↶]()
　　之前有一次在和同學解釋河內塔時，我使用了一個線上電子白板，但是操作起來覺得不夠直覺化，因此漸漸萌生自己做一個的念頭，這個專案也就在 KUAS ITC 的第一屆Hackathon開始執行了。

## Demo [↶]()
[![執行畫面](screenshot.png "screenshot")](http://203.64.91.82/)
> [Check it live](http://203.64.91.82/).

## Browser Support [↶]()
![IE](https://raw.github.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Chrome](https://raw.github.com/alrra/browser-logos/master/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/firefox/firefox_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
IE 10+ ✖ | Chrome 4.0+ ✔ | Firefox 16.0+ ✖ | Opera 15.0+ ✖ | Safari 4.0+ ✖ |

## Installation [↶]()
```bash
# Clone the repository
git clone https://github.com/TCCinTaiwan/White-Brain
```

## Usage [↶]()
run Server:
```bash
# Go into the directory
cd White-Brain

# run server
python main.py
```

## Features [↶]()

## 預計功能 [↶]()
1. 工具
    - 選取框
    - 拖曳
    - 擦子
        - 物件擦
        - 區域擦
    - 畫線
        - 點 按一下
        - 線 隨意畫
        + 中心點模式 <kbd>Ctrl</kbd>
        + 曲線 <kbd>Alt</kbd>
        + 直線 <kbd>Shift</kbd>
    - 畫矩形/多邊形
        + 矩形
        + 設定邊數
        + 正多邊形 <kbd>Shift</kbd>
        + 中心點模式 <kbd>Ctrl</kbd>
    - 畫圓形
        + 正圓 <kbd>Shift</kbd>
2. 物件
    - 文字
    - 圖片
3. 選項
    - 格線
        - 開啟關閉 <kbd>Ctrl</kbd> + <kbd>G</kbd>
    - 畫圖步驟物件化
    - 旋轉
        - 特殊角 <kbd>Ctrl</kbd>
4. 上一步
    - <kbd>Ctrl</kbd>+<kbd>Z</kbd>
    - 微調
5. 下一步
    - <kbd>Ctrl</kbd> + <kbd>Y</kbd>
    - 微調
6. 小地圖
7. 連線共用

## Contributing [↶]()
1. Create an issue and describe your idea
2. Fork it!
3. Create your feature branch: `git checkout -b my-new-feature`
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin my-new-feature`
6. Submit a Pull Request
/play letitgo
## History [↶]()
For detailed changelog, check [~~Change Log~~ ](CHANGELOG.md).

## License [↶]()
<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="創用 CC 授權條款" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a>
<span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">White's Brain</span>由<a xmlns:cc="http://creativecommons.org/ns#" href="https://github.com/TCCinTaiwan" property="cc:attributionName" rel="cc:attributionURL">TCC, chungtryhard</a>製作，以<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">創用CC 姓名標示-相同方式分享 4.0 國際 授權條款</a>釋出。
此作品衍生自<a xmlns:dct="http://purl.org/dc/terms/" href="https://github.com/TCCinTaiwan/White-Brain" rel="dct:source">https://github.com/TCCinTaiwan/White-Brain</a>。
