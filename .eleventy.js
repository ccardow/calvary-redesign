// Eleventy configuration for the Calvary Church site.
// Pages are Nunjucks templates in src/; editable content lives in src/_data/
// as JSON files managed by Decap CMS (see src/admin/config.yml).
module.exports = function (eleventyConfig) {
  // Static assets land in the output untouched, at the same paths the
  // original hand-built site used (boardgame.jpg, friends.jpg, /assets/...).
  eleventyConfig.addPassthroughCopy({ "src/static": "." });
  // The Decap CMS admin app is copied as-is to /admin/.
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });

  return {
    dir: {
      input: "src",
      output: "_site",
      data: "_data"
    },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
