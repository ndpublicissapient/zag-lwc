import { LightningElement, api } from 'lwc';

export default class ZagTab extends LightningElement {

  @api title;
  @api props = {};

  connectedCallback() {
    if (!this.title) {
      throw new Error('zagAccordionItem: title is a required property');
    }
    // this.setAttribute('exposeparts', 'item,item-trigger,item-content,open,closed,focus');
  }
}