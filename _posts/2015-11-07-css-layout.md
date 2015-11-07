---
layout: post
title: "css中的布局模式"
description: "早期的布局主要依赖于表格，从CSS2.1中有关布局的机制有所改变，但还是并不多，开发者通常不愿意使用绝对定位，因为不太灵活；浮动定位常用于页面的布局，但对于全页多列布局来说，它总是存在一些小毛病，功能上也有很多限制。CSS3则引入了一种全新的伸缩布局盒模型。"
category: CSS
tags: [CSS,布局模式]
---
{% include JB/setup %}

<div class="p-section">
	<h3>CSS2布局模式</h3>
	<p>谈到布局，CSS2.1中定义了四种布局模式，由一个盒与其兄弟、祖先盒的关系决定其尺寸与位置的算法。</p>
	<ul>
		<li><span class="icon fa fa-cube"></span>块布局：呈现文档的布局模式。</li>
		<li><span class="icon fa fa-cube"></span>行内布局：呈现文本的布局模式。</li>
		<li><span class="icon fa fa-cube"></span>表格布局：用格子来呈现2D数据的布局模式。</li>
		<li><span class="icon fa fa-cube"></span>定位布局：能够直接的定位元素的布局模式，定位元素基本与其他元素没有任何关系。</li>
	</ul>
</div>

<div class="p-section">
	<h3>CSS3 Flexbox布局</h3>
	<p>CSS3引入的布局模式Flexbox布局，主要思想是让容器有能力让其子项目能够改变其宽度、高度（甚至顺序），以最佳方式填充可用空间（主要是为了适应所有类型的显示设备和屏幕大小）。Flex容器会使子项目（伸缩项目）扩展来填满可用空间，或缩小以防止溢出容器。最重要的是，Flexbox布局方向不可预知，不想常规的布局，块就是从上到下，内联就是从左到右。而那些常规的适合页面布局，但对于支持大型或者复杂的应用程序（特别是涉及取向改变、缩放和收缩等）就缺乏灵活性。</p>
	<p>Flexbox布局对于设计比较复杂的页面非常有用。可以轻松实现屏幕和浏览器窗口大小发生变化时保持元素的相对位置和大小不变。同时减少了依赖于浮动布局实现元素位置的定义以及重置元素的大小。综合而言，Flexbox布局功能主要具有以下几点。</p>
	<ul>
		<li><span class="icon fa fa-cube"></span>屏幕和浏览器窗口大小发生改变也可以灵活调整布局。</li>
		<li><span class="icon fa fa-cube"></span>指定伸缩项目沿着主轴或侧轴按比例分配额外空间，从而调整伸缩项目的大小。</li>
		<li><span class="icon fa fa-cube"></span>指定伸缩项目沿着主轴或侧轴将伸缩容器额外空间分配到伸缩项目之前、之后或之间。</li>
		<li><span class="icon fa fa-cube"></span>指定如何将垂直于元素布局轴的额外空间分布到该元素周围。</li>
		<li><span class="icon fa fa-cube"></span>指定元素在页面上的布局方向。</li>
		<li><span class="icon fa fa-cube"></span>按照不同于DOM所指定的排序方式对屏幕上的元素重新排序。</li>
	</ul>
</div>

<div class="p-section">
	<h3>Flexbox模型中的术语</h3>
	<p>和CSS3其他属性不一样，Flexbox并不是一个属性，而是一个模块，包括多个CSS3属性，涉及很多东西，包括整个组属性。虽然现在对Flexbox有一定的了解，如果想更好的使用Flexbox，新的术语和概念可能是一个障碍，所以首先了解基本的概念。下图为一个row伸缩容器中各种方向与大小术语。</p>
	<div class="image"><img src="../../../../../images/post/css/flexbox.png" width="588" height="231"/></div>
	<p>主轴、主轴方向：用户代理沿着一个伸缩容器的主轴配置伸缩项目，主轴是主轴方向的延伸。伸缩容器的主轴，伸缩项目主要沿着这条轴进行布局。小心，它不一定是水平的，这主要取决于<code>justify-content</code>属性，如果取值为<code>column</code>，主轴的方向为纵向的。</p>
	<p>主轴起点、主轴终点：伸缩项目的配置从容器的主轴起点开始，往主轴终点边结束。也就是说，伸缩项目放置在伸缩容器从主轴起点到主轴终点方向。</p>
	<p>主轴长度、主轴长度属性：伸缩容器在主轴方向上的宽度或高度就是项目的主轴长度，伸缩项目的主轴长度属性就是<code>width</code>和<code>height</code>属性，由哪一个对着主轴方向决定。</p>
	<p>侧轴起点、侧轴终点：填满项目的伸缩行的配置从容器的侧轴起点开始，往侧轴终点边结束。</p>
	<p>侧轴长度、侧轴长度属性：伸缩项目在侧轴方向的宽度或高度就是项目的侧轴长度，伸缩项目的侧轴长度属性为<code>width</code>和<code>height</code>属性，由哪一个对着侧轴方向决定。</p>
</div>

<div class="p-section">
	<h3>伸缩容器和伸缩项目</h3>
	<p>通过<code>display</code>属性，可以显式的给一个元素设置为<code>flex</code>或者<code>inline-flex</code>，这个容器就是一个伸缩容器。伸缩容器会为其内容创立新的伸缩
	格式化上下文，其中设置为<code>flex</code>的容器会被渲染为一个块级元素，而被设置为<code>inline-flex</code>的容器则被渲染为一个行内元素。若元素<code>display</code>
	的指定值是<code>inline-flex</code>切=且元素为一个浮动或绝对定位元素，则<code>display</code>的计算值为<code>flex</code>。</p>
	<h4>伸缩容器的属性</h4> 
</div>