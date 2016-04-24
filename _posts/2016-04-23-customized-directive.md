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
	<h4>编写一个分页指令</h4>
	<p>我们经常会笨拙地将大量的任务列表或待办事项一股脑地放在一页中显示。可以使用分页来将尝尝的列表分割成一组更易于管理的页面。在网页中使用分页模块是一种很通用的做法。Bootstrap CSS库提供了一个简洁美观的分页组件，如下图所示：</p>
	<div class="image"><img src="../../../../../images/post/angularjs/pagination.png" width="569" height="78"/></div>
	<p>接下来将会为这个分页模块编写一个可复用的组件指令，这样在使用时就无需考虑分页组件的具体细节，分页指令的标签代码将会是下面这样子的：</p>
<pre><code class="html">&lt;pagination num-pages="tasks.pageCount" current-page="tasks.currentPage"&gt;
&lt;/pagination&gt;
</code></pre>	
	<h4>在指令中使用HTML模板</h4>
	<p>分页组件需要我们生成一些HTML标签来替换指令标签。最简单的办法是为指令使用模板。分页组件的模板代码如下：</p>
<pre><code class="html">&lt;ul&gt;
   &lt;li ng-class="&#123;disabled: noPrevious()&#125;"&gt;
      &lt;a ng-click="selectPrevious"&gt;Previous&lt;/a&gt;
   &lt;/li&gt;
   &lt;li ng-repeat="page in pages" ng-class="&#123;active: isActive(page)&#125;"&gt;
		&lt;a ng-click="selectPage(page)"&gt;&#123;&#123;page&#125;&#125;&lt;/a&gt;
   &lt;/li&gt;
   &lt;li ng-class="&#123;disabled: noNext()&#125;"&gt;
      &lt;a ng-click="selectNext()"&gt;Next&lt;/a&gt;
   &lt;/li&gt;
&lt;/ul&gt;
</code></pre>	
	<p>该模板使用了一个名为pages的数组和一些辅助函数，如<code>selectPage()</code>和<code>noNext()</code>。这些数组和辅助函数是分页组件在内部实现时需要的。它们要被放置在一个作用域内以便模板可以接收到这些内容，但它们不应该在某个具体分页组件的作用域内出现，要做到这点，可以要求编译函数为模板创建一个独立的作用域。</p>
</div>

<div class="p-section">
	<h3>从父作用域中隔离指令</h3>
	<p>我们无法在指令的具体使用场景中知晓作用域会包含什么，因此，提供具有良好开发接口的指令是一种很好的做法，这样可以保证指令不依赖于具体使用场景的作用域，也不会被作用域的任何属性所影响。</p>
	<p>针对在指令和模板中使用的作用域，有三个设置选项，具体定义如下：</p>
	<ul>
	   <li>1. 复用具体组件使用位置所在的作用域。这是默认设置，对应的语句为scope: false。</li>
	   <li>2. 创建一个子作用域，该作用域原型继承自组件具体使用位置所在的作用域。对应的语句为scope: true。</li>
	   <li>3. 创建一个独立作用域，该作用域没有原型继承，所以与父作用域完全隔离。设置的方法是给scope属性传递一个对象，scope:{...}。</li>
	</ul>
	<p>要将组件模板与应用的其他完全解耦，这样他们就不会存在数据泄露的风险。所以会使用独立作用域。</p>
	<p>现在的指令作用域从父作用域中完全隔离出来了，所以需要明确指定父作用域与独立作用域之间的数据映射关系。通过在指令元素的属性上使用AngularJS表达式来实现这一点。在分页组件中，num-pages和current-page属性担当此任。可以通过监视来使属性表达式与模板作用域中的数据同步。这种同步可以通过手工方式实现，也可以要求AngularJS来实现。定义元素属性与独立作用域之间的关系，共有三种接口：插入（@）、数据绑定（=）和表达式（&）。在指令中会以名值对的形式来定义这些接口：</p>
<pre><code class="javascript">scope : {
   isolated1 : '@attribute1',
   isolated2 : '=attribute2',
   isolated3 : '&attribute3'
}
</code></pre>	
	<h4>使用@插入属性</h4>
	<p>@表示AngularJS会将特定属性的值插入作用域，当模板属性值发生变化时，也会同步更新独立作用域中对应的属性。属性插入与手动<code>$observe</code>属性效果相同:</p>
<pre><code class="javascript">attrs.$observe('attribute1', function(value){
   isolatedScope.isolated1 = value;
});
attrs.$$observers['attribute1'].$$scope = parentScope;
</code></pre>
	<h4>使用=绑定数据</h4>
	<p>等号（=）表示AngularJS会保持属性表达式与独立作用域属性值双向同步。这是一种双向数据绑定，允许对象和值在组件内外直接映射。由于这种接口支持双向数据绑定，所以DOM属性中的表达式应该是可以赋值的（就是引用作用域上的字段或对象），而不是随意计算出来的表达式。使用等号的双向数据绑定有点类似于手动设置两种<code>$watch</code>的方式：</p>
<pre><code class="javascript">var parentGet = $parse(attrs['attribute2']);
var parentSet = parentGet.assign;
parentScope.$watch(parentGet, function(value){
   isolatedScope.isolated2 = value;
});
isolatedScope.$watch('isolated2', function(value){
   parentSet(parentScope, value);
});
</code></pre>
	<p>当然，AngularJS中真正的实现要比上述代码复杂得多，从而可以保证两个作用域之间的稳定性。</p>
	<h4>使用&提供一个回调表达式</h4>
	<p>&符号表达式表示属性中的表达式会被当成作用域中的一个函数，当属性被调用时，该表达式函数就会执行，这个借口可以用来创建组件的回调函数。这种绑定方式如同<code>$parse</code>属性中的表达式，而且在独立作用域中暴露了表达式函数：</p>
<pre><code class="javascript">parentGet = $parse(attrs['attribute3']);
scope.isolated3 = function(locals){
   return parentGet(parentScope, locals);
};
</code></pre>
</div>

<div class="p-section">
	<h3>实现分页组件</h3>
	<p>分页组件的指令定义如下：</p>
<pre><code class="javascript">myModule.directive('pagination',function(){
   return {
      restrict : 'E',
	  scope : {
	     numPages : '=',
		 currentPage : '='
	  },
	  template : '...',
	  replace : true
   };
});
</code></pre>	
	<p>指令被限制以元素形式出现。组件使用独立作用域，包含<code>numPages</code>和<code>currentPages</code>两个字段，分别绑定在<code>num-pages</code>和<code>current-page</code>属性上，指令会被之前的模板直接替换掉。</p>
<pre><code class="javascript">link : function(scope){
   scope.$watch('numPages',function(value){
      scope.pages = [];
	  for(var i=1;i<=value;i++){
	     scope.pages.push(i);
	  }
	  if(scope.currentPage>value){
	     scope.selectPage(value);
	  }
   });
   
   //...
   
   scope.isActive = function(page){
      return scope.currentPage === page;
   };
   
   scope.selectPage = function(page){
      if(!scope.isActive(page)){
	     scope.currentPage = page;
	  }
   };
   
   //...
   
   scope.selectNext = function(){
      if(!scope.noNext()){
	     scope.selectPage(scope.currentPage+1);
	  }
   };
   
};
</code></pre>
	<p></p>链接函数在<code>numPages</code>属性上添加了一个监视，还为独立作用域增添了各种在指令模板中使用的辅助函数。
</div>