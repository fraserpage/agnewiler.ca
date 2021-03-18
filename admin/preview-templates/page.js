import htm from "https://unpkg.com/htm?module";

const html = htm.bind(h);

// Preview component for a Page
const Page = createClass({
  render() {
    const entry = this.props.entry;
    //console.log(entry)
    return html`
      <main>
        <h1>${entry.getIn(["data", "title"], null)}</h1>

        ${
          entry.getIn(["data", "sections"], []).map(
            section =>
              getSection(section)
          )
        }

      </main>
    `;
  }
});

function getSection(section){
  //console.log(section);
  var type = section.getIn(["type"]);
  if (type == 'carousel'){
    carousel(section);
  }
}


function carousel(props){
  console.log(props);
  return html`
    <div class="headline content">
      ${props.getIn(["textArea"], null)}
    </div>
  
`;
}




export default Page;

