---
layout: post
title: "promise API and $q"
description: "Promise API的主要思想是，为异步世界带来我们在同步编程世界中所享有的那些便利之处，比如链式方法调用和错误处理。AngularJS拥有非常轻量化的Promise API实现——$q服务。为数不少的AngularJS服务相当依赖promise风格的API，为了使用这些服务，需要熟悉$q。"
category: MEAN框架 
tags: [AngularJS]
---
{% include JB/setup %}

<div class="p-section">
	<h3>工作中的promise和$q服务</h3>
	<p>为了学习<code>$q</code>服务提供的精简的API，我们来看看现实中的例子。假设我们想打电话叫披萨，结果不外乎两种，一种是披萨按时送达，另一种是接到告知我们订单有问题的电话。预订披萨只需打个电话，但外送（订单实现）确需要时间，它是异步的。为了感受Promise API，我们将定义一位顾客，它的行为包括享用披萨或者在订单没有送达时感到失望，代码如下：</p>
<pre><code class="javascript">var Person = function( name, $log ){

	this.eat = function( food ){
	   $log.info(name + " is eating delicious " + food);
	};

	this.beHungry = function( reason ){
	   $log.warn(name + " is hungry because: " + reason);
	};

};
</code></pre>

	<p>上面定义的<code>Person</code>构造函数可用于生产包含<code>eat</code>和<code>beHungry</code>方法的对象，我们将分别使用这些方法作为失败或者成功的回调。现在我们用<a href="http://jasmine.github.io/">Jasmine</a>测试披萨下单和完成过程的代码，如下：</p>
<pre><code class="javascript">it('should illustrate basic usage of $q', function(){

   var pizzaOrderFulfillment = $q.defer();  //描述未来任务的实体
   var pizzaDelivered = pizzaOrderFulfillment.promise();  //控制未来任务的实体提供承诺对象
   
   pizzaDelivered.then(pawel.eat, pawel.beHungry);
   
   pizzaOrderFulfillment.resolve('Margherita');
   $rootScope.$digest();
   
   expect($log.info.logs).toContain(['Pawel is eating delicious Margherita']);

});
</code></pre>

	<p>这个单元测试在一开始调用<code>$q.defer()</code>方法以得到一个延迟对象，从概念上来说，它反映了未来将要完成的任务，此对象有两项职责：（1）保存一个承诺对象，这是被延迟的任务未来结果的占位符；（2）提供方法以使此未来的任务完成（履行，<code>resolve</code>）或失败（拒绝，<code>reject</code>）。</p>
	<p>在Promise API中，通常有两个角色：一是控制未来任务的执行（在延迟对象上调用方法），另一个则是依赖于未来任务的执行结果（保存承诺结果）。控制未来任务的实体提供承诺对象给对任务感兴趣的其他实体。在上面的例子中，Pawel对外送订单感兴趣，并通过在承诺对象上注册回调来表达他的兴趣，为了注册回调，需要使用<code>then(successCallBack, errorCallBack)</code>方法，它接受回调函数。这些回调函数在被调用时会接受未来的结果或失败原因作为参数。错误回调是可选且可以被忽略的，如果它被忽略了，当未来任务失败时，失败也会被安静的忽略。</p>
	<p>想通知未来任务使之完成，就要在延迟对象上调用<code>resolve</code>方法，传递给<code>resolve</code>方法的参数将会提供给注册过的成功回调。在成功回调之后，未来的任务完成，承诺得到履行。类似的，对<code>reject</code>方法的调用会触发错误回调和承诺拒绝。在上面的测试示例中，调用了神秘的<code>$rootScope.$digest()</code>方法。在AngularJS中，承诺被履行或拒绝的结果作为<code>$digest</code>周期的一部分传播。</p>
</div>

<div class="p-section">
	<h3>promise是第一类javascript对象</h3>
	<p>乍看上去好像promise API增加了不必要的复杂度，但是，我们还有更多的例子来欣赏promise的威力。首先，我们要了解promise是第一类javascript对象，它可以作为函数调用的参数与返回值，这让我们可以轻易的将异步操作封装为服务，比如设想简化后的餐馆服务，代码如下：</p>
