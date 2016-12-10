---
layout: post
title: "创建高级指令"
description: "理解嵌入函数和嵌入作用域的用法；定义自己的指令控制器来实现指令之间的协调，理解指令控制器和链接函数之间的区别；终止并接管指令编译的过程:动态加载自定义模板，以及使用$compile和$interpolate服务。"
category: MEAN框架
tags: [AngularJS]
---
{% include JB/setup %}

<div class="p-section">
	<h3>使用嵌入</h3>
	<p>当元素从DOM中的一个地方移动到另一个地方时，必须要说明与其关联的作用域应该如何变化。简单直接的办法是为该元素关联新位置定义的新作用域，但这样可能会影响到应用逻辑，因为元素无法再访问原始作用域中的数据。我们真正需要的是“嫁鸡随鸡，嫁狗随狗”。这种移动时将其关联作用域也一并移动的做法称为嵌入。</p>
	<h4>在指令中使用嵌入</h4>
	<p>当一个指令的原始标签内容被新元素替换，但同时又需要在新元素的某些地方用到原始内容时，就必须使用嵌入。例如，<code>ng-repeat</code>指令会嵌入和克隆它的原始元素，它会按照列表迭代次数复制出多个嵌入元素的副本。每一个副本都关联一个新的作用域，该作用域是原始作用域的子作用域。</p>
	<p><code>ng-repeat</code>指令比较特殊，它先克隆了自己的副本，然后才进行嵌入。嵌入最常见的做法是创建一个有模板的指令，然后在模板中的某个位置嵌入原有元素的内容。这类使用模板组件的指令，最简单的就是alert指令，如下图所示：</p>
	<div class="image"><img src="../../../../../images/post/angularjs/alert.png" width="721" height="296"/></div>
	<p>alert元素的内容包含在alert指令中要显示的信息。这种情况就要将alert嵌入指令模板中。要显示一组提示信息，可以使用<code>ng-repeat</code>指令：</p>
<pre><code class="html">&lt;alert type="alert.type" close="closeAlert($index)" ng-repeat="alert in alerts"&gt;
   &#123;&#123;alert.msg&#125;&#125;
&lt;/alert&gt;
</code></pre>
	<p>代码中的<code>close</code>属性包含一个表达式，该表达式会在用户点击关闭时关闭<code>alert</code>时执行，实现该指令非常简单，代码如下：</p>
<pre><code class="javascript">myModule.directive('alert', function(){
   return {
      restrict: 'E',
	  replace: true,
	  transclude: true,
	  template: 
	     '&lt;div class="alert alert-&#123;&#123;type&#125;&#125;"&gt;'+
		    '&lt;button type="button" class="close"'+
			   'ng-click="close()"&gt;&times;'+
		    '&lt;/button>'+
		    '&lt;div ng-transclude&gt;&lt;/div&gt;'+
		'&lt;/div>',
	scope: { type:'=', close: '&' }
   };
});
</code></pre>
	<p><code>replace</code>属性会告诉编译器使用<code>template</code>字段所提供的模板来替换原始的指令元素。如果只提供<code>template</code>但没有定义<code>replace</code>，那么编译器就会将模板追加到指令元素中。当我们要求编译器使用模板替换指令元素时，编译器同时会将原始元素上的所有属性复制到模板元素上。</p>
	<h4>理解指令定义中的transclude属性</h4>
	<p><code>transclude</code>属性的值要么是<code>true</code>,要么是<code>element</code>。这个属性告诉编译器取出原始<code>alert</code>元素的内容，保证其在嵌入模板时可用。</p>
	<ul>
	   <li>1. 使用<code>transclude: true</code>表示指令元素的内容（子元素）会被嵌入。<code>alert</code>指令就是这种嵌入模式，我们使用模板替换子指令元素，然后嵌入原始元素内容。<li>
	   <li>2. 使用<code>transclude: element</code>表示整个元素会被嵌入，包括哪些尚未编译的属性指令，<code>ng-repeat</code>指令就是这种模式。</li>
	</ul>
	<p><code>ng-transclude</code>指令会得到嵌入元素，然后将嵌入元素追加到模板元素中<code>ng-transclude</code>所在的位置。这是嵌入最简单、最常用的做法。</p>
	<h4>理解嵌入作用域</h4>
	<p>所有经过AngularJS编译的DOM元素都会有一个与之关联的作用域。大多数情况下，DOM元素的关联作用域都不是该元素直接定义的，而是从它的祖先元素那里继承而来。在指令定义时指定<code>scope</code>属性会创建一个新的作用域。只有少数核心指令定义了新的作用域，具体包括<code>ng-controller</code>、<code>ng-repeat</code>、<code>ng-include</code>、<code>ng-view</code>和<code>ng-switch</code>。这些指令全部创建了从父作用域原型继承而来的子作用域。</p>
	<p>指令元素的原始内容，将会被插入到模板中，他需要与指令的原始作用域关联起来，而且该作用域不是独立作用域，通过嵌入原始元素，就可以为模板元素提供一个正确的作用域。上述示例中的<code>alert</code>指令是一个组件，使用独立作用域。在该指令尚未被编译之前，DOM和作用域看起来会是这样的：</p>
<pre><code class="html">&lt;!-- 定义$rootScope --&gt;
<div ng-app ng-init=" type='success'"&gt;
   &lt;!-- 绑定$rootScope --&gt;
   &lt;div&gt;&#123;&#123;type&#125;&#125;&lt;/div&gt;
   &lt;alert type="'info'"&gt;Look at {{type}}&lt;/alert&gt;
