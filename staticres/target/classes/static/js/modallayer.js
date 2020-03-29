"use strict";

/**
 * @author wolf
 * @description 开发中会用到的一些模态层
 * 
 * msg: 消息层 简单的消息框, 没有任何交互按钮
 * alert: 消息提示层 简单的消息提示框, 只有一个交互按钮
 * prompt: 交互层 可以自定义输入信息.
 * confirm: 询问层 提示信息并提供两个交互按钮代表两种意见.
 * page: 页面层 单独弹出一个独立于当前的页面.
 * loading: 加载层, 绑定Node展示加载动画
 * image 弹出一个窗口供用户观看图片, 拥有多种观看模式.
 * video: 视频层 基于page层和videojs实现
 * audio: 音乐层 基于page层实现, 单独的音乐播放器
 * ...
 */

class ModalLayer {
  /**
   * 模态层当前状态
   * @type {String}
   */
  status = 'hide';

  /**
   * 临时变量存放点
   * 在这里定义一些需要全局读到的变量
   * 不要直接定义到windows中. 可能会污染全局变量
   * @type {Object}
   */
  globalVariable = {};

  /**
   * 模态层使用的计时器
   * @type {Array}
   */
  timeoutClock = [];

  /**
   * 模态层使用的间隔器
   * @type {Array}
   */
  intervalClock = [];

