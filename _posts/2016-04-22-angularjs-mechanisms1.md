---
layout: post
title: "理解AngularJS的内部运作机制1"
description: "想要理解AngularJS应用的性能特征，需要掀开框架的盖子看看里面。熟悉AngularJS内部结构的运作机制，就能通过分析应用场景和具体代码，找出影响应用性能的最主要问题。"
category: MEAN框架
tags: [AngularJS]
---
{% include JB/setup %}

<div class="p-section">
	<h3>AngularJS不是基于字符串的模板引擎</h3>
	<p>查看AngularJS的简单示例代码，就会有一个基本印象：AngularJS又是一个客户端模板引擎。没错，来看看下面的代码：</p>
<pre><code class="html">Hello, &#123;&#123;name&#125;&#125;!
</code></pre>
	<p>AngularJS的代码与其他一些常规的模板系统看上去并无二致，只有在添加了<code>ng-model</code>指令后，它们之间的区别才变得明显：</p>
<pre><code class="html">&lt;input ng-model="name"&gt;
Hello, &#123;&#123;name&#125;&#125;!
</code></pre>
	<p>只需要如上所述的代码，DOM就会根据用户的输入实时更新，无需开发者做任何干预。刚开始见识双向数据绑定的效果会觉得很神奇。毋庸置疑，AngularJS使用了非常可靠的算法为DOM树赋予了生命！</p>
</div>

<div class="p-section">
	<h3>理解ngModelController</h3>
	<p>AngularJS的ngModel.NgModelController是非常强大的。但是它的<code>$formatters</code>和<code>$renders</code>以及<code>$parsers</code>又让它有点琢磨不清。<code>ng-model</code>是Angular里面进行双向数据绑定到控件的。但是如果你想使用自定义控件来绑定复杂的数据？或者你想用多个字段绑定一个数据？该怎么办？ngModelController就是为这种场景准备的。ngModelController有以下一些优点：</p>
	<ul>
		<li><span class="icon fa fa-cube"></span>允许用户在<code>ng-model</code>上设置验证器。</li>
		<li><span class="icon fa fa-cube"></span>可以将基础的底层模型或者复杂的视图模型转换成ngModelController。</li>
		<li><span class="icon fa fa-cube"></span>允许用户监视一个变量是否发生改变或者是否是脏数据。</li>
		<li><span class="icon fa fa-cube"></span>封装整洁，自包含。</li>
	</ul>
	<p>在以下场景你可以使用ngModelController：</p>
	<ul>
		<li><span class="icon fa fa-cube"></span>你需要通过复杂的接口将数据绑定到<code>ng-model</code>。</li>
		<li><span class="icon fa fa-cube"></span>你需要渲染一个和UI表现不一样的底层数据，比如日历控件。</li>
		<li><span class="icon fa fa-cube"></span>你想要使用一个特定的数据验证器，比如一个在确定时间范围内的时间数据。</li>
	</ul>
	<p>为了将数据格式化为特定格式以便修改，并且能够变回原格式。ngModelController添加<code>$modelValue</code>、<code>$viewValue</code>和directive本地scope作用域。这意味着有以下几个变量：</p>
	<ul>
		<li><span class="icon fa fa-cube"></span>真实的变量。</li>
		<li><span class="icon fa fa-cube"></span>ngModelController.$modelValue - 内部用来和真实变量同步的变量，进而连接到<code>ng-model</code>。</li>
		<li><span class="icon fa fa-cube"></span>scope变量，用来将你的数据绑定到directive，通常是ngModelController.$viewValue的副本。</li>
	</ul>
	<p>下图是这些变量的位置：</p>
	<div class="image"><img src="http://ffandii.github.io/Personal-blog/images/post/angularjs/ngModel1.png" width="797" height="328"/></div>
	<p>ngMoelController使用以下处理同步它们：</p>
	<div class="image"><img src="http://ffandii.github.io/Personal-blog/images/post/angularjs/ngModel2.png" width="800" height="597"/></div>
	<p>magic环节指Angular的digest环节，看起来有些复杂，我们通过一个例子一点一点展示它的工作过程。</p>
