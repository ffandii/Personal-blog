---
layout: page
title: 
tagline: 
---
{% include JB/setup %}

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
	<div>{{post.tags}}</div>
	<div>{{post.description}}</div>
  {% endfor %}
</ul>