  /**
   * 默认选项设置
   * 时间单位默认为秒(s)
   * 长度单位默认为像素(px)
   * @type {Object}
   */
  option = {
    'index': 0, // ID
    'title': null, // 标题(传入false则不显示标题栏)
    'content': null, // 内容
    'okText': null, // ok按钮内容
    'noText': null, // no按钮内容
    'cancelText': null, // cancel按钮内容
    'type': 'msg', // 模态层类型, 默认msg
    'mask': true, // 是否使用遮罩层
    'skin': 'default', // 样式类
    'transitionTime': 0.2, // 过渡动画持续时间
    'transitionOpacity': 0, // 过渡开始\结束时的透明度
    'transitionScale': [0.45, 0.45], // 过渡开始\结束时的缩放比例 [width, height]
    'areaProportion': [0.18, 0.21], // 浏览器窗口(可见区域)与模态层的比例 [width, height]
    'pageArea': [800, 600], // 页面层默认大小
    'popupTime': 5, // 模态层默认显示时间
    'resize': true, // 是否允许改变窗体大小
    'drag': true, // 是否允许拖拽
    'dragOverflow': false, // 拖拽过程中是否允许超出父元素
    'clickMaskRemove': true, // 点击遮罩层是否移除模态层
    'contentFullContainer': false, // 是否将内容填充整个模态层
    'displayProgressBar': false, // 是否显示剩余展示时间进度
    'displayProgressBarPos': 'bottom', // 进度条展示位置
    'displayProgressBarColor': 'deepskyblue', // 进度条颜色
    'parentModalLayer': null, // 父级模态层
    // 默认显示文本
    'text': {
      'content': '',
      'title': '标题栏',
      'okButton': '确定',
      'noButton': '拒绝',
      'cancelButton': '取消'
    },
    // page层默认设置
    'pageOption': {
      'src': null,
      'srcdoc': null,
      'frameborder': 0,
      'scrolling': 'no',
      'allowfullscreen': true,
      'name': 'modal-layer-page-'
    },
    // 钩子函数
    'hook': {
      'initStart': null, // 构造函数执行初始化前
      'initEnded': null // 构造函数执行初始化后
    },
    // 回调函数
    'callback': {
      // interaction
      'ok': null,
      'no': null,
      'cancel': () => {this.remove()},

      // action
      'close': () => {this.remove()},
      // 默认全屏事件
      'expand': () => {
        let self = this;
        let oldStatus = this.status;
        let modalLayerNodes = this.getNodes();
        let iframeNode = modalLayerNodes.container.querySelector('iframe[name=' + this.option.pageOption.name + this.option.index + ']');
        let fullscreenchangeListener = (event) => {
          if (event.target === iframeNode) {
            self.setStatus('expand');
          } else if (event.target === false) {
            window.removeEventListener('fullscreenchange', fullscreenchangeListener);
            self.setStatus(oldStatus);
          }
        };

        let fullscreenerrorListener = (e) => {
          ModalLayer.msg({
            mask: false,
            popupTime: 5,
            title: '错误',
            displayProgressBar: true,
            displayProgressBarPos: 'bottom',
            content: '<i class="fas fa-window-close" style="color: red"></i> 全屏失败, 错误原因: ' + e
          });
          window.removeEventListener('fullscreenerror', fullscreenerrorListener);
        };

        window.addEventListener('fullscreenerror', fullscreenerrorListener);
        window.addEventListener('fullscreenchange', fullscreenchangeListener);
        ModalLayer.assistant.util.launchFullscreen(iframeNode);
      },
      'minimize': () => {
        let index = ModalLayer.minimizeList.indexOf(this);
        if (index < 0)
          ModalLayer.minimizeList.push(this);
        else
          ModalLayer.minimizeList.splice(index, 1);
      },

      // 点击遮罩关闭模态层
      'clickMask': () => {this.remove()}
    },
    // 监听事件
    'event': {
      // 活动层
      active: (downEvent) => {
        let showCount = 0;
        let nodes = this.getNodes();
        let nowTime = new Date().getTime();
        let dEvent = downEvent || window.event;

        // 避免鼠标双击时也触发该事件
        if (dEvent.button !== 0 || (this.globalVariable.mousedown && this.globalVariable.mousedown[0] && nowTime - this.globalVariable.mousedown[0] <= 200)) return;

        this.globalVariable.mousedown = [true, nowTime];
        ModalLayer.instance.forEach((v) => {
          if (v.status === 'show') showCount++;
        });

        if (showCount >= 2) {
          let maxZIndex = ModalLayer.assistant.util.maxZIndex();
          if (nodes.container.style.zIndex == maxZIndex) return;
          Object.keys(nodes).forEach((k) => {
            nodes[k].style.zIndex = maxZIndex + 1;
          });

          nodes.container.style.zIndex = parseInt(nodes.container.style.zIndex) + 1;
        }
      },
      // 默认容器拖拽
      'drag': (downEvent) => {
        let statusText = this.status;
        let nowTime = new Date().getTime();
        let dEvent = downEvent || window.event;
        // 目标元素
        let target = this.getNodes().container;
        // 目标元素Rect
        let targetRect = target.getBoundingClientRect();
        // 鼠标按下时的坐标
        let mousePoint = [dEvent.screenX, dEvent.screenY];
        // 触发元素
        let trigger = target.querySelector('.modal-layer-title');
        // 拖拽目标元素父窗体
        let parentWindow = window.document.documentElement;
        // 父窗体Rect
        let parentWindowRect = parentWindow.getBoundingClientRect();
        // 父窗体边界值(左右边界值, 上下边界值)
        let boundary = [parentWindowRect.x, parentWindowRect.x + parentWindowRect.width, parentWindowRect.x, parentWindowRect.y + parentWindowRect.height]

        // 避免鼠标双击时也触发该事件
        if (dEvent.button !== 0 || (this.globalVariable.mousedown && this.globalVariable.mousedown[0] && nowTime - this.globalVariable.mousedown[0] <= 200)) return;
        this.globalVariable.mousedown = [true, nowTime];

        // 取消文字选中
        window.getSelection().empty();

        // 拖拽之前加上遮罩层防止选中某些元素导致位移错误
        let dragMask = target.querySelector('.modal-layer-drag-mask');
        if (!dragMask) {
          dragMask = ModalLayer.assistant.util.objectToDom([this.nodeData.dragMask])[0];
          target.querySelector('.modal-layer-content').insertAdjacentElement('afterbegin', dragMask);
        }
        dragMask.style.visibility = 'visible';

        // 统一移动方法
        let targetMoveMethod = (movementX, movementY) => {
          if (!this.option.dragOverflow) {
            if (targetRect.x + movementX < boundary[0])
              targetRect.x = boundary[0] - movementX;
            if (targetRect.right + movementX > boundary[1])
              targetRect.x = boundary[1] - targetRect.width - movementX;
            if (targetRect.y + movementY < boundary[2])
              targetRect.y = boundary[2] - movementY;
            if (targetRect.bottom + movementY > boundary[3])
              targetRect.y = boundary[3] - targetRect.height - movementY;
          }

          targetRect.x += movementX;
          targetRect.y += movementY;

          target.style.marginLeft = targetRect.x + 'px';
          target.style.marginTop = targetRect.y + 'px';

          this.setStatus('drag');
        }

        // 鼠标移动事件
        let mouseMoveEvent = (moveEvent) => {
          let mEvent = moveEvent || window.event;
          targetMoveMethod(mEvent.movementX, mEvent.movementY);
        };

        // 方向键调整
        let keyboardDownEvent = (kPressEvent) => {
          let movement = [];
          let kEvent = kPressEvent || window.event;
          let keyCode = kEvent.keyCode || kEvent.which;
          let allowKey = [ModalLayer.enum.arrow.up, ModalLayer.enum.arrow.dw, ModalLayer.enum.arrow.left, ModalLayer.enum.arrow.right];
          if (allowKey.indexOf(keyCode) < 0) return;
          switch (keyCode) {
            // up
            case allowKey[0]:
              movement[1] = -1;
              break;
            // dw
            case allowKey[1]:
              movement[1] = 1;
              break;
            // left
            case allowKey[2]:
              movement[0] = -1;
              break;
            // right
            case allowKey[3]:
              movement[0] = 1;
              break;
            default:
              break;
          }

          targetMoveMethod(movement[0], movement[1]);
        }
        
        // 放开鼠标事件
        let mouseUpEvent = () => {
          delete this.globalVariable.mousedown;
          // 隐藏遮罩层
          target.querySelector('.modal-layer-drag-mask').removeAttribute('style');

          document.removeEventListener('keydown', keyboardDownEvent);
          document.removeEventListener('mousemove', mouseMoveEvent);
          document.removeEventListener('mouseup', mouseUpEvent);

          this.setStatus(statusText);
        };

        document.addEventListener('mouseup', mouseUpEvent);
        document.addEventListener('mousemove', mouseMoveEvent);
        document.addEventListener('keydown', keyboardDownEvent);
      },
      // 默认缩放
      'resize': (downEvent) => {
        let statusText = this.status;
        let nowTime = new Date().getTime();
        let dEvent = downEvent || window.event;
        // 触发元素
        let trigger = dEvent.target;
        // 目标元素
        let target = this.getNodes().container;
        // 目标元素Rect
        let targetRect = target.getBoundingClientRect();
        // 目标元素最小大小
        let targetMinArea = this.globalVariable.defaultArea;
        // 鼠标按下时的坐标
        let mousePoint = [dEvent.screenX, dEvent.screenY];
        // 目标元素长宽
        let targetArea = [targetRect.width, targetRect.height];
        // 窗口Rect
        let windowRect = document.documentElement.getBoundingClientRect();

        // 避免鼠标双击时也触发该事件
        if (dEvent.button !== 0 || (this.globalVariable.mousedown && this.globalVariable.mousedown[0] && nowTime - this.globalVariable.mousedown[0] <= 200)) return;
        this.globalVariable.mousedown = [true, nowTime];

        // 取消文字选中
        window.getSelection().empty();

        // 伸缩之前加上遮罩层防止选中某些元素意外执行事件
        // 需要再外层也加上遮罩层, 否则可能会出现多个page层互相影响的情况.
        let resizeMask = target.querySelector('.modal-layer-resize-mask');
        let resizeBodyMask = document.querySelector('.modal-layer-resize-mask');
        if (!resizeMask) {
          resizeMask = ModalLayer.assistant.util.objectToDom([this.nodeData.resizeMask])[0];
          target.insertAdjacentElement('afterbegin', resizeMask);
        }
        if (resizeBodyMask.parentNode !== document.body || resizeMask === resizeBodyMask || !resizeBodyMask) {
          resizeBodyMask = ModalLayer.assistant.util.objectToDom([this.nodeData.resizeMask])[0];
          resizeBodyMask.style.zIndex = parseInt(target.style.zIndex) - 1;
          resizeBodyMask.style.cssText += 'top: 0; left: 0; right: 0; bottom: 0; position: fixed;';
          document.body.insertAdjacentElement('afterbegin', resizeBodyMask);
        }
        resizeMask.style.visibility = 'visible';
        resizeBodyMask.style.visibility = 'visible';

        let mouseMoveEvent = (moveEvent) => {
          let mEvent = moveEvent || window.event;
          let movementX = mEvent.screenX - mousePoint[0];
          let movementY = mEvent.screenY - mousePoint[1];
          let resizePos = trigger.getAttribute('position-resize-bar');
          let moveNow = [targetRect.x, targetRect.y, targetArea[0], targetArea[1]];

          this.setStatus('resize');

          if (resizePos.indexOf('top') >= 0) {
            moveNow[1] += movementY;
            moveNow[3] -= movementY;
            if (moveNow[1] < windowRect.y)
              moveNow[3] -= windowRect.y - moveNow[1];
            if (moveNow[3] < targetMinArea[1]) {
              moveNow[1] += moveNow[3] - targetMinArea[1];
              moveNow[3] = targetMinArea[1];
            }
          }
          if (resizePos.indexOf('bottom') >= 0) {
            moveNow[3] += movementY;
            if (moveNow[3] < targetMinArea[1])
              moveNow[3] = targetMinArea[1];
          }
          if (resizePos.indexOf('left') >= 0) {
            moveNow[0] += movementX;
            moveNow[2] -= movementX;
            if (moveNow[0] < windowRect.x)
              moveNow[2] -= windowRect.x - moveNow[0];
            if (moveNow[2] < targetMinArea[0]) {
              moveNow[0] += moveNow[2] - targetMinArea[0];
              moveNow[2] = targetMinArea[0];
            }
          }
          if (resizePos.indexOf('right') >= 0) {
            moveNow[2] += movementX;
            if (moveNow[2] < targetMinArea[0])
              moveNow[2] = targetMinArea[0];
          }

          this.resizeByXYWH(moveNow[0], moveNow[1], moveNow[2], moveNow[3]);
        };


        // 放开鼠标事件
        let mouseUpEvent = () => {
          delete this.globalVariable.mousedown;

          // 隐藏遮罩层
          target.querySelector('.modal-layer-resize-mask').removeAttribute('style');
          document.body.removeChild(document.querySelector('.modal-layer-resize-mask'));

          document.removeEventListener('mousemove', mouseMoveEvent);
          document.removeEventListener('mouseup', mouseUpEvent);

          this.setStatus(statusText);
        };

        document.addEventListener('mouseup', mouseUpEvent);
        document.addEventListener('mousemove', mouseMoveEvent);

      }
    }
  };

