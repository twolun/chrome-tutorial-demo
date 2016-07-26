/*
 * 需要activeTab权限
 *
 */

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  console.log('Turning ' + tab.url + ' red!');
  /* 
   * 以编辑的方式向页面插件脚本
   * 
   */
  chrome.tabs.executeScript(null, {
    // code: 'document.body.style.backgroundColor="red"'
    file: 'content.js'
  }, function(res){
  	console.log(res)
  });
});