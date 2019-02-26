#Simple Sass RTL mixing
---


### Introduction

There are many solutions out there in the world wide web, how to write css with rtl support in an effective and easily way to maintain.

I wanna show you a few solutions i explored while seeking the web.
If you can't wait just skip directly to my version i am using in production -> [Using a simple mixin](#approach-3-using-a-simple-mixin)

For the example i used SCSSSass syntax:

- [Sass preprocessor](http://sass-lang.com/guide)
- [SCSSSass syntax](http://sass-lang.com/documentation/file.INDENTED_SYNTAX.html#sass_syntax_differences)



### Approach 1: Overwriting default css

This approach will just load a second file which overwrites the default conditions.

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

To avoid it, you could easily use both conditions in the same file as shown.

But in both cases the problem still remains because we always load both versions! 
For performance reasons we sould keep our css as small as possible to avoid parser blocking on page load -> very expensive!!!



### Approach 2: Using a variable to set the direction

In this approach i am including only **one file** depending on the direction you are using. The direction is set dynamically.

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

As you can see, a variable called $direction will handle the correct direction for you.

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
This approach is powerfull but not 100% flexible.
You still have to pay attention how you define your styles, as an example here i couldn't reuse my code style i used in the first example:

```
margin: 0 2% 0 0;
```




### Approach 3: Using a simple mixin

Same as in approach 2 i just load the file needed, depending on the language and direction.

```html
// index.html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <link rel="stylesheet" href="css/dist/main-ltr.css">
    <!-- or this file if on rtl version
    	<link rel="stylesheet" href="css/dist/main-rtl.css">
    -->
  </head>
  <body>
	<section>Content, which might...</section>
	<aside>secondary content</aside>
  </body>
</html>
```

```scss
// css/src/modules/_rtl.scss
$isRTL: false !default;
@mixin rtl {
  @if $isRTL {
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

The above piece of code is doing the magic work. It takes a variable $isRTL which is set by default to false, this means the content won't be printed.
If this variable is true it will print the code.

```scss
// css/src/partials/_base.scss
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
// css/src/main-ltr.scss
@import "css/src/modules/rtl";
@import "css/src/partials/base";
```

The above code will already generate our final ltr (english) version (don't forget to always compress the css file!).

```scss
// css/src/main-rtl.scss
$isRTL: true;
@import "css/src/modules/rtl";
@import "css/src/partials/base";
```

In the later case the conditions will be printent twice, onces as ltr (english) and once as rtl (arabic).

This would be the output:

```scss
// css/dist/main-rtl.css
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

As you might noticed this is not really good, isn't it?

You are right!

Let's go one step further and compress our output.
We use a css minifier which will reduce the generated code into the following code:

```css
// css/dist/main-rtl.min.css
section{width:48%;float:right;margin:0 0 0 2%}aside{width:48%;float:right;margin:0 2% 0 0}
```

As you can see, no code overwriting anymore ;-)
I used for this tiny example this online minifier:

- [CSS minifier](http://cssminifier.com/)

There are plenty of minifier, to mention just a few:

- [grunt-contrib-cssmin](https://github.com/gruntjs/grunt-contrib-cssmin)
- [gulp-cssmin](https://www.npmjs.com/package/gulp-cssmin)