  /**
   * 构建Node所需数据
   * @type {Object}
   */
  nodeData = {
    // 遮罩层
    mask: {
      'nodeType': 'div',
      'id': 'modal-layer-mask'
    },
    // 模态层容器
    container: {
      'nodeType': 'div',
      'id': 'modal-layer-container'
    },
    // 标题栏
    title: {
      'nodeType': 'div',
      'class': 'modal-layer-title',
      'innerHTML': [{
        'nodeType': 'h4',
        'class': 'modal-layer-title-content'
      }]
    },
    // 内容
    content: {
      'nodeType': 'div',
      'class': 'modal-layer-content'
    },
    // 页面层
    contentPage: {
      'nodeType': 'iframe',
      'name': '',
      'scrolling': 'no',
      'frameborder': 0
    },
    // 拖拽遮罩层
    dragMask: {
      'nodeType': 'div',
      'class': 'modal-layer-drag-mask'
    },
    // 交互栏
    interaction: {
      'nodeType': 'div',
      'class': 'modal-layer-interaction',
      'innerHTML': [{
        'nodeType': 'span',
        'class': 'modal-layer-button modal-layer-button-ok'
      }, {
        'nodeType': 'span',
        'class': 'modal-layer-button modal-layer-button-cancel'
      }, {
        'nodeType': 'span',
        'class': 'modal-layer-button modal-layer-button-no'
      }]
    },
    // 响应栏
    action: {
      'nodeType': 'div',
      'class': 'modal-layer-action',
      'innerHTML': [{
        'nodeType': 'span',
        'data-fa-transform': 'up-4 shrink-2',
        'class': 'fas fa-window-minimize modal-layer-action-btn modal-layer-action-minimize'
      }, {
        'nodeType': 'span',
        'data-fa-transform': 'shrink-2',
        'class': 'fas fa-expand-arrows-alt modal-layer-action-btn modal-layer-action-expand'
      }, {
        'nodeType': 'span',
        'data-fa-transform': 'rotate-45 grow-1',
        'class': 'fas fa-plus modal-layer-action-btn modal-layer-action-class ModalLayer'
      }]
    },
    // 显示进度条
    displayProgressBar: {
      'nodeType': 'div',
      'class': 'modal-layer-display-progress-bar',
      'innerHTML': [{
        'nodeType': 'div',
        'class': 'modal-layer-display-progress-background',
        'innerHTML': [{
          'nodeType': 'span',
          'class': 'modal-layer-display-bar-progress'
        }]
      }]
    },
    // 调整容器
    resizeBox: {
      'nodeType': 'div',
      'class': 'modal-layer-resize-box',
      'innerHTML':[
        {
          'nodeType': 'div',
          'class': 'modal-layer-resize-bar',
          'position-resize-bar': 'top'
        },
        {
          'nodeType': 'div',
          'class': 'modal-layer-resize-bar',
          'position-resize-bar': 'left'
        },
        {
          'nodeType': 'div',
          'class': 'modal-layer-resize-bar',
          'position-resize-bar': 'right'
        },
        {
          'nodeType': 'div',
          'class': 'modal-layer-resize-bar',
          'position-resize-bar': 'bottom'
        },
        {
          'nodeType': 'div',
          'class': 'modal-layer-resize-bar',
          'position-resize-bar': 'left-top'
        },
        {
          'nodeType': 'div',
          'class': 'modal-layer-resize-bar',
          'position-resize-bar': 'right-top'
        },
        {
          'nodeType': 'div',
          'class': 'modal-layer-resize-bar',
          'position-resize-bar': 'left-bottom'
        },
        {
          'nodeType': 'div',
          'class': 'modal-layer-resize-bar',
          'position-resize-bar': 'right-bottom'
        }
      ]
    },
    // 伸缩遮罩层
    resizeMask: {
      'nodeType': 'div',
      'class': 'modal-layer-resize-mask'
    },
    // 最小化任务栏
    minimizeTaskbar: {
      'nodeType': 'div',
      'id': 'modal-layer-minimize-taskbar'
    },
    minimizeTaskbarItem: {
      'nodeType': 'div',
      'class': 'modal-layer-minimize-item',
      'innerHTML': [{
        'nodeType': 'h4',
        'class': 'modal-layer-minimize-item-title'
      }]
    }
  };