&lt;/div&gt;
</code></pre>	
	<p><code>&lt;div&gt;&#123;&#123;type&#125;&#125;&lt;/div&gt;</code>元素没有在自己上面直接定义作用域，相反，它悄悄的绑定到了<code>$rootScope</code>上，因为它是<code>ng-app</code>元素的子元素。<code>ng-app</code>元素定义了<code>$rootScope</code>。在<code>alert</code>元素上面有一个属性：<code>type="'info'"</code>。该属性被映射到了模板元素作用域的<code>type</code>属性上。一旦<code>alert</code>指令被编译，该元素就会被它的模板替换，编译后DOM和作用域如下：</p>
<pre><code class="html">&lt;!-- 定义$rootScope --&gt;
&lt;div ng-app ng-init=" type='success'"&gt;
   &lt;!-- 绑定$rootScope --&gt;
   &lt;div&gt;&#123;&#123;type&#125;&#125;&lt;/div&gt;
   &lt;!-- 定义独立作用域 --&gt;
   &lt;div class="alert-&#123;&#123;type&#125;&#125;"&gt;
      &lt;!-- 绑定独立作用域 --&gt;
	  &lt;button&gt;...&lt;/button&gt;
	  &lt;div ng-transclude&gt;
	     &lt;!-- 定义新的嵌入作用域 --&gt;
		 &lt;span&gt;Look at &#123;&#123;type&#125;&#125;&lt;/span&gt;
	  &lt;/div&gt;
   &lt;/div&gt;
&lt;/div&gt;
</code></pre>
	<p>嵌入作用域是一个继承自<code>$rootScope</code>的子作用域。当元素被嵌入模板中的某个位置时，它们会带着之前绑定在它们身上的原始作用域一起迁移。更准确的说法是，嵌入元素会绑定一个新的作用域，而该作用域原型继承自该元素当初诞生地的作用域。</p>
</div>

<div class="p-section">
	<h3>理解指令控制器</h3>
	<p>AngularJS中的指令控制器是一个附属于DOM元素的对象，主要用于初始化工作及为元素所在的作用域添加行为。指令控制器是控制器的一种特殊形式，它由某个指令定义出来，每当指令在DOM中出现，该控制器就会实例化一次。指令控制器的职责是负责初始化工作并为指令（而不是作用域）提供交互行为。可以使用指令定义对象中的<code>controller</code>对象定义一个指令控制器。<code>controller</code>属性的值可以是一个字符串，该字符串时已经在模块上定义好的控制器的名称，代码如下：</p>
<pre><code class="javascript">myModule.directive('myDirective',function(){
   return {
      controller: 'myDirectiveController'
   };
});
myModule.controller('MyDirectiveController',function($scope){
   //...
});
</code></pre>
	<p><code>controller</code>属性也可以是一个用来实例化控制器的构造函数，代码如下：</p>
<pre><code class="javascript">myModule.directive('myDirective',function(){
   return {
      controller: function($scope,$element,$attrs){
	     //...
	  }
   };
});
</code></pre>
	<h4>为指令控制器注入特殊依赖</h4>
	<p>和控制器一样，AngularJS为指令控制器注入了依赖关系。所有控制器都被注入了<code>$scope</code>，你可以定义其他需要被注入的服务，如<code>$timeout</code>或<code>$rootScope</code>。除了上面这些，指令控制器还可以注入以下三个特殊的服务：</p>
	<ul>
		<li>1. <code>$element</code>：对指令DOM元素的引用，是一个被jQLite或jQuery包裹的对象。</li>
		<li>2. <code>$attrs</code>：出现在指令DOM元素上的属性列表。</li>
		<li>3. <code>$transclude</code>：绑定在当前作用域上的嵌入函数。</li>
	</ul>
	<h4>创建一个基于指令控制器的分页指令</h4>
	<p>指令控制器和链接函数在功能上有很大的重叠，我们经常用控制器来替代链接函数，接下来编写一个分页指令，这次我们使用指令控制器替代链接函数，代码如下：</p>
<pre><code class="javascript">myModule.directive('pagination',function(){
   return {
      restrict: 'E',
	  scope: { numPages: '=', currentPage: '=', onSelectPage: '&' },
	  templateUrl: 'template/pagination.html',
	  controller: ['$scope','$element','$attrs',function($scope, $element, $attrs){
	     $scope.$watch('numPages',function(value){
		    $scope.pages = [];
			for(var i=1;i<=value;i++){
			   $scope.$pages.push(i);
			}
			if($scope.currentPage>value){
			   $scope.selectPage(value);
			}
			$scope.noPrevious = function(){
			   return $scope.currentPage === 1;
			};
			//...
		 })
	  }]
	  //...
   };
});
</code></pre>
	<p>在这个例子中，使用链接函数和使用指令控制器的唯一区别是，链接函数载入了scope, element, attrs和controller的参数，而指令控制器则需要自己来载入。</p>
	<h4>理解指令控制器和链接函数的区别</h4>
	<p>当你使用指令控制器或者链接函数时，理解它们的区别很有帮助。</p>
	<p>首先，指令控制器必须使用以来注入来指定他所需要的服务，而链接函数则永远被传入四个相同的参数。</p>
	<p>指令控制器和链接函数是在编译过程中的不同时间被调用的，如果在一个元素上包含多条指令，那么编译顺序如下：</p>
	<ul>
		<li>1. 按需创建作用域。</li>
		<li>2. 实例化每个指令的指令控制器。</li>
		<li>3. 调用每个指令的预链接函数。</li>
		<li>4. 所有子元素完成链接。</li>
		<li>5. 调用每个指令的链接函数。</li>
	</ul>
	<p>这意味着一个指令控制器被实例化时，该指令的指令元素和子元素尚未完全链接，但当链接函数被调用时，该元素的所有指令控制器都已经完成了实例化。这也就是指令控制器为什么可以被当成参数传递给链接函数的原因。</p>
</div>