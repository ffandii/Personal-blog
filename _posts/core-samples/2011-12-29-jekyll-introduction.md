---
layout: post
category : lessons
description: "A outline offered by Jekyll-Bootstrap, mainly talks about what is Jekyll, what does Jekyll do.Which is a start begginer for all of, sincerely suggest you to read about it carefully...  "
tagline: ""
tags : [intro, beginner, jekyll, tutorial]
---
{% include JB/setup %}

### What is Jekyll?

Jekyll is a parsing engine bundled as a ruby gem used to build static websites from
dynamic components such as templates, partials, liquid code, markdown, etc. Jekyll is known as "a simple, blog aware, static site generator".

### Examples

This website is created with Jekyll. [Other Jekyll websites](https://github.com/mojombo/jekyll/wiki/Sites).

### The Jekyll Application Base Format

Jekyll expects your website directory to be laid out like so:

		.
		|-- _config.yml
		|-- _includes
		|-- _layouts
		|   |-- default.html
		|   |-- post.html
		|-- _posts
		|   |-- 2011-10-25-open-source-is-good.markdown
		|   |-- 2011-04-26-hello-world.markdown
		|-- _site
		|-- index.html
		|-- assets
			|-- css
				|-- style.css
			|-- javascripts


- **\_config.yml**
	Stores configuration data.

- **\_includes**
	This folder is for partial views.

- **\_layouts**
	This folder is for the main templates your content will be inserted into.
	You can have different layouts for different pages or page sections.

- **\_posts**
	This folder contains your dynamic content/posts.
	the naming format is required to be `@YEAR-MONTH-DATE-title.MARKUP@`.

- **\_site**
	This is where the generated site will be placed once Jekyll is done transforming it.

- **assets**
	This folder is not part of the standard jekyll structure.
	The assets folder represents _any generic_ folder you happen to create in your root directory.
	Directories and files not properly formatted for jekyll will be left untouched for you to serve normally.

(read more: <https://github.com/mojombo/jekyll/wiki/Usage>)