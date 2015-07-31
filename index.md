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
	{% for item in post.tags %}
    <div>{{ item }}</div>
    {% endfor %}
	<div>{{post.description}}</div>
  {% endfor %}
</ul>