</div>

<div class="p-section">
	<h3>例子：颜色选择器</h3>
	<p>下面这个颜色选择器的例子可以解释整个原理。这个例子允许用户选择None或者Red/Green/Blue三个颜色通道。它们在底层是一个单一变量，但是在接口上是三个选择框，<a href="http://jsfiddle.net/cox0sba1/">演示例子</a>。</p>
	<div class="image"><img src="http://ffandii.github.io/Personal-blog/images/post/angularjs/colorSelect.png" width="419" height="389"/></div>
	<p>我们使用两个颜色选择器directive的实例，使用ngModelController来将三通道的颜色变成用户看得见的颜色(R,G,B)，并且在底层使用一个字符串变量来表现，同时绑定到<code>ng-model</code>。</p>
	<p>定义Angular module的命名空间RadifyExample：</p>
<pre><code class="js">angular.module('RadifyExample',[]);
</code></pre>	
	<p>在所有控制器里面做的是设置前景(foreground)和背景(background)的颜色。</p>
<pre><code class="javascript">.controller('ColorPickerController', function($scope){
   $scope.background = 'F00';
   $scope.foreground = '000;
});
</code></pre>
	<p>HTML代码段</p>
<pre><code class="html">&lt;div ng-app="RadifyExample" ng-controller="ColorPickerController"&gt;
   &lt;h1&gt;Colours&lt;&#47;h1&gt;
   &lt;label&gt;
      Foreground
	  &lt;colour-picker ng-model="foreground"&gt;&lt;&#47;colour-picker&gt;
   &lt;&#47;label&gt;
   &lt;label&gt;
      Background
	  &lt;colour-picker ng-model="background"&gt;&lt;&#47;colour-picker&gt;
   &lt;&#47;label&gt;
   &lt;div style="background:#&#123;&#123;background&#125;&#125;;foreground:#&#123;&#123;foreground&#125;&#125;"&gt;
      results
   &lt;&#47;div&gt;
&lt;&#47;div&gt;
</code></pre>	

	<p>在控制器中，前景色和背景色的两个变量通过<code>ng-model</code>和一个自定义的颜色directive绑定在一起。然后我们在一个小div区域中渲染用户选择的前景和背景颜色。</p>
	<P>指令的用法。首选使用一个简单的模板来显示三个directive组件。</p>
<pre><code class="javascript">.directive('colourPicker',function(){
   var tpl = "&lt;div> \ 
      R &lt;select ng-model="red"&gt; \ 
	     &lt;option value="F"&gt;Lots&lt;&#47;option&gt;
		 &lt;option value="A"&gt;Some&lt;&#47;option&gt;
		 &lt;option value="0"&gt;None&lt;&#47;option&gt;
	  &lt;&#47;select&gt; \ 
	  G &lt;select ng-model="green"&gt; \ 
	     &lt;option value="F"&gt;Lots&lt;&#47;option&gt;
		 &lt;option value="A"&gt;Some&lt;&#47;option&gt;
		 &lt;option value="0"&gt;None&lt;&#47;option&gt;
	  &lt;&#47;select&gt; \ 
	  B &lt;select ng-model="blue"&gt; \ 
	     &lt;option value="F"&gt;Lots&lt;&#47;option&gt;
		 &lt;option value="A"&gt;Some&lt;&#47;option&gt;
		 &lt;option value="0"&gt;None&lt;&#47;option&gt;
	  &lt;&#47;select&gt; \ 
   &lt;&#47;div&gt;";
});
</code></pre>	

	<p>然后，我们做一些初始化工作，我们通过限制<code>restrict</code>为E表示元素。分配模板并且创建一个隔离的<code>scope</code>，下一步<code>require('ngModel')</code>，从而启用了所有ngModelController的功能。</p>
<pre><code class="javascript">return {
   restrict : 'E',
   template : 'tpl',
   scope : {},
   require : 'ngModel
};
</code></pre>
	<p>下面我们真正去link函数中写代码</p>
