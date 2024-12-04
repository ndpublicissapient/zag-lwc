/* eslint-disable | Bundled from ZagJS | colorPicker | Version 0.77.1 */
// src/create-anatomy.ts
var createAnatomy = (name, parts = []) => ({
  parts: (...values) => {
    if (isEmpty(parts)) {
      return createAnatomy(name, values);
    }
    throw new Error("createAnatomy().parts(...) should only be called once. Did you mean to use .extendWith(...) ?");
  },
  extendWith: (...values) => createAnatomy(name, [...parts, ...values]),
  rename: (newName) => createAnatomy(newName, parts),
  keys: () => parts,
  build: () => [...new Set(parts)].reduce(
    (prev, part) => Object.assign(prev, {
      [part]: {
        selector: [
          `&[data-scope="${toKebabCase(name)}"][data-part="${toKebabCase(part)}"]`,
          `& [data-scope="${toKebabCase(name)}"][data-part="${toKebabCase(part)}"]`
        ].join(", "),
        attrs: { "data-scope": toKebabCase(name), "data-part": toKebabCase(part) }
      }
    }),
    {}
  )
});
var toKebabCase = (value) => value.replace(/([A-Z])([A-Z])/g, "$1-$2").replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase();
var isEmpty = (v) => v.length === 0;

// src/index.ts
function getRoundedValue(value, minValue, step) {
  return Math.round((value - minValue) / step) * step + minValue;
}
function clampValue(value, minValue, maxValue) {
  return Math.min(Math.max(value, minValue), maxValue);
}
function getValuePercent(value, minValue, maxValue) {
  return (value - minValue) / (maxValue - minValue);
}
function getPercentValue(percent, minValue, maxValue, step) {
  const value = percent * (maxValue - minValue) + minValue;
  const roundedValue = getRoundedValue(value, minValue, step);
  return clampValue(roundedValue, minValue, maxValue);
}
function roundToStepPrecision(value, step) {
  let roundedValue = value;
  let stepString = step.toString();
  let pointIndex = stepString.indexOf(".");
  let precision = pointIndex >= 0 ? stepString.length - pointIndex : 0;
  if (precision > 0) {
    let pow = Math.pow(10, precision);
    roundedValue = Math.round(roundedValue * pow) / pow;
  }
  return roundedValue;
}
function snapValueToStep(value, min, max, step) {
  min = Number(min);
  max = Number(max);
  let remainder = (value - (isNaN(min) ? 0 : min)) % step;
  let snappedValue = roundToStepPrecision(
    Math.abs(remainder) * 2 >= step ? value + Math.sign(remainder) * (step - Math.abs(remainder)) : value - remainder,
    step
  );
  if (!isNaN(min)) {
    if (snappedValue < min) {
      snappedValue = min;
    } else if (!isNaN(max) && snappedValue > max) {
      snappedValue = min + Math.floor(roundToStepPrecision((max - min) / step, step)) * step;
    }
  } else if (!isNaN(max) && snappedValue > max) {
    snappedValue = Math.floor(roundToStepPrecision(max / step, step)) * step;
  }
  snappedValue = roundToStepPrecision(snappedValue, step);
  return snappedValue;
}
function toFixedNumber(value, digits = 0, base = 10) {
  const pow = Math.pow(base, digits);
  return Math.round(value * pow) / pow;
}
function mod(value, modulo) {
  return (value % modulo + modulo) % modulo;
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, key + "" , value);

// src/color-format-gradient.ts
var generateRGB_R = (orientation, dir, zValue) => {
  const maskImage = `linear-gradient(to ${orientation[Number(!dir)]}, transparent, #000)`;
  const result = {
    areaStyles: {
      backgroundImage: `linear-gradient(to ${orientation[Number(dir)]},rgb(${zValue},0,0),rgb(${zValue},255,0))`
    },
    areaGradientStyles: {
      backgroundImage: `linear-gradient(to ${orientation[Number(dir)]},rgb(${zValue},0,255),rgb(${zValue},255,255))`,
      WebkitMaskImage: maskImage,
      maskImage
    }
  };
  return result;
};
var generateRGB_G = (orientation, dir, zValue) => {
  const maskImage = `linear-gradient(to ${orientation[Number(!dir)]}, transparent, #000)`;
  const result = {
    areaStyles: {
      backgroundImage: `linear-gradient(to ${orientation[Number(dir)]},rgb(0,${zValue},0),rgb(255,${zValue},0))`
    },
    areaGradientStyles: {
      backgroundImage: `linear-gradient(to ${orientation[Number(dir)]},rgb(0,${zValue},255),rgb(255,${zValue},255))`,
      WebkitMaskImage: maskImage,
      maskImage
    }
  };
  return result;
};
var generateRGB_B = (orientation, dir, zValue) => {
  const maskImage = `linear-gradient(to ${orientation[Number(!dir)]}, transparent, #000)`;
  const result = {
    areaStyles: {
      backgroundImage: `linear-gradient(to ${orientation[Number(dir)]},rgb(0,0,${zValue}),rgb(255,0,${zValue}))`
    },
    areaGradientStyles: {
      backgroundImage: `linear-gradient(to ${orientation[Number(dir)]},rgb(0,255,${zValue}),rgb(255,255,${zValue}))`,
      WebkitMaskImage: maskImage,
      maskImage
    }
  };
  return result;
};
var generateHSL_H = (orientation, dir, zValue) => {
  const result = {
    areaStyles: {},
    areaGradientStyles: {
      background: [
        `linear-gradient(to ${orientation[Number(dir)]}, hsla(0,0%,0%,1) 0%, hsla(0,0%,0%,0) 50%, hsla(0,0%,100%,0) 50%, hsla(0,0%,100%,1) 100%)`,
        `linear-gradient(to ${orientation[Number(!dir)]},hsl(0,0%,50%),hsla(0,0%,50%,0))`,
        `hsl(${zValue}, 100%, 50%)`
      ].join(",")
    }
  };
  return result;
};
var generateHSL_S = (orientation, dir, alphaValue) => {
  const result = {
    areaStyles: {},
    areaGradientStyles: {
      background: [
        `linear-gradient(to ${orientation[Number(!dir)]}, hsla(0,0%,0%,${alphaValue}) 0%, hsla(0,0%,0%,0) 50%, hsla(0,0%,100%,0) 50%, hsla(0,0%,100%,${alphaValue}) 100%)`,
        `linear-gradient(to ${orientation[Number(dir)]},hsla(0,100%,50%,${alphaValue}),hsla(60,100%,50%,${alphaValue}),hsla(120,100%,50%,${alphaValue}),hsla(180,100%,50%,${alphaValue}),hsla(240,100%,50%,${alphaValue}),hsla(300,100%,50%,${alphaValue}),hsla(359,100%,50%,${alphaValue}))`,
        "hsl(0, 0%, 50%)"
      ].join(",")
    }
  };
  return result;
};
var generateHSL_L = (orientation, dir, zValue) => {
  const result = {
    areaStyles: {},
    areaGradientStyles: {
      backgroundImage: [
        `linear-gradient(to ${orientation[Number(!dir)]},hsl(0,0%,${zValue}%),hsla(0,0%,${zValue}%,0))`,
        `linear-gradient(to ${orientation[Number(dir)]},hsl(0,100%,${zValue}%),hsl(60,100%,${zValue}%),hsl(120,100%,${zValue}%),hsl(180,100%,${zValue}%),hsl(240,100%,${zValue}%),hsl(300,100%,${zValue}%),hsl(360,100%,${zValue}%))`
      ].join(",")
    }
  };
  return result;
};
var generateHSB_H = (orientation, dir, zValue) => {
  const result = {
    areaStyles: {},
    areaGradientStyles: {
      background: [
        `linear-gradient(to ${orientation[Number(dir)]},hsl(0,0%,0%),hsla(0,0%,0%,0))`,
        `linear-gradient(to ${orientation[Number(!dir)]},hsl(0,0%,100%),hsla(0,0%,100%,0))`,
        `hsl(${zValue}, 100%, 50%)`
      ].join(",")
    }
  };
  return result;
};
var generateHSB_S = (orientation, dir, alphaValue) => {
  const result = {
    areaStyles: {},
    areaGradientStyles: {
      background: [
        `linear-gradient(to ${orientation[Number(!dir)]},hsla(0,0%,0%,${alphaValue}),hsla(0,0%,0%,0))`,
        `linear-gradient(to ${orientation[Number(dir)]},hsla(0,100%,50%,${alphaValue}),hsla(60,100%,50%,${alphaValue}),hsla(120,100%,50%,${alphaValue}),hsla(180,100%,50%,${alphaValue}),hsla(240,100%,50%,${alphaValue}),hsla(300,100%,50%,${alphaValue}),hsla(359,100%,50%,${alphaValue}))`,
        `linear-gradient(to ${orientation[Number(!dir)]},hsl(0,0%,0%),hsl(0,0%,100%))`
      ].join(",")
    }
  };
  return result;
};
var generateHSB_B = (orientation, dir, alphaValue) => {
  const result = {
    areaStyles: {},
    areaGradientStyles: {
      background: [
        `linear-gradient(to ${orientation[Number(!dir)]},hsla(0,0%,100%,${alphaValue}),hsla(0,0%,100%,0))`,
        `linear-gradient(to ${orientation[Number(dir)]},hsla(0,100%,50%,${alphaValue}),hsla(60,100%,50%,${alphaValue}),hsla(120,100%,50%,${alphaValue}),hsla(180,100%,50%,${alphaValue}),hsla(240,100%,50%,${alphaValue}),hsla(300,100%,50%,${alphaValue}),hsla(359,100%,50%,${alphaValue}))`,
        "#000"
      ].join(",")
    }
  };
  return result;
};

