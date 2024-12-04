import { LightningElement, api } from 'lwc';
import { ZagMixin } from 'c/zagMixin';
import ZagJS from './zag.js'

export default class ZagSelect extends ZagMixin(LightningElement) {

  @api label;
  @api options = [];
  @api defaultLabel = "Select option";

  @api set machineContext(value) {
    this._machineContext = value;
    this.connectZag();
  }
  get machineContext() {
    return this._machineContext;
  }

  get collection() {
    return ZagJS.collection({
      items: this.options,
      itemToString: (item) => item.label,
      itemToValue: (item) => item.value,
    });
  }

  connectedCallback() {
    if (!this.label) {
      throw new Error("zagSelect: label is a required attribute");
    }
    this.connectZag();
  }

  async connectZag() {
    this[ZagMixin.Connect](ZagJS, {
      id: "1",
      onValueChange: (value) => {
        this.dispatchEvent(new CustomEvent("change", { detail: { value } }));
      },
      ...this.machineContext,
      collection: this.collection,
    }, {});
  }

  get rootProps() {
    return this[ZagMixin.Props](this.zagApi?.getRootProps());
  }

  get controlProps() {
    return this[ZagMixin.Props](this.zagApi?.getControlProps());
  }

  get labelProps() {
    return this[ZagMixin.Props](this.zagApi?.getLabelProps());
  }

  get triggerProps() {
    return this[ZagMixin.Props](this.zagApi?.getTriggerProps());
  }

  get buttonLabel() {
    return this.zagApi?.valueAsString || this.defaultLabel;
  }

  // Portal
  get positionerProps() {
    return this[ZagMixin.Props](this.zagApi?.getPositionerProps());
  }

  get contentProps() {
    return this[ZagMixin.Props](this.zagApi?.getContentProps());
  }

  get formattedOptions() {
    return this.options.map((option) => ({
      ...option,
      props: this[ZagMixin.Props](this.zagApi?.getItemProps({ item: option })),
      indicatorProps: this[ZagMixin.Props](this.zagApi?.getItemIndicatorProps({ item: option })),
      value: option.value,
      label: option.label,
    }));
  }
}