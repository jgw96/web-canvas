import {
  LitElement, html, customElement, property
} from 'lit-element';

@customElement('web-canvas')
export class WebCanvas extends LitElement {

  @property({ type: Number }) height: number;
  @property({ type: Number }) width: number;
  @property({ type: String }) color: string;
  @property({ type: Array }) colors: any[];
  @property({ type: String }) mode: string = 'pen';

  @property() canvas: HTMLCanvasElement;
  @property() canvasContext: CanvasRenderingContext2D;

  @property({ type: Boolean }) drawing: boolean = true;

  @property({ type: Boolean }) showcontrols: boolean = false;

  mousePos: any;
  lastPos: any;
  rect: DOMRect;

  constructor() {
    super();

    this.colors = ['red', 'black', 'green', 'blue'];

    this.color = 'red';
  }

  firstUpdated() {
    this.setupCanvas();
  }

  setupCanvas() {
    this.canvas = this.shadowRoot.querySelector('canvas');

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.rect = this.canvas.getBoundingClientRect();

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

    this.setupDrawingEvents();

    this.renderCanvas();
  }

  setupDrawingEvents() {
    this.drawing = false;

    this.mousePos = { x: 0, y: 0 };

    this.canvas.addEventListener("pointerdown", (e) => {
      if (e.button !== 2) {
        this.lastPos = this.getMousePos(e);

        if (e.pointerType !== 'touch') {
          this.drawing = true;
        }
      }
    });

    this.canvas.addEventListener("pointermove", (e: PointerEvent) => {
      this.mousePos = this.getMousePos(e);

      if (e.pointerType === "touch") {
        this.drawing = true;
      }
    });

    this.canvas.addEventListener("pointerup", (e: PointerEvent) => {
      this.drawing = false;
      this.lastPos = null;
    });
  }

  getMousePos(event: PointerEvent) {
    return {
      x: event.clientX - this.rect.left,
      y: event.clientY - this.rect.top,
      width: event.width,
      type: event.pointerType,
      ctrlKey: event.ctrlKey,
      pressure: event.pressure,
      button: event.button,
      buttons: event.buttons
    };
  }

  erase() {
    this.mode = "erase";
  }

  pen() {
    this.mode = "pen";
  }

  changeColor(color: string) {
    console.log(color);
    this.color = color;
  }

  renderCanvas() {
    if (this.drawing !== false && this.mode === 'pen') {

      if (this.color) {
        this.canvasContext.strokeStyle = this.color;
      }

      if (this.lastPos) {
        this.canvasContext.globalCompositeOperation = 'source-over';
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(this.lastPos.x, this.lastPos.y);
        this.canvasContext.lineTo(this.mousePos.x, this.mousePos.y);

        if (this.mousePos.type === 'pen') {
          let tweakedPressure = this.mousePos.pressure * 6;
          this.canvasContext.lineWidth = this.mousePos.width + tweakedPressure;

          if (this.mousePos.buttons === 32 && this.mousePos.button === -1) {
            // eraser

            this.canvasContext.globalCompositeOperation = 'destination-out';
            this.canvasContext.beginPath();
            this.canvasContext.moveTo(this.lastPos.x, this.lastPos.y);
            this.canvasContext.lineTo(this.mousePos.x, this.mousePos.y);

            this.canvasContext.lineWidth = 60;

            this.canvasContext.stroke();
            this.canvasContext.closePath();

            this.lastPos = this.mousePos;
          }
        }
        else if (this.mousePos.type !== 'mouse' && this.mousePos.type !== 'pen') {
          this.canvasContext.lineWidth = this.mousePos.width - 20;
        }
        else if (this.mousePos.type !== 'touch' && this.mousePos.type !== 'pen') {
          this.canvasContext.lineWidth = 10;
        }

        this.canvasContext.stroke();
        this.canvasContext.closePath();
      }

      this.lastPos = this.mousePos;

    }
    else if (this.drawing !== false && this.mode === 'erase') {
      this.canvasContext.globalCompositeOperation = 'destination-out';
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(this.lastPos.x, this.lastPos.y);
      this.canvasContext.lineTo(this.mousePos.x, this.mousePos.y);

      if (this.mousePos.type === 'mouse') {
        this.canvasContext.lineWidth = 30;
      }

      this.canvasContext.stroke();
      this.canvasContext.closePath();

      this.lastPos = this.mousePos;
    }

    requestAnimationFrame(() => this.renderCanvas());
  }

  render() {
    return html`
      <div>
        <canvas></canvas>

        ${
      this.showcontrols ? html`
          <div id="controls">

            <div id="penControls">
              <button  @click="${this.pen}">pen</button>
              <button  @click="${this.erase}">erase</button>
            </div>

            <div id="colors">
              ${
                this.colors.map((color) => {
                  return html`
                    <button @click="${() => this.changeColor(color)}">${color}</button>
                  `
                })
              }
            </div>
          </div>` : null
      }
      </div>
    `;
  }
}