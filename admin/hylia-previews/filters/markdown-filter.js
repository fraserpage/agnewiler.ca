let options = {
  html: true,
  breaks: true,
  linkify: true
};

export default function markdown(value) {
  return markdownIt(options).render(value);
};
