---
layout: post
title: "理解AngularJS的内部运作机制"
description: "想要理解AngularJS应用的性能特征，需要掀开框架的盖子看看里面。熟悉AngularJS内部结构的运作机制，就能通过分析应用场景和具体代码，找出影响应用性能的最主要问题。"
category: Angular
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
</div>