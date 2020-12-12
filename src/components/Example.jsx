import React from 'react';
import mermaid from 'mermaid';

import Examples from '../examples.json';
import { CopyToClipboard } from 'react-copy-to-clipboard/lib/Component';

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      examples: [],
    };
  }

  componentDidMount() {
    this.setState(() => ({
      examples: Examples,
    }));
    this.initMermaid();
  }

  componentDidUpdate() {
    this.initMermaid();
  }

  initMermaid() {
    setTimeout(() => {
      // eslint-disable-next-line no-undef
      mermaid.init({}, document.querySelectorAll('.mermaid', this.myRef));
    }, 200);
  }

  render() {
    const listItems = this.state.examples.map((cat, keyCat) => cat.codes.map((code, key) => (
      <li key={key.toString()}>
        <b>{ `${cat.cat}: ${code.title}` }</b>
        <div>
          <table>
            <tbody>
            <tr>
              <td className="mermaid mermaid-example zoom05">{code.code}</td>
              <td>
                <CopyToClipboard text={code.code}>
                  <span style={{ cursor: 'pointer' }}>Copy</span>
                </CopyToClipboard>
                <pre className="code-example"><code>{code.code }</code></pre>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </li>
    )));

    return (
      <div ref={this.myRef} {...this.props}>
        <ul>
          {listItems}
        </ul>
      </div>
    );
  }



}

export default Example;
