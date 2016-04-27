---
layout: post
title: "理解AngularJS的内部运作机制2"
description: "当AngularJS首次向公众发布时，就有许多关于它的模型变化监控算法的“阴谋论”。其中最被津津乐道的一种是，怀疑AngularJS使用了某种轮询机制。这种机制可能是每隔一小段时间就去检查模型值的变化，如果发现变化，就重绘DOM，所有这些猜测都是错误的。"
category: AngularJS
tags: [AngularJS]
---
{% include JB/setup %}

<div class="p-section">
	<h3>$scope.$apply——打开AngularJS世界的钥匙</h3>
	<p>AngularJS没有使用任何形式的轮询算法来定期检查模型变化。AngularJS的模型变化监控机制背后的思想其实是“善后”，因为引发模型变化的情况是有限的（数得出来的），这些情况包括：</p>
	<ul>
		<li>1. DOM事件（例如用户修改了input的值，然后点击一个按钮，调用一个javascript函数或者执行其他操纵）</li>
		<li>2. XHR响应触发回调</li>
		<li>3. 浏览器的地址发生变化</li>
		<li>4. 计时器（<code>setTimeout</code>、<code>setInterval</code>）触发回调</li>
	</ul>
	<p>的确，如果上面的任何一种情况都未发生，那么监控模型的变化是没有意义的。此时页面上什么事情也没有发生，模型也没有变化，重绘DOM也就毫无必要。AngularJS只会在被明确告知的情况下启动它的模型监控机制，为了让这种复杂的机制运作起来，需要在<code>scope</code>上调用<code>$apply</code>方法。回到之前的simple-model指令，可以在input值每次发生变化时执行<code>$apply</code>方法（这样每次按键的变化都会传播给模型，这也是<code>ng-model</code>指令的默认行为）。</p>
<pre><code class="javascript">.directive('simpleModel',function($parse){
   return function(scope, element, attrs){
      var modelGetter = $parse(attrs.simpleModel);
	  var modelSetter = modelGetter.assgin;
	  scope.$watch(modelGetter, function(newVal, oldVal){
	     element.val(newVal);
	  });
	  element.bind('input', function(){
	     scope.$apply(function(){
		    modelSetter(scope, element.val());
		 });
	  });
   };
});
</code></pre>
	<p>或者，也可以修改默认的策略，只在用户光标离开输入框的时候才传播模型变化：</p>
<pre><code class="javascript">//从DOM更新model
element.bind('blur', function(){
   scope.$apply(function(){
      modelSetter(scope, element.val());
   });
});
</code></pre>
	<p>不论采用哪种策略，最重要的一点是模型变化监控机制需要被明确告知在何时启动。使用AngularJS的内置指令时，我们完全无需调用$apply方法，就可以看到很多“奇迹”，这一点很让人惊讶。但实际上，内置指令的实现代码中调用了$apply方法。也就是说，标准的指令和服务已经帮我们处理好了模型变化的监控工作（<code>$http</code>、<code>$timeout</code>、<code>$location</code>等）。当在一个作用域上调用<code>$apply</code>方法后，AngularJS就会启动模型变化监控机制。在网络通信、DOM事件、javascript计时器或浏览器地址发生变化后，AngularJS标准的服务和指令内就会调用<code>$apply</code>方法。</p>
	
</div>

<div class="p-section">
	<h3>深入$digest循环</h3>
	<p>在AngularJS的术语中，把检测模型变化的过程称为<code>$digest</code>循环。这个名称来源于<code>Scope</code>实例上的<code>$digest</code>方法。这种方法被作为<code>$apply</code>中的重要一步来调用，它会检测注册在所有作用域上的监视对象。为什么AngularJS中要有<code>$digest</code>循环呢？它又是如何判断模型变化的？<code>$digest</code>循环的存在主要是解决以下两类问题：</p>
	<ul>
		<li>1. 判断模型的哪些部分发生了变化，以及DOM中的哪些属性应该被更新。这一步的目的是让检测模型变化的过程对开发者保持尽可能的简单。在开发时，我们只需要修改属性值，之后指令会自动找到网页中哪些部分应该被重绘。</li>
		<li>2. 减少不必要的重绘以提升应用性能，避免UI闪烁，为了实现这一点，AngularJS会尽量将DOM重绘推迟到最后一刻，此时模型已经趋于稳定。</li>
	</ul>
	<p>要理解AngularJS如何实现这种效果，首先要明白web浏览器只有一个UI线程。浏览器中要有其他线程（如负责网络相关操作的线程），但是只有一个线程用于渲染DOM元素、监视DOM事件，以及执行javascript代码。浏览器不停的在javascript执行环境和DOM渲染环境之间切换。</p>
	<p>AngularJS确保在将控制权交还给DOM渲染环境时，所有的模型值都已完成运算且“稳定”。这种方法保证了UI一次性重绘完成，而不是为了响应某个单独的模型变化而不停的重绘。这保证了更快的执行速度和更好的视觉效果。</p>
	<h4>解剖$watch</h4>
	<p>AngularJS使用脏检测机制来判断某个模型值是否真正发生了变化。脏检测机制是将之前保存的模型值和能导致模型变化的事件发生后计算的新模型值对比。注册一个新的模型监视基本语法如下：</p>
<pre><code class="javascript">$scope.$watch(watchExpression, modelChangeCallback){
};
</code></pre>
	<p>当作用域上添加一个新的<code>$watch</code>时，AngularJS会运算<code>watchExpression</code>表达式，然后在内部将运算所得的值保存起来，紧接着进入<code>$digest</code>循环，<code>watchExpression</code>会再次被运算，运算所得的新值会和之前保存的值进行对比，回调只会在新值与旧值不同时执行，这个新值会被保存起来以备下一次使用，整个过程可以一直持续下去。作为开发者，我们对自己手动注册的监视很清楚。但是我们要明白任何指令（AngularJS的内置指令和第三方指令）都可以设置自己的监视，任何插值表达式都会在作用域上注册一个新的监视。</p>
	<h4>模型的稳定性</h4>
	<p>如果模型上的任何一个监视器都检测不到任何变化，AngularJS就会认为该模型是稳定的（此时就可以进行UI渲染工作了）。只要有一个监视变化，就足以使整个<code>$digest</code>变脏，迫使AngularJS进入下一轮循环。AngularJS会持续执行<code>$digest</code>循环，反复运算所有作用域上的所有监视，直到没有任何变化为止。连续几轮<code>$digest</code>循环是很有必要的，因为模型监视回调会有一些副作用。如果只是简单的设置一个回调，当监视的模型值变化时执行，那就可能改变我们已经运算过且认为稳定的模型。</p>
	<h4>不稳定的模型</h4>
	<p>有些情况下，<code>$digest</code>执行两次循环也不足以确定模型的稳定性。更糟糕的是，有可能永远无法确定模型稳定性的情况！我们来看下面的例子：</p>
<pre><code class="html"><span>Random value: {{random()}}</span>
</code></pre>
	<p><code>random()</code>函数定义如下：</p>
<pre><code class="javascript">$scope.random = Math.random;
</code></pre>
</div>

