---
layout: page
title: 
tagline: 
---
{% include JB/setup %}

<div class="blog-outline">
	{% for post in site.posts %}
	<div class="post-outline">
		<div class="post-array">
			<div class="array-left">
				<div class="post-header">
				<a href="{{ post.url }}">{{ post.title }}</a>
				<span class="icon fa fa-book"></span>
				</div>
				<div class="tags">
				{% for item in post.tags %}
					<span class="label label-primary">{{item}}</span>
				{% endfor %}
				</div>
			</div>
			<div class="array-right">
				{{ post.date | date:"%Y/%m/%d"}}
			</div>
		</div>
		<div class="post-description">{{post.description}}</div>
	</div>
	<div class="gap-line"></div>
	{% endfor %}
</div>