import { LightningElement, api } from 'lwc';
import { ZagMixin } from 'c/zagMixin';
import ZagJS from './zag.js'

export default class ZagAccordion extends ZagMixin(LightningElement) {

  @api itemSelector = 'c-zag-accordion-item';

  @api set machineContext(value) {
    this._machineContext = value;
    this.connectZag();
  }
  get machineContext() {
    return this._machineContext;
  }

  connectedCallback() {
    this.connectZag();
  }

  async connectZag() {
    this[ZagMixin.Connect](ZagJS, {
      id: "1",
      ...this.machineContext,
    }, {});
  }

  get rootProps() {
    return this[ZagMixin.Props](this.zagApi?.getRootProps());
  }

  handleSlotChange() {
    this.refreshItems();
  }

  zagCallback() {
    this.refreshItems();
  }

  refreshItems() {
    [...this.template.querySelectorAll(this.itemSelector)].forEach((item) => {
      item.props = this[ZagMixin.Props](this.zagApi.getItemProps({ value: item.title }));
      item.triggerProps = this[ZagMixin.Props](this.zagApi.getItemTriggerProps({ value: item.title }));
      item.contentProps = this[ZagMixin.Props](this.zagApi.getItemContentProps({ value: item.title }));
    });
  }
  get formattedItems() {
    return this.items.map((item) => ({
      ...item,
      props: this[ZagMixin.Props](this.zagApi.getItemProps({ value: item.title })),
      triggerProps: this[ZagMixin.Props](this.zagApi.getItemTriggerProps({ value: item.title })),
      contentProps: this[ZagMixin.Props](this.zagApi.getItemContentProps({ value: item.title })),
    }));
  }

}