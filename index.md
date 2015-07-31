---
layout: page
title: 
tagline: 
---
{% include JB/setup %}

{% for post in site.posts %}
<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>