  /**
   * 入口
   * @param  {Object} options 初始化设置
   */
  constructor (options) {
    try {
      // 初始化开始时给用户介入的机会
      if (options.hook && typeof options.hook.initStart === 'function')
        options.hook.initStart(this);
      
      this.initOption(options);
      let buildData = this.initBuildData();
      let nodeList = this.initNode(buildData);

      // 初始化结束后在插入Node之前给用户处理的机会
      if (options.hook && typeof options.hook.initEnded === 'function')
        options.hook.initEnded(this);

      // 将Node插入页面
      Object.keys(nodeList).forEach((key) => {
        document.body.insertAdjacentElement('beforeend', nodeList[key]);
      });

    } catch (e) {
      console.error(e);
      return {status: 'error', message: e};
    }
  }

  /**
   * 初始化options
   * @param  {Object} options 初始化设置
   */
  initOption (options) {
    let optionKeys = Object.keys(options);
    optionKeys.forEach(function (key) {
      // 枚举类型
      if (key === 'type') {
        if (ModalLayer.enum.type[options[key]] === undefined)
          throw Error('无效的类型');
      }

      // 如果是以下属性则遍历子项
      if (['text', 'pageOption', 'callback', 'hook', 'event'].indexOf(key) >= 0) {
        Object.keys(options[key]).forEach(function (k) {
          if (this.option[key][k] !== undefined){
            if (typeof options[key][k] === 'function') {
              this.option[key][k] = options[key][k].bind(this);
            } else {
              this.option[key][k] = options[key][k];
            }
          }
        }, this);
      } else {
        if (this.option[key] !== undefined)
          this.option[key] = options[key];
      }
    }, this);

    // 属性联动检查
    if (this.option.popupTime <= 0)
      this.option.displayProgressBar = false;

    if (this.option.mask === false)
      this.option.clickMaskRemove = false;

    if (this.option.type === 'msg')
      this.option.title = false;

    if (this.option.title === false)
      this.option.drag = false;

    if (this.option.drag === false)
      this.option.dragOverflow = false;


    // 设置ID
    this.option.index = ModalLayer.instance.length;    
  }

  /**
   * 根据初始数据生成创建模态层所需数据
   * @return {Object}         生成的数据
   */
  initBuildData () {
    let buildData = [];

    // 遮罩层
    if (this.option.mask)
      buildData['mask'] = this.nodeData.mask;

    // 容器
    buildData['container'] = this.nodeData.container;

    if (buildData['container']['innerHTML'] === undefined)
      buildData['container']['innerHTML'] = [];

    if (this.nodeData.content['innerHTML'] === undefined)
      this.nodeData.content['innerHTML'] = [];

    if (this.option.resize)
      buildData['container']['innerHTML'].push(this.nodeData.resizeMask);

    if (this.option.title !== false)
      buildData['container']['innerHTML'].push(this.nodeData.title);

    if (this.option.drag)
      this.nodeData.content['innerHTML'].push(this.nodeData.dragMask);

    if (['page', 'video', 'audio'].indexOf(this.option.type) >= 0)
      this.nodeData.content['innerHTML'].push(this.nodeData.contentPage);

    buildData['container']['innerHTML'].push(this.nodeData.content);

    buildData['container']['innerHTML'].push(this.nodeData.interaction);

    buildData['container']['innerHTML'].push(this.nodeData.action);

    // 显示进度条
    if (this.option.displayProgressBar)
      buildData['container']['innerHTML'].push(this.nodeData.displayProgressBar);

    // 如果允许调整窗口大小
    if (this.option.resize)
      buildData['container']['innerHTML'].push(this.nodeData.resizeBox);

    return buildData;
  }

