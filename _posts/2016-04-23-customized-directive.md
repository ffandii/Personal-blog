---
layout: post
title: "创建自定义指令"
description: "在使用一段时间的控制器和AngularJS内置的指令后，必然会进入一个新的境界，你会通过创建自己的自定义指令来教会浏览器一些新的招数，能够像jQuery那样直接操作DOM，重构应用程序以删除部分重复的代码，创建针对非开发者使用的新HTML标签。"
category: angular
tags: [AngularJS]
---
{% include JB/setup %}

<div class="p-section">
	<h3>什么是AngularJS指令</h3>
	<p>指令应该是AngularJS最强大的功能。它们是粘合程序逻辑与HTML DOM的胶水。下图展示了指令如何将AngularJS的各层架构粘合在一起：</p>
	<div class="image"><img src="../../../../../images/post/angularjs/directive1.png" width="763" height="531"/></div>
	<p>指令通过扩展和自定义浏览器处理HTML的行为，从而使应用开发者或设计师可以将精力集中在应用的业务逻辑或视觉风格上。而且指令使用的是声明式风格，而不是通过低级的编程与DOM交互。这使得开发效率更高，代码更易于维护，重要的是开发将变得更加有趣。</p>
	<p>AngularJS指令为HTML应用的标签添加了新的意义和行为。在指令内部，你可能会看到一些低级的或丑陋的代码来操纵DOM，这些代码一般使用jQuery或AngularJS's jqLite编写。如果在AngularJS之前加载jQuery，那么AngularJS会将jQuery作为DOM操作类库。否则AngularJS会假设你没有使用jQuery，它就会实现自己的简化版的jQuery，也就是常说的jqLite。指令的职责是修改DOM结构，并将作用域与DOM连接起来。这说明指令既要操作DOM，将作用域内的数据绑定到DOM，又要为DOM绑定作用域内的对应方法。</p>
</div>

<div class="p-section">
	<h3>理解内置指令</h3>
	<p>AngularJS框架提供了一组内置指令。内置指令明显包括那些自定义的HTML元素和属性，如ng-include、ng-controller和ng-click，同时也包括标准的HTML元素，如script、a、select和input。这些指令都是AngularJS核心框架默认提供的。</p>
	<p>很赞的一点是，定义内置指令所使用的API与自定义指令完全一样。内置指令与开发者自定义的指令之间并无特殊区别。所以阅读AngularJS中有关指令的源代码，是学习如何开发自定义指令的绝好办法。</p>
	<p>指令可以以HTML元素、属性、注释或CSS类等几种形式呈现。另外，任何指令都能以多种格式识别。下面的代码展示了在HTML标签中使用指令的一些示例（下面的示例并非完全恰当，具体情况根据使用方法确定）：</p>
<pre><code class="html">&lt;my-directive&gt;&lt;/my-directive&gt;
&lt;input my-directive&gt;
&lt;!-- directive: my-directive --&gt;
&lt;input class='my-directive'&gt;
</code></pre>
	<p>在javascript中定义和调用指令时，指令名称有规范，必须使用驼峰式命名，如myDirective。</p>
</div>

<div class="p-section">
	<h3>指令的编译生命周期</h3>
	<p>当AngularJS编译一个HTML模板时，它会遍历浏览器提供的DOM树，尝试参照已注册的指令集来匹配每个元素、属性、注释及CSS类。每当匹配一个指令时，AngularJS就会调用该指令的编译函数，该函数会返回一个链接函数。AngularJS会收集所有的链接函数。编译工作是在作用域创建之前进行的，所以在编译函数中没有任何可用的作用域数据。一旦所有指令编译完成，AngularJS就会创建作用域，然后通过调用每个指令的链接函数将指令和作用域连接起来。在连接阶段，作用域已经附加到指令上了，所以链接函数可以将作用域和DOM绑定起来。</p>
	<p>编译阶段通常做一些优化工作。有可能指令的几乎所有工作都会在链接函数中完成（除了一些高级任务，如访问嵌入函数）。而对于重复指令（如<code>ng-repeat</code>内部），指令的编译函数只会被调用一次，但链接函数在每次迭代时都会被调用，每次迭代对应的数据也会随之变化。</p>
	<p>下表展示了AngularJS的编译器在匹配指令时所调用的编译函数，可以看到模板中每个指令所对应的编译函数都只被调用了一次：</p>
	<div class="browser">
        <table class="browser">
            <thead>
                <tr>
                    <th>模板</th>
                    <th>编译步骤</th>
                </tr>
            </thead>
			<tbody>
				<tr>
					<td>&lt;ul my-dir&gt;<br>&lt;li ng-repeat="obj in objs" my-dir&gt;<br>&lt;/li&gt;<br>&lt;/ui&gt;</td>
					<td>myDir编译函数<br>ngRepeat编译函数<br>myDir编译函数</td>
				</tr>
				<tr>
				</tr>
			</tbody>
        </table>
    </div>
	<p>下表则展示了模板转义为最终的HTML时所调用的链接函数。可以看到在重复指令的每一次迭代中都会调用链接函数。如果指令中有一些不依赖于作用域数据的复杂功能，那么这些功能应该放在编译函数中，这样功能就只会被调用一次。</p>
	<div class="browser">
        <table class="browser">
            <thead>
                <tr>
                    <th>HTML</th>
                    <th>链接步骤</th>
                </tr>
            </thead>
			<tbody>
				<tr>
					<td>&lt;ul my-dir&gt;<br>&lt;-- ng-repeat="obj in objs" --&gt;<br>&lt;li my-dir&gt;&lt;/li&gt;<br>&lt;li my-dir&gt;&lt;/li&gt;<br>&lt;li my-dir&gt;&lt;/li&gt;<br>&lt;/ui&gt;</td>
					<td>myDir链接函数<br>ngRepeat链接函数<br>myDir链接函数<br>myDir链接函数<br>myDir链接函数</td>
				</tr>
				<tr>
				</tr>
			</tbody>
        </table>
    </div>
