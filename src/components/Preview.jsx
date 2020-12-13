/* eslint-disable no-param-reassign,jsx-a11y/anchor-is-valid,no-undef */
import React from 'react';
import { Divider } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Base64 } from 'js-base64';
import mermaid from 'mermaid';

class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.onDownloadSVG = this.onDownloadSVG.bind(this);
    this.getCanvas = this.getCanvas.bind(this);
    this.onCopyPNG = this.onCopyPNG.bind(this);
    this.onDownloadPNG = this.onDownloadPNG.bind(this);
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
    const a = document.createElement('a');
    a.download = `mermaid-diagram-${moment()
      .format(
        'YYYYMMDDHHmmss',
      )}.svg`;
    a.href = `data:image/svg+xml;base64,${Base64.encode(this.container.innerHTML)}`;
    a.click();
    event.stopPropagation();
    event.preventDefault();
  }

  onCopyPNG(event) {
    event.stopPropagation();
    event.preventDefault();
    this.getCanvas((canvas) => {
      canvas.toBlob((blob) => {
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      });
    });
  }

  onDownloadPNG(event) {
    event.stopPropagation();
    event.preventDefault();
    this.getCanvas((canvas) => {
      const a = document.createElement('a');
      a.download = `mermaid-diagram-${moment().format(
        'YYYYMMDDHHmmss',
      )}.png`;
      a.href = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      a.click();
    });
  }

  getCanvas(cb) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const svg = document.querySelector('svg', this.container);

    canvas.width = svg.viewBox.baseVal.width * 2;
    canvas.height = svg.viewBox.baseVal.height * 2;
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const image = new Image();
    image.onload = () => {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      cb(canvas);
    };
    image.src = `data:image/svg+xml;base64,${Base64.encode(this.container.innerHTML)}`;
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
          <a href="" download="" onClick={this.onDownloadPNG}>Download PNG</a>
          <Divider type="vertical" />
          <a href="" onClick={this.onCopyPNG}>Copy PNG</a>
          <Divider type="vertical" />
          <Link to={url.replace('/edit/', '/view/')}>Link to View</Link>
        </div>
        <div ref={(div) => { this.container = div; }}>{code}</div>
      </div>
    );
  }
}

export default Preview;
