---
layout: post
title: Cookie和Session
description: "在web应用中，请求路径和查询字符串对业务至关重要，通过它们可以进行很多业务操作了，但是HTTP是一个无协议的状态，现实中的业务确实需要一定的状态的，否者无法区分用户之间的身份。"
category: node
tags: [cookie,session]
---
{% include JB/setup %}

<div class="p-section">
	<h3>初始Cookie</h3>
	<p>Cookie最早由文本浏览器Lynx合作开发者Lou Moutulli在1994年网景公司开发的Netscape浏览器的第一个版本时发明，它能记录服务器与客户端之间的状态，最早的用处是用来判断用户是否是第一次访问网站。在1997年形成规范RFC 2109，目前最新的规范为RFC 6265，它是一个由服务器和浏览器共同协作完成的规范。Cookie的处理分为如下几步：</p>
	<ul>
		<li><span class="icon fa fa-cube"></span>服务器向客户端发送Cookie</li>
		<li><span class="icon fa fa-cube"></span>浏览器将Cookie保存</li>
		<li><span class="icon fa fa-cube"></span>之后每次浏览器都会将Cookie发送给服务器端</li>
	</ul>
	<p>客户端发送的Cookie在请求字段Cookie中，HTTP_Parser会将所有的报文字段解析到<code>req.headers</code>上，那么Cookie就是<code>req.headers.cookie</code>。根据规范中的定义，Cookie值的格式为key=value;key2=value2形式的，如果我们需要Cookie解析它也十分容易：</p>
<pre><code class="javascript">var parseCookie = function(cookie){
   var cookies = {};
   if(!cookie){
      return cookies;
   } 
   var list = cookie.split(";");
   for(var i=0;i<list.length;i++){
      var pair = list[i].split("=");
	  cookies[pair[0].trim()] = pair[1];
   }
   return cookies;
};
</code></pre>
	<p>在业务逻辑代码执行之前，我们将其挂载在<code>req</code>对象上，让业务代码可以直接访问，如下所示：</p>
<pre><code class="javascript">function(req,res){
   req.cookies = parseCookie(req.headers.cookie);
   handle(req,res);
}
</code></pre>	
	<p>这样我们的业务就可以判断和处理了，如下所示：</p>
<pre><code class="javascript">var handle = function(req,res){
   res.writeHead(200);
   if(!req.cookie.isVisit){
      res.end("欢迎第一次来到动物园");
   } else {
      //TODO
   }
}
</code></pre>
	<p>任何请求报文中，如果Cookie值没有isVist，都会收到”欢迎第一次来到动物园”这样的响应。这里提出一个问题，如果识别到用户没有访问过我们的站点，那么我们的客户端是否应该告诉客户端已经访问过的表示呢？告知客户端的方式是通过响应报文实现的，响应的Cookie值在<code>Set-Cookie</code>字段中，它的格式与请求的格式不太相同，规范中对它的定义如下所示：</p>
<pre><code class="http">Set-Cookie: name=value; Path=/; Expires=Sun, 23-Apr-23 09:01:35 GMT; Domain=.domain.com;
</code></pre>
	<p>其中<code>name=value</code>是必须包含的部分，其余部分皆是可选参数，这些可选参数会影响到浏览器在后续将Cookie发送给服务器端的行为。知道Cookie中报文的具体格式后，下面我们将Cookie序列化成符合规范的字符串，相关代码如下所示：</p>
<pre><code class="javascript">var serialize = function(name,val,opt){
   var pairs = [name+ "="+encode(val)];
   opt = opt || {};
   
   if(opt.maxAge) pairs.push("Max-Age="+opt.maxAge);
   if(opt.domain) pairs.push("Domain="+opt.domain);
   if(opt.path) pairs.push("Path="+opt.path);
   if(opt.expires) pairs.push("Expires="+opt.expires.toUTCString());
   if(opt.httpOnly) pairs.push("HttpOnly");
   if(opt.secure) pairs.push("Secure");
   
   return pairs.join(";");
}
</code></pre>
	<p>略该前文的逻辑，我们就能轻松的判断用户的状态了，如下所示：</p>
