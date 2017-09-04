# lab4 样式系统
## lab4/core/lab/StyleManager
StyleManager 管理工程style文件夹下的样式文件
### StyleManager.getStyles(compName, styleClass)
通过给定组件名和样式名获取对应的样式表
```javascript
import { getStyles } from 'lab4/core/lab/StyleManager';
const styles = getStyles('com.Button', 'default');
```

## lab4/core/BaseComponentMixin
Page LAB.Component LAB.PureComponent 实现了BaseComponentMixin
所以具有 BaseComponentMixin 的所有功能

### getStyle(styleName)
将 defaultStyles[styleName] props.styles[styleName] StyleManager.getStyles(compName, styleClass)[styleName]
组合之后返回, 所以优先级为 style_class > props.styles > defaultStyles

## 规范
### defaultStyles
* 推荐将 defaultStyles 设置为组件的静态变量
```javascript
class XXX extends LAB.Component {
  ...
}
const styles = StyleSheet.create({...});
XXX.defaultStyles = styles;
```

### style_class
* style_class 使用小写字母数据与 '-' 分割
```
default
outline
success-outline
```

## 父子组件style_class 传递
* 如果一个组件纯粹是另一个组件的包装扩展 则建议将style_class 直接传递给其子组件 将样式写在style中子组件的目录下
假设 LoginButton extends Button
* 如果要给内部的某一个子组件传递style_class 则建议在父组件设置 xxx_style_class 的属性 xxx为该子组件所在的组成成分名
如 right_button_style_class left_label_style_class





