import React from 'react'

import Examples from '../examples.json'

class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      examples: []
    };
  }

  render() {
    const listItems = Examples.map((cat, keyCat) =>
      cat.codes.map((code, key) =>
        <li key={key.toString()}>
          <b>{ cat.cat +': ' + code.title }</b>
          <div className="zoom05">
            <div className="mermaid mermaid-example">{code.code }</div>
            <div><pre className="code-example"><code>{code.code }</code></pre></div>
          </div>
        </li>
      )
    )

    return <div>
      <ul>
        {listItems}
      </ul>
    </div>
  }

  initMermaid() {
    //mermaid.parse(code)
    //mermaid.init(undefined, this.container)
  }

  componentDidMount() {
    this.setState(() => ({
      examples: Examples
    }));
    this.initMermaid()
  }

  componentDidUpdate() {
    this.initMermaid()
  }
}

export default Example
