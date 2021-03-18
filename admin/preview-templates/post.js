import htm from "https://unpkg.com/htm?module";
import format from "https://unpkg.com/date-fns@2.7.0/esm/format/index.js?module";

const html = htm.bind(h);

// Preview component for a Post
const Post = createClass({
  render() {
    const entry = this.props.entry;
    var image = entry.getIn(["data", "mainImage","image"]);
    var mainImage = this.props.getAsset(image);
    return html`
      <main>

        <article class="post">
          <div class="content">
            <h1 class="headline">${entry.getIn(["data", "title"], null)}</h1>
            <p class="post-meta">
            ${entry.getIn(["data", "author"], null)} |
              <time> ${
                format(
                  entry.getIn(["data", "date"], new Date()),
                  "dd MMM, yyyy"
                )
              }</time>
            </p>

              <figure>
                <img class="post-image" src="${mainImage.toString()}" alt="{{mainImage.alt}}"/>
              
                  <figcaption>
                    ${entry.getIn(["data", "mainImage","caption"], null)}
                  </figcaption>
              </figure>

            ${this.props.widgetFor("body")}

              <p class="tags">
               Tagged: 
              ${
                entry.getIn(["data", "tags"], []).map(
                  tag =>
                    html`
                      <a href="#" rel="tag" class="tag">${tag}</a>
                    `
                )
              }
              </p>

          </div>
        </article>
      </main>
    `;
  }
});

export default Post;
