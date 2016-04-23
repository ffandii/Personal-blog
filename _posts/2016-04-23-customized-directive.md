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