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
		{% for item in post.tags %}
		<div class="tags">
			<div class="tag-element">{{ item }}</div>
		</div>
		{% endfor %}
		<div class="post-description">{{post.description}}</div>
	</div>
	{% endfor %}
</div>