  /**
   * 初始化Node对象
   * @param  {Object} buildData 用于生成Node的数据
   * @param  {Object} options   模态层设置
   * @return {Object}           设置过的Node
   */
  initNode (buildData) {
    // class
    let ui = 'modal-layer-ui';
    let hideCls = 'modal-layer-hide';
    let skin = 'modal-layer-skin-' + this.option.skin;
    let indexCls = 'modal-layer-index-' + this.option.index;

    // 生成DOM
    let modalLayerNodes = ModalLayer.assistant.util.objectToDom(buildData);
    let modalLayerNodeKeys = Object.keys(modalLayerNodes);

    // 样式数据
    let maxZIndex = ModalLayer.assistant.util.maxZIndex();
    let opacityStyle = 'opacity: ' + this.option.transitionOpacity + ';';
    let transitionOpacity = 'opacity ' + this.option.transitionTime + 's ease';
    let transitionTransform = 'transform ' + this.option.transitionTime + 's ease';
    let transitionStyle = ';-webkit-transition: ' + transitionOpacity + ', ' + transitionTransform + '; -o-transition:' + transitionOpacity + ', ' + transitionTransform + '; transition:' + transitionOpacity + ', ' + transitionTransform + ';';
    let transformStyle = ';-webkit-transform: scale(' + this.option.transitionScale[0] + ', ' + this.option.transitionScale[1] + ');-ms-transform: scale(' + this.option.transitionScale[0] + ', ' + this.option.transitionScale[1] + ');-o-transform: scale(' + this.option.transitionScale[0] + ', ' + this.option.transitionScale[1] + ');transform: scale(' + this.option.transitionScale[0] + ', ' + this.option.transitionScale[1] + ');';

    // 单独设置
    modalLayerNodes.container.setAttribute('modal-layer-type', this.option.type);
    modalLayerNodes.container.setAttribute('modal-layer-popup-time', this.option.popupTime);
    modalLayerNodes.container.setAttribute('click-mask-remove', this.option.clickMaskRemove);
    modalLayerNodes.container.setAttribute('content-full-container', this.option.contentFullContainer);
    if (this.option.drag)
      modalLayerNodes.container.setAttribute('allow-drag', this.option.drag);
    if (this.option.resize)
      modalLayerNodes.container.setAttribute('allow-resize', this.option.resize);

    // 展示进度条
    if (this.option.displayProgressBar) {
      let posAry = ['top', 'left', 'right', 'bottom'];
      let barNode = modalLayerNodes.container.querySelector('.modal-layer-display-progress-bar');
      if (posAry.indexOf(this.option.displayProgressBarPos.toLowerCase()) === false)
        this.option.displayProgressBarPos = posAry[3];
      barNode.setAttribute('progress-bar-position', this.option.displayProgressBarPos);
      barNode.querySelector('.modal-layer-display-bar-progress').style.cssText += 'background: ' + this.option.displayProgressBarColor;
    }

    // 页面层单独设置
    if (this.option.type === 'page') {
      let pageNode = modalLayerNodes.container.querySelector('.modal-layer-content iframe');
      let pageStyle = 'display: block; width: ' + this.option.pageArea[0] + 'px; height: ' + this.option.pageArea[1] + 'px';

      // 如果src与srcdoc属性一起存在则使用src属性
      if (this.option.pageOption.srcdoc !== undefined && this.option.pageOption.src !== undefined)
        delete this.option.pageOption.srcdoc;
      Object.keys(this.option.pageOption).forEach(function (key) {
        if (key === 'name')
          pageNode.setAttribute('name', this.option.pageOption.name + this.option.index);
        else
          pageNode.setAttribute(key, this.option.pageOption[key]);
      }, this);

      pageNode.style = pageStyle;
    }
    
    // 初始化内容
    this.initContent(modalLayerNodes.container);

    // 统一设置
    modalLayerNodeKeys.forEach(function (key) {
      let allNodes = ModalLayer.assistant.util.getAllElement(modalLayerNodes[key]);
      
      // 设置样式类
      for (let i = 0; i < allNodes.length; i++) {
        let classList = allNodes[i].classList;
        if (!classList.contains(ui));
          classList.add(ui);
      }

      // 设置默认class
      // 设置皮肤class
      // 设置索引class
      // 默认隐藏
      modalLayerNodes[key].classList.add(ui, skin, indexCls, hideCls);

      // 设置过渡样式
      modalLayerNodes[key].style = opacityStyle + transitionStyle;

      // 设置z-index
      modalLayerNodes[key].style.zIndex = maxZIndex + 1;
    }, this);

    // 设置形变
    modalLayerNodes.container.style.cssText += transformStyle;

    // 重新设置container z-index, 确保在最上层.
    // modalLayerNodes.container.style.zIndex = maxZIndex + 2;

    // 绑定事件
    this.initEvent(modalLayerNodes);

    // 将设置完成的Node放入实例数组
    ModalLayer.instance.push(this);

    return modalLayerNodes;
  }

  /**
   * 初始化内容
   * @param  {Element} container 容器Node
   */
  initContent (container) {
    let titleNode = container.querySelector('.modal-layer-title-content');
    let contentNode = container.querySelector('.modal-layer-content');
    let interactionNode = container.querySelector('.modal-layer-interaction');

    if (this.option.type !== 'page'){
      if (this.option.drag)
        contentNode.innerHTML = container.querySelector('.modal-layer-drag-mask').outerHTML + (this.option.content ? this.option.content : this.option.text.content);
      else
        contentNode.innerHTML = this.option.content ? this.option.content : this.option.text.content;
    }
    if (this.option.type !== 'msg') {
      titleNode.innerHTML = this.option.title ? this.option.title : this.option.text.title;
      interactionNode.querySelector('.modal-layer-button-ok').innerHTML = this.option.okText ? this.option.okText : this.option.text.okButton;
      interactionNode.querySelector('.modal-layer-button-no').innerHTML = this.option.noText ? this.option.noText : this.option.text.noButton;
      interactionNode.querySelector('.modal-layer-button-cancel').innerHTML = this.option.cancelText ? this.option.cancelText : this.option.text.cancelButton;
    }
  }

  /**
   * 初始化事件
   * @param  {Object} modalLayerNodes 模态层Node
   */
  initEvent (modalLayerNodes) {
    let self = this;

    // 点击遮罩层移除模态层
    if (this.option.mask && this.option.clickMaskRemove)
      modalLayerNodes.mask.addEventListener('click', this.option.callback.clickMask);

    // 拖拽模态层
    if (this.option.drag)
      modalLayerNodes.container.querySelector('.modal-layer-title').addEventListener('mousedown', this.option.event.drag);

    // 模态层伸缩
    if (this.option.resize)
      ModalLayer.assistant.util.eventTarget(modalLayerNodes.container, '.modal-layer-resize-bar', 'mousedown', this.option.event.resize);

    // 当点击模态层时如果有多个模态层为显示状态则点击的对象置于最上层
    modalLayerNodes.container.addEventListener('mousedown', this.option.event.active);

    // 自动关闭模态层
    if (this.option.popupTime > 0) {
      let hideCls = 'modal-layer-hide';
      let showCls = 'modal-layer-show';
      let totalTime = this.option.popupTime * 1000;
      this.intervalClock.push(setInterval(function () {
        if (modalLayerNodes.container.classList.contains(showCls)) {
          self.stopAllInterval();

          if (self.option.displayProgressBar) {
            let animationName = '';
            let progressNode = modalLayerNodes.container.querySelector('.modal-layer-display-bar-progress');
            switch (self.option.displayProgressBarPos) {
              case 'top':
              case 'bottom':
                animationName = 'widthFull';
                break;
              case 'left':
              case 'right':
                animationName = 'heightFull';
                break;
              default:
                break;
            }
            progressNode.style.cssText += ';animation: ' + animationName + ' ' + self.option.popupTime + 's linear; -webkit-animation: ' + animationName + ' ' + self.option.popupTime + 's linear;';
          }

          self.timeoutClock.push(setTimeout(function () {
            self.remove(self.option.index);
          }, totalTime));
        }
      }, 10));
    }

    // action 由于action使用了Font Awesome, 最好使用事件委托
    if (this.option.callback.close)
      ModalLayer.assistant.util.eventTarget(modalLayerNodes.container, '.modal-layer-action-close', 'click', this.option.callback.close);
    if (this.option.callback.expand)
      ModalLayer.assistant.util.eventTarget(modalLayerNodes.container, '.modal-layer-action-expand', 'click', this.option.callback.expand);
    if (this.option.callback.minimize)
      ModalLayer.assistant.util.eventTarget(modalLayerNodes.container, '.modal-layer-action-minimize', 'click', this.option.callback.minimize);
    
    // interaction 默认只绑定cancel
    if (this.option.type !== 'msg') {
      let okButton = modalLayerNodes.container.querySelector('.modal-layer-button-ok');
      let noButton = modalLayerNodes.container.querySelector('.modal-layer-button-no');
      let cancelButton = modalLayerNodes.container.querySelector('.modal-layer-button-cancel');

      if (this.option.callback.ok !== undefined)
        okButton.addEventListener('click', this.option.callback.ok);
      if (this.option.callback.no !== undefined)
        noButton.addEventListener('click', this.option.callback.no);
      cancelButton.addEventListener('click', this.option.callback.cancel);
    }
  }

