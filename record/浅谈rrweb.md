#### <center>浅谈rrweb</center>

rrweb全称`Record and replay the web`, 可以对web页面进行录制、回放，也可以将⻚⾯中的 DOM 以及⽤户操作保存为可序列化的数据，以实现远程回放的一个开源的第三方库。

##### 为什么使用rrweb？
产品在客户使用中出现问题，只能通过远程工具在客户环境中进行debug；或者客户在使用产品的过程中操作出一些偶然性的bug，比如页面中的显示数据和保存的数据不一致、闪现出不该出现的元素部分等。虽然可以通过完善前端的`异常监控`，结合后端记录的日志来分析问题，但没法准确的定位出当时客户操作的场景和页面对应的数据。

所以使用`rrweb`可以对当时的客户的操作和页面的内容进行录制和回放，能够准确的定位到问题所在，迅速复现和解决问题。

##### 使用场景
> 记录客户操作场景和数据，迅速复现解决。
> 记录客户使用产品的方式和习惯，优化产品。
> 录制产品演⽰。
> 记录 CI 环境中的 E2E 测试的执⾏情况。
> 直播

##### 组成部分
`rrweb` 主要由 3 部分组成:

`rrweb-snapshot` 包含 `snapshot` 和 `rebuild` 两个功能。

`snapshot` 将遍历 `DOM` 及其状态，转化为可序列化的数据结构，并添加唯一标识；

1. 将某些 DOM 状态内联到 HTML 属性中，如 input 的 value。
2. 将 `script` 转换为 `noscript` ，在 `iframe` 沙盒中不执行脚本。
3. 尝试内联样式表，以确保可以使用本地样式表。
4. 将 `href`，`src`，`css` 中的相对路径转成绝对路径。
5. 为每个节点指定一个 `id`，并在快照完成后返回 `id` 节点映射。

`rebuild` 则是将 `snapshot` 记录的数据结构重建为对应的 `DOM`。

1. 如果节点是元素，则添加 `data-rrid` 属性。
2. 创建一些额外的 `DOM` 节点（例如文本节点）来放置内联 `CSS` 和某些状态。
3. 如果 `Node` 具有一些额外的子`DOM`，则添加 `data-extra-child-index` 属性。


**[serializeNodeWithId](https://github.com/rrweb-io/rrweb-snapshot/blob/master/src/snapshot.ts)**  将节点序列化为具有ID的快照格式。
**[buildNodeWithSN](https://github.com/rrweb-io/rrweb-snapshot/blob/master/src/rebuild.ts)** 从序列化的节点构建DOM并将序列化的信息存储在	`__sn` 属性中。

> 如图所示：
> 
> ![Alt text](./1603639238652.png)
> 
> ![Alt text](./1603639429499.png)



`rrweb` 包含 `record` 和 `replay` 两个功能。`record`用于记录 `DOM` 中的所有变更（`mutation`）；`replay` 则是将记录的变更按照对应的时间一一重放。

`rrweb-player` 为 `rrweb` 提供一套 UI 控件，提供基于 GUI 的暂停、快进、拖拽至任意时间点播放等功能。



[官方demo](https://www.rrweb.io/#demos)
[社区](http://www.myriptide.com/rrweb-community-cn/)
