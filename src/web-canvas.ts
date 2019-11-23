import {
    LitElement, html, customElement
} from 'lit-element';

@customElement('web-canvas')
export class WebCanvas extends LitElement {
    render() {
      return html`<h1>Hello world</h1>`;
    }
}