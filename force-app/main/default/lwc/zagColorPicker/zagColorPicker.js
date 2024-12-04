import { LightningElement, api } from 'lwc';
import { ZagMixin } from 'c/zagMixin';
import ZagJS from './zag.js';

export default class ZagColorPicker extends ZagMixin(LightningElement) {

  @api set machineContext(value) {
    this.zagMachineContext = value;
    this.connectZag();
  }
  get machineContext() {
    return this.zagMachineContext;
  }

  renderedCallback() {
    if (!this._connected) {
      this._connected = true;
      this.connectZag();
    }
  }

  ready = true;
  async connectZag() {
    this[ZagMixin.Connect](ZagJS, {
      id: "1",
      value: ZagJS.parse("hsl(0, 100%, 50%)"),
      ...this.machineContext,
      
      // Add Events
    }, {
      root: () => this.zagApi.getRootProps(),
      label: () => this.zagApi.getLabelProps(),
      hiddenInput: () => this.zagApi.getHiddenInputProps(),
      control: () => this.zagApi.getControlProps(),
      trigger: () => this.zagApi.getTriggerProps(),
      transparencyGrid: () => this.zagApi.getTransparencyGridProps({ size: "10px" }),
      swatch: () => this.zagApi.getSwatchProps({ value: this.zagApi.value }),
      channelInput: () => this.zagApi.getChannelInputProps({ channel: "hex" }),
      channelInputAlpha: () => this.zagApi.getChannelInputProps({ channel: "alpha" }),
      positioner: () => this.zagApi.getPositionerProps(),
      content: () => this.zagApi.getContentProps(),
      area: () => this.zagApi.getAreaProps(),
      areaBackground: () => this.zagApi.getAreaBackgroundProps(),
      areaThumb: () => this.zagApi.getAreaThumbProps(),
      channelSliderHue: () => this.zagApi.getChannelSliderProps({ channel: "hue" }),
      channelSliderTrackHue: () => this.zagApi.getChannelSliderTrackProps({ channel: "hue" }),
      channelSliderThumbHue: () => this.zagApi.getChannelSliderThumbProps({ channel: "hue" }),
      channelSliderAlpha: () => this.zagApi.getChannelSliderProps({ channel: "alpha" }),
      transparencyGridAlpha: () => this.zagApi.getTransparencyGridProps({ size: "12px" }),
      channelSliderTrackAlpha: () => this.zagApi.getChannelSliderTrackProps({ channel: "alpha" }),
      channelSliderThumbAlpha: () => this.zagApi.getChannelSliderThumbProps({ channel: "alpha" }),
    });
  }

}