  /**
   * 停止所有间隔器
   */
  stopAllInterval () {
    this.intervalClock.forEach((v, k) => {
      this.stopInterval(k);
    }, this);
  }

  /**
   * 停止间隔器
   * @param  {Number} i 间隔器索引
   */
  stopInterval (i) {
    clearInterval(this.intervalClock[i]);
    delete this.intervalClock[i];
  }

  /**
   * 停止所有计时器
   */
  stopAllTimeout () {
    this.timeoutClock.forEach((v, k) => {
      this.stopTimeout(k);
    }, this);
  }

  /**
   * 停止计时器
   * @param  {Number} i 间隔器索引
   */
  stopTimeout (i) {
    clearTimeout(this.timeoutClock[i]);
    delete this.timeoutClock[i];
  }

  /**
   * 移除事件
   */
  removeAllEvent () {
    let self = this;
    return ModalLayer.assistant.util.convertAsyncMethod(() => {
      let modalLayerNodes = this.getNodes();
      if (Object.keys(modalLayerNodes).length === 0) return false;

      // 移除遮罩层点击事件
      if (self.option.mask)
        modalLayerNodes.mask.removeEventListener('click', self.option.callback.clickMask);

      // 移除模态层拖拽事件
      if (this.option.drag)
        modalLayerNodes.container.querySelector('.modal-layer-title').removeEventListener('mousedown', this.option.event.drag);

      // 移除模态层伸缩事件
      if (this.option.resize)
        modalLayerNodes.container.removeEventListener('mousedown', this.option.event.resize);

      // 移除活动层事件
      modalLayerNodes.container.removeEventListener('mousedown', this.option.event.active);
      
      // 移除action事件
      let okButton = modalLayerNodes.container.querySelector('.modal-layer-button-ok');
      let noButton = modalLayerNodes.container.querySelector('.modal-layer-button-no');
      let cancelButton = modalLayerNodes.container.querySelector('.modal-layer-button-cancel');
      if (okButton)
        okButton.removeEventListener('click', self.option.callback.ok);
      if (noButton)
        noButton.removeEventListener('click', self.option.callback.no);
      if (cancelButton)
        cancelButton.removeEventListener('click', self.option.callback.cancel);

      // 移除interaction事件
      modalLayerNodes.container.removeEventListener('click', self.option.callback.close);
      modalLayerNodes.container.removeEventListener('click', self.option.callback.expand);
      modalLayerNodes.container.removeEventListener('click', self.option.callback.minimize);
    });
  }

  /**
   * 返回当前实例的DOM
   * @return {Object}
   */
  getNodes () {
    let nodes = {};

    let maskNode = document.querySelector('#modal-layer-mask.modal-layer-index-' + this.option.index);
    let containerNode = document.querySelector('#modal-layer-container.modal-layer-index-' + this.option.index);
    let minimizeTaskbarNode = document.querySelector('#modal-layer-container.modal-layer-index-');
    maskNode ? nodes.mask = maskNode : '';
    containerNode ? nodes.container = containerNode : '';

    return nodes;
  }

  /**
   * 设置模态层当前状态
   * @param {String} statusText 模态层状态
   */
  setStatus (statusText) {
    if (ModalLayer.enum.status[statusText] === undefined)
      throw Error('不存在该状态, 无法设置.');
    this.status = statusText;
  }

  /**
  * 根据屏幕大小重绘模态层大小
  */
  resize () {
    let newModalWidth = 0;
    let newModalHeight = 0;
    let modalChildNodes = null;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let containerNode = this.getNodes().container;
    let widthTmpNum = this.option.areaProportion[0].toString().length - (this.option.areaProportion[0].toString().indexOf('.') + 1);
    let heightTmpNum = this.option.areaProportion[1].toString().length - (this.option.areaProportion[1].toString().indexOf('.') + 1);

    if (this.option.type.toLowerCase() === 'page') {
      let pageNode = containerNode.querySelector('iframe[name=' + this.option.pageOption.name + this.option.index + ']');
      modalChildNodes = containerNode.children;
      newModalWidth = pageNode.offsetWidth + (pageNode.parentNode.offsetLeft * 2);
      for (let i = 0; i < modalChildNodes.length; i++) {
        newModalHeight += getComputedStyle(modalChildNodes[i], null).position == 'absolute' ? 0 : modalChildNodes[i].offsetHeight;
      }
      containerNode.style.width = newModalWidth + 'px';
      containerNode.style.height = newModalHeight + 'px';
    } else {
      // 先设置宽度, 不然会出现高度不正确的现象
      newModalWidth = windowWidth * (10 * widthTmpNum * this.option.areaProportion[0]) / (10 * widthTmpNum);
      containerNode.style.width = newModalWidth + 'px';

      // newModalHeight = windowHeight * (10 * heightTmpNum * ModalLayer.modalHeightProportion) / (10 * heightTmpNum) + 'px';
      modalChildNodes = containerNode.children;
      for (let i = 0; i < modalChildNodes.length; i++) {
        newModalHeight += getComputedStyle(modalChildNodes[i], null).position == 'absolute' ? 0 : modalChildNodes[i].offsetHeight;
      }
      containerNode.style.height = newModalHeight + 'px';
    }
    // 记录初始化后的最小值
    this.globalVariable.defaultArea = [newModalWidth, newModalHeight];
  }