// src/area-gradient.ts
function getColorAreaGradient(color, options) {
  const { xChannel, yChannel, dir: dirProp = "ltr" } = options;
  const { zChannel } = color.getColorAxes({ xChannel, yChannel });
  const zValue = color.getChannelValue(zChannel);
  const { minValue: zMin, maxValue: zMax } = color.getChannelRange(zChannel);
  const orientation = ["top", dirProp === "rtl" ? "left" : "right"];
  let dir = false;
  let background = { areaStyles: {}, areaGradientStyles: {} };
  let alphaValue = (zValue - zMin) / (zMax - zMin);
  let isHSL = color.getFormat() === "hsla";
  switch (zChannel) {
    case "red": {
      dir = xChannel === "green";
      background = generateRGB_R(orientation, dir, zValue);
      break;
    }
    case "green": {
      dir = xChannel === "red";
      background = generateRGB_G(orientation, dir, zValue);
      break;
    }
    case "blue": {
      dir = xChannel === "red";
      background = generateRGB_B(orientation, dir, zValue);
      break;
    }
    case "hue": {
      dir = xChannel !== "saturation";
      if (isHSL) {
        background = generateHSL_H(orientation, dir, zValue);
      } else {
        background = generateHSB_H(orientation, dir, zValue);
      }
      break;
    }
    case "saturation": {
      dir = xChannel === "hue";
      if (isHSL) {
        background = generateHSL_S(orientation, dir, alphaValue);
      } else {
        background = generateHSB_S(orientation, dir, alphaValue);
      }
      break;
    }
    case "brightness": {
      dir = xChannel === "hue";
      background = generateHSB_B(orientation, dir, alphaValue);
      break;
    }
    case "lightness": {
      dir = xChannel === "hue";
      background = generateHSL_L(orientation, dir, zValue);
      break;
    }
  }
  return background;
}
var isEqualObject = (a, b) => {
  if (Object.keys(a).length !== Object.keys(b).length) return false;
  for (let key in a) if (a[key] !== b[key]) return false;
  return true;
};
var Color = class {
  toHexInt() {
    return this.toFormat("rgba").toHexInt();
  }
  getChannelValue(channel) {
    if (channel in this) return this[channel];
    throw new Error("Unsupported color channel: " + channel);
  }
  getChannelValuePercent(channel, valueToCheck) {
    const value = valueToCheck ?? this.getChannelValue(channel);
    const { minValue, maxValue } = this.getChannelRange(channel);
    return getValuePercent(value, minValue, maxValue);
  }
  getChannelPercentValue(channel, percentToCheck) {
    const { minValue, maxValue, step } = this.getChannelRange(channel);
    const percentValue = getPercentValue(percentToCheck, minValue, maxValue, step);
    return snapValueToStep(percentValue, minValue, maxValue, step);
  }
  withChannelValue(channel, value) {
    const { minValue, maxValue } = this.getChannelRange(channel);
    if (channel in this) {
      let clone = this.clone();
      clone[channel] = clampValue(value, minValue, maxValue);
      return clone;
    }
    throw new Error("Unsupported color channel: " + channel);
  }
  getColorAxes(xyChannels) {
    let { xChannel, yChannel } = xyChannels;
    let xCh = xChannel || this.getChannels().find((c) => c !== yChannel);
    let yCh = yChannel || this.getChannels().find((c) => c !== xCh);
    let zCh = this.getChannels().find((c) => c !== xCh && c !== yCh);
    return { xChannel: xCh, yChannel: yCh, zChannel: zCh };
  }
  incrementChannel(channel, stepSize) {
    const { minValue, maxValue, step } = this.getChannelRange(channel);
    const value = snapValueToStep(
      clampValue(this.getChannelValue(channel) + stepSize, minValue, maxValue),
      minValue,
      maxValue,
      step
    );
    return this.withChannelValue(channel, value);
  }
  decrementChannel(channel, stepSize) {
    return this.incrementChannel(channel, -stepSize);
  }
  isEqual(color) {
    const isSame = isEqualObject(this.toJSON(), color.toJSON());
    return isSame && this.getChannelValue("alpha") === color.getChannelValue("alpha");
  }
};
var _RGBColor = class _RGBColor extends Color {
  constructor(red, green, blue, alpha) {
    super();
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
  }
  static parse(value) {
    let colors = [];
    if (/^#[\da-f]+$/i.test(value) && [4, 5, 7, 9].includes(value.length)) {
      const values = (value.length < 6 ? value.replace(/[^#]/gi, "$&$&") : value).slice(1).split("");
      while (values.length > 0) {
        colors.push(parseInt(values.splice(0, 2).join(""), 16));
      }
      colors[3] = colors[3] !== void 0 ? colors[3] / 255 : void 0;
    }
    const match = value.match(/^rgba?\((.*)\)$/);
    if (match?.[1]) {
      colors = match[1].split(",").map((value2) => Number(value2.trim())).map((num, i) => clampValue(num, 0, i < 3 ? 255 : 1));
    }
    return colors.length < 3 ? void 0 : new _RGBColor(colors[0], colors[1], colors[2], colors[3] ?? 1);
  }
  toString(format) {
    switch (format) {
      case "hex":
        return "#" + (this.red.toString(16).padStart(2, "0") + this.green.toString(16).padStart(2, "0") + this.blue.toString(16).padStart(2, "0")).toUpperCase();
      case "hexa":
        return "#" + (this.red.toString(16).padStart(2, "0") + this.green.toString(16).padStart(2, "0") + this.blue.toString(16).padStart(2, "0") + Math.round(this.alpha * 255).toString(16).padStart(2, "0")).toUpperCase();
      case "rgb":
        return `rgb(${this.red}, ${this.green}, ${this.blue})`;
      case "css":
      case "rgba":
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
      case "hsl":
        return this.toHSL().toString("hsl");
      case "hsb":
        return this.toHSB().toString("hsb");
      default:
        return this.toFormat(format).toString(format);
    }
  }
  toFormat(format) {
    switch (format) {
      case "rgba":
        return this;
      case "hsba":
        return this.toHSB();
      case "hsla":
        return this.toHSL();
      default:
        throw new Error("Unsupported color conversion: rgb -> " + format);
    }
  }
  toHexInt() {
    return this.red << 16 | this.green << 8 | this.blue;
  }
  /**
   * Converts an RGB color value to HSB.
   * Conversion formula adapted from https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB.
   * @returns An HSBColor object.
   */
  toHSB() {
    const red = this.red / 255;
    const green = this.green / 255;
    const blue = this.blue / 255;
    const min = Math.min(red, green, blue);
    const brightness = Math.max(red, green, blue);
    const chroma = brightness - min;
    const saturation = brightness === 0 ? 0 : chroma / brightness;
    let hue = 0;
    if (chroma !== 0) {
      switch (brightness) {
        case red:
          hue = (green - blue) / chroma + (green < blue ? 6 : 0);
          break;
        case green:
          hue = (blue - red) / chroma + 2;
          break;
        case blue:
          hue = (red - green) / chroma + 4;
          break;
      }
      hue /= 6;
    }
    return new HSBColor(
      toFixedNumber(hue * 360, 2),
      toFixedNumber(saturation * 100, 2),
      toFixedNumber(brightness * 100, 2),
      toFixedNumber(this.alpha, 2)
    );
  }
  /**
   * Converts an RGB color value to HSL.
   * Conversion formula adapted from https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB.
   * @returns An HSLColor object.
   */
  toHSL() {
    const red = this.red / 255;
    const green = this.green / 255;
    const blue = this.blue / 255;
    const min = Math.min(red, green, blue);
    const max = Math.max(red, green, blue);
    const lightness = (max + min) / 2;
    const chroma = max - min;
    let hue = -1;
    let saturation = -1;
    if (chroma === 0) {
      hue = saturation = 0;
    } else {
      saturation = chroma / (lightness < 0.5 ? max + min : 2 - max - min);
      switch (max) {
        case red:
          hue = (green - blue) / chroma + (green < blue ? 6 : 0);
          break;
        case green:
          hue = (blue - red) / chroma + 2;
          break;
        case blue:
          hue = (red - green) / chroma + 4;
          break;
      }
      hue /= 6;
    }
    return new HSLColor(
      toFixedNumber(hue * 360, 2),
      toFixedNumber(saturation * 100, 2),
      toFixedNumber(lightness * 100, 2),
      toFixedNumber(this.alpha, 2)
    );
  }
  clone() {
    return new _RGBColor(this.red, this.green, this.blue, this.alpha);
  }
  getChannelFormatOptions(channel) {
    switch (channel) {
      case "red":
      case "green":
      case "blue":
        return { style: "decimal" };
      case "alpha":
        return { style: "percent" };
      default:
        throw new Error("Unknown color channel: " + channel);
    }
  }
  formatChannelValue(channel, locale) {
    let options = this.getChannelFormatOptions(channel);
    let value = this.getChannelValue(channel);
    return new Intl.NumberFormat(locale, options).format(value);
  }
  getChannelRange(channel) {
    switch (channel) {
      case "red":
      case "green":
      case "blue":
        return { minValue: 0, maxValue: 255, step: 1, pageSize: 17 };
      case "alpha":
        return { minValue: 0, maxValue: 1, step: 0.01, pageSize: 0.1 };
      default:
        throw new Error("Unknown color channel: " + channel);
    }
  }
  toJSON() {
    return { r: this.red, g: this.green, b: this.blue, a: this.alpha };
  }
  getFormat() {
    return "rgba";
  }
  getChannels() {
    return _RGBColor.colorChannels;
  }
};
__publicField$1(_RGBColor, "colorChannels", ["red", "green", "blue"]);
var RGBColor = _RGBColor;

// src/hsl-color.ts
var HSL_REGEX = /hsl\(([-+]?\d+(?:.\d+)?\s*,\s*[-+]?\d+(?:.\d+)?%\s*,\s*[-+]?\d+(?:.\d+)?%)\)|hsla\(([-+]?\d+(?:.\d+)?\s*,\s*[-+]?\d+(?:.\d+)?%\s*,\s*[-+]?\d+(?:.\d+)?%\s*,\s*[-+]?\d(.\d+)?)\)/;
var _HSLColor = class _HSLColor extends Color {
  constructor(hue, saturation, lightness, alpha) {
    super();
    this.hue = hue;
    this.saturation = saturation;
    this.lightness = lightness;
    this.alpha = alpha;
  }
  static parse(value) {
    let m;
    if (m = value.match(HSL_REGEX)) {
      const [h, s, l, a] = (m[1] ?? m[2]).split(",").map((n) => Number(n.trim().replace("%", "")));
      return new _HSLColor(mod(h, 360), clampValue(s, 0, 100), clampValue(l, 0, 100), clampValue(a ?? 1, 0, 1));
    }
  }
  toString(format) {
    switch (format) {
      case "hex":
        return this.toRGB().toString("hex");
      case "hexa":
        return this.toRGB().toString("hexa");
      case "hsl":
        return `hsl(${this.hue}, ${toFixedNumber(this.saturation, 2)}%, ${toFixedNumber(this.lightness, 2)}%)`;
      case "css":
      case "hsla":
        return `hsla(${this.hue}, ${toFixedNumber(this.saturation, 2)}%, ${toFixedNumber(this.lightness, 2)}%, ${this.alpha})`;
      case "hsb":
        return this.toHSB().toString("hsb");
      case "rgb":
        return this.toRGB().toString("rgb");
      default:
        return this.toFormat(format).toString(format);
    }
  }
  toFormat(format) {
    switch (format) {
      case "hsla":
        return this;
      case "hsba":
        return this.toHSB();
      case "rgba":
        return this.toRGB();
      default:
        throw new Error("Unsupported color conversion: hsl -> " + format);
    }
  }
  /**
   * Converts a HSL color to HSB.
   * Conversion formula adapted from https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_HSV.
   * @returns An HSBColor object.
   */
  toHSB() {
    let saturation = this.saturation / 100;
    let lightness = this.lightness / 100;
    let brightness = lightness + saturation * Math.min(lightness, 1 - lightness);
    saturation = brightness === 0 ? 0 : 2 * (1 - lightness / brightness);
    return new HSBColor(
      toFixedNumber(this.hue, 2),
      toFixedNumber(saturation * 100, 2),
      toFixedNumber(brightness * 100, 2),
      toFixedNumber(this.alpha, 2)
    );
  }
  /**
   * Converts a HSL color to RGB.
   * Conversion formula adapted from https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB_alternative.
   * @returns An RGBColor object.
   */
  toRGB() {
    let hue = this.hue;
    let saturation = this.saturation / 100;
    let lightness = this.lightness / 100;
    let a = saturation * Math.min(lightness, 1 - lightness);
    let fn = (n, k = (n + hue / 30) % 12) => lightness - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return new RGBColor(
      Math.round(fn(0) * 255),
      Math.round(fn(8) * 255),
      Math.round(fn(4) * 255),
      toFixedNumber(this.alpha, 2)
    );
  }
  clone() {
    return new _HSLColor(this.hue, this.saturation, this.lightness, this.alpha);
  }
  getChannelFormatOptions(channel) {
    switch (channel) {
      case "hue":
        return { style: "unit", unit: "degree", unitDisplay: "narrow" };
      case "saturation":
      case "lightness":
      case "alpha":
        return { style: "percent" };
      default:
        throw new Error("Unknown color channel: " + channel);
    }
  }
  formatChannelValue(channel, locale) {
    let options = this.getChannelFormatOptions(channel);
    let value = this.getChannelValue(channel);
    if (channel === "saturation" || channel === "lightness") {
      value /= 100;
    }
    return new Intl.NumberFormat(locale, options).format(value);
  }
  getChannelRange(channel) {
    switch (channel) {
      case "hue":
        return { minValue: 0, maxValue: 360, step: 1, pageSize: 15 };
      case "saturation":
      case "lightness":
        return { minValue: 0, maxValue: 100, step: 1, pageSize: 10 };
      case "alpha":
        return { minValue: 0, maxValue: 1, step: 0.01, pageSize: 0.1 };
      default:
        throw new Error("Unknown color channel: " + channel);
    }
  }
  toJSON() {
    return { h: this.hue, s: this.saturation, l: this.lightness, a: this.alpha };
  }
  getFormat() {
    return "hsla";
  }
  getChannels() {
    return _HSLColor.colorChannels;
  }
};
__publicField$1(_HSLColor, "colorChannels", ["hue", "saturation", "lightness"]);
var HSLColor = _HSLColor;

// src/hsb-color.ts
var HSB_REGEX = /hsb\(([-+]?\d+(?:.\d+)?\s*,\s*[-+]?\d+(?:.\d+)?%\s*,\s*[-+]?\d+(?:.\d+)?%)\)|hsba\(([-+]?\d+(?:.\d+)?\s*,\s*[-+]?\d+(?:.\d+)?%\s*,\s*[-+]?\d+(?:.\d+)?%\s*,\s*[-+]?\d(.\d+)?)\)/;
var _HSBColor = class _HSBColor extends Color {
  constructor(hue, saturation, brightness, alpha) {
    super();
    this.hue = hue;
    this.saturation = saturation;
    this.brightness = brightness;
    this.alpha = alpha;
  }
  static parse(value) {
    let m;
    if (m = value.match(HSB_REGEX)) {
      const [h, s, b, a] = (m[1] ?? m[2]).split(",").map((n) => Number(n.trim().replace("%", "")));
      return new _HSBColor(mod(h, 360), clampValue(s, 0, 100), clampValue(b, 0, 100), clampValue(a ?? 1, 0, 1));
    }
  }
  toString(format) {
    switch (format) {
      case "css":
        return this.toHSL().toString("css");
      case "hex":
        return this.toRGB().toString("hex");
      case "hexa":
        return this.toRGB().toString("hexa");
      case "hsb":
        return `hsb(${this.hue}, ${toFixedNumber(this.saturation, 2)}%, ${toFixedNumber(this.brightness, 2)}%)`;
      case "hsba":
        return `hsba(${this.hue}, ${toFixedNumber(this.saturation, 2)}%, ${toFixedNumber(this.brightness, 2)}%, ${this.alpha})`;
      case "hsl":
        return this.toHSL().toString("hsl");
      case "rgb":
        return this.toRGB().toString("rgb");
      default:
        return this.toFormat(format).toString(format);
    }
  }
  toFormat(format) {
    switch (format) {
      case "hsba":
        return this;
      case "hsla":
        return this.toHSL();
      case "rgba":
        return this.toRGB();
      default:
        throw new Error("Unsupported color conversion: hsb -> " + format);
    }
  }
  /**
   * Converts a HSB color to HSL.
   * Conversion formula adapted from https://en.wikipedia.org/wiki/HSL_and_HSV#HSV_to_HSL.
   * @returns An HSLColor object.
   */
  toHSL() {
    let saturation = this.saturation / 100;
    let brightness = this.brightness / 100;
    let lightness = brightness * (1 - saturation / 2);
    saturation = lightness === 0 || lightness === 1 ? 0 : (brightness - lightness) / Math.min(lightness, 1 - lightness);
    return new HSLColor(
      toFixedNumber(this.hue, 2),
      toFixedNumber(saturation * 100, 2),
      toFixedNumber(lightness * 100, 2),
      toFixedNumber(this.alpha, 2)
    );
  }
  /**
   * Converts a HSV color value to RGB.
   * Conversion formula adapted from https://en.wikipedia.org/wiki/HSL_and_HSV#HSV_to_RGB_alternative.
   * @returns An RGBColor object.
   */
  toRGB() {
    let hue = this.hue;
    let saturation = this.saturation / 100;
    let brightness = this.brightness / 100;
    let fn = (n, k = (n + hue / 60) % 6) => brightness - saturation * brightness * Math.max(Math.min(k, 4 - k, 1), 0);
    return new RGBColor(
      Math.round(fn(5) * 255),
      Math.round(fn(3) * 255),
      Math.round(fn(1) * 255),
      toFixedNumber(this.alpha, 2)
    );
  }
  clone() {
    return new _HSBColor(this.hue, this.saturation, this.brightness, this.alpha);
  }
  getChannelFormatOptions(channel) {
    switch (channel) {
      case "hue":
        return { style: "unit", unit: "degree", unitDisplay: "narrow" };
      case "saturation":
      case "brightness":
      case "alpha":
        return { style: "percent" };
      default:
        throw new Error("Unknown color channel: " + channel);
    }
  }
  formatChannelValue(channel, locale) {
    let options = this.getChannelFormatOptions(channel);
    let value = this.getChannelValue(channel);
    if (channel === "saturation" || channel === "brightness") {
      value /= 100;
    }
    return new Intl.NumberFormat(locale, options).format(value);
  }
  getChannelRange(channel) {
    switch (channel) {
      case "hue":
        return { minValue: 0, maxValue: 360, step: 1, pageSize: 15 };
      case "saturation":
      case "brightness":
        return { minValue: 0, maxValue: 100, step: 1, pageSize: 10 };
      case "alpha":
        return { minValue: 0, maxValue: 1, step: 0.01, pageSize: 0.1 };
      default:
        throw new Error("Unknown color channel: " + channel);
    }
  }
  toJSON() {
    return { h: this.hue, s: this.saturation, b: this.brightness, a: this.alpha };
  }
  getFormat() {
    return "hsba";
  }
  getChannels() {
    return _HSBColor.colorChannels;
  }
};
__publicField$1(_HSBColor, "colorChannels", ["hue", "saturation", "brightness"]);
var HSBColor = _HSBColor;

// src/native-color.ts
var nativeColors = "aliceblue:f0f8ff,antiquewhite:faebd7,aqua:00ffff,aquamarine:7fffd4,azure:f0ffff,beige:f5f5dc,bisque:ffe4c4,black:000000,blanchedalmond:ffebcd,blue:0000ff,blueviolet:8a2be2,brown:a52a2a,burlywood:deb887,cadetblue:5f9ea0,chartreuse:7fff00,chocolate:d2691e,coral:ff7f50,cornflowerblue:6495ed,cornsilk:fff8dc,crimson:dc143c,cyan:00ffff,darkblue:00008b,darkcyan:008b8b,darkgoldenrod:b8860b,darkgray:a9a9a9,darkgreen:006400,darkkhaki:bdb76b,darkmagenta:8b008b,darkolivegreen:556b2f,darkorange:ff8c00,darkorchid:9932cc,darkred:8b0000,darksalmon:e9967a,darkseagreen:8fbc8f,darkslateblue:483d8b,darkslategray:2f4f4f,darkturquoise:00ced1,darkviolet:9400d3,deeppink:ff1493,deepskyblue:00bfff,dimgray:696969,dodgerblue:1e90ff,firebrick:b22222,floralwhite:fffaf0,forestgreen:228b22,fuchsia:ff00ff,gainsboro:dcdcdc,ghostwhite:f8f8ff,gold:ffd700,goldenrod:daa520,gray:808080,green:008000,greenyellow:adff2f,honeydew:f0fff0,hotpink:ff69b4,indianred:cd5c5c,indigo:4b0082,ivory:fffff0,khaki:f0e68c,lavender:e6e6fa,lavenderblush:fff0f5,lawngreen:7cfc00,lemonchiffon:fffacd,lightblue:add8e6,lightcoral:f08080,lightcyan:e0ffff,lightgoldenrodyellow:fafad2,lightgrey:d3d3d3,lightgreen:90ee90,lightpink:ffb6c1,lightsalmon:ffa07a,lightseagreen:20b2aa,lightskyblue:87cefa,lightslategray:778899,lightsteelblue:b0c4de,lightyellow:ffffe0,lime:00ff00,limegreen:32cd32,linen:faf0e6,magenta:ff00ff,maroon:800000,mediumaquamarine:66cdaa,mediumblue:0000cd,mediumorchid:ba55d3,mediumpurple:9370d8,mediumseagreen:3cb371,mediumslateblue:7b68ee,mediumspringgreen:00fa9a,mediumturquoise:48d1cc,mediumvioletred:c71585,midnightblue:191970,mintcream:f5fffa,mistyrose:ffe4e1,moccasin:ffe4b5,navajowhite:ffdead,navy:000080,oldlace:fdf5e6,olive:808000,olivedrab:6b8e23,orange:ffa500,orangered:ff4500,orchid:da70d6,palegoldenrod:eee8aa,palegreen:98fb98,paleturquoise:afeeee,palevioletred:d87093,papayawhip:ffefd5,peachpuff:ffdab9,peru:cd853f,pink:ffc0cb,plum:dda0dd,powderblue:b0e0e6,purple:800080,rebeccapurple:663399,red:ff0000,rosybrown:bc8f8f,royalblue:4169e1,saddlebrown:8b4513,salmon:fa8072,sandybrown:f4a460,seagreen:2e8b57,seashell:fff5ee,sienna:a0522d,silver:c0c0c0,skyblue:87ceeb,slateblue:6a5acd,slategray:708090,snow:fffafa,springgreen:00ff7f,steelblue:4682b4,tan:d2b48c,teal:008080,thistle:d8bfd8,tomato:ff6347,turquoise:40e0d0,violet:ee82ee,wheat:f5deb3,white:ffffff,whitesmoke:f5f5f5,yellow:ffff00,yellowgreen:9acd32";
var makeMap = (str) => {
  const map = /* @__PURE__ */ new Map();
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    const [key, val] = list[i].split(":");
    map.set(key, `#${val}`);
    if (key.includes("gray")) map.set(key.replace("gray", "grey"), `#${val}`);
  }
  return map;
};
var nativeColorMap = makeMap(nativeColors);

// src/parse-color.ts
var parseColor = (value) => {
  if (nativeColorMap.has(value)) {
    return parseColor(nativeColorMap.get(value));
  }
  const result = RGBColor.parse(value) || HSBColor.parse(value) || HSLColor.parse(value);
  if (!result) {
    const error = new Error("Invalid color value: " + value);
    Error.captureStackTrace?.(error, parseColor);
    throw error;
  }
  return result;
};
var normalizeColor = (v) => {
  return typeof v === "string" ? parseColor(v) : v;
};

// src/attrs.ts
var dataAttr = (guard) => guard ? "" : void 0;

// src/is.ts
var ELEMENT_NODE = 1;
var DOCUMENT_NODE = 9;
var DOCUMENT_FRAGMENT_NODE = 11;
var isObject$2 = (v) => typeof v === "object" && v !== null;
var isHTMLElement$1 = (el) => isObject$2(el) && el.nodeType === ELEMENT_NODE && typeof el.nodeName === "string";
var isDocument = (el) => isObject$2(el) && el.nodeType === DOCUMENT_NODE;
var isWindow = (el) => isObject$2(el) && el === el.window;
var getNodeName$1 = (node) => {
  if (isHTMLElement$1(node)) return node.localName || "";
  return "#document";
};
function isRootElement(node) {
  return ["html", "body", "#document"].includes(getNodeName$1(node));
}
var isNode$1 = (el) => isObject$2(el) && el.nodeType !== void 0;
var isShadowRoot$1 = (el) => isNode$1(el) && el.nodeType === DOCUMENT_FRAGMENT_NODE && "host" in el;

// src/contains.ts
function contains(parent, child) {
  if (!parent || !child) return false;
  if (!isHTMLElement$1(parent) || !isHTMLElement$1(child)) return false;
  return parent === child || parent.contains(child);
}

// src/env.ts
function getDocument(el) {
  if (isDocument(el)) return el;
  if (isWindow(el)) return el.document;
  return el?.ownerDocument ?? document;
}
function getDocumentElement$1(el) {
  return getDocument(el).documentElement;
}
function getWindow$2(el) {
  if (isShadowRoot$1(el)) return getWindow$2(el.host);
  if (isDocument(el)) return el.defaultView ?? window;
  if (isHTMLElement$1(el)) return el.ownerDocument?.defaultView ?? window;
  return window;
}
function getActiveElement(rootNode) {
  let activeElement = rootNode.activeElement;
  while (activeElement?.shadowRoot) {
    const el = activeElement.shadowRoot.activeElement;
    if (el === activeElement) break;
    else activeElement = el;
  }
  return activeElement;
}

// src/platform.ts
var isDom = () => typeof document !== "undefined";
function getPlatform() {
  const agent = navigator.userAgentData;
  return agent?.platform ?? navigator.platform;
}
var pt = (v) => isDom() && v.test(getPlatform());
var isMac = () => pt(/^Mac/);
var isIos = () => pt(/iP(hone|ad|od)|iOS/);
function getComposedPath(event) {
  return event.composedPath?.() ?? event.nativeEvent?.composedPath?.();
}
function getEventTarget(event) {
  const composedPath = getComposedPath(event);
  return composedPath?.[0] ?? event.target;
}

// src/get-parent-node.ts
function getParentNode$1(node) {
  if (getNodeName$1(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot$1(node) && node.host || // Fallback.
    getDocumentElement$1(node)
  );
  return isShadowRoot$1(result) ? result.host : result;
}

// src/tabbable.ts
var isHTMLElement2 = (element) => typeof element === "object" && element !== null && element.nodeType === 1;
var isFrame = (element) => isHTMLElement2(element) && element.tagName === "IFRAME";
function isVisible(el) {
  if (!isHTMLElement2(el)) return false;
  return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
}
function hasNegativeTabIndex(element) {
  const tabIndex = parseInt(element.getAttribute("tabindex") || "0", 10);
  return tabIndex < 0;
}
var focusableSelector = "input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], button:not([disabled]), [tabindex], iframe, object, embed, area[href], audio[controls], video[controls], [contenteditable]:not([contenteditable='false']), details > summary:first-of-type";
function isFocusable(element) {
  if (!element || element.closest("[inert]")) return false;
  return element.matches(focusableSelector) && isVisible(element);
}
function getTabbables(container, includeContainer) {
  if (!container) return [];
  const elements = Array.from(container.querySelectorAll(focusableSelector));
  const tabbableElements = elements.filter(isTabbable);
  tabbableElements.forEach((element, i) => {
    if (isFrame(element) && element.contentDocument) {
      const frameBody = element.contentDocument.body;
      const allFrameTabbable = getTabbables(frameBody);
      tabbableElements.splice(i, 1, ...allFrameTabbable);
    }
  });
  if (!tabbableElements.length && includeContainer) {
    return elements;
  }
  return tabbableElements;
}
function isTabbable(el) {
  if (el != null && el.tabIndex > 0) return true;
  return isFocusable(el) && !hasNegativeTabIndex(el);
}

// src/initial-focus.ts
function getInitialFocus(options) {
  const { root, getInitialEl, filter, enabled = true } = options;
  if (!enabled) return;
  let node = null;
  node || (node = typeof getInitialEl === "function" ? getInitialEl() : getInitialEl);
  node || (node = root?.querySelector("[data-autofocus],[autofocus]"));
  if (!node) {
    const tabbables = getTabbables(root);
    node = filter ? tabbables.filter(filter)[0] : tabbables[0];
  }
  return node || root || void 0;
}

// src/is-overflow-element.ts
var OVERFLOW_RE = /auto|scroll|overlay|hidden|clip/;
function isOverflowElement$1(el) {
  const win = getWindow$2(el);
  const { overflow, overflowX, overflowY, display } = win.getComputedStyle(el);
  return OVERFLOW_RE.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
}

// src/raf.ts
function nextTick(fn) {
  const set2 = /* @__PURE__ */ new Set();
  function raf2(fn2) {
    const id = globalThis.requestAnimationFrame(fn2);
    set2.add(() => globalThis.cancelAnimationFrame(id));
  }
  raf2(() => raf2(fn));
  return function cleanup() {
    set2.forEach((fn2) => fn2());
  };
}
function raf(fn) {
  const id = globalThis.requestAnimationFrame(fn);
  return () => {
    globalThis.cancelAnimationFrame(id);
  };
}

// src/overflow.ts
function getNearestOverflowAncestor$1(el) {
  const parentNode = getParentNode$1(el);
  if (isRootElement(parentNode)) {
    return getDocument(parentNode).body;
  }
  if (isHTMLElement$1(parentNode) && isOverflowElement$1(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor$1(parentNode);
}

// src/query.ts
function queryAll(root, selector) {
  return Array.from(root?.querySelectorAll(selector) ?? []);
}
function query(root, selector) {
  return root?.querySelector(selector) ?? null;
}

// src/scope.ts
function createScope(methods) {
  const dom = {
    getRootNode: (ctx) => ctx.getRootNode?.() ?? document,
    getDoc: (ctx) => getDocument(dom.getRootNode(ctx)),
    getWin: (ctx) => dom.getDoc(ctx).defaultView ?? window,
    getActiveElement: (ctx) => getActiveElement(dom.getRootNode(ctx)),
    isActiveElement: (ctx, elem) => elem === dom.getActiveElement(ctx),
    getById: (ctx, id) => dom.getRootNode(ctx).getElementById(id),
    setValue: (elem, value) => {
      if (elem == null || value == null) return;
      const valueAsString = value.toString();
      if (elem.value === valueAsString) return;
      elem.value = value.toString();
    }
  };
  return { ...dom, ...methods };
}

// src/set.ts
var cleanups = /* @__PURE__ */ new WeakMap();
function set$2(element, key, setup) {
  if (!cleanups.has(element)) {
    cleanups.set(element, /* @__PURE__ */ new Map());
  }
  const elementCleanups = cleanups.get(element);
  const prevCleanup = elementCleanups.get(key);
  if (!prevCleanup) {
    elementCleanups.set(key, setup());
    return () => {
      elementCleanups.get(key)?.();
      elementCleanups.delete(key);
    };
  }
  const cleanup = setup();
  const nextCleanup = () => {
    cleanup();
    prevCleanup();
    elementCleanups.delete(key);
  };
  elementCleanups.set(key, nextCleanup);
  return () => {
    const isCurrent = elementCleanups.get(key) === nextCleanup;
    if (!isCurrent) return;
    cleanup();
    elementCleanups.set(key, prevCleanup);
  };
}
function setStyle(element, style) {
  if (!element) return () => {
  };
  const setup = () => {
    const prevStyle = element.style.cssText;
    Object.assign(element.style, style);
    return () => {
      element.style.cssText = prevStyle;
    };
  };
  return set$2(element, "style", setup);
}

// src/visually-hidden.ts
var visuallyHiddenStyle = {
  border: "0",
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: "0",
  position: "absolute",
  width: "1px",
  whiteSpace: "nowrap",
  wordWrap: "normal"
};

// src/wait-for.ts
var fps = 1e3 / 60;
function waitForElement(query2, cb) {
  const el = query2();
  if (isHTMLElement$1(el) && el.isConnected) {
    cb(el);
    return () => void 0;
  } else {
    const timerId = setInterval(() => {
      const el2 = query2();
      if (isHTMLElement$1(el2) && el2.isConnected) {
        cb(el2);
        clearInterval(timerId);
      }
    }, fps);
    return () => clearInterval(timerId);
  }
}
function waitForElements(queries, cb) {
  const cleanups2 = [];
  queries?.forEach((query2) => {
    const clean = waitForElement(query2, cb);
    cleanups2.push(clean);
  });
  return () => {
    cleanups2.forEach((fn) => fn());
  };
}

// src/index.ts
var state = "default";
var userSelect = "";
var elementMap = /* @__PURE__ */ new WeakMap();
function disableTextSelectionImpl(options = {}) {
  const { target, doc } = options;
  const docNode = doc ?? document;
  const rootEl = docNode.documentElement;
  if (isIos()) {
    if (state === "default") {
      userSelect = rootEl.style.webkitUserSelect;
      rootEl.style.webkitUserSelect = "none";
    }
    state = "disabled";
  } else if (target) {
    elementMap.set(target, target.style.userSelect);
    target.style.userSelect = "none";
  }
  return () => restoreTextSelection({ target, doc: docNode });
}
function restoreTextSelection(options = {}) {
  const { target, doc } = options;
  const docNode = doc ?? document;
  const rootEl = docNode.documentElement;
  if (isIos()) {
    if (state !== "disabled") return;
    state = "restoring";
    setTimeout(() => {
      nextTick(() => {
        if (state === "restoring") {
          if (rootEl.style.webkitUserSelect === "none") {
            rootEl.style.webkitUserSelect = userSelect || "";
          }
          userSelect = "";
          state = "default";
        }
      });
    }, 300);
  } else {
    if (target && elementMap.has(target)) {
      const prevUserSelect = elementMap.get(target);
      if (target.style.userSelect === "none") {
        target.style.userSelect = prevUserSelect ?? "";
      }
      if (target.getAttribute("style") === "") {
        target.removeAttribute("style");
      }
      elementMap.delete(target);
    }
  }
}
function disableTextSelection(options = {}) {
  const { defer, target, ...restOptions } = options;
  const func = defer ? raf : (v) => v();
  const cleanups = [];
  cleanups.push(
    func(() => {
      const node = typeof target === "function" ? target() : target;
      cleanups.push(disableTextSelectionImpl({ ...restOptions, target: node }));
    })
  );
  return () => {
    cleanups.forEach((fn) => fn?.());
  };
}

// src/add-dom-event.ts
var addDomEvent = (target, eventName, handler, options) => {
  const node = typeof target === "function" ? target() : target;
  node?.addEventListener(eventName, handler, options);
  return () => {
    node?.removeEventListener(eventName, handler, options);
  };
};
var isLeftClick = (e) => e.button === 0;
var isContextMenuEvent = (e) => {
  return e.button === 2 || isMac() && e.ctrlKey && e.button === 0;
};
var isModifierKey = (e) => e.ctrlKey || e.altKey || e.metaKey;

// src/fire-event.ts
function fireCustomEvent(el, type, init) {
  if (!el) return;
  const win = el.ownerDocument.defaultView || window;
  const event = new win.CustomEvent(type, init);
  return el.dispatchEvent(event);
}

// src/get-event-key.ts
var keyMap = {
  Up: "ArrowUp",
  Down: "ArrowDown",
  Esc: "Escape",
  " ": "Space",
  ",": "Comma",
  Left: "ArrowLeft",
  Right: "ArrowRight"
};
var rtlKeyMap = {
  ArrowLeft: "ArrowRight",
  ArrowRight: "ArrowLeft"
};
function getEventKey(event, options = {}) {
  const { dir = "ltr", orientation = "horizontal" } = options;
  let { key } = event;
  key = keyMap[key] ?? key;
  const isRtl = dir === "rtl" && orientation === "horizontal";
  if (isRtl && key in rtlKeyMap) {
    key = rtlKeyMap[key];
  }
  return key;
}

// src/get-event-point.ts
function pointFromTouch(e, type = "client") {
  const point = e.touches[0] || e.changedTouches[0];
  return { x: point[`${type}X`], y: point[`${type}Y`] };
}
function pointFromMouse(point, type = "client") {
  return { x: point[`${type}X`], y: point[`${type}Y`] };
}
var isTouchEvent = (event) => "touches" in event && event.touches.length > 0;
function getEventPoint(event, type = "client") {
  return isTouchEvent(event) ? pointFromTouch(event, type) : pointFromMouse(event, type);
}

// src/get-event-step.ts
var PAGE_KEYS = /* @__PURE__ */ new Set(["PageUp", "PageDown"]);
var ARROW_KEYS = /* @__PURE__ */ new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);
function getEventStep(event) {
  if (event.ctrlKey || event.metaKey) {
    return 0.1;
  } else {
    const isPageKey = PAGE_KEYS.has(event.key);
    const isSkipKey = isPageKey || event.shiftKey && ARROW_KEYS.has(event.key);
    return isSkipKey ? 10 : 1;
  }
}

// src/get-point-value.ts
function clamp$1(value) {
  return Math.max(0, Math.min(1, value));
}
function getRelativePoint(point, element) {
  const { left, top, width, height } = element.getBoundingClientRect();
  const offset = { x: point.x - left, y: point.y - top };
  const percent = { x: clamp$1(offset.x / width), y: clamp$1(offset.y / height) };
  function getPercentValue(options = {}) {
    const { dir = "ltr", orientation = "horizontal", inverted } = options;
    const invertX = typeof inverted === "object" ? inverted.x : inverted;
    const invertY = typeof inverted === "object" ? inverted.y : inverted;
    if (orientation === "horizontal") {
      return dir === "rtl" || invertX ? 1 - percent.x : percent.x;
    }
    return invertY ? 1 - percent.y : percent.y;
  }
  return { offset, percent, getPercentValue };
}
function trackPointerMove(doc, handlers) {
  const { onPointerMove, onPointerUp } = handlers;
  const history = [];
  const handleMove = (event) => {
    const point = getEventPoint(event);
    history.push({ ...point, timestamp: performance.now() });
    const distance = Math.sqrt(point.x ** 2 + point.y ** 2);
    const moveBuffer = event.pointerType === "touch" ? 10 : 5;
    if (distance < moveBuffer) return;
    if (event.pointerType === "mouse" && event.button === 0) {
      onPointerUp();
      return;
    }
    onPointerMove({ point, event, velocity: getVelocity(history, 0.1) });
  };
  const cleanups = [
    addDomEvent(doc, "pointermove", handleMove, false),
    addDomEvent(doc, "pointerup", onPointerUp, false),
    addDomEvent(doc, "pointercancel", onPointerUp, false),
    addDomEvent(doc, "contextmenu", onPointerUp, false),
    disableTextSelection({ doc })
  ];
  return () => {
    cleanups.forEach((cleanup) => cleanup());
    history.length = 0;
  };
}
function lastDevicePoint(history) {
  return history[history.length - 1];
}
function ms(seconds) {
  return seconds * 1e3;
}
function sec(milliseconds) {
  return milliseconds / 1e3;
}
function getVelocity(history, timeDelta) {
  if (history.length < 2) return { x: 0, y: 0 };
  let i = history.length - 1;
  let timestampedPoint = null;
  const lastPoint = lastDevicePoint(history);
  while (i >= 0) {
    timestampedPoint = history[i];
    if (lastPoint.timestamp - timestampedPoint.timestamp > ms(timeDelta)) {
      break;
    }
    i--;
  }
  if (!timestampedPoint) return { x: 0, y: 0 };
  const time = sec(lastPoint.timestamp - timestampedPoint.timestamp);
  if (time === 0) return { x: 0, y: 0 };
  const currentVelocity = {
    x: (lastPoint.x - timestampedPoint.x) / time,
    y: (lastPoint.y - timestampedPoint.y) / time
  };
  if (currentVelocity.x === Infinity) currentVelocity.x = 0;
  if (currentVelocity.y === Infinity) currentVelocity.y = 0;
  return {
    x: Math.abs(currentVelocity.x),
    y: Math.abs(currentVelocity.y)
  };
}

/**
 * Custom positioning reference element.
 * @see https://floating-ui.com/docs/virtual-elements
 */

const sides = ['top', 'right', 'bottom', 'left'];
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = v => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
const oppositeAlignmentMap = {
  start: 'end',
  end: 'start'
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === 'function' ? value(param) : value;
}
function getSide(placement) {
  return placement.split('-')[0];
}
function getAlignment(placement) {
  return placement.split('-')[1];
}
function getOppositeAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}
function getAxisLength(axis) {
  return axis === 'y' ? 'height' : 'width';
}
function getSideAxis(placement) {
  return ['top', 'bottom'].includes(getSide(placement)) ? 'y' : 'x';
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, alignment => oppositeAlignmentMap[alignment]);
}
function getSideList(side, isStart, rtl) {
  const lr = ['left', 'right'];
  const rl = ['right', 'left'];
  const tb = ['top', 'bottom'];
  const bt = ['bottom', 'top'];
  switch (side) {
    case 'top':
    case 'bottom':
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;
    case 'left':
    case 'right':
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === 'start', rtl);
  if (alignment) {
    list = list.map(side => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, side => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== 'number' ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}

function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === 'y';
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case 'top':
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case 'bottom':
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case 'right':
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case 'left':
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case 'start':
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case 'end':
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
const computePosition$1 = async (reference, floating, config) => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
  let rects = await platform.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = 'clippingAncestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === 'floating' ? 'reference' : 'floating';
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform.getClippingRect({
    element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === 'floating' ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
  const offsetScale = (await (platform.isElement == null ? void 0 : platform.isElement(offsetParent))) ? (await (platform.getScale == null ? void 0 : platform.getScale(offsetParent))) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow$1 = options => ({
  name: 'arrow',
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform,
      elements,
      middlewareData
    } = state;
    // Since `element` is required, we don't Partial<> the type.
    const {
      element,
      padding = 0
    } = evaluate(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = getPaddingObject(padding);
    const coords = {
      x,
      y
    };
    const axis = getAlignmentAxis(placement);
    const length = getAxisLength(axis);
    const arrowDimensions = await platform.getDimensions(element);
    const isYAxis = axis === 'y';
    const minProp = isYAxis ? 'top' : 'left';
    const maxProp = isYAxis ? 'bottom' : 'right';
    const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

    // DOM platform can return `window` as the `offsetParent`.
    if (!clientSize || !(await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent)))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;

    // If the padding is large enough that it causes the arrow to no longer be
    // centered, modify the padding so that it is centered.
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = min(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);

    // Make sure the arrow doesn't overflow the floating element if the center
    // point is outside the floating element's bounds.
    const min$1 = minPadding;
    const max = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset = clamp(min$1, center, max);

    // If the reference is small enough that the arrow's padding causes it to
    // to point to nothing for an aligned placement, adjust the offset of the
    // floating element itself. To ensure `shift()` continues to take action,
    // a single reset is performed when this is true.
    const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset,
        centerOffset: center - offset - alignmentOffset,
        ...(shouldAddOffset && {
          alignmentOffset
        })
      },
      reset: shouldAddOffset
    };
  }
});

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip$1 = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'flip',
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = 'bestFit',
        fallbackAxisSideDirection = 'none',
        flipAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state);

      // If a reset by the arrow was caused due to an alignment offset being
      // added, we should skip any logic now since `flip()` has already done its
      // work.
      // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = getSide(placement);
      const initialSideAxis = getSideAxis(initialPlacement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== 'none';
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];

      // One or more sides is overflowing.
      if (!overflows.every(side => side <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          // Try next placement and re-run the lifecycle.
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }

        // First, find the candidates that fit on the mainAxis side of overflow,
        // then find the placement that fits the best on the main crossAxis side.
        let resetPlacement = (_overflowsData$filter = overflowsData.filter(d => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;

        // Otherwise fallback.
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case 'bestFit':
              {
                var _overflowsData$filter2;
                const placement = (_overflowsData$filter2 = overflowsData.filter(d => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = getSideAxis(d.placement);
                    return currentSideAxis === initialSideAxis ||
                    // Create a bias to the `y` side axis due to horizontal
                    // reading directions favoring greater width.
                    currentSideAxis === 'y';
                  }
                  return true;
                }).map(d => [d.placement, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement) {
                  resetPlacement = placement;
                }
                break;
              }
            case 'initialPlacement':
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};

function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return sides.some(side => overflow[side] >= 0);
}
/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide$1 = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'hide',
    options,
    async fn(state) {
      const {
        rects
      } = state;
      const {
        strategy = 'referenceHidden',
        ...detectOverflowOptions
      } = evaluate(options, state);
      switch (strategy) {
        case 'referenceHidden':
          {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              elementContext: 'reference'
            });
            const offsets = getSideOffsets(overflow, rects.reference);
            return {
              data: {
                referenceHiddenOffsets: offsets,
                referenceHidden: isAnySideFullyClipped(offsets)
              }
            };
          }
        case 'escaped':
          {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              altBoundary: true
            });
            const offsets = getSideOffsets(overflow, rects.floating);
            return {
              data: {
                escapedOffsets: offsets,
                escaped: isAnySideFullyClipped(offsets)
              }
            };
          }
        default:
          {
            return {};
          }
      }
    }
  };
};