<pre><code class="javascript">link : function(scope, element, attrs, ngModelCtrl){
}
</code></pre>
	<p>在link函数里面，我们会做很多事情。首先我们设置formatters（用来将model value转化为view value）。</p>
<pre><code class="javascript">ngModelCtrl.formatters.push(function(modelValue){
   var colours = modelValue.split('');
   return {
      red : colours[0],
	  green : colours[1],
	  blue : colours[2]
   };
});
</code></pre>
	<p>Formatters可以是一堆函数链（一个存放函数的数组）。我们仅仅使用一个，我们返回一个对象，然后用它们来设置$viewValue。</p>
<pre><code class="javascript">ngModelCtrl.$render = function(){
   scope.red = ngModelCtrl.$viewValue.red;
   scope.green = ngModelCtrl.$viewValue.green;
   scope.blue = ngModelController.$viewValue.blue;
};
</code></pre>
	<p><code>$render</code>函数用来获取用来获取<code>$viewValue</code>中的变量并将它们设置到本地<code>scope</code>。换句话说，它们是将<code>$viewValue</code>中的变量渲染到屏幕上。这意味着在directice的UI中，我们可以控制red/green/blue三种颜色。我们在这里所做的所有事情就是获取view value然后将它推送到本地<code>scope</code>，从而改变HTML上渲染的颜色。</p>
<pre><code class="javascript">scope.$watch('red+green+blue', function(){
   ngModelCtrl.$setViewValue({
      red : scope.red,
	  green: scope.green,
	  blue : scope.blue
   });
});
</code></pre>
	<p>我们已经告诉<code>scope</code>去关注我们设置的这三个变量。当其中任何一个发生变化的时候，Angular会在下一个<code>$digest</code>周期中设置ngModelCtrl中的viewValue，保持端口时效性和所有数据同步。</p>
	<p>设置<code>$parsers</code>，将viewValue转化为modelValue。</p>
<pre><code class="javascript">ngModelCtrl.$parsers.push(function(viewValue){
   return '#'+[viewValue.red, viewValue.green, viewValue.blue];
});
</code></pre>
	<p>当你改变了<code>select</code>字段中的任何一个值的时候，它会同步修改<code>scope</code>变量，在标准angular中它会触发如下事件：</p>
	<div class="image"><img src="http://ffandii.github.io/Personal-blog/images/post/angularjs/ngModel3.png" width="778" height="581"/></div>
	<ul>
		<li>1. scope变量发生变化。</li>
		<li>2. 监视函数获取到scope变量变化的数据。</li>
		<li>3. 监视函数调用$setViewValue这个变量，$setViewValue是用来设置$viewValue的。</li>
		<li>4. $viewValue的变化引起$parsers处理链（parser chain）。</li>
		<li>分析处理链更新底层的$modelValue。</li>
		<li>一些Angular的magic环节。</li>
		<li>真实的模型更新，所有数据同步。</li>
	</ul>
	<p>当directive外面的一些操作改变了真实的变量，下面的一系列事件将被触发从而同步数据：</p>
	<div class="image"><img src="http://ffandii.github.io/Personal-blog/images/post/angularjs/ngModel4.png" width="786" height="589"/></div>
	<ul>
		<li>1. ngModelController外面的真实数据模型发生了变化。</li>
		<li>2. Angular通知ngModelController模型发生了变化。</li>
		<li>3. ngModelController更新$modelValue。</li>
		<li>4. $formatters链被触发，将$modelValue转化为$viewValue。</li>
		<li>5. 因为$viewValue更新了，$render函数被触发。</li>
		<li>6. $render函数更新scope变量。</li>
		<li>7. watch函数获取获取scope中变化的变量。</li>
		<li>8. watch函数调用$setViewValue从而改变$viewValue。</li>
		<li>9. $viewValue的改变触发$parsers链。</li>
		<li>10. parsers链更新底层的$modelValue。</li>
		<li>11. 一些angular magic触发。</li>
		<li>12. 真实模型被触发，所有数据同步完成。</li>
	</ul>
</div>