<pre><code class="javascript">var Restaurant = function($q, $rootScope){

   var currentOrder;
   
   this.takeOrder = function(orderedItems){
      currentOrder = {
	     deferred: $q.defer(),
		 items: orderedItems
	  };
	  return currentOrder.deferred.promise;
   };
   
   this.deliverOrder = function(){
      currentOrder.deferred.resolve( currentOrder.items );
	  $rootScope.$digest();
   };
   
   this.problemWithOrder = function(reason){
      currentOrder.deferred.reject(reason);
	  $rootScope.$digest();
   };

};
</code></pre>

	<p>现在餐馆服务封装好了异步任务，它仅在<code>takeOrder</code>方法中返回承诺对象，此对象随后被餐馆的顾客用于保存承诺的结果，而且此对象将在结果有效后获得通知。下面看看新制作的API在实践中如何工作，让我们编写代码来描绘拒绝承诺时调用错误回调的情况：</p>
<pre><code class="javascript">it('should illustrate promise rejection', function(){
   
   pizzaPit = new Restaurant($q, $rootScope);
   var pizzaDelivered = pizzaPit.takeOrder('Capricciosa');
   pizzaDelivered.then(pawel.eat, pawel.beHungry);
   pizzaDelivered.then(peter.eat, peter.beHungry);
   
   pizzaPit.problemWithOrder('no Capricciosa, only Margherita left');
   
   expect($log.warn.logs).toContain(['pawel is hungry because: no Capricciosa, only Margherita left']);
   
});
</code></pre>
	<p>上述注册了多个回调，类似地，拒绝承诺时也会调用所有注册的错误回调。</p>
</div>

<div class="p-section">
	<h3>注册回调和承诺的生命周期</h3>
	<p>承诺一旦被履行或拒绝，就不能再改变它的状态，它只有一次机会提供承诺结果，换句话说就是不能做到：</p>
	<ul>
		<li><span class="icon fa fa-cube"></span>履行已被拒绝的承诺。</li>
		<li><span class="icon fa fa-cube"></span>履行已被履行过的承诺以得到不一样的结果。</li>
		<li><span class="icon fa fa-cube"></span>拒绝已被履行的承诺。</li>
		<li><span class="icon fa fa-cube"></span>拒绝已被拒绝的承诺，提供不同的拒绝理由。</li>
	</ul>
	<p>这些规则相当直观，例如，披萨如果已经直接送达（也许还被吃掉了），那么再回去通知订单有问题，就没有任何意义了。任何在承诺履行后再注册的回调将会与起始的回调有同样的结果。</p>
</div>

<div class="p-section">
	<h3>异步动作的链式调用</h3>
	<p>聚集回调很不错，但promise API真正的强大之处在于，它能够在异步世界中模仿同步世界的函数调用。继续披萨的例子，设想这次朋友招待我们吃披萨，主人将预订披萨，并当它送达时切好上桌。这是一串异步事件：首先披萨要被送达，然后才准备上桌，这等于在我们能够吃饭之前，有两个承诺要被履行：餐馆承诺送餐，主人承诺送到的披萨会被切好上桌。下面看看模型化这种情况的代码：</p>
<pre><code class="javascript">it('should illustrate successful promise chaining', function(){
   
   var slice = function(pizza){
      return 'sliced pizza';
   };
   
   pizzaPit.takeOrder('Margherita).then(slice).then(pawel.eat);
   
   pizzaPit.deliverOrder();
   expect($log.info.logs).toContain(['Pawel is eating delicious sliced Margherita']);
   
});
</code></pre>

	<p>在上面的例子中，我们看到了一个承诺链（对<code>then</code>方法的调用），这种结构与同步风格的代码十分相似。仅当<code>then</code>方法返回新的承诺对象时，承诺链才成立，这个返回的承诺对象将以回调的形式返回结果作为参数来履行承诺。更让人印象深刻的是，现在处理错误也变得非常简单了，下面看看失败传播到承诺所负责的人时的情况：</p>
<pre><code class="javascript">it('should illustrate promise rejection chain', function(){
   
   pizzaPit.takeOrder('Capricciosa').then(slice).then(pawel.eat, pawel.beHungry);
   
   pizzaPit.problemWithOrder('no Capricciosa, only Margherita left');
   expect($log.warn.logs).toContain(['Pawel is hungry because: no Capricciosa, only Margherita left']);
   
});
</code></pre>

	<p>餐馆对承诺的拒绝传播给了最终对结果感兴趣的人，这恰恰是同步世界里异常处理的工作机制：抛出的异常会冒泡给第一个捕获块。在Promise API中，错误回调与捕获块起同样的作用，而且相当标准——有好几个选项可以去处理异常情况，比如可以这样：</p>
	<ul>
		<li><span class="icon fa fa-cube"></span>恢复（从捕获块返回值）。</li>
		<li><span class="icon fa fa-cube"></span>宣布传播失败，再次抛出异常。</li>
	</ul>
</div>