<pre><code class="javascript">var handle = function(req,res){
   if(!req.cookies.isVisit){
      res.setHeaders("Set-Cookie",serialize("isVisit",'1'));
	  res.writeHead(200);
	  res.end("欢迎第一次来到动物园");
   } else {
      res.writeHead(200);
	  res.end("动物园再次欢迎您");
   }
}
</code></pre>	
	<p>客户端收到这个带<code>Set-Cookie</code>的响应后，在之后的请求中会带上这个字段的值。</p>
</div>

<div class="p-section">
	<h3>Cookie的性能影响</h3>
	<p>由于Cookie的实现机制，一旦服务器端向客户端发送了设置Cookie的意图，除非Cookie过期，否则客户端每次请求都会发送这些Cookie到服务器端，一旦设置的Cookie过多，将导致报文头较大。大多数的Cookie并不需要每次都用上，因此这会造成宽带的部分浪费。</p>
	<h4>减小Cookie的大小</h4>
	<p>更严重的是，如果在域名的根节点中设置Cookie，几乎所有子路径下的请求都会带上Cookie，这些Cookie在某些情况下是有用的，但是有些情况下是完全无用的。其中以静态文件最为典型，静态文件的业务定位几乎不关系状态，Cookie对它而言几乎是无用的，但是一旦Cookie设置到了相同的域下，它的请求就会带上Cookie，好在Cookie在设计时先顶了它的域，只有域名相同时才会发送。</p>
	<h4>为静态组件设置不同的域名</h4>
	<p>简而言之就是，为不需要Cookie的组件换个域名可以实现减少无效Cookie的传输。所有很多网站的静态文件会有特别的域名，使得业务相关的域名不再影响到静态资源。当然，换有额外域名的好处不只这点，还可以突破浏览器下载线程数的限制，因为域名不同，可以将下载线程数翻倍，但是换用额外域名还是有一定缺点的，那就是将域名转换为IP，需要进行DNS查询，多一个域名就多一次DNS查询。</p>
	<h4>减少DNS查询</h4>
	<p>看起来减少DNS查询和使用不同的域名是冲突的两条规则，但是好在现今的浏览器都会进行DNS缓存，以消弱这个副作用的影响。目前，广告和在线统计领域是最为依赖Cookie的，通过嵌入第三方的广告或者统计脚本，将Cookie和当前页面绑定，这样就可以标识用户，得到用户的浏览行为，广告商就可以定向投放广告了。尽管这样的行为看起来很可怕，但从Cookie的原理来讲，它只能做标识，而不能做任何具有破坏性的事情，如果依然担心自己站点的用户被记录下行为，那就不需要挂任何第三方脚本了。</p>
</div>

<div class="p-section">
	<h3>Session</h3>
	<p>通过Cookie，浏览器和服务器可以实现状态的记录。但Cookie并非是完美的，前文提及体积过大就是一个显著的问题，最为严重的是Cookie可以在前后端进行修改，因此数据就容易被篡改和伪造。如果服务器有部分逻辑是根据Cookie中的isVIP字段进行判断的，那么一个普通用户可以通过修改Cookie就可以享受到VIP服务了。综上所述，Cookie对于敏感数据的保护是无效的。为了解决Cookie敏感数据的问题，Session应运而生。Session的数据只保留在服务器端，客户端无法修改，这样数据的安全性就得到了一定的保障，数据也无需在协议中每次都被传递。虽然在服务器端存储数据十分方便，但是如何将每个客户和服务器中的数据一一对应起来，这里有两种常见的实现方式：</p>
	<h4>第一种：基于Cookie来实现用户和数据的映射</h4>
	<p>虽然将所有数据都放在Cookie中不可取，但是将口令放在Cookie中还是可以的，因为口令一旦被修改就丢失了映射关系，也无法修改服务器端存的数据。并且Session的有效期通常都很短，普通的设置为20分钟，如果在这20分钟内客户端和服务器端没有交互产生，服务器端就将数据删除，由于数据过期时间较短，且在服务器端存储数据，因此安全性相对较高。那么口令是如何产生的呢？</p>
	<p>一旦服务器端启用了Session，它将约定一个健值作为Session的口令，这个值可以随意约定，比如Connect默认采用connect_uid等。一旦服务器检查到用户Cookie中没有携带该值，它就会为之生成一个值，这是一个唯一且不重复的值，请并设定超时时间。以下为生成Session的代码：</p>
