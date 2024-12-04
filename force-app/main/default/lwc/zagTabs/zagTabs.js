import { LightningElement, api } from 'lwc';
import { ZagMixin } from 'c/zagMixin';
import ZagJS from './zag.js'

export default class ZagTabs extends ZagMixin(LightningElement) {
  
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

  get listProps() {
    return this[ZagMixin.Props](this.zagApi?.getListProps());
  }

  handleSlotChange() {
    this.refreshItems();
  }

  zagCallback() {
    this.refreshItems();
  }

  tabs = [];
  refreshItems() {
    this.tabs = [...this.template.querySelectorAll('c-zag-tab')].map((item, idx) => {
      item.props = this[ZagMixin.Props](this.zagApi.getContentProps({ value: idx }));
      return {
        key: item.title,
        label: item.title,
        props: this[ZagMixin.Props](this.zagApi.getTriggerProps({ value: idx })),
      };
    });
  }

}