</div>

<div class="p-section">
	<h3>定义指令</h3>
	<p>每个指令都必须注册在模块（module）上。定义指令的方法是在模块上调用<code>directive()</code>方法，调用方法时需要传递指令的标准名称和一个返回指令定义的工厂函数。</p>
<pre><code class="javascript">angular.module('app',[]).directive('myDir',function(){
   return myDirectionDefinition;
});
</code></pre>
	<p>工厂函数可以注入服务以便指令使用。指令定义是一个对象，它包含的字段告诉编译器该指令要做什么。其中一些字段是声明式的（如replace:true，这个字段告知编译器使用模板替换原有的元素）。而有些字段则是命令式的（如link:function(...)，这个字段为编译器提供了链接函数）。下表展示了指令定义中可以使用的所有字段：</p>
	<div class="browser">
        <table class="browser">
            <thead>
                <tr>
                    <th>字段</th>
                    <th>描述</th>
                </tr>
            </thead>
			<tbody>
				<tr>
					<td>name</td>
					<td>指令名称</td>
				</tr>
				<tr>
					<td>restrict</td>
					<td>指令可以使用哪种标签形式</td>
				</tr>
				<tr>
					<td>priority</td>
					<td>提示编译器该指令执行的顺序（优先级）</td>
				</tr>
				<tr>
					<td>terminal</td>
					<td>编译器是否在该指令之后继续编译其他指令</td>
				</tr>
				<tr>
					<td>link</td>
					<td>定义该指令与作用域连接起来的链接函数</td>
				</tr>
				<tr>
					<td>template</td>
					<td>用于生成指令标签的字符串</td>
				</tr>
				<tr>
					<td>templateUrl</td>
					<td>指向指令模板的URL地址</td>
				</tr>
				<tr>
					<td>replace</td>
					<td>是否用模板内容替换现有的元素</td>
				</tr>
				<tr>
					<td>transclude</td>
					<td>是否为指令模板和编译函数提供指令元素中的内容</td>
				</tr>
				<tr>
					<td>scope</td>
					<td>是为指令创建一个子作用域还是一个独立作用域</td>
				</tr>
				<tr>
					<td>controller</td>
					<td>一个作为指令控制器的函数</td>
				</tr>
				<tr>
					<td>require</td>
					<td>设置要注入到当前指令链接函数中的其他指令的控制器</td>
				</tr>
				<tr>
					<td>compile</td>
					<td>定义编译函数，编译函数会操作原始DOM，而且会在没有提供link设置的情况下创建链接函数。</td>
				</tr>
			</tbody>
        </table>
    </div>
</div>

<div class="p-section">
	<h3>使用指令修改按钮样式</h3>
	<p>一个典型bootstrap中的按钮使用如下标签格式：</p>
<pre><code class="html">&lt;button type="submit" class="btn btn-primary btn-large"&gt;click me&lt;/button&gt;
</code></pre>	
	<p>记住这些类名既费时又容易出错。我们可以定义一个指令，让按钮的使用变得既简单又实用。下面来看这个指令应该如何实现，代码如下：</p>
<pre><code class="javascript">myModule.directive('button',function(){
   return {
      restrict : 'E',
	  compile : function(element, attrs){
	     element.addClass('btn');
		 if(attrs.type="submit"){
		    element.addClass('btn-primary');
		 }
		 if(attrs.size){
		    element.addClass('btn-'+attrs.size);
		 }
	  }
   };
});
</code></pre>
	<p>我们的指令名称是<code>'button'</code>，它被限制只能以元素形式出现（restrict:'E'）。这表示该指令会在AngularJS编译器遇到任何按钮时被调用。实际上，我们是在给HTML button添加自定义的行为。该指令的剩余部分是一个编译函数，编译函数传递了一个element的参数，这个参数是一个jQuery对象，引用了指令对应的DOM元素，在本例中是一个Button元素。在编译函数中，我们只是简单的根据元素的属性值给元素追加CSS类。可以使用注入的属性参数来获取元素的属性值。在这个指令中，可以在编译函数中执行完所有的操作，完全没有使用链接函数，这是因为我们对元素的修改完全没有依赖于绑定在元素上的作用域数据。也可以将这些功能都挪到链接函数中，这样如果按钮出现在<code>ng-repeat</code>中，每次迭代都会调用addClass方法。有关循环指令中链接函数的执行次数问题，参见上文。</p>
</div>

<div class="p-section">
	<h3>理解AngularJS的组件指令</h3>
	<p>指令最强大的功能之一就是能让你创建自己的领域特定标签。换句话说，你能创建自定义的元素和属性，然后在你的应用所限定的特定领域内，为相应HTML标签赋予新的语义和行为。例如，类似于标准的HTML标签，你可以创建一个<code>&lt;user&gt;</code>元素来显示用户信息，或者创建一个<code>&lt;g-map&gt;</code>元素来与Google地图交互。这种创造的可能性是无穷无尽的，随之而来的好处是你的标签完全匹配你的开发领域。</p>
</div>