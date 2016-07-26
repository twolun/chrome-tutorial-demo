/*
 * 权限：cookie, 主机权限
 */

/* 
 * 当cookie设置或删除时产生
 * cookie更新为特殊情况，应该是会产生两次事件
 */
chrome.cookies.onChanged.addListener(function(info) {
  // console.log("onChanged" + JSON.stringify(info));
  console.log("onChanged", info);
});

function focusOrCreateTab(url) {
  /*
   * 获取所有窗口
   * populate:true，则返回的windows对象会有tabs属性
   */
  chrome.windows.getAll({"populate":true}, function(windows) {
    console.log(windows)
    var existing_tab = null;
    for (var i in windows) {
      var tabs = windows[i].tabs;
      for (var j in tabs) {
        var tab = tabs[j];
        if (tab.url == url) {
          existing_tab = tab;
          break;
        }
      }
    }
    if (existing_tab) {
      /*
       * 修改标签页属性，未指定的属性保持不变
       */
      chrome.tabs.update(existing_tab.id, {"highlighted":true});
    } else {
      chrome.tabs.create({"url":url, "selected":true});
    }
  });
}

chrome.browserAction.onClicked.addListener(function(tab) {
  /*
   * 将应用安装目录中的相对路径，转换成完整的URL
   */
  var manager_url = chrome.extension.getURL("manager.html");

  focusOrCreateTab(manager_url);
});