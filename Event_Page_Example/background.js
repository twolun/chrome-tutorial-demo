// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Global variables only exist for the life of the page, so they get reset
// each time the page is unloaded.
var counter = 1;

var lastTabId = -1;
function sendMessage() {
  /*
   * 获得当前窗口内的活动页
   * callback(tab): 返回值为tab类型
   */
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    lastTabId = tabs[0].id;
    /*
     * 向指定标签页中的内容脚本发送一个消息，当收到一个回调时执行一个可选的回调函数
     * 标签页通过标签id指定
     * 当前应用在指定标签页中每一个内容脚本都会收到runtime.onMessage事件，并执行相应的回调
     */
    chrome.tabs.sendMessage(lastTabId, "Background page started.");
  });
}

sendMessage();
/*
 * 设置应用图标上的徽章信息，一般不超过四个字
 * browserAction.setBadgeBackgroundColor：设置徽章的背景颜色
 */
chrome.browserAction.setBadgeText({text: "ON"});
console.log("Loaded.");
/*
 * 当应用第一次安装或者更新到新版本或者浏览器更新时，触发该事件
 * callback(details): details说明触发这一事件的原因
 */
chrome.runtime.onInstalled.addListener(function() {
  alert("Installed.");

  // localStorage is persisted, so it's a good place to keep state that you
  // need to persist across page reloads.
  localStorage.counter = 1;

  // Register a webRequest rule to redirect bing to google.
  /*
   * chrome.declarativeWebRequest,属于beta-api，只有测试或开发模式才会出现
   * 至今没有移入稳定版本中的计划
   * 用来拦截、分析http请求，
   * 明天比chrome.webRequest要快很多
   */
  // var wr = chrome.declarativeWebRequest;
  // chrome.declarativeWebRequest.onRequest.addRules([{
  //   id: "0",
  //   conditions: [new wr.RequestMatcher({url: {hostSuffix: "bing.com"}})],
  //   actions: [new wr.RedirectRequest({redirectUrl: "http://google.com"})]
  // }]);
});

/*
 * 需要bookmarks权限
 * 当书签或书签文件夹被移除的时候触发
 */
chrome.bookmarks.onRemoved.addListener(function(id, info) {
  alert("I never liked that site anyway.");
});

/*
 * 浏览器图标，即插件图标被单击时触发，如果浏览器图标即插件图标有弹出内容，则该事件不会触发
 */
chrome.browserAction.onClicked.addListener(function() {
  // The event page will unload after handling this event (assuming nothing
  // else is keeping it awake). The content script will become the main way to
  // interact with us.
  /*
   * 创建新的标签页，并在此标签页加载http://google.com
   */
  chrome.tabs.create({url: "http://google.com"}, function(tab) {
    /*
     * 以编程的方式在页面插入代码，
     */
    chrome.tabs.executeScript(tab.id, {file: "content.js"}, function() {
      // 在事件页面加载之前，也发送一个消息  sendMessage()
      // 但是此时 content_scripts不会被加载
      // 所以在这里，在新的标签页创建后，此时也应该是当前活动页，再一次发送消息事件
      // 在content_scripts里，可以捕获到这个事件，
      sendMessage();
    });
  });
});
/*
 * 当注册的命令，通过快捷键激活时产生
 */
chrome.commands.onCommand.addListener(function(command) {
  alert(command)
  chrome.tabs.create({url: "http://www.google.com/"});
});
/*
 * 当消息从应用后台进程，或者内容脚本中发送时产生，
 * 同一个文档中，应该只存在一个onMessage事件处理函数，存在多个的话也只有一个会执行
 * msg: 接收到的消息
 * _:   发送者
 * sendResponse: 当产生响应时可以调用的函数
 *           当事件处理函数返回时，该函数将失效，即意味着此时不能在事件处理函数中异步调用sendResponse
 *           有一个办法解决这个问题，在事件处理函数中显式的执行：return true,
 *           这即告诉事件处理函数，希望以异步的方式发送响应，
 *           这样，与发送消息一端的消息通道将保持打开状态，直到调用了sendResponse
 */
chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  if (msg.setAlarm) {
    /*
     * 安排代码周期的运行，或者在将来的某个时候运行
     * 创建定时器，在指定的时间或条件下产生alarms.onAlarm事件
     * 
     */
    chrome.alarms.create('myalarm', {delayInMinutes: 0.1});
  } else if (msg.delayedResponse) {
    // Note: setTimeout itself does NOT keep the page awake. We return true
    // from the onMessage event handler, which keeps the message channel open -
    // in turn keeping the event page awake - until we call sendResponse.
    setTimeout(function() {
      sendResponse("Got your message.");
    }, 5000);
    return true;
  } else if (msg.getCounters) {
    sendResponse({counter: counter++,
                  persistentCounter: localStorage.counter++});
  }
  // If we don't return anything, the message channel will close, regardless
  // of whether we called sendResponse.
});

/*
 * 当定时器到达时间时产生，对事件页面非常有用
 */

chrome.alarms.onAlarm.addListener(function(alarm) {
  console.log(alarm)
  alert("Time's up!");
});

/*
 * 在事件页面即将卸载前发送
 */

chrome.runtime.onSuspend.addListener(function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    // After the unload event listener runs, the page will unload, so any
    // asynchronous callbacks will not fire.
    alert("This does not show up.");
  });
  console.log("Unloading.");
  chrome.browserAction.setBadgeText({text: ""});
  chrome.tabs.sendMessage(lastTabId, "Background page unloaded.");
});