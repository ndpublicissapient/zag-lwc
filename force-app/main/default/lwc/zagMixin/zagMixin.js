function createNormalizer(fn) {
  return new Proxy({}, {
    get() {
      return fn;
    }
  });
}

export const ZagMixin = (BaseClass) => {
  return class extends BaseClass {

    static shadowSupportMode = 'native';
    
    zagApi = {};

    zagCallback() {
      /* override this method in your component if needed */
    }
    
    async _zagConnect(zagComponentJS, machineContext, lwcRefs = null) {
      try {
        const machine = zagComponentJS.machine(machineContext);
        const createApi = () => zagComponentJS.connect(machine.state, (action) => {
          machine.send(action);
          this.zagApi = createApi();
          if (lwcRefs) {
            this._zagUseRefsToAssignProps(lwcRefs);
          }
          this.zagCallback();
        }, createNormalizer((v) => v));
        this.zagApi = createApi();
        if (lwcRefs) {
          this._zagUseRefsToAssignProps(lwcRefs);
        }
        this.zagCallback();
      } catch (e) {
        console.error(e);
      }
    }

    _zagLwcProps(props = {}, options = { includeAllDataAttributes: false }) {
      return Object.keys(props).reduce((acc, key) => {
    
        // Component Parts (data-part -> part) AND Component State (data-state -> part)
        if (["data-part", "data-state"].includes(key)) {
          const part = acc.part ? `${acc.part} ${props[key]}` : props[key];
          return { ...acc, part };
        }
    
        // ARIA Attributes (aria-label -> ariaLabel)
        if (key.slice(0, 5) === "aria-") {
          const newKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
          return { ...acc, [newKey]: props[key] };
        }
    
        // Other Custom Data Attributes (data-foo-bar -> fooBar)
        if (key.slice(0, 5) === "data-") {
          const newKey = key.replace('data-', '');
          const value = props[key];
          // assign only if the value is a blank string (ie. data-disabled)
          if (value === '') {
            return { ...acc, part: acc.part ? `${acc.part} ${newKey}` : newKey };
          }
          if (!options.includeAllDataAttributes) return acc;
        }
        
        // Event Handlers (onClick -> onclick)
        if (key.slice(0, 2) === "on") {
          const newKey = key.toLowerCase();
          return { ...acc, [newKey]: props[key] };
        }
    
        // remove undefined props
        if (typeof props[key] === "undefined") return acc;
        
        if (key === "style") {
          const value = Object.keys(props[key]).reduce((styleAcc, styleKey) => {
            const styleKeyFormatted = styleKey.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
            return `${styleAcc}${styleKeyFormatted}:${props[key][styleKey]};`;
          }, '');
          return { ...acc, [key]: value };
        }

        return { ...acc, [key]: props[key] };
      }, {});
    }

    _zagUseRefsToAssignProps(lwcRefs) {
      Object.keys(lwcRefs).forEach((ref) => {
        if (this.refs && this.refs[ref]) {
          const props = this[ZagMixin.Props](lwcRefs[ref](), { includeAllDataAttributes: true });
          props && Object.keys(props).forEach((prop) => {
            if (prop.slice(0, 5) === "data-") {
              this.refs[ref].setAttribute(prop, props[prop]);
              return;
            }
            this.refs[ref][prop] = props[prop];
          });
        }
      });
    }

  }
}

ZagMixin.Connect = '_zagConnect';
ZagMixin.Props = '_zagLwcProps';