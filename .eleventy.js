const { DateTime } = require("luxon");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-es");
const htmlmin = require("html-minifier");
const metagen = require('eleventy-plugin-metagen');

module.exports = function(eleventyConfig) {

  // Configuration API: use eleventyConfig.addLayoutAlias(from, to) to add
  // layout aliases! Say you have a bunch of existing content using
  // layout: post. If you don’t want to rewrite all of those values, just map
  // post to a new file like this:
  // eleventyConfig.addLayoutAlias("post", "layouts/my_new_post_layout.njk");

  // Merge data instead of overriding
  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true);

  // Add support for maintenance-free post authors
  // Adds an authors collection using the author key in our post frontmatter
  // Thanks to @pdehaan: https://github.com/pdehaan
  /* 
  eleventyConfig.addCollection("authors", collection => {
    const posts = collection.getFilteredByGlob("posts/*.md");
    return posts.reduce((coll, post) => {
      const author = post.data.author;
      if (!author) {
        return coll;
      }
      if (!coll.hasOwnProperty(author)) {
        coll[author] = [];
      }
      coll[author].push(post.data);
      return coll;
    }, {});
  });
  */

  // Date formatting (human readable)
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("LLLL d, yyyy");
  });

  // Date formatting (machine readable)
  eleventyConfig.addFilter("machineDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd");
  });

  // Minify CSS
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Minify JS
  eleventyConfig.addFilter("jsmin", function(code) {
    let minified = UglifyJS.minify(code);
    if (minified.error) {
      console.log("UglifyJS error: ", minified.error);
      return code;
    }
    return minified.code;
  });

  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if (outputPath.indexOf(".html") > -1) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("static/img");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("_includes/assets/");

  /* Meta tag generator shortcode */
  eleventyConfig.addPlugin(metagen);
  
  /* Markdown Plugins */
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  let opts = {
    permalink: false
  };

  eleventyConfig.setLibrary("md", markdownIt(options)
    .use(markdownItAnchor, opts)
  );

  // Add a 'renderMarkdown' filter for processing markdown from json in _data
  // Usage {{ data | renderMarkdown | safe }}
  const mdRender = new markdownIt(options);
  eleventyConfig.addFilter("renderMarkdown", function(rawString) {
    return mdRender.render(rawString);
  });

  //Add filter to highlight certian words
  eleventyConfig.addFilter("highlightKeywords", function(textString, words) {

    var colors = ['purple', 'green', 'pink', 'yellow'];
    
    function wrapWords(word, index){
      let i = index % colors.length;
      textString = textString.replace(word, "<span class='"+colors[i]+"'>"+word+"</span>");
    }
    
    words.forEach(wrapWords);
    
    return textString;
  });

  //Add limit filter to nunjucks for retrieving only a few blog posts
  eleventyConfig.addNunjucksFilter("limit", (arr, limit) => arr.slice(0, limit));

  //Add filter to highlight current page + current page ancestor
  //Input page.url and other url - outputs 'current-page' if they match the regex
  eleventyConfig.addFilter("currentPage", function(url, matchUrl) {

    const regex = new RegExp('^'+url+'($|/)')
    if (regex.test(matchUrl)){
      return "current-page";
    }
  });


  return {
    templateFormats: ["md", "njk", "html", "liquid"],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about it.
    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for URLs (it does not affect your file structure)
    pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};

