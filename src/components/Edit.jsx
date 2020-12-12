import React from 'react';
import { Icon, Tabs, Tag } from 'antd';
import { Route } from 'react-router-dom';
import { Base64 } from 'js-base64';
import mermaid from 'mermaid';
import MonacoEditor from 'react-monaco-editor';
import SplitPane from 'react-split-pane';
import Error from './Error';
import Example from './Example';
import Preview from './Preview';
import pkg from '../../package.json';
import { base64ToState } from '../utils';

let mermaidVersion = pkg.dependencies.mermaid;
if (mermaidVersion[0] === '^') {
  mermaidVersion = mermaidVersion.substring(1);
}

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.onCodeChange = this.onCodeChange.bind(this);
    this.onMermaidConfigChange = this.onMermaidConfigChange.bind(this);
    const {
      match: { params: { base64 } },
      location: { search },
    } = this.props;
    const data = base64ToState(base64, search);
    this.state = {
      code: data.code,
      mermaid: data.mermaid,
    };
    mermaid.initialize(data.mermaid);
    this.tabRef = React.createRef();
    /* monaco.languages.register({
      id: 'mermaid',
      extensions: ['.mmd'],
      aliases: ['mermaid', 'MERMAID'],
      loader: function () { return mermaidLanguage }
    }); */
  }

  onCodeChange(code) {
    const {
      history,
      match: { path },
    } = this.props;
    this.setState({ code });
    const base64 = Base64.encodeURI(JSON.stringify({
      code: this.state.code,
      mermaid: this.state.mermaid,
    }));
    history.push(path.replace(':base64', base64));
  }

  onMermaidConfigChange(event) {
    const str = event.target.value;
    const {
      history,
      match: {
        path,
        url,
      },
    } = this.props;
    try {
      const config = JSON.parse(str);
      mermaid.initialize(config);
      this.setState({ mermaid: config });
      const base64 = Base64.encodeURI(JSON.stringify({
        code: this.state.code,
        mermaid: this.state.mermaid,
      }));
      history.push(path.replace(':base64', base64));
    } catch (e) {
      const base64 = Base64.encodeURI(e.message);
      history.push(`${url}/error/${base64}`);
    }
  }

  editorDidMount(editor, monaco) {
    console.log('editorDidMount', editor, monaco);
    editor.focus();
  }

  // componentDidMount() {
  //   if (this.tabRef.current) {
  //     const parent = ReactDOM.findDOMNode(this.tabRef.current).parentNode;
  //   console.log('this.tabRef.current', this.tabRef.current, parent);
  //     parent.onResize(() => {
  //       console.log('resized', parent);
  //     });
  //   }
  // }

  render() {
    const { match: { url } } = this.props;
    const {
      code,
      mermaid: mermaidConfiguration,
    } = this.state;

    return (
      <div>
        <SplitPane allowResize split="horizontal" minSize="90%" defaultSize="90%">
          <SplitPane allowResize split="vertical" minSize="20%" defaultSize="50%">
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane
                tab="Mermaid"
                key="1"
                style={{
                  minHeight: '100vh',
                  maxheight: '100vh',
                }}
              >
                <MonacoEditor
                  language="mermaid"
                  theme="vs-dark"
                  value={code}
                  options={{
                    selectOnLineNumbers: true,
                    automaticLayout: true,
                  }}
                  onChange={this.onCodeChange}
                  editorDidMount={this.editorDidMount}
                />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab="Configuration"
                key="2"
              >
                <MonacoEditor
                  language="json"
                  theme="vs-dark"
                  value={JSON.stringify(mermaidConfiguration, null, 2)}
                  options={{
                    selectOnLineNumbers: true,
                    automaticLayout: true,
                  }}
                  onChange={this.onMermaidConfigChange}
                  editorDidMount={this.editorDidMount}
                />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab="Examples"
                key="3"
                style={{
                  overflow: 'auto',
                  height: '100vh',
                }}
              >
                <Example />
              </Tabs.TabPane>
            </Tabs>
            <div>
              <Route
                exact
                path={url}
                render={(props) => (
                  <Preview
                    width="100%"
                    height="100%"
                    {...props}
                    code={code}
                  />
                )}
              />
              <Route path={`${url}/error/:base64`} component={Error} />
            </div>
          </SplitPane>
          <div>
            <ul className="marketing-links">
              <li>
                <a href="https://mermaidjs.github.io/" target="_blank">
                  <Icon type="book" />
                  {' '}
                  Mermaid Documentation
                </a>
              </li>
              <li>
                Powered by mermaid
                <Tag color="green">{mermaidVersion}</Tag>
              </li>
            </ul>
          </div>
        </SplitPane>
      </div>
    );
  }
}

export default Edit;