<pre><code class="javascript">var session = {};
var key = 'session_id';
var Expires = 20 * 60 *1000;

var generate = function(){
   var session = {};
   session.id = (new Date()).getTime()+Math.random();
   session.cookie = {
      expire: (new Date()).getTime() + Expires;
   };
   sessions[session.id] = session;
   return session;
};
</code></pre>	
	<p>每个请求到来时，检查Cookie中的口令与服务器端的数据，如果过期，就重新生成，如下所示：</p>
<pre><code class="javascript">function(req,res){
   var id = req.cookies[key];
   if(!id){
      req.session = generate();
   } else {
      var session = sessions[id];
	  if(session){
	     if(session.cookie.expires > (new Date()).getTime()){
		    //更新超时时间
		    session.cookie.expire = (new Date()).getTime() + Expires;
			req.session = session;
		 } else {
		    //超时了，删除旧的数据并重新生成
			delete session[id];
			req.sesison = generate();
		 }
	  } else {
	     //如果session过期或者口令不对，重新生成session
		 req.session = generate();
	  }
   }
   handle(req,res);
}
</code></pre>	

	<p>当然仅仅重新生成Session还不足以完成整个流程，还需要在响应给客户端时设置新的值，以便下次请求时能够对应上服务器端的数据，如下所示：</p>
<pre><code class="javascript">var writeHead = rew.writeHead;
res.writeHead = function(){
   var cookies = res.getHeader("Set-Cookie");
   var session = serialize("Set-Cookie",req.session.id);
   cookies = Array.isArray(cookies)?cookies.concat(session):[cookies,session];
   res.setHeader("Set-Cookie",cookies);
   return writeHead.apply(this,arguments);
}
</code></pre>

	<p>至此，Session在前后端的对应过程就算完成了，这样的业务逻辑可以判断和设置Session，以此维护用户与服务器端的联系，如下所示：</p>
<pre><code class="javascript">var handle = function(req,res){
   if(!req.session.isVisit){
      req.session.isVisit = true;
	  res.writeHead(200);
	  res.end("欢迎第一次来到动物园");
   } else {
      res.writeHead(200);
	  res.end("动物园再次欢迎您");
   }
};
</code></pre>

	<p>这样在Session中保存的数据比直接保存在Cookie中安全得多，这种实现方案依赖Cookie实现，而且也是大多数web应用的方案，如果客户端禁止使用Cookie，这个世界上大多数的网站将无法实现登录等操作。</p>
	<h4>第二种：通过查询字符串来实现浏览器端与服务器端数据的对应</h4>
	<p>它的原理是检查请求的查询字符串，如果没有值，就会生成带值的URL，如下所示：</p>
<pre><code class="javascript">var getURL = function(_url,key,value){
   var obj = url.parse(_url,true);
   obj.query[key] = value;
   return url.format(obj);
};
</code></pre>	
	<p>然后形成跳转，让客户端重新发起请求：</p>
<pre><code class="javascript">function(req,res){
   var redirect = function(url){
      res.setHeader("Location",url);
	  res.writeHead(302);
	  res.end();
   };
   
   var id = req.query[key];
   if(!id){
      var session = generate();
	  redirect(getURL(req,url,key,session.id));
   } else {
      var session = sessions[id];
	  if(session){
	     if(session.cookie.expire>(new Date()).getTime()){
		    //更新超时时间
			session.cookie.expire = (new Date()).getTime()+Expires;
			req.session = session;
			handle(req,res);
		 } else {
		    //超时了，删除旧的数据并重新生成
			delete session[id];
			var session = generate();
			redirect(getURL(req.url,key,session.id));
		 }
	  } else {
	     //如果session过期或者口令不对，重新生成session
		 var session = generate();
		 redirect(getURL(req.url,key,session.id));
	  }
   }
}
</code></pre>
	<p>用户访问http://localhost/pathname时，如果服务器端发现查询字符串中不带session_id的参数，就会将用户跳转到http://localhost/pathname?session_id=1244567这样的一个类似地址。如果浏览器收到302状态码和Location报头，就会重新发起请求，如下所示：</p>
<pre><code class="http">< HTTP/1.1 302 Moved Temporarily
< Location: /pathname?session_id=12344567
</code></pre>
	<p>这样，新的请求到来时就能通过Session的检查，排除内存中的数据过期。</p>
</div>