  /**
   * 根据给定的参数重绘模态层
   * 不允许溢出document边界
   * @param {Number} x x轴坐标
   * @param {Number} y y轴坐标
   * @param {Number} w 容器宽
   * @param {Number} h 容器高
   */
  resizeByXYWH (x, y, w, h) {
    let containerNode = this.getNodes().container;
    let wBoundary = document.documentElement.getBoundingClientRect();

    if (x < wBoundary.x)
      x = wBoundary.x;
    if (x + w > wBoundary.right)
      w = wBoundary.right - x;
    if (y < wBoundary.y)
      y = wBoundary.y;
    if (y + h > wBoundary.bottom)
      h = wBoundary.bottom - y;

    containerNode.style.marginLeft = x + 'px';
    containerNode.style.marginTop = y + 'px';

    containerNode.style.width = w + 'px';
    containerNode.style.height = h + 'px';

    // 如果为页面层则跟随模态层变化
    if (['page', 'video', 'audio'].indexOf(this.option.type) >= 0) {
      let pageNode = containerNode.querySelector('iframe[name=' + this.option.pageOption.name + this.option.index + ']');
      pageNode.style.width = this.option.pageArea[0] + w - this.globalVariable['defaultArea'][0] + 'px';
      pageNode.style.height = this.option.pageArea[1] + h - this.globalVariable['defaultArea'][1] + 'px';
    }
  }
  /**
   * 展示模态层
   */
  show () {
    let showStatus = 'show';
    let showCls = 'modal-layer-show';
    let hideCls = 'modal-layer-hide';
    let modalLayerNodes = this.getNodes();
    let maxZIndex = ModalLayer.assistant.util.maxZIndex();
    if (Object.keys(modalLayerNodes).length === 0 || this.status === showStatus) return false;

    // 置于最上层
    if (this.option.mask)
      modalLayerNodes.mask.style.zIndex = maxZIndex + 1;
    modalLayerNodes.container.style.zIndex = maxZIndex + 2;

    // 更改CSS属性执行过渡动画
    if (this.option.mask)
      modalLayerNodes.mask.style.opacity = 1;
    modalLayerNodes.container.style.opacity = 1;
    modalLayerNodes.container.style.transform = 'scale(1, 1)';

    Object.keys(modalLayerNodes).forEach((key) => {
      if (modalLayerNodes[key].classList.contains(hideCls)) {
        modalLayerNodes[key].classList.add(showCls);
        modalLayerNodes[key].classList.remove(hideCls);
      }
    }, this);

    // 更改当前状态
    this.setStatus(showStatus);
  }

  /**
   * 隐藏模态层
   * @return {Promise}      等待该方法执行完毕才执行之后的
   */
  hide () {
    let hideStatus = 'hide';
    let hideCls = 'modal-layer-hide';
    let showCls = 'modal-layer-show';
    let modalLayerNodes = this.getNodes();
    if (Object.keys(modalLayerNodes).length === 0 || this.status === hideStatus) return false;

    // 更改CSS属性执行过渡动画
    if (this.option.mask)
      modalLayerNodes.mask.style.opacity = this.option.transitionOpacity;
    modalLayerNodes.container.style.opacity = this.option.transitionOpacity;
    modalLayerNodes.container.style.transform = 'scale(' + this.option.transitionScale[0] + ', ' + this.option.transitionScale[1] + ')';

    // 等待动画完毕后执行
    return ModalLayer.assistant.util.convertAsyncMethod(() => {
      
      Object.keys(modalLayerNodes).forEach((key) => {
        if (modalLayerNodes[key].classList.contains(showCls)) {
          modalLayerNodes[key].classList.add(hideCls);
          modalLayerNodes[key].classList.remove(showCls);
        }
      });
      
      // 更改当前状态
      this.setStatus(hideStatus);

    }, (this.option.transitionTime * 1000 / 700).toFixed(2));
   }

   /**
    * 最小化模态层
    */
   async minimize () {
    let title = null;
    let maxTaskItem = 8;
    let taskbarNode = null;
    let taskItemNode = null;
    let taskItemWidth = null;
    let minimizeText = 'minimize';
    if (this.status === minimizeText) return;

    taskbarNode = document.querySelector('#modal-layer-minimize-taskbar');
    if (!taskbarNode) {
      taskbarNode = ModalLayer.assistant.util.objectToDom([this.nodeData.minimizeTaskbar])[0];
      document.body.insertAdjacentElement('beforeend', taskbarNode);
      ModalLayer.assistant.util.eventTarget(taskbarNode, '.modal-layer-minimize-item', 'click', function () {
        if (this.getAttribute('clicked')) return;
        this.setAttribute('clicked', true);

        let index = this.getAttribute('modal-layer-index');
        delete ModalLayer.minimizeList[ModalLayer.minimizeList.indexOf(ModalLayer.instance[index])];
      });
    }

    if (ModalLayer.minimizeList.length < 3)
      taskItemWidth = '25%';
    else if (ModalLayer.minimizeList.length < 5)
      taskItemWidth = '20%';
    else
      taskItemWidth = '12.5%';
    title = this.option.title.length === 0 ? this.option.text.title : this.option.title;
    taskItemNode = ModalLayer.assistant.util.objectToDom([this.nodeData.minimizeTaskbarItem])[0];

    taskItemNode.setAttribute('modal-layer-index', this.option.index);
    taskItemNode.querySelector('.modal-layer-minimize-item-title').innerHTML = title;
    taskbarNode.insertAdjacentElement('beforeend', taskItemNode);

    taskbarNode.querySelectorAll('.' + taskItemNode.className).forEach((element) => {
      element.style.width = taskItemWidth;
    }, this);

    let tmpClock = setInterval(() => {
      if (taskItemNode.parentNode) {
        taskItemNode.style.cssText += 'opacity: 1;-webkit-transform: scale(1);-ms-transform: scale(1);-o-transform: scale(1);transform: scale(1);';
        clearInterval(tmpClock);
      }
    }, 10);

    await this.hide();
    this.setStatus(minimizeText);
   }

