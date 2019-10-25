---
layout: page
title: Articles
weight: 1
nav: yes
permalink: articles/
---


<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>