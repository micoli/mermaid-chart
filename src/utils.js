import { Base64 } from 'js-base64';

export const base64ToState = (base64, search) => {
  // eslint-disable-next-line no-undef
  const params = new window.URLSearchParams(search);
  const themeFromUrl = params.get('theme') || 'default';

  const str = Base64.decode(base64);
  let state;
  try {
    state = JSON.parse(str);
    if (state.code === undefined) { // not valid json
      state = { code: str, mermaid: { theme: themeFromUrl } };
    }
  } catch (e) {
    state = { code: str, mermaid: { theme: themeFromUrl } };
  }
  return state;
};

const defaultCode = `
sequenceDiagram
    a ->> b : link
`;
export const defaultState = {
  code: defaultCode,
  mermaid: { theme: 'default' },
};
