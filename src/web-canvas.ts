import {
  LitElement, html, customElement, property
} from 'lit-element';

@customElement('web-canvas')
export class WebCanvas extends LitElement {

  @property() canvas: HTMLCanvasElement;
  @property() canvasContext: CanvasRenderingContext2D;

  firstUpdated() {
    this.setupCanvas();
  }

  setupCanvas() {
    this.canvas = this.shadowRoot.querySelector('canvas');
  }

  render() {
    return html`<canvas></canvas>`;
  }
}