// For type backwards-compatibility, the `OffsetOptions` type was also
// Derivable.

async function convertValueToCoords(state, options) {
  const {
    placement,
    platform,
    elements
  } = state;
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === 'y';
  const mainAxisMulti = ['left', 'top'].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);

  // eslint-disable-next-line prefer-const
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === 'number' ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === 'number') {
    crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset$1 = function (options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: 'offset',
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);

      // If the placement is the same and the arrow caused an alignment offset
      // then we don't need to change the positioning coordinates.
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift$1 = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'shift',
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: _ref => {
            let {
              x,
              y
            } = _ref;
            return {
              x,
              y
            };
          }
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === 'y' ? 'top' : 'left';
        const maxSide = mainAxis === 'y' ? 'bottom' : 'right';
        const min = mainAxisCoord + overflow[minSide];
        const max = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min, mainAxisCoord, max);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === 'y' ? 'top' : 'left';
        const maxSide = crossAxis === 'y' ? 'bottom' : 'right';
        const min = crossAxisCoord + overflow[minSide];
        const max = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min, crossAxisCoord, max);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift$1 = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const crossAxis = getSideAxis(placement);
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = evaluate(offset, state);
      const computedOffset = typeof rawOffset === 'number' ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...rawOffset
      };
      if (checkMainAxis) {
        const len = mainAxis === 'y' ? 'height' : 'width';
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === 'y' ? 'width' : 'height';
        const isOriginSide = ['top', 'left'].includes(getSide(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size$1 = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'size',
    options,
    async fn(state) {
      var _state$middlewareData, _state$middlewareData2;
      const {
        placement,
        rects,
        platform,
        elements
      } = state;
      const {
        apply = () => {},
        ...detectOverflowOptions
      } = evaluate(options, state);
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const side = getSide(placement);
      const alignment = getAlignment(placement);
      const isYAxis = getSideAxis(placement) === 'y';
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === 'top' || side === 'bottom') {
        heightSide = side;
        widthSide = alignment === ((await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating))) ? 'start' : 'end') ? 'left' : 'right';
      } else {
        widthSide = side;
        heightSide = alignment === 'end' ? 'top' : 'bottom';
      }
      const maximumClippingHeight = height - overflow.top - overflow.bottom;
      const maximumClippingWidth = width - overflow.left - overflow.right;
      const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
      const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
      const noShift = !state.middlewareData.shift;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
        availableWidth = maximumClippingWidth;
      }
      if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
        availableHeight = maximumClippingHeight;
      }
      if (noShift && !alignment) {
        const xMin = max(overflow.left, 0);
        const xMax = max(overflow.right, 0);
        const yMin = max(overflow.top, 0);
        const yMax = max(overflow.bottom, 0);
        if (isYAxis) {
          availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
        } else {
          availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
        }
      }
      await apply({
        ...state,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};

function hasWindow() {
  return typeof window !== 'undefined';
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || '').toLowerCase();
  }
  // Mocked nodes in testing environments may not be instances of Node. By
  // returning `#document` an infinite loop won't occur.
  // https://github.com/floating-ui/floating-ui/issues/2317
  return '#document';
}
function getWindow$1(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow$1(value).Node;
}
function isElement$1(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow$1(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow$1(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === 'undefined') {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow$1(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !['inline', 'contents'].includes(display);
}
function isTableElement(element) {
  return ['table', 'td', 'th'].includes(getNodeName(element));
}
function isTopLayer(element) {
  return [':popover-open', ':modal'].some(selector => {
    try {
      return element.matches(selector);
    } catch (e) {
      return false;
    }
  });
}
function isContainingBlock(elementOrCss) {
  const webkit = isWebKit();
  const css = isElement$1(elementOrCss) ? getComputedStyle(elementOrCss) : elementOrCss;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  return css.transform !== 'none' || css.perspective !== 'none' || (css.containerType ? css.containerType !== 'normal' : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== 'none' : false) || !webkit && (css.filter ? css.filter !== 'none' : false) || ['transform', 'perspective', 'filter'].some(value => (css.willChange || '').includes(value)) || ['paint', 'layout', 'strict', 'content'].some(value => (css.contain || '').includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === 'undefined' || !CSS.supports) return false;
  return CSS.supports('-webkit-backdrop-filter', 'none');
}
function isLastTraversableNode(node) {
  return ['html', 'body', '#document'].includes(getNodeName(node));
}
function getComputedStyle(element) {
  return getWindow$1(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement$1(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === 'html') {
    return node;
  }
  const result =
  // Step into the shadow DOM of the parent of a slotted node.
  node.assignedSlot ||
  // DOM Element detected.
  node.parentNode ||
  // ShadowRoot detected.
  isShadowRoot(node) && node.host ||
  // Fallback.
  getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow$1(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}

function getCssDimensions(element) {
  const css = getComputedStyle(element);
  // In testing environments, the `width` and `height` properties are empty
  // strings for SVG elements, returning NaN. Fallback to `0` in this case.
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}

function unwrapElement(element) {
  return !isElement$1(element) ? element.contextElement : element;
}

function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y = ($ ? round(rect.height) : rect.height) / height;

  // 0, NaN, or Infinity should always fallback to 1.

  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}

const noOffsets = /*#__PURE__*/createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow$1(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow$1(element)) {
    return false;
  }
  return isFixed;
}

function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement$1(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow$1(domElement);
    const offsetWin = offsetParent && isElement$1(offsetParent) ? getWindow$1(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = getFrameElement(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = getWindow$1(currentIFrame);
      currentIFrame = getFrameElement(currentWin);
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
}

// If <html> has a CSS width greater than the viewport, then this will be
// incorrect for RTL.
function getWindowScrollBarX(element, rect) {
  const leftScroll = getNodeScroll(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}

function getHTMLOffset(documentElement, scroll, ignoreScrollbarX) {
  if (ignoreScrollbarX === void 0) {
    ignoreScrollbarX = false;
  }
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - (ignoreScrollbarX ? 0 :
  // RTL <body> scrollbar.
  getWindowScrollBarX(documentElement, htmlRect));
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}

function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === 'fixed';
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll, true) : createCoords(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}

function getClientRects(element) {
  return Array.from(element.getClientRects());
}

// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable.
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle(body).direction === 'rtl') {
    x += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}

function getViewportRect(element, strategy) {
  const win = getWindow$1(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === 'viewport') {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === 'document') {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement$1(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement$1(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle(parentNode).position === 'fixed' || hasFixedPositionAncestor(parentNode, stopNode);
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter(el => isElement$1(el) && getNodeName(el) !== 'body');
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle(element).position === 'fixed';
  let currentNode = elementIsFixed ? getParentNode(element) : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while (isElement$1(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === 'fixed') {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === 'static' && !!currentContainingBlockComputedStyle && ['absolute', 'fixed'].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      // Drop non-containing blocks.
      result = result.filter(ancestor => ancestor !== currentNode);
    } else {
      // Record last containing block for next iteration.
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors.
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === 'clippingAncestors' ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}

function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}

function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === 'fixed';
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      // If the <body> scrollbar appears on the left (e.g. RTL systems). Use
      // Firefox with layout.scrollbar.side = 3 in about:config to test this.
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}

function isStaticPositioned(element) {
  return getComputedStyle(element).position === 'static';
}

function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle(element).position === 'fixed') {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;

  // Firefox returns the <html> element as the offsetParent if it's non-static,
  // while Chrome and Safari return the <body> element. The <body> element must
  // be used to perform the correct calculations even if the <html> element is
  // non-static.
  if (getDocumentElement(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
function getOffsetParent(element, polyfill) {
  const win = getWindow$1(element);
  if (isTopLayer(element)) {
    return win;
  }
  if (!isHTMLElement(element)) {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement$1(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
    return win;
  }
  return offsetParent || getContainingBlock(element) || win;
}

const getElementRects = async function (data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};

function isRTL(element) {
  return getComputedStyle(element).direction === 'rtl';
}

const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement: isElement$1,
  isRTL
};

// https://samthor.au/2021/observing-dom/
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = getDocumentElement(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const {
      left,
      top,
      width,
      height
    } = element.getBoundingClientRect();
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          // If the reference is clipped, the ratio is 0. Throttle the refresh
          // to prevent an infinite loop of updates.
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1000);
        } else {
          refresh(false, ratio);
        }
      }
      isFirstUpdate = false;
    }

    // Older browsers don't support a `document` as the root and will throw an
    // error.
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}

/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === 'function',
    layoutShift = typeof IntersectionObserver === 'function',
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...(referenceEl ? getOverflowAncestors(referenceEl) : []), ...getOverflowAncestors(floating)] : [];
  ancestors.forEach(ancestor => {
    ancestorScroll && ancestor.addEventListener('scroll', update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener('resize', update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver(_ref => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        // Prevent update loops when using the `size` middleware.
        // https://github.com/floating-ui/floating-ui/issues/1740
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach(ancestor => {
      ancestorScroll && ancestor.removeEventListener('scroll', update);
      ancestorResize && ancestor.removeEventListener('resize', update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = offset$1;

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = shift$1;

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = flip$1;

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = size$1;

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = hide$1;

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = arrow$1;

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = limitShift$1;

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 */
const computePosition = (reference, floating, options) => {
  // This caches the expensive `getClippingElementAncestors` function so that
  // multiple lifecycle resets re-use the same result. It only lives for a
  // single call. If other functions become expensive, we can add them as well.
  const cache = new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition$1(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};

// src/array.ts
function clear(v) {
  while (v.length > 0) v.pop();
  return v;
}

// src/functions.ts
var runIfFn = (v, ...a) => {
  const res = typeof v === "function" ? v(...a) : v;
  return res ?? void 0;
};
var cast = (v) => v;
var noop = () => {
};
var callAll = (...fns) => (...a) => {
  fns.forEach(function(fn) {
    fn?.(...a);
  });
};
var uuid = /* @__PURE__ */ (() => {
  let id = 0;
  return () => {
    id++;
    return id.toString(36);
  };
})();
var tryCatch = (fn, fallback) => {
  try {
    return fn();
  } catch (error) {
    if (error instanceof Error) {
      Error.captureStackTrace?.(error, tryCatch);
    }
    return fallback?.();
  }
};
var isArray = (v) => Array.isArray(v);
var isObjectLike = (v) => v != null && typeof v === "object";
var isObject$1 = (v) => isObjectLike(v) && !isArray(v);
var isNumber = (v) => typeof v === "number" && !Number.isNaN(v);
var isString = (v) => typeof v === "string";
var isFunction = (v) => typeof v === "function";
var isNull = (v) => v == null;
var hasProp = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
var baseGetTag = (v) => Object.prototype.toString.call(v);
var fnToString = Function.prototype.toString;
var objectCtorString = fnToString.call(Object);
var isPlainObject = (v) => {
  if (!isObjectLike(v) || baseGetTag(v) != "[object Object]") return false;
  const proto = Object.getPrototypeOf(v);
  if (proto === null) return true;
  const Ctor = hasProp(proto, "constructor") && proto.constructor;
  return typeof Ctor == "function" && Ctor instanceof Ctor && fnToString.call(Ctor) == objectCtorString;
};

// src/object.ts
function compact(obj) {
  if (!isPlainObject2(obj) || obj === void 0) {
    return obj;
  }
  const keys = Reflect.ownKeys(obj).filter((key) => typeof key === "string");
  const filtered = {};
  for (const key of keys) {
    const value = obj[key];
    if (value !== void 0) {
      filtered[key] = compact(value);
    }
  }
  return filtered;
}
var isPlainObject2 = (value) => {
  return value && typeof value === "object" && value.constructor === Object;
};

// src/warning.ts
function warn(...a) {
  const m = a.length === 1 ? a[0] : a[1];
  const c = a.length === 2 ? a[0] : true;
  if (c && "production" !== "production") {
    console.warn(m);
  }
}
function invariant(...a) {
  const m = a.length === 1 ? a[0] : a[1];
  const c = a.length === 2 ? a[0] : true;
  if (c && "production" !== "production") {
    throw new Error(m);
  }
}

// src/get-placement.ts
function createDOMRect(x = 0, y = 0, width = 0, height = 0) {
  if (typeof DOMRect === "function") {
    return new DOMRect(x, y, width, height);
  }
  const rect = {
    x,
    y,
    width,
    height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x
  };
  return { ...rect, toJSON: () => rect };
}
function getDOMRect(anchorRect) {
  if (!anchorRect) return createDOMRect();
  const { x, y, width, height } = anchorRect;
  return createDOMRect(x, y, width, height);
}
function getAnchorElement(anchorElement, getAnchorRect) {
  return {
    contextElement: isHTMLElement$1(anchorElement) ? anchorElement : void 0,
    getBoundingClientRect: () => {
      const anchor = anchorElement;
      const anchorRect = getAnchorRect?.(anchor);
      if (anchorRect || !anchor) {
        return getDOMRect(anchorRect);
      }
      return anchor.getBoundingClientRect();
    }
  };
}

// src/middleware.ts
var toVar = (value) => ({ variable: value, reference: `var(${value})` });
var cssVars = {
  arrowSize: toVar("--arrow-size"),
  arrowSizeHalf: toVar("--arrow-size-half"),
  arrowBg: toVar("--arrow-background"),
  transformOrigin: toVar("--transform-origin"),
  arrowOffset: toVar("--arrow-offset")
};
var getTransformOrigin = (arrow2) => ({
  top: "bottom center",
  "top-start": arrow2 ? `${arrow2.x}px bottom` : "left bottom",
  "top-end": arrow2 ? `${arrow2.x}px bottom` : "right bottom",
  bottom: "top center",
  "bottom-start": arrow2 ? `${arrow2.x}px top` : "top left",
  "bottom-end": arrow2 ? `${arrow2.x}px top` : "top right",
  left: "right center",
  "left-start": arrow2 ? `right ${arrow2.y}px` : "right top",
  "left-end": arrow2 ? `right ${arrow2.y}px` : "right bottom",
  right: "left center",
  "right-start": arrow2 ? `left ${arrow2.y}px` : "left top",
  "right-end": arrow2 ? `left ${arrow2.y}px` : "left bottom"
});
var transformOriginMiddleware = {
  name: "transformOrigin",
  fn({ placement, elements, middlewareData }) {
    const { arrow: arrow2 } = middlewareData;
    const transformOrigin = getTransformOrigin(arrow2)[placement];
    const { floating } = elements;
    floating.style.setProperty(cssVars.transformOrigin.variable, transformOrigin);
    return {
      data: { transformOrigin }
    };
  }
};
var rectMiddleware = {
  name: "rects",
  fn({ rects }) {
    return {
      data: rects
    };
  }
};
var shiftArrowMiddleware = (arrowEl) => {
  if (!arrowEl) return;
  return {
    name: "shiftArrow",
    fn({ placement, middlewareData }) {
      if (!middlewareData.arrow) return {};
      const { x, y } = middlewareData.arrow;
      const dir = placement.split("-")[0];
      Object.assign(arrowEl.style, {
        left: x != null ? `${x}px` : "",
        top: y != null ? `${y}px` : "",
        [dir]: `calc(100% + ${cssVars.arrowOffset.reference})`
      });
      return {};
    }
  };
};
function getPlacementDetails(placement) {
  const [side, align] = placement.split("-");
  return { side, align, hasAlign: align != null };
}

// src/get-placement.ts
var defaultOptions = {
  strategy: "absolute",
  placement: "bottom",
  listeners: true,
  gutter: 8,
  flip: true,
  slide: true,
  overlap: false,
  sameWidth: false,
  fitViewport: false,
  overflowPadding: 8,
  arrowPadding: 4
};
function roundByDpr(win, value) {
  const dpr = win.devicePixelRatio || 1;
  return Math.round(value * dpr) / dpr;
}
function getBoundaryMiddleware(opts) {
  return runIfFn(opts.boundary);
}
function getArrowMiddleware(arrowElement, opts) {
  if (!arrowElement) return;
  return arrow({
    element: arrowElement,
    padding: opts.arrowPadding
  });
}
function getOffsetMiddleware(arrowElement, opts) {
  if (isNull(opts.offset ?? opts.gutter)) return;
  return offset(({ placement }) => {
    const arrowOffset = (arrowElement?.clientHeight || 0) / 2;
    const gutter = opts.offset?.mainAxis ?? opts.gutter;
    const mainAxis = typeof gutter === "number" ? gutter + arrowOffset : gutter ?? arrowOffset;
    const { hasAlign } = getPlacementDetails(placement);
    const shift2 = !hasAlign ? opts.shift : void 0;
    const crossAxis = opts.offset?.crossAxis ?? shift2;
    return compact({
      crossAxis,
      mainAxis,
      alignmentAxis: opts.shift
    });
  });
}
function getFlipMiddleware(opts) {
  if (!opts.flip) return;
  return flip({
    boundary: getBoundaryMiddleware(opts),
    padding: opts.overflowPadding,
    fallbackPlacements: opts.flip === true ? void 0 : opts.flip
  });
}
function getShiftMiddleware(opts) {
  if (!opts.slide && !opts.overlap) return;
  return shift({
    boundary: getBoundaryMiddleware(opts),
    mainAxis: opts.slide,
    crossAxis: opts.overlap,
    padding: opts.overflowPadding,
    limiter: limitShift()
  });
}
function getSizeMiddleware(opts) {
  return size({
    padding: opts.overflowPadding,
    apply({ elements, rects, availableHeight, availableWidth }) {
      const floating = elements.floating;
      const referenceWidth = Math.round(rects.reference.width);
      availableWidth = Math.floor(availableWidth);
      availableHeight = Math.floor(availableHeight);
      floating.style.setProperty("--reference-width", `${referenceWidth}px`);
      floating.style.setProperty("--available-width", `${availableWidth}px`);
      floating.style.setProperty("--available-height", `${availableHeight}px`);
    }
  });
}
function hideWhenDetachedMiddleware(opts) {
  if (!opts.hideWhenDetached) return;
  return hide({ strategy: "referenceHidden", boundary: opts.boundary?.() ?? "clippingAncestors" });
}
function getAutoUpdateOptions(opts) {
  if (!opts) return {};
  if (opts === true) {
    return { ancestorResize: true, ancestorScroll: true, elementResize: true, layoutShift: true };
  }
  return opts;
}
function getPlacementImpl(referenceOrVirtual, floating, opts = {}) {
  const reference = getAnchorElement(referenceOrVirtual, opts.getAnchorRect);
  if (!floating || !reference) return;
  const options = Object.assign({}, defaultOptions, opts);
  const arrowEl = floating.querySelector("[data-part=arrow]");
  const middleware = [
    getOffsetMiddleware(arrowEl, options),
    getFlipMiddleware(options),
    getShiftMiddleware(options),
    getArrowMiddleware(arrowEl, options),
    shiftArrowMiddleware(arrowEl),
    transformOriginMiddleware,
    getSizeMiddleware(options),
    hideWhenDetachedMiddleware(options),
    rectMiddleware
  ];
  const { placement, strategy, onComplete, onPositioned } = options;
  const updatePosition = async () => {
    if (!reference || !floating) return;
    const pos = await computePosition(reference, floating, {
      placement,
      middleware,
      strategy
    });
    onComplete?.(pos);
    onPositioned?.({ placed: true });
    const win = getWindow$2(floating);
    const x = roundByDpr(win, pos.x);
    const y = roundByDpr(win, pos.y);
    floating.style.setProperty("--x", `${x}px`);
    floating.style.setProperty("--y", `${y}px`);
    if (options.hideWhenDetached && pos.middlewareData.hide?.referenceHidden) {
      floating.style.setProperty("visibility", "hidden");
    }
    const contentEl = floating.firstElementChild;
    if (contentEl) {
      const zIndex = win.getComputedStyle(contentEl).zIndex;
      floating.style.setProperty("--z-index", zIndex);
    }
  };
  const update = async () => {
    if (opts.updatePosition) {
      await opts.updatePosition({ updatePosition });
      onPositioned?.({ placed: true });
    } else {
      await updatePosition();
    }
  };
  const autoUpdateOptions = getAutoUpdateOptions(options.listeners);
  const cancelAutoUpdate = options.listeners ? autoUpdate(reference, floating, update, autoUpdateOptions) : noop;
  update();
  return () => {
    cancelAutoUpdate?.();
    onPositioned?.({ placed: false });
  };
}
function getPlacement(referenceOrFn, floatingOrFn, opts = {}) {
  const { defer, ...options } = opts;
  const func = defer ? raf : (v) => v();
  const cleanups = [];
  cleanups.push(
    func(() => {
      const reference = typeof referenceOrFn === "function" ? referenceOrFn() : referenceOrFn;
      const floating = typeof floatingOrFn === "function" ? floatingOrFn() : floatingOrFn;
      cleanups.push(getPlacementImpl(reference, floating, options));
    })
  );
  return () => {
    cleanups.forEach((fn) => fn?.());
  };
}

// src/get-styles.ts
var ARROW_FLOATING_STYLE = {
  bottom: "rotate(45deg)",
  left: "rotate(135deg)",
  top: "rotate(225deg)",
  right: "rotate(315deg)"
};
function getPlacementStyles(options = {}) {
  const { placement, sameWidth, fitViewport, strategy = "absolute" } = options;
  return {
    arrow: {
      position: "absolute",
      width: cssVars.arrowSize.reference,
      height: cssVars.arrowSize.reference,
      [cssVars.arrowSizeHalf.variable]: `calc(${cssVars.arrowSize.reference} / 2)`,
      [cssVars.arrowOffset.variable]: `calc(${cssVars.arrowSizeHalf.reference} * -1)`
    },
    arrowTip: {
      // @ts-expect-error - Fix this
      transform: placement ? ARROW_FLOATING_STYLE[placement.split("-")[0]] : void 0,
      background: cssVars.arrowBg.reference,
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: "inherit"
    },
    floating: {
      position: strategy,
      isolation: "isolate",
      minWidth: sameWidth ? void 0 : "max-content",
      width: sameWidth ? "var(--reference-width)" : void 0,
      maxWidth: fitViewport ? "var(--available-width)" : void 0,
      maxHeight: fitViewport ? "var(--available-height)" : void 0,
      top: "0px",
      left: "0px",
      // move off-screen if placement is not defined
      transform: placement ? "translate3d(var(--x), var(--y), 0)" : "translate3d(0, -100vh, 0)",
      zIndex: "var(--z-index)"
    }
  };
}

/* eslint @typescript-eslint/no-explicit-any: off */
// symbols
const GET_ORIGINAL_SYMBOL = Symbol();
// get object prototype
const getProto = Object.getPrototypeOf;
const objectsToTrack = new WeakMap();
// check if obj is a plain object or an array
const isObjectToTrack = (obj) => obj &&
    (objectsToTrack.has(obj)
        ? objectsToTrack.get(obj)
        : getProto(obj) === Object.prototype || getProto(obj) === Array.prototype);
/**
 * Unwrap proxy to get the original object.
 *
 * Used to retrieve the original object used to create the proxy instance with `createProxy`.
 *
 * @param {Proxy<object>} obj -  The proxy wrapper of the originial object.
 * @returns {object | null} - Return either the unwrapped object if exists.
 *
 * @example
 * import { createProxy, getUntracked } from 'proxy-compare';
 *
 * const original = { a: "1", c: "2", d: { e: "3" } };
 * const affected = new WeakMap();
 *
 * const proxy = createProxy(original, affected);
 * const originalFromProxy = getUntracked(proxy)
 *
 * Object.is(original, originalFromProxy) // true
 * isChanged(original, originalFromProxy, affected) // false
 */
const getUntracked = (obj) => {
    if (isObjectToTrack(obj)) {
        return obj[GET_ORIGINAL_SYMBOL] || null;
    }
    return null;
};
/**
 * Mark object to be tracked.
 *
 * This function marks an object that will be passed into `createProxy`
 * as marked to track or not. By default only Array and Object are marked to track,
 * so this is useful for example to mark a class instance to track or to mark a object
 * to be untracked when creating your proxy.
 *
 * @param obj - Object to mark as tracked or not.
 * @param mark - Boolean indicating whether you want to track this object or not.
 * @returns - No return.
 *
 * @example
 * import { createProxy, markToTrack, isChanged } from 'proxy-compare';
 *
 * const nested = { e: "3" }
 *
 * markToTrack(nested, false)
 *
 * const original = { a: "1", c: "2", d: nested };
 * const affected = new WeakMap();
 *
 * const proxy = createProxy(original, affected);
 *
 * proxy.d.e
 *
 * isChanged(original, { d: { e: "3" } }, affected) // true
 */
const markToTrack = (obj, mark = true) => {
    objectsToTrack.set(obj, mark);
};

// src/global.ts
function getGlobal() {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
}
function makeGlobal(key, value) {
  const g = getGlobal();
  if (!g) return value();
  g[key] || (g[key] = value());
  return g[key];
}
var isObject = (x) => typeof x === "object" && x !== null;
var proxyStateMap = makeGlobal("__zag__proxyStateMap", () => /* @__PURE__ */ new WeakMap());
var refSet = makeGlobal("__zag__refSet", () => /* @__PURE__ */ new WeakSet());
var isReactElement = (x) => typeof x === "object" && x !== null && "$$typeof" in x;
var isVueElement = (x) => typeof x === "object" && x !== null && "__v_isVNode" in x;
var isDOMElement = (x) => typeof x === "object" && x !== null && "nodeType" in x && typeof x.nodeName === "string";
var isElement = (x) => isReactElement(x) || isVueElement(x) || isDOMElement(x);
var buildProxyFunction = (objectIs = Object.is, newProxy = (target, handler) => new Proxy(target, handler), canProxy = (x) => isObject(x) && !refSet.has(x) && (Array.isArray(x) || !(Symbol.iterator in x)) && !isElement(x) && !(x instanceof WeakMap) && !(x instanceof WeakSet) && !(x instanceof Error) && !(x instanceof Number) && !(x instanceof Date) && !(x instanceof String) && !(x instanceof RegExp) && !(x instanceof ArrayBuffer), defaultHandlePromise = (promise) => {
  switch (promise.status) {
    case "fulfilled":
      return promise.value;
    case "rejected":
      throw promise.reason;
    default:
      throw promise;
  }
}, snapCache = /* @__PURE__ */ new WeakMap(), createSnapshot = (target, version, handlePromise = defaultHandlePromise) => {
  const cache = snapCache.get(target);
  if (cache?.[0] === version) {
    return cache[1];
  }
  const snap = Array.isArray(target) ? [] : Object.create(Object.getPrototypeOf(target));
  markToTrack(snap, true);
  snapCache.set(target, [version, snap]);
  Reflect.ownKeys(target).forEach((key) => {
    const value = Reflect.get(target, key);
    if (refSet.has(value)) {
      markToTrack(value, false);
      snap[key] = value;
    } else if (value instanceof Promise) {
      Object.defineProperty(snap, key, {
        get() {
          return handlePromise(value);
        }
      });
    } else if (proxyStateMap.has(value)) {
      snap[key] = snapshot(value, handlePromise);
    } else {
      snap[key] = value;
    }
  });
  return Object.freeze(snap);
}, proxyCache = /* @__PURE__ */ new WeakMap(), versionHolder = [1, 1], proxyFunction2 = (initialObject) => {
  if (!isObject(initialObject)) {
    throw new Error("object required");
  }
  const found = proxyCache.get(initialObject);
  if (found) {
    return found;
  }
  let version = versionHolder[0];
  const listeners = /* @__PURE__ */ new Set();
  const notifyUpdate = (op, nextVersion = ++versionHolder[0]) => {
    if (version !== nextVersion) {
      version = nextVersion;
      listeners.forEach((listener) => listener(op, nextVersion));
    }
  };
  let checkVersion = versionHolder[1];
  const ensureVersion = (nextCheckVersion = ++versionHolder[1]) => {
    if (checkVersion !== nextCheckVersion && !listeners.size) {
      checkVersion = nextCheckVersion;
      propProxyStates.forEach(([propProxyState]) => {
        const propVersion = propProxyState[1](nextCheckVersion);
        if (propVersion > version) {
          version = propVersion;
        }
      });
    }
    return version;
  };
  const createPropListener = (prop) => (op, nextVersion) => {
    const newOp = [...op];
    newOp[1] = [prop, ...newOp[1]];
    notifyUpdate(newOp, nextVersion);
  };
  const propProxyStates = /* @__PURE__ */ new Map();
  const addPropListener = (prop, propProxyState) => {
    if (listeners.size) {
      const remove = propProxyState[3](createPropListener(prop));
      propProxyStates.set(prop, [propProxyState, remove]);
    } else {
      propProxyStates.set(prop, [propProxyState]);
    }
  };
  const removePropListener = (prop) => {
    const entry = propProxyStates.get(prop);
    if (entry) {
      propProxyStates.delete(prop);
      entry[1]?.();
    }
  };
  const addListener = (listener) => {
    listeners.add(listener);
    if (listeners.size === 1) {
      propProxyStates.forEach(([propProxyState, prevRemove], prop) => {
        const remove = propProxyState[3](createPropListener(prop));
        propProxyStates.set(prop, [propProxyState, remove]);
      });
    }
    const removeListener = () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        propProxyStates.forEach(([propProxyState, remove], prop) => {
          if (remove) {
            remove();
            propProxyStates.set(prop, [propProxyState]);
          }
        });
      }
    };
    return removeListener;
  };
  const baseObject = Array.isArray(initialObject) ? [] : Object.create(Object.getPrototypeOf(initialObject));
  const handler = {
    deleteProperty(target, prop) {
      const prevValue = Reflect.get(target, prop);
      removePropListener(prop);
      const deleted = Reflect.deleteProperty(target, prop);
      if (deleted) {
        notifyUpdate(["delete", [prop], prevValue]);
      }
      return deleted;
    },
    set(target, prop, value, receiver) {
      const hasPrevValue = Reflect.has(target, prop);
      const prevValue = Reflect.get(target, prop, receiver);
      if (hasPrevValue && (objectIs(prevValue, value) || proxyCache.has(value) && objectIs(prevValue, proxyCache.get(value)))) {
        return true;
      }
      removePropListener(prop);
      if (isObject(value)) {
        value = getUntracked(value) || value;
      }
      let nextValue = value;
      if (Object.getOwnPropertyDescriptor(target, prop)?.set) ; else if (value instanceof Promise) {
        value.then((v) => {
          Object.assign(value, { status: "fulfilled", value: v });
          notifyUpdate(["resolve", [prop], v]);
        }).catch((e) => {
          Object.assign(value, { status: "rejected", reason: e });
          notifyUpdate(["reject", [prop], e]);
        });
      } else {
        if (!proxyStateMap.has(value) && canProxy(value)) {
          nextValue = proxy(value);
        }
        const childProxyState = !refSet.has(nextValue) && proxyStateMap.get(nextValue);
        if (childProxyState) {
          addPropListener(prop, childProxyState);
        }
      }
      Reflect.set(target, prop, nextValue, receiver);
      notifyUpdate(["set", [prop], value, prevValue]);
      return true;
    }
  };
  const proxyObject = newProxy(baseObject, handler);
  proxyCache.set(initialObject, proxyObject);
  const proxyState = [baseObject, ensureVersion, createSnapshot, addListener];
  proxyStateMap.set(proxyObject, proxyState);
  Reflect.ownKeys(initialObject).forEach((key) => {
    const desc = Object.getOwnPropertyDescriptor(initialObject, key);
    if (desc.get || desc.set) {
      Object.defineProperty(baseObject, key, desc);
    } else {
      proxyObject[key] = initialObject[key];
    }
  });
  return proxyObject;
}) => [
  // public functions
  proxyFunction2,
  // shared state
  proxyStateMap,
  refSet,
  // internal things
  objectIs,
  newProxy,
  canProxy,
  defaultHandlePromise,
  snapCache,
  createSnapshot,
  proxyCache,
  versionHolder
];
var [proxyFunction] = buildProxyFunction();
function proxy(initialObject = {}) {
  return proxyFunction(initialObject);
}
function subscribe(proxyObject, callback, notifyInSync) {
  const proxyState = proxyStateMap.get(proxyObject);
  let promise;
  const ops = [];
  const addListener = proxyState[3];
  let isListenerActive = false;
  const listener = (op) => {
    ops.push(op);
    if (notifyInSync) {
      callback(ops.splice(0));
      return;
    }
    if (!promise) {
      promise = Promise.resolve().then(() => {
        promise = void 0;
        if (isListenerActive) {
          callback(ops.splice(0));
        }
      });
    }
  };
  const removeListener = addListener(listener);
  isListenerActive = true;
  return () => {
    isListenerActive = false;
    removeListener();
  };
}
function snapshot(proxyObject, handlePromise) {
  const proxyState = proxyStateMap.get(proxyObject);
  const [target, ensureVersion, createSnapshot] = proxyState;
  return createSnapshot(target, ensureVersion(), handlePromise);
}
function ref(obj) {
  refSet.add(obj);
  return obj;
}

// src/proxy-computed.ts
function proxyWithComputed(initialObject, computedFns) {
  const keys = Object.keys(computedFns);
  keys.forEach((key) => {
    if (Object.getOwnPropertyDescriptor(initialObject, key)) {
      throw new Error("object property already defined");
    }
    const computedFn = computedFns[key];
    const { get, set } = typeof computedFn === "function" ? { get: computedFn } : computedFn;
    const desc = {};
    desc.get = () => get(snapshot(proxyObject));
    if (set) {
      desc.set = (newValue) => set(proxyObject, newValue);
    }
    Object.defineProperty(initialObject, key, desc);
  });
  const proxyObject = proxy(initialObject);
  return proxyObject;
}

function set$1(obj, key, val) {
	if (typeof val.value === 'object') val.value = klona(val.value);
	if (!val.enumerable || val.get || val.set || !val.configurable || !val.writable || key === '__proto__') {
		Object.defineProperty(obj, key, val);
	} else obj[key] = val.value;
}

function klona(x) {
	if (typeof x !== 'object') return x;

	var i=0, k, list, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		tmp = Object.create(x.__proto__ || null);
	} else if (str === '[object Array]') {
		tmp = Array(x.length);
	} else if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
	} else if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
	} else if (str === '[object Date]') {
		tmp = new Date(+x);
	} else if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
	} else if (str === '[object DataView]') {
		tmp = new x.constructor( klona(x.buffer) );
	} else if (str === '[object ArrayBuffer]') {
		tmp = x.slice(0);
	} else if (str.slice(-6) === 'Array]') {
		// ArrayBuffer.isView(x)
		// ~> `new` bcuz `Buffer.slice` => ref
		tmp = new x.constructor(x);
	}

	if (tmp) {
		for (list=Object.getOwnPropertySymbols(x); i < list.length; i++) {
			set$1(tmp, list[i], Object.getOwnPropertyDescriptor(x, list[i]));
		}

		for (i=0, list=Object.getOwnPropertyNames(x); i < list.length; i++) {
			if (Object.hasOwnProperty.call(tmp, k=list[i]) && tmp[k] === x[k]) continue;
			set$1(tmp, k, Object.getOwnPropertyDescriptor(x, k));
		}
	}

	return tmp || x;
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
function deepMerge(source, ...objects) {
  for (const obj of objects) {
    const target = compact(obj);
    for (const key in target) {
      if (isPlainObject(obj[key])) {
        if (!source[key]) {
          source[key] = {};
        }
        deepMerge(source[key], obj[key]);
      } else {
        source[key] = obj[key];
      }
    }
  }
  return source;
}
function structuredClone(v) {
  return klona(v);
}
function toEvent(event) {
  const obj = isString(event) ? { type: event } : event;
  return obj;
}
function toArray(value) {
  if (!value) return [];
  return isArray(value) ? value.slice() : [value];
}
function isGuardHelper(value) {
  return isObject$1(value) && value.predicate != null;
}

// src/guard-utils.ts
var Truthy = () => true;
function exec(guardMap, ctx, event, meta) {
  return (guard) => {
    if (isString(guard)) {
      return !!guardMap[guard]?.(ctx, event, meta);
    }
    if (isFunction(guard)) {
      return guard(ctx, event, meta);
    }
    return guard.predicate(guardMap)(ctx, event, meta);
  };
}
function or(...conditions) {
  return {
    predicate: (guardMap) => (ctx, event, meta) => conditions.map(exec(guardMap, ctx, event, meta)).some(Boolean)
  };
}
function and$1(...conditions) {
  return {
    predicate: (guardMap) => (ctx, event, meta) => conditions.map(exec(guardMap, ctx, event, meta)).every(Boolean)
  };
}
function not(condition) {
  return {
    predicate: (guardMap) => (ctx, event, meta) => {
      return !exec(guardMap, ctx, event, meta)(condition);
    }
  };
}
function stateIn(...values) {
  return (_ctx, _evt, meta) => meta.state.matches(...values);
}
var guards = { or, and: and$1, not, stateIn };
function determineGuardFn(guard, guardMap) {
  guard = guard ?? Truthy;
  return (context, event, meta) => {
    if (isString(guard)) {
      const value = guardMap[guard];
      return isFunction(value) ? value(context, event, meta) : value;
    }
    if (isGuardHelper(guard)) {
      return guard.predicate(guardMap)(context, event, meta);
    }
    return guard?.(context, event, meta);
  };
}
function determineActionsFn(values, guardMap) {
  return (context, event, meta) => {
    if (isGuardHelper(values)) {
      return values.predicate(guardMap)(context, event, meta);
    }
    return values;
  };
}
function createProxy(config) {
  const computedContext = config.computed ?? cast({});
  const initialContext = config.context ?? cast({});
  const initialTags = config.initial ? config.states?.[config.initial]?.tags : [];
  const state = proxy({
    value: config.initial ?? "",
    previousValue: "",
    event: cast({}),
    previousEvent: cast({}),
    context: proxyWithComputed(initialContext, computedContext),
    done: false,
    tags: initialTags ?? [],
    hasTag(tag) {
      return this.tags.includes(tag);
    },
    matches(...value) {
      return value.includes(this.value);
    },
    can(event) {
      return cast(this).nextEvents.includes(event);
    },
    get nextEvents() {
      const stateEvents = config.states?.[this.value]?.["on"] ?? {};
      const globalEvents = config?.on ?? {};
      return Object.keys({ ...stateEvents, ...globalEvents });
    },
    get changed() {
      if (this.event.value === "machine.init" /* Init */ || !this.previousValue) return false;
      return this.value !== this.previousValue;
    }
  });
  return cast(state);
}
function determineDelayFn(delay, delaysMap) {
  return (context, event) => {
    if (isNumber(delay)) return delay;
    if (isFunction(delay)) {
      return delay(context, event);
    }
    if (isString(delay)) {
      const value = Number.parseFloat(delay);
      if (!Number.isNaN(value)) {
        return value;
      }
      if (delaysMap) {
        const valueOrFn = delaysMap?.[delay];
        invariant(
          valueOrFn == null,
          `[@zag-js/core > determine-delay] Cannot determine delay for \`${delay}\`. It doesn't exist in \`options.delays\``
        );
        return isFunction(valueOrFn) ? valueOrFn(context, event) : valueOrFn;
      }
    }
  };
}
function toTarget(target) {
  return isString(target) ? { target } : target;
}
function determineTransitionFn(transitions, guardMap) {
  return (context, event, meta) => {
    return toArray(transitions).map(toTarget).find((transition) => {
      const determineGuard = determineGuardFn(transition.guard, guardMap);
      const guard = determineGuard(context, event, meta);
      return guard ?? transition.target ?? transition.actions;
    });
  };
}

// src/machine.ts
var Machine = class {
  // Let's get started!
  constructor(config, options) {
    __publicField(this, "status", "Not Started" /* NotStarted */);
    __publicField(this, "state");
    __publicField(this, "initialState");
    __publicField(this, "initialContext");
    __publicField(this, "id");
    __publicField(this, "type", "machine" /* Machine */);
    // Cleanup function map (per state)
    __publicField(this, "activityEvents", /* @__PURE__ */ new Map());
    __publicField(this, "delayedEvents", /* @__PURE__ */ new Map());
    // state update listeners the user can opt-in for
    __publicField(this, "stateListeners", /* @__PURE__ */ new Set());
    __publicField(this, "doneListeners", /* @__PURE__ */ new Set());
    __publicField(this, "contextWatchers", /* @__PURE__ */ new Set());
    // Cleanup functions (for `subscribe`)
    __publicField(this, "removeStateListener", noop);
    // For Parent <==> Spawned Actor relationship
    __publicField(this, "parent");
    __publicField(this, "children", /* @__PURE__ */ new Map());
    // A map of guard, action, delay implementations
    __publicField(this, "guardMap");
    __publicField(this, "actionMap");
    __publicField(this, "delayMap");
    __publicField(this, "activityMap");
    __publicField(this, "sync");
    __publicField(this, "options");
    __publicField(this, "config");
    __publicField(this, "_created", () => {
      const event = toEvent("machine.created" /* Created */);
      this.executeActions(this.config?.created, event);
    });
    // Starts the interpreted machine.
    __publicField(this, "start", (init) => {
      this.state.value = "";
      this.state.tags = [];
      if (this.status === "Running" /* Running */) {
        return this;
      }
      this.status = "Running" /* Running */;
      this.removeStateListener = subscribe(
        this.state,
        () => {
          this.stateListeners.forEach((listener) => {
            listener(this.stateSnapshot);
          });
        },
        this.sync
      );
      this.setupContextWatchers();
      this.executeActivities(toEvent("machine.start" /* Start */), toArray(this.config.activities), "machine.start" /* Start */);
      this.executeActions(this.config.entry, toEvent("machine.start" /* Start */));
      const event = toEvent("machine.init" /* Init */);
      const target = isObject$1(init) ? init.value : init;
      const context = isObject$1(init) ? init.context : void 0;
      if (context) {
        this.setContext(context);
      }
      const transition = {
        target: target ?? this.config.initial
      };
      const next = this.getNextStateInfo(transition, event);
      this.initialState = next;
      this.performStateChangeEffects(this.state.value, next, event);
      return this;
    });
    __publicField(this, "setupContextWatchers", () => {
      const { watch } = this.config;
      if (!watch) return;
      let prev = snapshot(this.state.context);
      const cleanup = subscribe(this.state.context, () => {
        const next = snapshot(this.state.context);
        for (const [key, fn] of Object.entries(watch)) {
          const isEqual = this.options.compareFns?.[key] ?? Object.is;
          if (isEqual(prev[key], next[key])) continue;
          this.executeActions(fn, this.state.event);
        }
        prev = next;
      });
      this.contextWatchers.add(cleanup);
    });
    // Stops the interpreted machine
    __publicField(this, "stop", () => {
      if (this.status === "Stopped" /* Stopped */) return;
      this.performExitEffects(this.state.value, toEvent("machine.stop" /* Stop */));
      this.executeActions(this.config.exit, toEvent("machine.stop" /* Stop */));
      this.setState("");
      this.setEvent("machine.stop" /* Stop */);
      this.stopStateListeners();
      this.stopChildren();
      this.stopActivities();
      this.stopDelayedEvents();
      this.stopContextWatchers();
      this.status = "Stopped" /* Stopped */;
      return this;
    });
    __publicField(this, "stopStateListeners", () => {
      this.removeStateListener();
      this.stateListeners.clear();
    });
    __publicField(this, "stopContextWatchers", () => {
      this.contextWatchers.forEach((fn) => fn());
      this.contextWatchers.clear();
    });
    __publicField(this, "stopDelayedEvents", () => {
      this.delayedEvents.forEach((state) => {
        state.forEach((stop) => stop());
      });
      this.delayedEvents.clear();
    });
    // Cleanup running activities (e.g `setInterval`, invoked callbacks, promises)
    __publicField(this, "stopActivities", (state) => {
      if (state) {
        this.activityEvents.get(state)?.forEach((stop) => stop());
        this.activityEvents.get(state)?.clear();
        this.activityEvents.delete(state);
      } else {
        this.activityEvents.forEach((state2) => {
          state2.forEach((stop) => stop());
          state2.clear();
        });
        this.activityEvents.clear();
      }
    });
    /**
     * Function to send event to spawned child machine or actor
     */
    __publicField(this, "sendChild", (evt, to) => {
      const event = toEvent(evt);
      const id = runIfFn(to, this.contextSnapshot);
      const child = this.children.get(id);
      if (!child) {
        invariant(`[@zag-js/core] Cannot send '${event.type}' event to unknown child`);
      }
      child.send(event);
    });
    /**
     * Function to stop a running child machine or actor
     */
    __publicField(this, "stopChild", (id) => {
      if (!this.children.has(id)) {
        invariant(`[@zag-js/core > stop-child] Cannot stop unknown child ${id}`);
      }
      this.children.get(id).stop();
      this.children.delete(id);
    });
    __publicField(this, "removeChild", (id) => {
      this.children.delete(id);
    });
    // Stop and delete spawned actors
    __publicField(this, "stopChildren", () => {
      this.children.forEach((child) => child.stop());
      this.children.clear();
    });
    __publicField(this, "setParent", (parent) => {
      this.parent = parent;
    });
    __publicField(this, "spawn", (src, id) => {
      const actor = runIfFn(src);
      if (id) actor.id = id;
      actor.type = "machine.actor" /* Actor */;
      actor.setParent(this);
      this.children.set(actor.id, cast(actor));
      actor.onDone(() => {
        this.removeChild(actor.id);
      }).start();
      return cast(ref(actor));
    });
    __publicField(this, "stopActivity", (key) => {
      if (!this.state.value) return;
      const cleanups = this.activityEvents.get(this.state.value);
      cleanups?.get(key)?.();
      cleanups?.delete(key);
    });
    __publicField(this, "addActivityCleanup", (state, key, cleanup) => {
      if (!state) return;
      if (!this.activityEvents.has(state)) {
        this.activityEvents.set(state, /* @__PURE__ */ new Map([[key, cleanup]]));
      } else {
        this.activityEvents.get(state)?.set(key, cleanup);
      }
    });
    __publicField(this, "setState", (target) => {
      this.state.previousValue = this.state.value;
      this.state.value = target;
      const stateNode = this.getStateNode(target);
      if (target == null) {
        clear(this.state.tags);
      } else {
        this.state.tags = toArray(stateNode?.tags);
      }
    });
    /**
     * To used within side effects for React or Vue to update context
     */
    __publicField(this, "setContext", (context) => {
      if (!context) return;
      deepMerge(this.state.context, compact(context));
    });
    __publicField(this, "setOptions", (options) => {
      const opts = compact(options);
      this.actionMap = { ...this.actionMap, ...opts.actions };
      this.delayMap = { ...this.delayMap, ...opts.delays };
      this.activityMap = { ...this.activityMap, ...opts.activities };
      this.guardMap = { ...this.guardMap, ...opts.guards };
    });
    __publicField(this, "getStateNode", (state) => {
      if (!state) return;
      return this.config.states?.[state];
    });
    __publicField(this, "getNextStateInfo", (transitions, event) => {
      const transition = this.determineTransition(transitions, event);
      const isTargetless = !transition?.target;
      const target = transition?.target ?? this.state.value;
      const changed = this.state.value !== target;
      const stateNode = this.getStateNode(target);
      const reenter = !isTargetless && !changed && !transition?.internal;
      const info = {
        reenter,
        transition,
        stateNode,
        target,
        changed
      };
      this.log("NextState:", `[${event.type}]`, this.state.value, "---->", info.target);
      return info;
    });
    __publicField(this, "getAfterActions", (transition, delay) => {
      let id;
      const current = this.state.value;
      return {
        entry: () => {
          id = globalThis.setTimeout(() => {
            const next = this.getNextStateInfo(transition, this.state.event);
            this.performStateChangeEffects(current, next, this.state.event);
          }, delay);
        },
        exit: () => {
          globalThis.clearTimeout(id);
        }
      };
    });
    /**
     * All `after` events leverage `setTimeout` and `clearTimeout`,
     * we invoke the `clearTimeout` on exit and `setTimeout` on entry.
     *
     * To achieve this, we split the `after` defintion into `entry` and `exit`
     *  functions and append them to the state's `entry` and `exit` actions
     */
    __publicField(this, "getDelayedEventActions", (state) => {
      const stateNode = this.getStateNode(state);
      const event = this.state.event;
      if (!stateNode || !stateNode.after) return;
      const entries = [];
      const exits = [];
      if (isArray(stateNode.after)) {
        const transition = this.determineTransition(stateNode.after, event);
        if (!transition) return;
        if (!hasProp(transition, "delay")) {
          throw new Error(`[@zag-js/core > after] Delay is required for after transition: ${JSON.stringify(transition)}`);
        }
        const determineDelay = determineDelayFn(transition.delay, this.delayMap);
        const __delay = determineDelay(this.contextSnapshot, event);
        const actions = this.getAfterActions(transition, __delay);
        entries.push(actions.entry);
        exits.push(actions.exit);
        return { entries, exits };
      }
      if (isObject$1(stateNode.after)) {
        for (const delay in stateNode.after) {
          const transition = stateNode.after[delay];
          const determineDelay = determineDelayFn(delay, this.delayMap);
          const __delay = determineDelay(this.contextSnapshot, event);
          const actions = this.getAfterActions(transition, __delay);
          entries.push(actions.entry);
          exits.push(actions.exit);
        }
      }
      return { entries, exits };
    });
    /**
     * Function to executes defined actions. It can accept actions as string
     * (referencing `options.actions`) or actual functions.
     */
    __publicField(this, "executeActions", (actions, event) => {
      const pickedActions = determineActionsFn(actions, this.guardMap)(this.contextSnapshot, event, this.guardMeta);
      for (const action of toArray(pickedActions)) {
        const fn = isString(action) ? this.actionMap?.[action] : action;
        warn(
          isString(action) && !fn,
          `[@zag-js/core > execute-actions] No implementation found for action: \`${action}\``
        );
        fn?.(this.state.context, event, this.meta);
      }
    });
    /**
     * Function to execute running activities and registers
     * their cleanup function internally (to be called later on when we exit the state)
     */
    __publicField(this, "executeActivities", (event, activities, state) => {
      for (const activity of activities) {
        const fn = isString(activity) ? this.activityMap?.[activity] : activity;
        if (!fn) {
          warn(`[@zag-js/core > execute-activity] No implementation found for activity: \`${activity}\``);
          continue;
        }
        const cleanup = fn(this.state.context, event, this.meta);
        if (cleanup) {
          const key = isString(activity) ? activity : activity.name || uuid();
          this.addActivityCleanup(state ?? this.state.value, key, cleanup);
        }
      }
    });
    /**
     * Normalizes the `every` definition to transition. `every` can be:
     * - An array of possible actions to run (we need to pick the first match based on guard)
     * - An object of intervals and actions
     */
    __publicField(this, "createEveryActivities", (every, callbackfn) => {
      if (!every) return;
      if (isArray(every)) {
        const picked = toArray(every).find((transition) => {
          const delayOrFn = transition.delay;
          const determineDelay2 = determineDelayFn(delayOrFn, this.delayMap);
          const delay2 = determineDelay2(this.contextSnapshot, this.state.event);
          const determineGuard = determineGuardFn(transition.guard, this.guardMap);
          const guard = determineGuard(this.contextSnapshot, this.state.event, this.guardMeta);
          return guard ?? delay2 != null;
        });
        if (!picked) return;
        const determineDelay = determineDelayFn(picked.delay, this.delayMap);
        const delay = determineDelay(this.contextSnapshot, this.state.event);
        const activity = () => {
          const id = globalThis.setInterval(() => {
            this.executeActions(picked.actions, this.state.event);
          }, delay);
          return () => {
            globalThis.clearInterval(id);
          };
        };
        callbackfn(activity);
      } else {
        for (const interval in every) {
          const actions = every?.[interval];
          const determineDelay = determineDelayFn(interval, this.delayMap);
          const delay = determineDelay(this.contextSnapshot, this.state.event);
          const activity = () => {
            const id = globalThis.setInterval(() => {
              this.executeActions(actions, this.state.event);
            }, delay);
            return () => {
              globalThis.clearInterval(id);
            };
          };
          callbackfn(activity);
        }
      }
    });
    __publicField(this, "setEvent", (event) => {
      this.state.previousEvent = this.state.event;
      this.state.event = ref(toEvent(event));
    });
    __publicField(this, "performExitEffects", (current, event) => {
      const currentState = this.state.value;
      if (currentState === "") return;
      const stateNode = current ? this.getStateNode(current) : void 0;
      this.stopActivities(currentState);
      const _exit = determineActionsFn(stateNode?.exit, this.guardMap)(this.contextSnapshot, event, this.guardMeta);
      const exitActions = toArray(_exit);
      const afterExitActions = this.delayedEvents.get(currentState);
      if (afterExitActions) {
        exitActions.push(...afterExitActions);
      }
      this.executeActions(exitActions, event);
      this.delayedEvents.delete(currentState);
    });
    __publicField(this, "performEntryEffects", (next, event) => {
      const stateNode = this.getStateNode(next);
      const activities = toArray(stateNode?.activities);
      this.createEveryActivities(stateNode?.every, (activity) => {
        activities.unshift(activity);
      });
      if (activities.length > 0) {
        this.executeActivities(event, activities);
      }
      const pickedActions = determineActionsFn(stateNode?.entry, this.guardMap)(
        this.contextSnapshot,
        event,
        this.guardMeta
      );
      const entryActions = toArray(pickedActions);
      const afterActions = this.getDelayedEventActions(next);
      if (stateNode?.after && afterActions) {
        this.delayedEvents.set(next, afterActions?.exits);
        entryActions.push(...afterActions.entries);
      }
      this.executeActions(entryActions, event);
      if (stateNode?.type === "final") {
        this.state.done = true;
        this.doneListeners.forEach((listener) => {
          listener(this.stateSnapshot);
        });
        this.stop();
      }
    });
    __publicField(this, "performTransitionEffects", (transitions, event) => {
      const transition = this.determineTransition(transitions, event);
      this.executeActions(transition?.actions, event);
    });
    /**
     * Performs all the requires side-effects or reactions when
     * we move from state A => state B.
     *
     * The Effect order:
     * Exit actions (current state) => Transition actions  => Go to state => Entry actions (next state)
     */
    __publicField(this, "performStateChangeEffects", (current, next, event) => {
      this.setEvent(event);
      const changed = next.changed || next.reenter;
      if (changed) {
        this.performExitEffects(current, event);
      }
      this.performTransitionEffects(next.transition, event);
      this.setState(next.target);
      if (changed) {
        this.performEntryEffects(next.target, event);
      }
    });
    __publicField(this, "determineTransition", (transition, event) => {
      const fn = determineTransitionFn(transition, this.guardMap);
      return fn?.(this.contextSnapshot, event, this.guardMeta);
    });
    /**
     * Function to send event to parent machine from spawned child
     */
    __publicField(this, "sendParent", (evt) => {
      if (!this.parent) {
        invariant("[@zag-js/core > send-parent] Cannot send event to an unknown parent");
      }
      const event = toEvent(evt);
      this.parent?.send(event);
    });
    __publicField(this, "log", (...args) => {
    });
    /**
     * Function to send an event to current machine
     */
    __publicField(this, "send", (evt) => {
      const event = toEvent(evt);
      this.transition(this.state.value, event);
    });
    __publicField(this, "transition", (state, evt) => {
      const stateNode = isString(state) ? this.getStateNode(state) : state?.stateNode;
      const event = toEvent(evt);
      if (!stateNode && !this.config.on) {
        const msg = this.status === "Stopped" /* Stopped */ ? "[@zag-js/core > transition] Cannot transition a stopped machine" : `[@zag-js/core > transition] State does not have a definition for \`state\`: ${state}, \`event\`: ${event.type}`;
        warn(msg);
        return;
      }
      const transitions = (
        // @ts-expect-error - Fix this
        stateNode?.on?.[event.type] ?? this.config.on?.[event.type]
      );
      const next = this.getNextStateInfo(transitions, event);
      this.performStateChangeEffects(this.state.value, next, event);
      return next.stateNode;
    });
    __publicField(this, "subscribe", (listener) => {
      this.stateListeners.add(listener);
      if (this.status === "Running" /* Running */) {
        listener(this.stateSnapshot);
      }
      return () => {
        this.stateListeners.delete(listener);
      };
    });
    __publicField(this, "onDone", (listener) => {
      this.doneListeners.add(listener);
      return this;
    });
    __publicField(this, "onTransition", (listener) => {
      this.stateListeners.add(listener);
      if (this.status === "Running" /* Running */) {
        listener(this.stateSnapshot);
      }
      return this;
    });
    this.config = structuredClone(config);
    this.options = structuredClone(options ?? {});
    this.id = this.config.id ?? `machine-${uuid()}`;
    this.guardMap = this.options?.guards ?? {};
    this.actionMap = this.options?.actions ?? {};
    this.delayMap = this.options?.delays ?? {};
    this.activityMap = this.options?.activities ?? {};
    this.sync = this.options?.sync ?? false;
    this.state = createProxy(this.config);
    this.initialContext = snapshot(this.state.context);
  }
  // immutable state value
  get stateSnapshot() {
    return cast(snapshot(this.state));
  }
  getState() {
    return this.stateSnapshot;
  }
  // immutable context value
  get contextSnapshot() {
    return this.stateSnapshot.context;
  }
  /**
   * A reference to the instance methods of the machine.
   * Useful when spawning child machines and managing the communication between them.
   */
  get self() {
    const self = this;
    return {
      id: this.id,
      send: this.send.bind(this),
      sendParent: this.sendParent.bind(this),
      sendChild: this.sendChild.bind(this),
      stop: this.stop.bind(this),
      stopChild: this.stopChild.bind(this),
      spawn: this.spawn.bind(this),
      stopActivity: this.stopActivity.bind(this),
      get state() {
        return self.stateSnapshot;
      },
      get initialContext() {
        return self.initialContext;
      },
      get initialState() {
        return self.initialState?.target ?? "";
      }
    };
  }
  get meta() {
    return {
      state: this.stateSnapshot,
      guards: this.guardMap,
      send: this.send.bind(this),
      self: this.self,
      initialContext: this.initialContext,
      initialState: this.initialState?.target ?? "",
      getState: () => this.stateSnapshot,
      getAction: (key) => this.actionMap[key],
      getGuard: (key) => this.guardMap[key]
    };
  }
  get guardMeta() {
    return {
      state: this.stateSnapshot
    };
  }
  get [Symbol.toStringTag]() {
    return "Machine";
  }
  getHydrationState() {
    const state = this.getState();
    return {
      value: state.value,
      tags: state.tags
    };
  }
};
var createMachine = (config, options) => new Machine(config, options);

// src/index.ts

// src/frame-utils.ts
function getWindowFrames(win) {
  const frames = {
    each(cb) {
      for (let i = 0; i < win.frames?.length; i += 1) {
        const frame = win.frames[i];
        if (frame) cb(frame);
      }
    },
    addEventListener(event, listener, options) {
      frames.each((frame) => {
        try {
          frame.document.addEventListener(event, listener, options);
        } catch {
        }
      });
      return () => {
        try {
          frames.removeEventListener(event, listener, options);
        } catch {
        }
      };
    },
    removeEventListener(event, listener, options) {
      frames.each((frame) => {
        try {
          frame.document.removeEventListener(event, listener, options);
        } catch {
        }
      });
    }
  };
  return frames;
}
function getParentWindow(win) {
  const parent = win.frameElement != null ? win.parent : null;
  return {
    addEventListener: (event, listener, options) => {
      try {
        parent?.addEventListener(event, listener, options);
      } catch {
      }
      return () => {
        try {
          parent?.removeEventListener(event, listener, options);
        } catch {
        }
      };
    },
    removeEventListener: (event, listener, options) => {
      try {
        parent?.removeEventListener(event, listener, options);
      } catch {
      }
    }
  };
}

// src/index.ts
var POINTER_OUTSIDE_EVENT = "pointerdown.outside";
var FOCUS_OUTSIDE_EVENT = "focus.outside";
function isComposedPathFocusable(composedPath) {
  for (const node of composedPath) {
    if (isHTMLElement$1(node) && isFocusable(node)) return true;
  }
  return false;
}
var isPointerEvent = (event) => "clientY" in event;
function isEventPointWithin(node, event) {
  if (!isPointerEvent(event) || !node) return false;
  const rect = node.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return false;
  return rect.top <= event.clientY && event.clientY <= rect.top + rect.height && rect.left <= event.clientX && event.clientX <= rect.left + rect.width;
}
function isEventWithinScrollbar(event, target) {
  if (!target || !isPointerEvent(event)) return false;
  const isScrollableY = target.scrollHeight > target.clientHeight;
  const onScrollbarY = isScrollableY && event.clientX > target.clientWidth;
  const isScrollableX = target.scrollWidth > target.clientWidth;
  const onScrollbarX = isScrollableX && event.clientY > target.clientHeight;
  return onScrollbarY || onScrollbarX;
}
function trackInteractOutsideImpl(node, options) {
  const { exclude, onFocusOutside, onPointerDownOutside, onInteractOutside, defer } = options;
  if (!node) return;
  const doc = getDocument(node);
  const win = getWindow$2(node);
  const frames = getWindowFrames(win);
  const parentWin = getParentWindow(win);
  function isEventOutside(event) {
    const target = getEventTarget(event);
    if (!isHTMLElement$1(target)) return false;
    if (contains(node, target)) return false;
    if (isEventPointWithin(node, event)) return false;
    if (isEventWithinScrollbar(event, target)) return false;
    const scrollParent = getNearestOverflowAncestor$1(node);
    if (isEventWithinScrollbar(event, scrollParent)) return false;
    return !exclude?.(target);
  }
  const pointerdownCleanups = /* @__PURE__ */ new Set();
  function onPointerDown(event) {
    function handler() {
      const func = defer ? raf : (v) => v();
      const composedPath = event.composedPath?.() ?? [event.target];
      func(() => {
        if (!node || !isEventOutside(event)) return;
        if (onPointerDownOutside || onInteractOutside) {
          const handler2 = callAll(onPointerDownOutside, onInteractOutside);
          node.addEventListener(POINTER_OUTSIDE_EVENT, handler2, { once: true });
        }
        fireCustomEvent(node, POINTER_OUTSIDE_EVENT, {
          bubbles: false,
          cancelable: true,
          detail: {
            originalEvent: event,
            contextmenu: isContextMenuEvent(event),
            focusable: isComposedPathFocusable(composedPath)
          }
        });
      });
    }
    if (event.pointerType === "touch") {
      pointerdownCleanups.forEach((fn) => fn());
      pointerdownCleanups.add(addDomEvent(doc, "click", handler, { once: true }));
      pointerdownCleanups.add(parentWin.addEventListener("click", handler, { once: true }));
      pointerdownCleanups.add(frames.addEventListener("click", handler, { once: true }));
    } else {
      handler();
    }
  }
  const cleanups = /* @__PURE__ */ new Set();
  const timer = setTimeout(() => {
    cleanups.add(addDomEvent(doc, "pointerdown", onPointerDown, true));
    cleanups.add(parentWin.addEventListener("pointerdown", onPointerDown, true));
    cleanups.add(frames.addEventListener("pointerdown", onPointerDown, true));
  }, 0);
  function onFocusin(event) {
    const func = defer ? raf : (v) => v();
    func(() => {
      if (!node || !isEventOutside(event)) return;
      if (onFocusOutside || onInteractOutside) {
        const handler = callAll(onFocusOutside, onInteractOutside);
        node.addEventListener(FOCUS_OUTSIDE_EVENT, handler, { once: true });
      }
      fireCustomEvent(node, FOCUS_OUTSIDE_EVENT, {
        bubbles: false,
        cancelable: true,
        detail: {
          originalEvent: event,
          contextmenu: false,
          focusable: isFocusable(getEventTarget(event))
        }
      });
    });
  }
  cleanups.add(addDomEvent(doc, "focusin", onFocusin, true));
  cleanups.add(parentWin.addEventListener("focusin", onFocusin, true));
  cleanups.add(frames.addEventListener("focusin", onFocusin, true));
  return () => {
    clearTimeout(timer);
    pointerdownCleanups.forEach((fn) => fn());
    cleanups.forEach((fn) => fn());
  };
}
function trackInteractOutside(nodeOrFn, options) {
  const { defer } = options;
  const func = defer ? raf : (v) => v();
  const cleanups = [];
  cleanups.push(
    func(() => {
      const node = typeof nodeOrFn === "function" ? nodeOrFn() : nodeOrFn;
      cleanups.push(trackInteractOutsideImpl(node, options));
    })
  );
  return () => {
    cleanups.forEach((fn) => fn?.());
  };
}

// src/dismissable-layer.ts
function trackEscapeKeydown(node, fn) {
  const handleKeyDown = (event) => {
    if (event.key !== "Escape") return;
    if (event.isComposing) return;
    fn?.(event);
  };
  return addDomEvent(getDocument(node), "keydown", handleKeyDown, { capture: true });
}
var layerStack = {
  layers: [],
  branches: [],
  count() {
    return this.layers.length;
  },
  pointerBlockingLayers() {
    return this.layers.filter((layer) => layer.pointerBlocking);
  },
  topMostPointerBlockingLayer() {
    return [...this.pointerBlockingLayers()].slice(-1)[0];
  },
  hasPointerBlockingLayer() {
    return this.pointerBlockingLayers().length > 0;
  },
  isBelowPointerBlockingLayer(node) {
    const index = this.indexOf(node);
    const highestBlockingIndex = this.topMostPointerBlockingLayer() ? this.indexOf(this.topMostPointerBlockingLayer()?.node) : -1;
    return index < highestBlockingIndex;
  },
  isTopMost(node) {
    const layer = this.layers[this.count() - 1];
    return layer?.node === node;
  },
  getNestedLayers(node) {
    return Array.from(this.layers).slice(this.indexOf(node) + 1);
  },
  isInNestedLayer(node, target) {
    return this.getNestedLayers(node).some((layer) => contains(layer.node, target));
  },
  isInBranch(target) {
    return Array.from(this.branches).some((branch) => contains(branch, target));
  },
  add(layer) {
    const num = this.layers.push(layer);
    layer.node.style.setProperty("--layer-index", `${num}`);
  },
  addBranch(node) {
    this.branches.push(node);
  },
  remove(node) {
    const index = this.indexOf(node);
    if (index < 0) return;
    if (index < this.count() - 1) {
      const _layers = this.getNestedLayers(node);
      _layers.forEach((layer) => layer.dismiss());
    }
    this.layers.splice(index, 1);
    node.style.removeProperty("--layer-index");
  },
  removeBranch(node) {
    const index = this.branches.indexOf(node);
    if (index >= 0) this.branches.splice(index, 1);
  },
  indexOf(node) {
    return this.layers.findIndex((layer) => layer.node === node);
  },
  dismiss(node) {
    this.layers[this.indexOf(node)]?.dismiss();
  },
  clear() {
    this.remove(this.layers[0].node);
  }
};
var originalBodyPointerEvents;
function assignPointerEventToLayers() {
  layerStack.layers.forEach(({ node }) => {
    node.style.pointerEvents = layerStack.isBelowPointerBlockingLayer(node) ? "none" : "auto";
  });
}
function clearPointerEvent(node) {
  node.style.pointerEvents = "";
}
function disablePointerEventsOutside(node, peristentElements) {
  const doc = getDocument(node);
  const cleanups = [];
  if (layerStack.hasPointerBlockingLayer() && !doc.body.hasAttribute("data-inert")) {
    originalBodyPointerEvents = document.body.style.pointerEvents;
    queueMicrotask(() => {
      doc.body.style.pointerEvents = "none";
      doc.body.setAttribute("data-inert", "");
    });
  }
  if (peristentElements) {
    const persistedCleanup = waitForElements(peristentElements, (el) => {
      cleanups.push(setStyle(el, { pointerEvents: "auto" }));
    });
    cleanups.push(persistedCleanup);
  }
  return () => {
    if (layerStack.hasPointerBlockingLayer()) return;
    queueMicrotask(() => {
      doc.body.style.pointerEvents = originalBodyPointerEvents;
      doc.body.removeAttribute("data-inert");
      if (doc.body.style.length === 0) doc.body.removeAttribute("style");
    });
    cleanups.forEach((fn) => fn());
  };
}

// src/dismissable-layer.ts
function trackDismissableElementImpl(node, options) {
  if (!node) {
    warn("[@zag-js/dismissable] node is `null` or `undefined`");
    return;
  }
  const { onDismiss, pointerBlocking, exclude: excludeContainers, debug } = options;
  const layer = { dismiss: onDismiss, node, pointerBlocking };
  layerStack.add(layer);
  assignPointerEventToLayers();
  function onPointerDownOutside(event) {
    const target = getEventTarget(event.detail.originalEvent);
    if (layerStack.isBelowPointerBlockingLayer(node) || layerStack.isInBranch(target)) return;
    options.onPointerDownOutside?.(event);
    options.onInteractOutside?.(event);
    if (event.defaultPrevented) return;
    if (debug) {
      console.log("onPointerDownOutside:", event.detail.originalEvent);
    }
    onDismiss?.();
  }
  function onFocusOutside(event) {
    const target = getEventTarget(event.detail.originalEvent);
    if (layerStack.isInBranch(target)) return;
    options.onFocusOutside?.(event);
    options.onInteractOutside?.(event);
    if (event.defaultPrevented) return;
    if (debug) {
      console.log("onFocusOutside:", event.detail.originalEvent);
    }
    onDismiss?.();
  }
  function onEscapeKeyDown(event) {
    if (!layerStack.isTopMost(node)) return;
    options.onEscapeKeyDown?.(event);
    if (!event.defaultPrevented && onDismiss) {
      event.preventDefault();
      onDismiss();
    }
  }
  function exclude(target) {
    if (!node) return false;
    const containers = typeof excludeContainers === "function" ? excludeContainers() : excludeContainers;
    const _containers = Array.isArray(containers) ? containers : [containers];
    const persistentElements = options.persistentElements?.map((fn) => fn()).filter(isHTMLElement$1);
    if (persistentElements) _containers.push(...persistentElements);
    return _containers.some((node2) => contains(node2, target)) || layerStack.isInNestedLayer(node, target);
  }
  const cleanups = [
    pointerBlocking ? disablePointerEventsOutside(node, options.persistentElements) : void 0,
    trackEscapeKeydown(node, onEscapeKeyDown),
    trackInteractOutside(node, { exclude, onFocusOutside, onPointerDownOutside, defer: options.defer })
  ];
  return () => {
    layerStack.remove(node);
    assignPointerEventToLayers();
    clearPointerEvent(node);
    cleanups.forEach((fn) => fn?.());
  };
}
function trackDismissableElement(nodeOrFn, options) {
  const { defer } = options;
  const func = defer ? raf : (v) => v();
  const cleanups = [];
  cleanups.push(
    func(() => {
      const node = isFunction(nodeOrFn) ? nodeOrFn() : nodeOrFn;
      cleanups.push(trackDismissableElementImpl(node, options));
    })
  );
  return () => {
    cleanups.forEach((fn) => fn?.());
  };
}

// src/input-event.ts
var getWindow = (el) => el.ownerDocument.defaultView || window;
function getDescriptor(el, options) {
  const { type = "HTMLInputElement", property = "value" } = options;
  const proto = getWindow(el)[type].prototype;
  return Object.getOwnPropertyDescriptor(proto, property) ?? {};
}
function setElementValue(el, value, option = {}) {
  const descriptor = getDescriptor(el, option);
  descriptor.set?.call(el, value);
  el.setAttribute("value", value);
}
function dispatchInputValueEvent(el, options) {
  const { value, bubbles = true } = options;
  if (!el) return;
  const win = getWindow(el);
  if (!(el instanceof win.HTMLInputElement)) return;
  setElementValue(el, `${value}`);
  el.dispatchEvent(new win.Event("input", { bubbles }));
}

// src/form.ts
function getClosestForm(el) {
  if (isFormElement(el)) return el.form;
  else return el.closest("form");
}
function isFormElement(el) {
  return el.matches("textarea, input, select, button");
}
function trackFormReset(el, callback) {
  if (!el) return;
  const form = getClosestForm(el);
  form?.addEventListener("reset", callback, { passive: true });
  return () => {
    form?.removeEventListener("reset", callback);
  };
}
function trackFieldsetDisabled(el, callback) {
  const fieldset = el?.closest("fieldset");
  if (!fieldset) return;
  callback(fieldset.disabled);
  const win = fieldset.ownerDocument.defaultView || window;
  const obs = new win.MutationObserver(() => callback(fieldset.disabled));
  obs.observe(fieldset, {
    attributes: true,
    attributeFilter: ["disabled"]
  });
  return () => obs.disconnect();
}
function trackFormControl(el, options) {
  if (!el) return;
  const { onFieldsetDisabledChange, onFormReset } = options;
  const cleanups = [trackFormReset(el, onFormReset), trackFieldsetDisabled(el, onFieldsetDisabledChange)];
  return () => {
    cleanups.forEach((cleanup) => cleanup?.());
  };
}

// src/color-picker.anatomy.ts
var anatomy = createAnatomy("color-picker", [
  "root",
  "label",
  "control",
  "trigger",
  "positioner",
  "content",
  "area",
  "areaThumb",
  "valueText",
  "areaBackground",
  "channelSlider",
  "channelSliderLabel",
  "channelSliderTrack",
  "channelSliderThumb",
  "channelSliderValueText",
  "channelInput",
  "transparencyGrid",
  "swatchGroup",
  "swatchTrigger",
  "swatchIndicator",
  "swatch",
  "eyeDropperTrigger",
  "formatTrigger",
  "formatSelect"
]);
var parts = anatomy.build();
var dom = createScope({
  getRootId: (ctx) => ctx.ids?.root ?? `color-picker:${ctx.id}`,
  getLabelId: (ctx) => ctx.ids?.label ?? `color-picker:${ctx.id}:label`,
  getHiddenInputId: (ctx) => ctx.ids?.hiddenInput ?? `color-picker:${ctx.id}:hidden-input`,
  getControlId: (ctx) => ctx.ids?.control ?? `color-picker:${ctx.id}:control`,
  getTriggerId: (ctx) => ctx.ids?.trigger ?? `color-picker:${ctx.id}:trigger`,
  getContentId: (ctx) => ctx.ids?.content ?? `color-picker:${ctx.id}:content`,
  getPositionerId: (ctx) => ctx.ids?.positioner ?? `color-picker:${ctx.id}:positioner`,
  getFormatSelectId: (ctx) => ctx.ids?.formatSelect ?? `color-picker:${ctx.id}:format-select`,
  getAreaId: (ctx) => ctx.ids?.area ?? `color-picker:${ctx.id}:area`,
  getAreaGradientId: (ctx) => ctx.ids?.areaGradient ?? `color-picker:${ctx.id}:area-gradient`,
  getAreaThumbId: (ctx) => ctx.ids?.areaThumb ?? `color-picker:${ctx.id}:area-thumb`,
  getChannelSliderTrackId: (ctx, channel) => ctx.ids?.channelSliderTrack?.(channel) ?? `color-picker:${ctx.id}:slider-track:${channel}`,
  getChannelSliderThumbId: (ctx, channel) => ctx.ids?.channelSliderThumb?.(channel) ?? `color-picker:${ctx.id}:slider-thumb:${channel}`,
  getContentEl: (ctx) => dom.getById(ctx, dom.getContentId(ctx)),
  getAreaThumbEl: (ctx) => dom.getById(ctx, dom.getAreaThumbId(ctx)),
  getChannelSliderThumbEl: (ctx, channel) => dom.getById(ctx, dom.getChannelSliderThumbId(ctx, channel)),
  getChannelInputEl: (ctx, channel) => {
    const selector = `input[data-channel="${channel}"]`;
    return [
      ...queryAll(dom.getContentEl(ctx), selector),
      ...queryAll(dom.getControlEl(ctx), selector)
    ];
  },
  getFormatSelectEl: (ctx) => dom.getById(ctx, dom.getFormatSelectId(ctx)),
  getHiddenInputEl: (ctx) => dom.getById(ctx, dom.getHiddenInputId(ctx)),
  getAreaEl: (ctx) => dom.getById(ctx, dom.getAreaId(ctx)),
  getAreaValueFromPoint(ctx, point) {
    const areaEl = dom.getAreaEl(ctx);
    if (!areaEl) return;
    const { percent } = getRelativePoint(point, areaEl);
    return percent;
  },
  getControlEl: (ctx) => dom.getById(ctx, dom.getControlId(ctx)),
  getTriggerEl: (ctx) => dom.getById(ctx, dom.getTriggerId(ctx)),
  getPositionerEl: (ctx) => dom.getById(ctx, dom.getPositionerId(ctx)),
  getChannelSliderTrackEl: (ctx, channel) => {
    return dom.getById(ctx, dom.getChannelSliderTrackId(ctx, channel));
  },
  getChannelSliderValueFromPoint(ctx, point, channel) {
    const trackEl = dom.getChannelSliderTrackEl(ctx, channel);
    if (!trackEl) return;
    const { percent } = getRelativePoint(point, trackEl);
    return percent;
  },
  getChannelInputEls: (ctx) => {
    return [
      ...queryAll(dom.getContentEl(ctx), "input[data-channel]"),
      ...queryAll(dom.getControlEl(ctx), "input[data-channel]")
    ];
  }
});
function getChannelDisplayColor(color, channel) {
  switch (channel) {
    case "hue":
      return parseColor(`hsl(${color.getChannelValue("hue")}, 100%, 50%)`);
    case "lightness":
    case "brightness":
    case "saturation":
    case "red":
    case "green":
    case "blue":
      return color.withChannelValue("alpha", 1);
    case "alpha": {
      return color;
    }
    default:
      throw new Error("Unknown color channel: " + channel);
  }
}
function getChannelValue(color, channel) {
  if (channel == null) return "";
  if (channel === "hex") {
    return color.toString("hex");
  }
  if (channel === "css") {
    return color.toString("css");
  }
  if (channel in color) {
    return color.getChannelValue(channel).toString();
  }
  const isHSL = color.getFormat() === "hsla";
  switch (channel) {
    case "hue":
      return isHSL ? color.toFormat("hsla").getChannelValue("hue").toString() : color.toFormat("hsba").getChannelValue("hue").toString();
    case "saturation":
      return isHSL ? color.toFormat("hsla").getChannelValue("saturation").toString() : color.toFormat("hsba").getChannelValue("saturation").toString();
    case "lightness":
      return color.toFormat("hsla").getChannelValue("lightness").toString();
    case "brightness":
      return color.toFormat("hsba").getChannelValue("brightness").toString();
    case "red":
    case "green":
    case "blue":
      return color.toFormat("rgba").getChannelValue(channel).toString();
    default:
      return color.getChannelValue(channel).toString();
  }
}
function getChannelRange(color, channel) {
  switch (channel) {
    case "hex":
      const minColor = parseColor("#000000");
      const maxColor = parseColor("#FFFFFF");
      return {
        minValue: minColor.toHexInt(),
        maxValue: maxColor.toHexInt(),
        pageSize: 10,
        step: 1
      };
    case "css":
      return void 0;
    case "hue":
    case "saturation":
    case "lightness":
      return color.toFormat("hsla").getChannelRange(channel);
    case "brightness":
      return color.toFormat("hsba").getChannelRange(channel);
    case "red":
    case "green":
    case "blue":
      return color.toFormat("rgba").getChannelRange(channel);
    default:
      return color.getChannelRange(channel);
  }
}

// src/utils/get-slider-background.ts
function getSliderBackgroundDirection(orientation, dir) {
  if (orientation === "vertical") {
    return "top";
  } else if (dir === "ltr") {
    return "right";
  } else {
    return "left";
  }
}
var getSliderBackground = (props) => {
  const { channel, value, dir, orientation } = props;
  const bgDirection = getSliderBackgroundDirection(orientation, dir);
  const { minValue, maxValue } = value.getChannelRange(channel);
  switch (channel) {
    case "hue":
      return `linear-gradient(to ${bgDirection}, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)`;
    case "lightness": {
      let start = value.withChannelValue(channel, minValue).toString("css");
      let middle = value.withChannelValue(channel, (maxValue - minValue) / 2).toString("css");
      let end = value.withChannelValue(channel, maxValue).toString("css");
      return `linear-gradient(to ${bgDirection}, ${start}, ${middle}, ${end})`;
    }
    case "saturation":
    case "brightness":
    case "red":
    case "green":
    case "blue":
    case "alpha": {
      let start = value.withChannelValue(channel, minValue).toString("css");
      let end = value.withChannelValue(channel, maxValue).toString("css");
      return `linear-gradient(to ${bgDirection}, ${start}, ${end})`;
    }
    default:
      throw new Error("Unknown color channel: " + channel);
  }
};

// src/color-picker.connect.ts
function connect(state, send, normalize) {
  const value = state.context.value;
  const areaValue = state.context.areaValue;
  const valueAsString = state.context.valueAsString;
  const disabled = state.context.isDisabled;
  const interactive = state.context.isInteractive;
  const dragging = state.hasTag("dragging");
  const open = state.hasTag("open");
  const focused = state.hasTag("focused");
  const getAreaChannels = (props) => {
    const channels = areaValue.getChannels();
    return {
      xChannel: props.xChannel ?? channels[1],
      yChannel: props.yChannel ?? channels[2]
    };
  };
  const currentPlacement = state.context.currentPlacement;
  const popperStyles = getPlacementStyles({
    ...state.context.positioning,
    placement: currentPlacement
  });
  function getSwatchTriggerState(props) {
    const color = normalizeColor(props.value).toFormat(state.context.format);
    return {
      value: color,
      valueAsString: color.toString("hex"),
      checked: color.isEqual(value),
      disabled: props.disabled || !interactive
    };
  }
  return {
    dragging,
    open,
    valueAsString,
    value,
    setOpen(nextOpen) {
      if (nextOpen === open) return;
      send({ type: nextOpen ? "OPEN" : "CLOSE" });
    },
    setValue(value2) {
      send({ type: "VALUE.SET", value: normalizeColor(value2), src: "set-color" });
    },
    getChannelValue(channel) {
      return getChannelValue(value, channel);
    },
    getChannelValueText(channel, locale) {
      return value.formatChannelValue(channel, locale);
    },
    setChannelValue(channel, channelValue) {
      const color = value.withChannelValue(channel, channelValue);
      send({ type: "VALUE.SET", value: color, src: "set-channel" });
    },
    format: state.context.format,
    setFormat(format) {
      const formatValue = value.toFormat(format);
      send({ type: "VALUE.SET", value: formatValue, src: "set-format" });
    },
    alpha: value.getChannelValue("alpha"),
    setAlpha(alphaValue) {
      const color = value.withChannelValue("alpha", alphaValue);
      send({ type: "VALUE.SET", value: color, src: "set-alpha" });
    },
    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        dir: state.context.dir,
        id: dom.getRootId(state.context),
        "data-disabled": dataAttr(disabled),
        "data-readonly": dataAttr(state.context.readOnly),
        style: {
          "--value": value.toString("css")
        }
      });
    },
    getLabelProps() {
      return normalize.element({
        ...parts.label.attrs,
        dir: state.context.dir,
        id: dom.getLabelId(state.context),
        htmlFor: dom.getHiddenInputId(state.context),
        "data-disabled": dataAttr(disabled),
        "data-readonly": dataAttr(state.context.readOnly),
        "data-focus": dataAttr(focused),
        onClick(event) {
          event.preventDefault();
          const inputEl = query(dom.getControlEl(state.context), "[data-channel=hex]");
          inputEl?.focus({ preventScroll: true });
        }
      });
    },
    getControlProps() {
      return normalize.element({
        ...parts.control.attrs,
        id: dom.getControlId(state.context),
        dir: state.context.dir,
        "data-disabled": dataAttr(disabled),
        "data-readonly": dataAttr(state.context.readOnly),
        "data-state": open ? "open" : "closed",
        "data-focus": dataAttr(focused)
      });
    },
    getTriggerProps() {
      return normalize.button({
        ...parts.trigger.attrs,
        id: dom.getTriggerId(state.context),
        dir: state.context.dir,
        disabled,
        "aria-label": `select color. current color is ${valueAsString}`,
        "aria-controls": dom.getContentId(state.context),
        "aria-labelledby": dom.getLabelId(state.context),
        "data-disabled": dataAttr(disabled),
        "data-readonly": dataAttr(state.context.readOnly),
        "data-placement": currentPlacement,
        "aria-expanded": dataAttr(open),
        "data-state": open ? "open" : "closed",
        "data-focus": dataAttr(focused),
        type: "button",
        onClick() {
          if (!interactive) return;
          send({ type: "TRIGGER.CLICK" });
        },
        onBlur() {
          if (!interactive) return;
          send({ type: "TRIGGER.BLUR" });
        },
        style: {
          position: "relative"
        }
      });
    },
    getPositionerProps() {
      return normalize.element({
        ...parts.positioner.attrs,
        id: dom.getPositionerId(state.context),
        dir: state.context.dir,
        style: popperStyles.floating
      });
    },
    getContentProps() {
      return normalize.element({
        ...parts.content.attrs,
        id: dom.getContentId(state.context),
        dir: state.context.dir,
        "data-placement": currentPlacement,
        "data-state": open ? "open" : "closed",
        hidden: !open
      });
    },
    getValueTextProps() {
      return normalize.element({
        ...parts.valueText.attrs,
        dir: state.context.dir,
        "data-disabled": dataAttr(disabled),
        "data-focus": dataAttr(focused)
      });
    },
    getAreaProps(props = {}) {
      const { xChannel, yChannel } = getAreaChannels(props);
      const { areaStyles } = getColorAreaGradient(areaValue, {
        xChannel,
        yChannel,
        dir: state.context.dir
      });
      return normalize.element({
        ...parts.area.attrs,
        id: dom.getAreaId(state.context),
        role: "group",
        onPointerDown(event) {
          if (!interactive) return;
          if (!isLeftClick(event)) return;
          if (isModifierKey(event)) return;
          const point = getEventPoint(event);
          const channel = { xChannel, yChannel };
          send({ type: "AREA.POINTER_DOWN", point, channel, id: "area" });
          event.preventDefault();
        },
        style: {
          position: "relative",
          touchAction: "none",
          forcedColorAdjust: "none",
          ...areaStyles
        }
      });
    },
    getAreaBackgroundProps(props = {}) {
      const { xChannel, yChannel } = getAreaChannels(props);
      const { areaGradientStyles } = getColorAreaGradient(areaValue, {
        xChannel,
        yChannel,
        dir: state.context.dir
      });
      return normalize.element({
        ...parts.areaBackground.attrs,
        id: dom.getAreaGradientId(state.context),
        style: {
          position: "relative",
          touchAction: "none",
          forcedColorAdjust: "none",
          ...areaGradientStyles
        }
      });
    },
    getAreaThumbProps(props = {}) {
      const { xChannel, yChannel } = getAreaChannels(props);
      const channel = { xChannel, yChannel };
      const xPercent = areaValue.getChannelValuePercent(xChannel);
      const yPercent = 1 - areaValue.getChannelValuePercent(yChannel);
      const xValue = areaValue.getChannelValue(xChannel);
      const yValue = areaValue.getChannelValue(yChannel);
      return normalize.element({
        ...parts.areaThumb.attrs,
        id: dom.getAreaThumbId(state.context),
        dir: state.context.dir,
        tabIndex: disabled ? void 0 : 0,
        "data-disabled": dataAttr(disabled),
        role: "slider",
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": xValue,
        "aria-label": `${xChannel} and ${yChannel}`,
        "aria-roledescription": "2d slider",
        "aria-valuetext": `${xChannel} ${xValue}, ${yChannel} ${yValue}`,
        style: {
          position: "absolute",
          left: `${xPercent * 100}%`,
          top: `${yPercent * 100}%`,
          transform: "translate(-50%, -50%)",
          touchAction: "none",
          forcedColorAdjust: "none",
          background: areaValue.withChannelValue("alpha", 1).toString("css")
        },
        onFocus() {
          if (!interactive) return;
          send({ type: "AREA.FOCUS", id: "area", channel });
        },
        onKeyDown(event) {
          if (event.defaultPrevented) return;
          if (!interactive) return;
          const step = getEventStep(event);
          const keyMap = {
            ArrowUp() {
              send({ type: "AREA.ARROW_UP", channel, step });
            },
            ArrowDown() {
              send({ type: "AREA.ARROW_DOWN", channel, step });
            },
            ArrowLeft() {
              send({ type: "AREA.ARROW_LEFT", channel, step });
            },
            ArrowRight() {
              send({ type: "AREA.ARROW_RIGHT", channel, step });
            },
            PageUp() {
              send({ type: "AREA.PAGE_UP", channel, step });
            },
            PageDown() {
              send({ type: "AREA.PAGE_DOWN", channel, step });
            },
            Escape(event2) {
              event2.stopPropagation();
            }
          };
          const exec = keyMap[getEventKey(event, state.context)];
          if (exec) {
            exec(event);
            event.preventDefault();
          }
        }
      });
    },
    getTransparencyGridProps(props = {}) {
      const { size = "12px" } = props;
      return normalize.element({
        ...parts.transparencyGrid.attrs,
        style: {
          "--size": size,
          width: "100%",
          height: "100%",
          position: "absolute",
          backgroundColor: "#fff",
          backgroundImage: "conic-gradient(#eeeeee 0 25%, transparent 0 50%, #eeeeee 0 75%, transparent 0)",
          backgroundSize: "var(--size) var(--size)",
          inset: "0px",
          zIndex: "auto",
          pointerEvents: "none"
        }
      });
    },
    getChannelSliderProps(props) {
      const { orientation = "horizontal", channel, format } = props;
      return normalize.element({
        ...parts.channelSlider.attrs,
        "data-channel": channel,
        "data-orientation": orientation,
        role: "presentation",
        onPointerDown(event) {
          if (!interactive) return;
          if (!isLeftClick(event)) return;
          if (isModifierKey(event)) return;
          const point = getEventPoint(event);
          send({ type: "CHANNEL_SLIDER.POINTER_DOWN", channel, format, point, id: channel, orientation });
          event.preventDefault();
        },
        style: {
          position: "relative",
          touchAction: "none"
        }
      });
    },
    getChannelSliderTrackProps(props) {
      const { orientation = "horizontal", channel, format } = props;
      const normalizedValue = format ? value.toFormat(format) : areaValue;
      return normalize.element({
        ...parts.channelSliderTrack.attrs,
        id: dom.getChannelSliderTrackId(state.context, channel),
        role: "group",
        "data-channel": channel,
        "data-orientation": orientation,
        style: {
          position: "relative",
          forcedColorAdjust: "none",
          backgroundImage: getSliderBackground({
            orientation,
            channel,
            dir: state.context.dir,
            value: normalizedValue
          })
        }
      });
    },
    getChannelSliderLabelProps(props) {
      const { channel } = props;
      return normalize.element({
        ...parts.channelSliderLabel.attrs,
        "data-channel": channel,
        onClick(event) {
          if (!interactive) return;
          event.preventDefault();
          const thumbId = dom.getChannelSliderThumbId(state.context, channel);
          dom.getById(state.context, thumbId)?.focus({ preventScroll: true });
        },
        style: {
          userSelect: "none",
          WebkitUserSelect: "none"
        }
      });
    },
    getChannelSliderValueTextProps(props) {
      return normalize.element({
        ...parts.channelSliderValueText.attrs,
        "data-channel": props.channel
      });
    },
    getChannelSliderThumbProps(props) {
      const { orientation = "horizontal", channel, format } = props;
      const normalizedValue = format ? value.toFormat(format) : areaValue;
      const channelRange = normalizedValue.getChannelRange(channel);
      const channelValue = normalizedValue.getChannelValue(channel);
      const offset = (channelValue - channelRange.minValue) / (channelRange.maxValue - channelRange.minValue);
      const placementStyles = orientation === "horizontal" ? { left: `${offset * 100}%`, top: "50%" } : { top: `${offset * 100}%`, left: "50%" };
      return normalize.element({
        ...parts.channelSliderThumb.attrs,
        id: dom.getChannelSliderThumbId(state.context, channel),
        role: "slider",
        "aria-label": channel,
        tabIndex: disabled ? void 0 : 0,
        "data-channel": channel,
        "data-disabled": dataAttr(disabled),
        "data-orientation": orientation,
        "aria-disabled": dataAttr(disabled),
        "aria-orientation": orientation,
        "aria-valuemax": channelRange.maxValue,
        "aria-valuemin": channelRange.minValue,
        "aria-valuenow": channelValue,
        "aria-valuetext": `${channel} ${channelValue}`,
        style: {
          forcedColorAdjust: "none",
          position: "absolute",
          background: getChannelDisplayColor(areaValue, channel).toString("css"),
          ...placementStyles
        },
        onFocus() {
          if (!interactive) return;
          send({ type: "CHANNEL_SLIDER.FOCUS", channel });
        },
        onKeyDown(event) {
          if (event.defaultPrevented) return;
          if (!interactive) return;
          const step = getEventStep(event) * channelRange.step;
          const keyMap = {
            ArrowUp() {
              send({ type: "CHANNEL_SLIDER.ARROW_UP", channel, step });
            },
            ArrowDown() {
              send({ type: "CHANNEL_SLIDER.ARROW_DOWN", channel, step });
            },
            ArrowLeft() {
              send({ type: "CHANNEL_SLIDER.ARROW_LEFT", channel, step });
            },
            ArrowRight() {
              send({ type: "CHANNEL_SLIDER.ARROW_RIGHT", channel, step });
            },
            PageUp() {
              send({ type: "CHANNEL_SLIDER.PAGE_UP", channel });
            },
            PageDown() {
              send({ type: "CHANNEL_SLIDER.PAGE_DOWN", channel });
            },
            Home() {
              send({ type: "CHANNEL_SLIDER.HOME", channel });
            },
            End() {
              send({ type: "CHANNEL_SLIDER.END", channel });
            },
            Escape(event2) {
              event2.stopPropagation();
            }
          };
          const exec = keyMap[getEventKey(event, state.context)];
          if (exec) {
            exec(event);
            event.preventDefault();
          }
        }
      });
    },
    getChannelInputProps(props) {
      const { channel } = props;
      const isTextField = channel === "hex" || channel === "css";
      const channelRange = getChannelRange(value, channel);
      return normalize.input({
        ...parts.channelInput.attrs,
        dir: state.context.dir,
        type: isTextField ? "text" : "number",
        "data-channel": channel,
        "aria-label": channel,
        spellCheck: false,
        autoComplete: "off",
        disabled,
        "data-disabled": dataAttr(disabled),
        readOnly: state.context.readOnly,
        defaultValue: getChannelValue(value, channel),
        min: channelRange?.minValue,
        max: channelRange?.maxValue,
        step: channelRange?.step,
        onBeforeInput(event) {
          if (isTextField || !interactive) return;
          const value2 = event.currentTarget.value;
          if (value2.match(/[^0-9.]/g)) {
            event.preventDefault();
          }
        },
        onFocus(event) {
          if (!interactive) return;
          send({ type: "CHANNEL_INPUT.FOCUS", channel });
          event.currentTarget.select();
        },
        onBlur(event) {
          if (!interactive) return;
          const value2 = isTextField ? event.currentTarget.value : event.currentTarget.valueAsNumber;
          send({ type: "CHANNEL_INPUT.BLUR", channel, value: value2, isTextField });
        },
        onKeyDown(event) {
          if (event.defaultPrevented) return;
          if (!interactive) return;
          if (event.key === "Enter") {
            const value2 = isTextField ? event.currentTarget.value : event.currentTarget.valueAsNumber;
            send({ type: "CHANNEL_INPUT.CHANGE", channel, value: value2, isTextField });
            event.preventDefault();
          }
        },
        style: {
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "textfield"
        }
      });
    },
    getHiddenInputProps() {
      return normalize.input({
        type: "text",
        disabled,
        name: state.context.name,
        readOnly: state.context.readOnly,
        required: state.context.required,
        id: dom.getHiddenInputId(state.context),
        style: visuallyHiddenStyle,
        defaultValue: valueAsString
      });
    },
    getEyeDropperTriggerProps() {
      return normalize.button({
        ...parts.eyeDropperTrigger.attrs,
        type: "button",
        dir: state.context.dir,
        disabled,
        "data-disabled": dataAttr(disabled),
        "aria-label": "Pick a color from the screen",
        onClick() {
          if (!interactive) return;
          send("EYEDROPPER.CLICK");
        }
      });
    },
    getSwatchGroupProps() {
      return normalize.element({
        ...parts.swatchGroup.attrs,
        role: "group"
      });
    },
    getSwatchTriggerState,
    getSwatchTriggerProps(props) {
      const swatchState = getSwatchTriggerState(props);
      return normalize.button({
        ...parts.swatchTrigger.attrs,
        disabled: swatchState.disabled,
        dir: state.context.dir,
        type: "button",
        "aria-label": `select ${swatchState.valueAsString} as the color`,
        "data-state": swatchState.checked ? "checked" : "unchecked",
        "data-value": swatchState.valueAsString,
        "data-disabled": dataAttr(swatchState.disabled),
        onClick() {
          if (swatchState.disabled) return;
          send({ type: "SWATCH_TRIGGER.CLICK", value: swatchState.value });
        },
        style: {
          "--color": swatchState.valueAsString,
          position: "relative"
        }
      });
    },
    getSwatchIndicatorProps(props) {
      const swatchState = getSwatchTriggerState(props);
      return normalize.element({
        ...parts.swatchIndicator.attrs,
        dir: state.context.dir,
        hidden: !swatchState.checked
      });
    },
    getSwatchProps(props) {
      const { respectAlpha = true } = props;
      const swatchState = getSwatchTriggerState(props);
      const color = swatchState.value.toString(respectAlpha ? "css" : "hex");
      return normalize.element({
        ...parts.swatch.attrs,
        dir: state.context.dir,
        "data-state": swatchState.checked ? "checked" : "unchecked",
        "data-value": swatchState.valueAsString,
        style: {
          "--color": color,
          position: "relative",
          background: color
        }
      });
    },
    getFormatTriggerProps() {
      return normalize.button({
        ...parts.formatTrigger.attrs,
        dir: state.context.dir,
        type: "button",
        "aria-label": `change color format to ${getNextFormat(state.context.format)}`,
        onClick(event) {
          if (event.currentTarget.disabled) return;
          const nextFormat = getNextFormat(state.context.format);
          send({ type: "FORMAT.SET", format: nextFormat, src: "format-trigger" });
        }
      });
    },
    getFormatSelectProps() {
      return normalize.select({
        ...parts.formatSelect.attrs,
        "aria-label": "change color format",
        dir: state.context.dir,
        defaultValue: state.context.format,
        disabled,
        onChange(event) {
          const format = assertFormat(event.currentTarget.value);
          send({ type: "FORMAT.SET", format, src: "format-select" });
        }
      });
    }
  };
}
var formats = ["hsba", "hsla", "rgba"];
var formatRegex = new RegExp(`^(${formats.join("|")})$`);
function getNextFormat(format) {
  const index = formats.indexOf(format);
  return formats[index + 1] ?? formats[0];
}
function assertFormat(format) {
  if (formatRegex.test(format)) return format;
  throw new Error(`Unsupported color format: ${format}`);
}
var parse = (colorString) => {
  return parseColor(colorString);
};

// src/color-picker.machine.ts
var { and } = guards;
function machine(userContext) {
  const ctx = compact(userContext);
  return createMachine(
    {
      id: "color-picker",
      initial: ctx.open ? "open" : "idle",
      context: {
        dir: "ltr",
        value: parse("#000000"),
        format: "rgba",
        disabled: false,
        closeOnSelect: false,
        ...ctx,
        activeId: null,
        activeChannel: null,
        activeOrientation: null,
        fieldsetDisabled: false,
        restoreFocus: true,
        positioning: {
          ...ctx.positioning,
          placement: "bottom"
        }
      },
      computed: {
        isRtl: (ctx2) => ctx2.dir === "rtl",
        isDisabled: (ctx2) => !!ctx2.disabled || ctx2.fieldsetDisabled,
        isInteractive: (ctx2) => !(ctx2.isDisabled || ctx2.readOnly),
        valueAsString: (ctx2) => ctx2.value.toString(ctx2.format),
        areaValue: (ctx2) => {
          const format = ctx2.format.startsWith("hsl") ? "hsla" : "hsba";
          return ctx2.value.toFormat(format);
        }
      },
      activities: ["trackFormControl"],
      watch: {
        value: ["syncInputElements"],
        format: ["syncFormatSelectElement"],
        open: ["toggleVisibility"]
      },
      on: {
        "VALUE.SET": {
          actions: ["setValue"]
        },
        "FORMAT.SET": {
          actions: ["setFormat"]
        },
        "CHANNEL_INPUT.CHANGE": {
          actions: ["setChannelColorFromInput"]
        },
        "EYEDROPPER.CLICK": {
          actions: ["openEyeDropper"]
        },
        "SWATCH_TRIGGER.CLICK": {
          actions: ["setValue"]
        }
      },
      states: {
        idle: {
          tags: ["closed"],
          on: {
            "CONTROLLED.OPEN": {
              target: "open",
              actions: ["setInitialFocus"]
            },
            OPEN: [
              {
                guard: "isOpenControlled",
                actions: ["invokeOnOpen"]
              },
              {
                target: "open",
                actions: ["invokeOnOpen", "setInitialFocus"]
              }
            ],
            "TRIGGER.CLICK": [
              {
                guard: "isOpenControlled",
                actions: ["invokeOnOpen"]
              },
              {
                target: "open",
                actions: ["invokeOnOpen", "setInitialFocus"]
              }
            ],
            "CHANNEL_INPUT.FOCUS": {
              target: "focused",
              actions: ["setActiveChannel"]
            }
          }
        },
        focused: {
          tags: ["closed", "focused"],
          on: {
            "CONTROLLED.OPEN": {
              target: "open",
              actions: ["setInitialFocus"]
            },
            OPEN: [
              {
                guard: "isOpenControlled",
                actions: ["invokeOnOpen"]
              },
              {
                target: "open",
                actions: ["invokeOnOpen", "setInitialFocus"]
              }
            ],
            "TRIGGER.CLICK": [
              {
                guard: "isOpenControlled",
                actions: ["invokeOnOpen"]
              },
              {
                target: "open",
                actions: ["invokeOnOpen", "setInitialFocus"]
              }
            ],
            "CHANNEL_INPUT.FOCUS": {
              actions: ["setActiveChannel"]
            },
            "CHANNEL_INPUT.BLUR": {
              target: "idle",
              actions: ["setChannelColorFromInput"]
            },
            "TRIGGER.BLUR": {
              target: "idle"
            }
          }
        },
        open: {
          tags: ["open"],
          activities: ["trackPositioning", "trackDismissableElement"],
          on: {
            "CONTROLLED.CLOSE": [
              {
                guard: "shouldRestoreFocus",
                target: "focused",
                actions: ["setReturnFocus"]
              },
              {
                target: "idle"
              }
            ],
            "TRIGGER.CLICK": [
              {
                guard: "isOpenControlled",
                actions: ["invokeOnClose"]
              },
              {
                target: "idle",
                actions: ["invokeOnClose"]
              }
            ],
            "AREA.POINTER_DOWN": {
              target: "open:dragging",
              actions: ["setActiveChannel", "setAreaColorFromPoint", "focusAreaThumb"]
            },
            "AREA.FOCUS": {
              actions: ["setActiveChannel"]
            },
            "CHANNEL_SLIDER.POINTER_DOWN": {
              target: "open:dragging",
              actions: ["setActiveChannel", "setChannelColorFromPoint", "focusChannelThumb"]
            },
            "CHANNEL_SLIDER.FOCUS": {
              actions: ["setActiveChannel"]
            },
            "AREA.ARROW_LEFT": {
              actions: ["decrementAreaXChannel"]
            },
            "AREA.ARROW_RIGHT": {
              actions: ["incrementAreaXChannel"]
            },
            "AREA.ARROW_UP": {
              actions: ["incrementAreaYChannel"]
            },
            "AREA.ARROW_DOWN": {
              actions: ["decrementAreaYChannel"]
            },
            "AREA.PAGE_UP": {
              actions: ["incrementAreaXChannel"]
            },
            "AREA.PAGE_DOWN": {
              actions: ["decrementAreaXChannel"]
            },
            "CHANNEL_SLIDER.ARROW_LEFT": {
              actions: ["decrementChannel"]
            },
            "CHANNEL_SLIDER.ARROW_RIGHT": {
              actions: ["incrementChannel"]
            },
            "CHANNEL_SLIDER.ARROW_UP": {
              actions: ["incrementChannel"]
            },
            "CHANNEL_SLIDER.ARROW_DOWN": {
              actions: ["decrementChannel"]
            },
            "CHANNEL_SLIDER.PAGE_UP": {
              actions: ["incrementChannel"]
            },
            "CHANNEL_SLIDER.PAGE_DOWN": {
              actions: ["decrementChannel"]
            },
            "CHANNEL_SLIDER.HOME": {
              actions: ["setChannelToMin"]
            },
            "CHANNEL_SLIDER.END": {
              actions: ["setChannelToMax"]
            },
            "CHANNEL_INPUT.BLUR": {
              actions: ["setChannelColorFromInput"]
            },
            INTERACT_OUTSIDE: [
              {
                guard: "isOpenControlled",
                actions: ["invokeOnClose"]
              },
              {
                guard: "shouldRestoreFocus",
                target: "focused",
                actions: ["invokeOnClose", "setReturnFocus"]
              },
              {
                target: "idle",
                actions: ["invokeOnClose"]
              }
            ],
            CLOSE: [
              {
                guard: "isOpenControlled",
                actions: ["invokeOnClose"]
              },
              {
                target: "idle",
                actions: ["invokeOnClose"]
              }
            ],
            "SWATCH_TRIGGER.CLICK": [
              {
                guard: and("isOpenControlled", "closeOnSelect"),
                actions: ["setValue", "invokeOnClose"]
              },
              {
                guard: "closeOnSelect",
                target: "focused",
                actions: ["setValue", "invokeOnClose", "setReturnFocus"]
              },
              {
                actions: ["setValue"]
              }
            ]
          }
        },
        "open:dragging": {
          tags: ["open"],
          exit: ["clearActiveChannel"],
          activities: ["trackPointerMove", "disableTextSelection", "trackPositioning", "trackDismissableElement"],
          on: {
            "CONTROLLED.CLOSE": [
              {
                guard: "shouldRestoreFocus",
                target: "focused",
                actions: ["setReturnFocus"]
              },
              {
                target: "idle"
              }
            ],
            "AREA.POINTER_MOVE": {
              actions: ["setAreaColorFromPoint", "focusAreaThumb"]
            },
            "AREA.POINTER_UP": {
              target: "open",
              actions: ["invokeOnChangeEnd"]
            },
            "CHANNEL_SLIDER.POINTER_MOVE": {
              actions: ["setChannelColorFromPoint", "focusChannelThumb"]
            },
            "CHANNEL_SLIDER.POINTER_UP": {
              target: "open",
              actions: ["invokeOnChangeEnd"]
            },
            INTERACT_OUTSIDE: [
              {
                guard: "isOpenControlled",
                actions: ["invokeOnClose"]
              },
              {
                guard: "shouldRestoreFocus",
                target: "focused",
                actions: ["invokeOnClose", "setReturnFocus"]
              },
              {
                target: "idle",
                actions: ["invokeOnClose"]
              }
            ],
            CLOSE: [
              {
                guard: "isOpenControlled",
                actions: ["invokeOnClose"]
              },
              {
                target: "idle",
                actions: ["invokeOnClose"]
              }
            ]
          }
        }
      }
    },
    {
      guards: {
        closeOnSelect: (ctx2) => !!ctx2.closeOnSelect,
        isOpenControlled: (ctx2) => !!ctx2["open.controlled"],
        shouldRestoreFocus: (ctx2) => !!ctx2.restoreFocus
      },
      activities: {
        trackPositioning(ctx2) {
          ctx2.currentPlacement = ctx2.positioning.placement;
          const anchorEl = dom.getTriggerEl(ctx2);
          const getPositionerEl = () => dom.getPositionerEl(ctx2);
          return getPlacement(anchorEl, getPositionerEl, {
            ...ctx2.positioning,
            defer: true,
            onComplete(data) {
              ctx2.currentPlacement = data.placement;
            }
          });
        },
        trackDismissableElement(ctx2, _evt, { send }) {
          const getContentEl = () => dom.getContentEl(ctx2);
          return trackDismissableElement(getContentEl, {
            exclude: dom.getTriggerEl(ctx2),
            defer: true,
            onInteractOutside(event) {
              ctx2.onInteractOutside?.(event);
              if (event.defaultPrevented) return;
              ctx2.restoreFocus = !(event.detail.focusable || event.detail.contextmenu);
            },
            onPointerDownOutside: ctx2.onPointerDownOutside,
            onFocusOutside: ctx2.onFocusOutside,
            onDismiss() {
              send({ type: "INTERACT_OUTSIDE" });
            }
          });
        },
        trackFormControl(ctx2, _evt, { send, initialContext }) {
          const inputEl = dom.getHiddenInputEl(ctx2);
          return trackFormControl(inputEl, {
            onFieldsetDisabledChange(disabled) {
              ctx2.fieldsetDisabled = disabled;
            },
            onFormReset() {
              send({ type: "VALUE.SET", value: initialContext.value, src: "form.reset" });
            }
          });
        },
        trackPointerMove(ctx2, evt, { send }) {
          return trackPointerMove(dom.getDoc(ctx2), {
            onPointerMove({ point }) {
              const type = ctx2.activeId === "area" ? "AREA.POINTER_MOVE" : "CHANNEL_SLIDER.POINTER_MOVE";
              send({ type, point, format: evt.format });
            },
            onPointerUp() {
              const type = ctx2.activeId === "area" ? "AREA.POINTER_UP" : "CHANNEL_SLIDER.POINTER_UP";
              send({ type });
            }
          });
        },
        disableTextSelection(ctx2) {
          return disableTextSelection({ doc: dom.getDoc(ctx2), target: dom.getContentEl(ctx2) });
        }
      },
      actions: {
        openEyeDropper(ctx2) {
          const isSupported = "EyeDropper" in dom.getWin(ctx2);
          if (!isSupported) return;
          const win = dom.getWin(ctx2);
          const picker = new win.EyeDropper();
          picker.open().then(({ sRGBHex }) => {
            const format = ctx2.value.getFormat();
            const color = parseColor(sRGBHex).toFormat(format);
            set.value(ctx2, color);
            ctx2.onValueChangeEnd?.({ value: ctx2.value, valueAsString: ctx2.valueAsString });
          }).catch(() => void 0);
        },
        setActiveChannel(ctx2, evt) {
          ctx2.activeId = evt.id;
          if (evt.channel) ctx2.activeChannel = evt.channel;
          if (evt.orientation) ctx2.activeOrientation = evt.orientation;
        },
        clearActiveChannel(ctx2) {
          ctx2.activeChannel = null;
          ctx2.activeId = null;
          ctx2.activeOrientation = null;
        },
        setAreaColorFromPoint(ctx2, evt) {
          const normalizedValue = evt.format ? ctx2.value.toFormat(evt.format) : ctx2.areaValue;
          const { xChannel, yChannel } = evt.channel || ctx2.activeChannel;
          const percent = dom.getAreaValueFromPoint(ctx2, evt.point);
          if (!percent) return;
          const xValue = normalizedValue.getChannelPercentValue(xChannel, percent.x);
          const yValue = normalizedValue.getChannelPercentValue(yChannel, 1 - percent.y);
          const color = normalizedValue.withChannelValue(xChannel, xValue).withChannelValue(yChannel, yValue);
          set.value(ctx2, color);
        },
        setChannelColorFromPoint(ctx2, evt) {
          const channel = evt.channel || ctx2.activeId;
          const normalizedValue = evt.format ? ctx2.value.toFormat(evt.format) : ctx2.areaValue;
          const percent = dom.getChannelSliderValueFromPoint(ctx2, evt.point, channel);
          if (!percent) return;
          const orientation = ctx2.activeOrientation || "horizontal";
          const channelPercent = orientation === "horizontal" ? percent.x : percent.y;
          const value = normalizedValue.getChannelPercentValue(channel, channelPercent);
          const color = normalizedValue.withChannelValue(channel, value);
          set.value(ctx2, color);
        },
        setValue(ctx2, evt) {
          set.value(ctx2, evt.value);
        },
        setFormat(ctx2, evt) {
          set.format(ctx2, evt.format);
        },
        syncInputElements(ctx2) {
          sync.inputs(ctx2);
        },
        invokeOnChangeEnd(ctx2) {
          invoke.changeEnd(ctx2);
        },
        setChannelColorFromInput(ctx2, evt) {
          const { channel, isTextField, value } = evt;
          const currentAlpha = ctx2.value.getChannelValue("alpha");
          let color;
          if (channel === "alpha") {
            let valueAsNumber = parseFloat(value);
            valueAsNumber = Number.isNaN(valueAsNumber) ? currentAlpha : valueAsNumber;
            color = ctx2.value.withChannelValue("alpha", valueAsNumber);
          } else if (isTextField) {
            color = tryCatch(
              () => parse(value).withChannelValue("alpha", currentAlpha),
              () => ctx2.value
            );
          } else {
            const current = ctx2.value.toFormat(ctx2.format);
            const valueAsNumber = Number.isNaN(value) ? current.getChannelValue(channel) : value;
            color = current.withChannelValue(channel, valueAsNumber);
          }
          sync.inputs(ctx2, color);
          set.value(ctx2, color);
        },
        incrementChannel(ctx2, evt) {
          const color = ctx2.value.incrementChannel(evt.channel, evt.step);
          set.value(ctx2, color);
        },
        decrementChannel(ctx2, evt) {
          const color = ctx2.value.decrementChannel(evt.channel, evt.step);
          set.value(ctx2, color);
        },
        incrementAreaXChannel(ctx2, evt) {
          const { xChannel } = evt.channel;
          const color = ctx2.areaValue.incrementChannel(xChannel, evt.step);
          set.value(ctx2, color);
        },
        decrementAreaXChannel(ctx2, evt) {
          const { xChannel } = evt.channel;
          const color = ctx2.areaValue.decrementChannel(xChannel, evt.step);
          set.value(ctx2, color);
        },
        incrementAreaYChannel(ctx2, evt) {
          const { yChannel } = evt.channel;
          const color = ctx2.areaValue.incrementChannel(yChannel, evt.step);
          set.value(ctx2, color);
        },
        decrementAreaYChannel(ctx2, evt) {
          const { yChannel } = evt.channel;
          const color = ctx2.areaValue.decrementChannel(yChannel, evt.step);
          set.value(ctx2, color);
        },
        setChannelToMax(ctx2, evt) {
          const range = ctx2.value.getChannelRange(evt.channel);
          const color = ctx2.value.withChannelValue(evt.channel, range.maxValue);
          set.value(ctx2, color);
        },
        setChannelToMin(ctx2, evt) {
          const range = ctx2.value.getChannelRange(evt.channel);
          const color = ctx2.value.withChannelValue(evt.channel, range.minValue);
          set.value(ctx2, color);
        },
        focusAreaThumb(ctx2) {
          raf(() => {
            dom.getAreaThumbEl(ctx2)?.focus({ preventScroll: true });
          });
        },
        focusChannelThumb(ctx2, evt) {
          raf(() => {
            dom.getChannelSliderThumbEl(ctx2, evt.channel)?.focus({ preventScroll: true });
          });
        },
        setInitialFocus(ctx2) {
          raf(() => {
            const element = getInitialFocus({
              root: dom.getContentEl(ctx2),
              getInitialEl: ctx2.initialFocusEl
            });
            element?.focus({ preventScroll: true });
          });
        },
        setReturnFocus(ctx2) {
          raf(() => {
            dom.getTriggerEl(ctx2)?.focus({ preventScroll: true });
          });
        },
        syncFormatSelectElement(ctx2) {
          sync.formatSelect(ctx2);
        },
        invokeOnOpen(ctx2) {
          ctx2.onOpenChange?.({ open: true });
        },
        invokeOnClose(ctx2) {
          ctx2.onOpenChange?.({ open: false });
        },
        toggleVisibility(ctx2, evt, { send }) {
          send({ type: ctx2.open ? "CONTROLLED.OPEN" : "CONTROLLED.CLOSE", previousEvent: evt });
        }
      },
      compareFns: {
        value: (a, b) => a.isEqual(b)
      }
    }
  );
}
var sync = {
  // sync channel inputs
  inputs(ctx, color) {
    const channelInputs = dom.getChannelInputEls(ctx);
    raf(() => {
      channelInputs.forEach((inputEl) => {
        const channel = inputEl.dataset.channel;
        dom.setValue(inputEl, getChannelValue(color || ctx.value, channel));
      });
    });
  },
  // sync format select
  formatSelect(ctx) {
    const selectEl = dom.getFormatSelectEl(ctx);
    raf(() => {
      dom.setValue(selectEl, ctx.format);
    });
  }
};
var invoke = {
  changeEnd(ctx) {
    const value = ctx.value.toFormat(ctx.format);
    ctx.onValueChangeEnd?.({
      value,
      valueAsString: ctx.valueAsString
    });
  },
  change(ctx) {
    const value = ctx.value.toFormat(ctx.format);
    ctx.onValueChange?.({
      value,
      valueAsString: ctx.valueAsString
    });
    dispatchInputValueEvent(dom.getHiddenInputEl(ctx), { value: ctx.valueAsString });
  },
  formatChange(ctx) {
    ctx.onFormatChange?.({ format: ctx.format });
  }
};
var set = {
  value(ctx, color) {
    if (!color || ctx.value.isEqual(color)) return;
    ctx.value = color;
    invoke.change(ctx);
  },
  format(ctx, format) {
    if (ctx.format === format) return;
    ctx.format = format;
    invoke.formatChange(ctx);
  }
};

var component = /*#__PURE__*/Object.freeze({
  __proto__: null,
  anatomy: anatomy,
  connect: connect,
  machine: machine,
  parse: parse
});

export { component as default };
