---
layout: article
title: "Hello World"
description: "It's a hello-world written by me, just learn how to organize a blog."
category: lessons
tags: [beginner,jekyll,bootstrap]
---
{% include JB/setup %}

## 第一页，新的开始

Jekyll is a parsing engine bundled as a ruby gem used to build static websites from
dynamic components such as templates, partials, liquid code, markdown, etc. Jekyll is known as "a simple, blog aware, static site generator".
{% highlight ruby %}
def show
  @widget = Widget(params[:id])
  respond_to do |format|
    format.html # show.html.erb
    format.json { render json: @widget }
  end
end
{% endhighlight %}