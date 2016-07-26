// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Register a callback function with the commands api, which will be called when
 * one of our registered commands is detected.
 */
chrome.commands.onCommand.addListener(function(command) {
	/*
	 * chrome.tabs.update()，第一个参数可省略，默认为当前窗口的选定即活动标签页
	 * 这里的用法只是为了拿到活动标签的tab.id
	 */  
  chrome.tabs.update({}, function(tab) {
  	console.log(tab)
    if (command == 'toggle - pin - tab')
      chrome.tabs.update({pinned: !tab.pinned});
    else if (command == 'duplicate - tab')
      chrome.tabs.duplicate(tab.id);
  });
});