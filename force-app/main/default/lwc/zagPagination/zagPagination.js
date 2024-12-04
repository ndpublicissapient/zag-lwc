import { LightningElement, api } from 'lwc';
import { ZagMixin } from 'c/zagMixin';
import ZagJS from './zag.js';

export default class ZagPagination extends ZagMixin(LightningElement) {

  @api set machineContext(value) {
    this.zagMachineContext = value;
    this.connectZag();
  }
  get machineContext() {
    return this.zagMachineContext;
  }

  ready;
  async connectZag() {
    this[ZagMixin.Connect](ZagJS, {
      id: "1",
      ...this.machineContext,
      
      // Add Events
      // onPageChange: (page) => {
      //   this.dispatchEvent(new CustomEvent("pagechange", { detail: page }));
      // }
    }, {
      nav: () => this.zagApi.getRootProps(),
    });
    this.ready = true;
  }

  get navProps() {
    return this[ZagMixin.Props](this.zagApi.getRootProps());
  }

  get prevProps() {
    return this[ZagMixin.Props](this.zagApi.getPrevTriggerProps());
  }

  get nextProps() {
    return this[ZagMixin.Props](this.zagApi.getNextTriggerProps());
  }

  get showPagination() {
    return this.zagApi.totalPages > 1;
  }

  get pages() {
    return this.zagApi.pages.map((page, index) => ({
      ...page,
      isPage: page.type === "page",
      href: `#${page.value}`,
      props: this[ZagMixin.Props](this.zagApi.getItemProps(page)),
      ellipsisKey: `ellipsis-${index}`,
      ellipsisProps: this[ZagMixin.Props](this.zagApi.getEllipsisProps({ index }))
    }));
  }

  handlePage(event) {
    this.zagApi.setPage(event.target.dataset.page);
  }

}