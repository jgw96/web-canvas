import {
  LitElement, html, customElement, property
} from 'lit-element';

@customElement('web-canvas')
export class WebCanvas extends LitElement {

  @property() height: number;
  @property() width: number;
  @property() color: string;

  @property() canvas: HTMLCanvasElement;
  @property() canvasContext: CanvasRenderingContext2D;

  firstUpdated() {
    this.setupCanvas();
  }

  setupCanvas() {
    this.canvas = this.shadowRoot.querySelector('canvas');

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.canvasContext = (this.canvas.getContext('2d', {
      desynchronized: true
    }) as CanvasRenderingContext2D);

    this.canvasContext.fillStyle = 'white';
    this.canvasContext.fillRect(0, 0, this.width, this.height);

    this.canvasContext.lineCap = 'round';
    this.canvasContext.lineJoin = 'round';

    this.canvasContext.strokeStyle = this.color;

    this.canvasContext.lineWidth = 10;

    if ("getContextAttributes" in this.canvasContext && (this.canvasContext as any).getContextAttributes().desynchronized) {
      console.log('Low latency canvas supported. Yay!');
    } else {
      console.log('Low latency canvas not supported. Boo!');
    }
  }

  render() {
    return html`<canvas></canvas>`;
  }
}