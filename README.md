#Simple Sass RTL mixing
---


### Introduction

There are many solutions out there in the world wide web how to write css with rtl support in an effective and easily way to write and maintain.

I wanna show you a few solutions i explored while seeking the web.
If you can't wait just skip directly to my version we use in production -> [Using a simple mixin](#mixin)

For the example i used SCSSSass syntax:

- [Sass preprocessor](http://sass-lang.com/guide)
- [SCSSSass syntax](http://sass-lang.com/documentation/file.INDENTED_SYNTAX.html#sass_syntax_differences)



### Approach 1: Overwriting default css

This approach will just load a second file which therefore will overwrite the default conditions.

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/rtl.css">
  </head>
  <body>
	<section>Content, which might...</section>
	<aside>secondary content</aside>
  </body>
</html>
```

```scss
// css/main.scss
section {
  float: left;
  width: 48%;
  margin: 0 2% 0 0;
}	
aside {
  float: left;
  width: 48%;
  margin: 0 0 2% 0;
}
```

```scss
// css/rtl.scss
section {
  float: right;
  margin: 0 0 0 2%;
}	
aside {
  float: right;
  margin: 0 2% 0 0;
}
```

As you might noticed, the uncompiled files are long and difficult to maintain because you have to keep them in sync.

```scss
// css/main.scss
section {
  float: left;
  width: 48%;
  margin: 0 2% 0 0;
  
  html[dir=rtl] & {
  	float: right;
  	margin: 0 0 0 2%;	
  }
}	
aside {
  float: left;
  width: 48%;
  margin: 0 0 2% 0;
  
  html[dir=rtl] & {
  	float: right;
  	margin: 0 2% 0 0;	
  }
}
```

To avoid it, you you could easily use both conditions in the same file as shown.

But in both cases the problem still remains because we always load unnecessary code for nothing! 
For performance reasons we sould keep our css as small as possible to avoid parser blocking on page load -> very expensive!!!



### Approach 2: Using a variable to set the direction

For this approach you are including only **one file** depending on the direction you are using. The direction is set while compiling with a variable.

Let's have a look:

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <link rel="stylesheet" href="css/main-ltr.css">
    <!-- or this file if on rtl version
    	<link rel="stylesheet" href="css/main-rtl.css">
    -->
  </head>
  <body>
	<section>Content, which might...</section>
	<aside>secondary content</aside>
  </body>
</html>
```


```scss
// css/base.scss
$direction: left !default; // set left as default direction

section {
  float: $direction;
  width: 48%;
  margin-#{$direction}: 2%;
}	
aside {
  float: $direction;
  width: 48%;
  margin-#{$direction}: 2%;
}
```

As you could see, the file uses variables which will be replaced by the direction set.

```scss
// css/main-ltr.scss
@import "css/base";
```

```scss
// css/main-rtl.scss
$direction: right;
@import "css/base";
```

The two files will load the base code and reset the direction if needed.
With this approach you have to pay attention how you define your styles, as an example here i couldn't reuse my code style i used in the first example 

```
margin: 0 2% 0 0;
```



### <a id="mixin">Approach 3: Using a simple mixin</a>

Same as in approach 2 i just load the file needed, depending on the language and direction.

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <link rel="stylesheet" href="css/main-ltr.css">
    <!-- or this file if on rtl version
    	<link rel="stylesheet" href="css/main-rtl.css">
    -->
  </head>
  <body>
	<section>Content, which might...</section>
	<aside>secondary content</aside>
  </body>
</html>
```

```scss
// css/mixin.scss
$isLTR: false !default;
@mixin rtl {
  @if $isLTR {
    @if & {
      & {
        @content;
      }
    }
    @else {
      @content;
    }
  }
}
```

The above piece of code is doing the magic work. It takes a variable $isLTR which is set by default to false, this means the content won't be printed.
If this variable is true it will print the code.

```scss
// css/base.scss
section {
  float: left;
  width: 48%;
  margin: 0 2% 0 0;
  
  // define here inline your rtl conditions
  @include rtl {
  	float: right;
  	margin: 0 0 0 2%;	
  }
}	
aside {
  float: left;
  width: 48%;
  margin: 0 0 2% 0;
  
  // define here inline your rtl conditions
  @include rtl {
  	float: right;
  	margin: 0 2% 0 0;	
  }
}
```

```scss
// css/main-ltr.scss
@import "css/mixin";
@import "css/base";
```

The above code will already generate our final ltr (english) version (don't forget to always compress the css file!).

```scss
// css/main-rtl.scss
$isLTR: true;
@import "css/mixin";
@import "css/base";
```

In the later case the conditions will be printent twice, onces as ltr (english) and once as rtl (arabic).

This would be the output:

```scss
section {
  float: left;
  width: 48%;
  margin: 0 2% 0 0;
}
section {
  float: right;
  margin: 0 0 0 2%;
}

aside {
  float: left;
  width: 48%;
  margin: 0 0 2% 0;
}
aside {
  float: right;
  margin: 0 2% 0 0;
}
```

mhhh, but this is not really good?

You are right!

Let's go one step further and finalise our output.
If we use now a css minifier, it will be intelligent enough to reduce the generated code into the following code:

```css
section{width:48%;float:right;margin:0 0 0 2%}aside{width:48%;float:right;margin:0 2% 0 0}
```

As you can see, no code overwriting ;-)
I used for this tiny example this online minifier:

- [CSS minifier](http://cssminifier.com/)

There are plenty of minifier, to mention just a few:

- [grunt-contrib-cssmin](https://github.com/gruntjs/grunt-contrib-cssmin)
- [gulp-minify-css](https://github.com/murphydanger/gulp-minify-css)
