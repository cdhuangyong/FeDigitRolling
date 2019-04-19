# FeDigitRolling
基于three css3d数字翻页特效
## 代码示例
```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <script type="text/javascript" src="./three.min.js"></script>
    <script type="text/javascript" src="./CSS3DRenderer.js"></script>
    <script type="text/javascript" src="./tween.min.js"></script>
    <script type="text/javascript" src="./FeDigitRolling.js"></script>
</head>
<body>
    <div id="container"></div>
</body>
<script type="text/javascript">
    
    var digitRolling = new FeDigitRolling({
        container:document.getElementById("container"),
        height:200,
        width:600,
        number:112.22,
        maxWidth: 150,
        bgColor:"orange",
        gap:0,
        times:"auto",
        padding:[0,0,0,0]
    });

</script>
</html>
```
## 属性
  container： 容器
  height: 高度
  width : 宽度
  number: 要显示的数字
  maxWidth: 数字区块最大宽度
  bgColor: 数字区块背景色
  gap:数字区块间隔
  times: 数字翻转次数，默认 “auto”
## 方法
  changeValue: 修改数字，例如：digit.changeValue(324.543,6), 第二参数为需要改变的数字翻滚次数
