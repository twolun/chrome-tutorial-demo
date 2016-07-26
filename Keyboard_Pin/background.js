/*
 * commands自定义命令有一定的要求
 * 例："togogle - pin",
 * "-"两边要有一个半角空格，否则命令无法起作用，
 * 经测试似乎是这样，以后开发过程还需要进一步测试
 */

chrome.commands.onCommand.addListener(function(command) {
	alert(command)
  if (command == "toggle - pin") {
    // Get the currently selected tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // Toggle the pinned status
      var current = tabs[0]
      console.log(current);
      /*
       * {pinned: boolean}设置标签页是否固定
       * 标签页为收紧标签栏显示，固定在固定的位置，无法拖动
       */
      chrome.tabs.update(current.id, {'pinned': !current.pinned});
    });
  }
});