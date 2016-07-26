# chrome-tutorial-demo

## 2016年7月10日
### chrome.browserAction
```js  
  {
      "manifest_version": 2,

      "name": "Getting started example",
      "description": "This extension shows a Google Image search result for the current page",
      "version": "1.0",

      "browser_action": {
        "default_icon": "icon.png",
        "default_popup": "popup.html",
        "default_title": 'Click here!'
      },
      "permissions": [
        "activeTab",
        "https://ajax.googleapis.com/"
      ]
  }
```  

- default_icon: 在搜索栏右边显示的插件图标，19px正方形的png图片
- default_popup: 如果插件中存在popup.html或设置这一项，则点击插件图片会弹出popup.html页面
- default_popup中的popup.html可以引用插件内部或者外部的资源，当然引用外部资源需要其它的配置，后续再讲。
- default_title: 鼠标放在icon上时，显示的提示文字，不设置则显示配置文件中的`name`值

## 2016年7月21日
### Event_Page_Exabmple
- 声明跨域权限  
```js
"permissions": [
  "*://*/*"
],
```
