/* eslint-disable no-param-reassign,jsx-a11y/anchor-is-valid */
import React from 'react';
import { Divider, Card } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Base64 } from 'js-base64';
import mermaid from 'mermaid';

class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.onDownloadSVG = this.onDownloadSVG.bind(this);
  }

  componentDidMount() {
    this.initMermaid();
  }

  componentDidUpdate() {
    this.container.removeAttribute('data-processed');
    this.container.innerHTML = this.props.code;
    this.initMermaid();
  }

  onDownloadSVG(event) {
    event.target.href = `data:image/svg+xml;base64,${Base64.encode(this.container.innerHTML)}`;
    event.target.download = `mermaid-diagram-${moment().format('YYYYMMDDHHmmss')}.svg`;
  }

  initMermaid() {
    const { code, history, match: { url } } = this.props;
    try {
      mermaid.parse(code);
      mermaid.init(undefined, this.container);
    } catch (error) {
      const base64 = Base64.encodeURI(error.str || error.message);
      history.push(`${url}/error/${base64}`);
    }
  }

  render() {
    const { code, match: { url } } = this.props;
    return (
      <div>
        <div className="links">
          <a href="" download="" onClick={this.onDownloadSVG}>Download SVG</a>
          <Divider type="vertical" />
          <Link to={url.replace('/edit/', '/view/')}>Link to View</Link>
        </div>
        <div ref={(div) => { this.container = div; }}>{code}</div>
      </div>
    );
  }
}

export default Preview;
