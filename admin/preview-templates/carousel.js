import htm from "https://unpkg.com/htm?module";

const html = htm.bind(h);

// Preview component for a Post
const Carousel = createClass({
  render() {
    const entry = this.props.entry;
    console.log(entry)
    return html`
      <div class="headline content">
      ${entry.getIn(["data", "textArea"], null)}
      </div>

      <div class="slider {% if section.images.length > 1 %} slideshow {% endif %}" data-length="{{section.images.length}}" data-timing="{{section.timer}}" data-current-slide="0">
        {% for image in section.images %}
          {% if loop.index == 1 %}
            <img class="current-slide" data-loaded="true" src="{{image.image}}" alt="{{image.alt}}">
          {% else %}
            <img  data-loaded="false" data-src="{{image.image}}" alt="{{image.alt}}">
          {% endif %}
        {% endfor %}
      </div>

    `;
  }
});

export default Carousel;
