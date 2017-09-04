## Top-Level API
### LAB
import LAB from 'lab4';

### LAB.requireComp
加载平台组件如'com.Text'
    const ComText = LAB.requireComp('com.Text');

### LAB.isCompData
判断数据是否为平台组件
```
let data = {
  ui_type: 'com.Text',
  ...
};
LAB.isCompData(data); //true
```

### LAB.render
类似React.createElement React.cloneElement，可传入平台组件数据或者ReactElement
```
let data = {
  ui_type: 'com.Text',
  ...
};

let element = LAB.render(data);

let data1 = <Text>xxx</Text>;
let element1 = LAB.render(data1, {
    xxx: ...
}); //这是相当于cloneElement
```

### LAB.requireImage
获取用于Image的source参数，参数可以为url或者图片相对路径
为相对路径时从当前配置的图片目录下查找，不需要扩展名
```
let foo = LAB.requireImage('foo');
let foo1 = LAB.requireImage('http://foo.jpg');
```

## 网络
* axios https://github.com/yinhangfeng/ex-axios

## 核心组件
Application
Navigation
PageContainer
Page
Popup
Toast
StatusView
HeaderBar HeaderBarItem
List
Scroll
TabBar TabBarItem
ViewPager
Form
Swiper
Button
Touchable
Dialog
Html
Image
GridView
Drawer