   /**
    * 还原模态层(处于特殊状态)
    */
   revert () {
    let showText = 'show';
    let minimizeText = 'minimize';
    let minimizeTaskbar = document.querySelector('#modal-layer-minimize-taskbar');
    let taskItem = minimizeTaskbar.querySelector('.modal-layer-minimize-item[modal-layer-index="' + this.option.index + '"]');
    if ([minimizeText].indexOf(this.status) < 0) return;

    this.show();
    this.setStatus(showText);

    taskItem.style.opacity = '';
    taskItem.style.transform = '';
    setTimeout(() => {
      minimizeTaskbar.removeChild(taskItem);
      if (ModalLayer.minimizeList.length <= 0)
        document.body.removeChild(minimizeTaskbar);
    }, 250);
   }

  /**
   * 移除模态层
   */
  async remove () {
    let removedStatus = 'removed';
    let removingStatus = 'removing';
    let hideCls = 'modal-layer-hide';
    let modalLayerNodes = this.getNodes();
    if (Object.keys(modalLayerNodes).length === 0 || this.status === removingStatus || this.status === removedStatus) return false;

    // 将当前状态置为removing
    this.setStatus(removingStatus);

    // 停止计时器与间隔器
    this.stopAllTimeout();
    this.stopAllInterval();

    // 隐藏模态层
    await this.hide();

    // 移除事件
    await this.removeAllEvent();

    // 删除模态层
    Object.keys(modalLayerNodes).forEach((key) => {
      // if (modalLayerNodes[key].parentNode)
      modalLayerNodes[key].parentNode.removeChild(modalLayerNodes[key]);
    });

    // 将当前状态置为removed
    this.setStatus(removedStatus);


    if (this.option.parentModalLayer !== null)
      this.option.parentModalLayer.show();
  }

  /**
   * 移除所有模态层
   */
  static removeAll () {
    for (let i = 0; i < ModalLayer.instance.length; i++)
      ModalLayer.instance[i].remove();
  }

  /**
   * 消息层
   * @param  {Object} options 模态层设置
   * @return {ModalLayer}     模态层实例
   */
  static msg (options) {
    let msgLayer = null;

    if (typeof options === 'string')
      options = {
        'content': options
      }
    else 
      options.type = 'msg';

    // 实例化
    msgLayer = new ModalLayer(options);

    // 重绘模态层大小
    msgLayer.resize();

    // 显示
    msgLayer.show();

    return msgLayer;
  }

  /**
   * 消息提示层
   * @param  {Object} options 模态层设置
   * @return {ModalLayer}     模态层实例
   */
  static alert (options) {
    let alertLayer = null;

    options.type = 'alert';

    alertLayer = new ModalLayer(options);

    // 重绘模态层大小
    alertLayer.resize();

    // 显示
    alertLayer.show();

    return alertLayer;
  }

  /**
   * 提示层
   * @param  {Object} options 模态层设置
   * @return {ModalLayer}     模态层实例
   */
  static prompt (options) {
    let promptLayer = null;

    options.type = 'prompt';

    promptLayer = new ModalLayer(options);

    // 重绘模态层大小
    promptLayer.resize();

    // 显示
    promptLayer.show();

    return promptLayer;
  }

   /**
   * 询问层
   * @param  {Object} options 模态层设置
   * @return {ModalLayer}     模态层实例
   */
  static confirm (options) {
    let confirmLayer = null;

    options.type = 'confirm';

    confirmLayer = new ModalLayer(options);

    // 重绘模态层大小
    confirmLayer.resize();

    // 显示
    confirmLayer.show();

    return confirmLayer;
 }

  /**
   * 页面层
   * @param  {Object} options 模态层设置
   * @return {ModalLayer}     模态层实例
   */
  static page (options) {
    let pageLayer = null;

    options.type = 'page';
    if (!options.callback)
      options.callback = {};

    pageLayer = new ModalLayer(options);

    // 重绘模态层大小
    pageLayer.resize();

    // 显示
    pageLayer.show();

    return pageLayer;
  }

  /**
   * 图片层
   * @param  {Object} options 模态层设置
   * @return {ModalLayer}     模态层实例
   */
  static image (options) {}

  /**
   * 视频层
   * @param  {Object} options 模态层设置
   * @return {ModalLayer}     模态层实例
   */
  static video (options) {}

  /**
   * 音乐层
   * @param  {Object} options 模态层设置
   * @return {ModalLayer}     模态层实例
   */
  static audio (options) {}

}

/**
 * 模态层实例
 * @type {Array}
 */
ModalLayer.instance = new Proxy([], {
  set: (obj, attr, val) => {
    if (val instanceof ModalLayer || attr === 'length') {
      obj[attr] = val;
      return true;
    }
    throw new TypeError('类型必须为ModalLayer');
  },
  deleteProperty: (obj, key) => {
    throw new Error('不允许删除');
  }
});

/**
 * 模态层最小化列表
 * @type {Array}
 */
ModalLayer.minimizeList = new Proxy([], {
  // 处理push, splice
  // 暂时只允许使用push操作, 大于length的操作做push操作.
  set: (obj, key, val) => {
    if (val instanceof ModalLayer) {
      let valIndex = obj.indexOf(val);
      if (valIndex < 0) {
        val.minimize();
      } else {
        obj[valIndex] = obj[key];
        obj[key].minimize();
      }
      if (key > obj.length)
        obj[obj.length] = val;
      else
        obj[key] = val;
    }
    if (key === 'length')
      obj[key] = val;
    return true;
  },
  deleteProperty: (obj, key) => {
    if (obj[key] instanceof ModalLayer) {
      key = parseInt(key);
      obj[key].revert();
      if (obj[key + 1]) {
        obj[key] = obj[key + 1]
        delete obj[key + 1];
      } else {
        delete obj[key];
      }
      obj.length--;

      return true;
    }
  }
});

/**
 * 工具类集合
 * @type {Object}
 */
ModalLayer.assistant = {
  'util': Util
};

/**
 * 枚举
 * @type {Object}
 */
ModalLayer.enum = {
  // 模态层类型
  type: {
    'msg': 0,
    'alert': 1,
    'prompt': 2,
    'confirm': 3,
    'page': 4,
    'loading': 5,
    'image': 6,
    'video': 7,
    'audio': 8
  },
  // 模态层状态
  status: {
    'hide': 0,
    'show': 1,
    'expand': 2,
    'minimize': 3,
    'removing': 4,
    'removed': 5,
    'drag': 6,
    'resize': 7
  },
  // 方向键
  arrow: {
    'left': 37,
    'up': 38,
    'right': 39,
    'dw': 40
  }
}











