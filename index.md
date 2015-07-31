---
layout: page
title: 
tagline: 
---
{% include JB/setup %}

<div class="blog-outline">
	{% for post in site.posts %}
	<div class="post-outline">
		<div class="post-header">
			<a href="{{ post.url }}">{{ post.title }}</a>
		</div>
		<div class="tags">
		标签
		{% for item in post.tags %}
		<span class="label label-primary">{{item}}</span>
		{% endfor %}
		</div>
		<div class="post-description">{{post.description}}</div>
	</div>
	{% endfor %}
</div>