import { MenuItem } from './tru-menu';

export class TruSecondMenu {
  collapse: boolean = false;
  handleIcon: string = 'left';
  items: MenuItem[]=[];
  selected: MenuItem|null=null;
  constructor(items?: MenuItem[], selected?: MenuItem) {
    if (items && items.length > 0) {
        this.items=items;
        this.selected=selected;
    }
  }
  toggle() {
    if (this.collapse) {
      this.collapse = false;
      this.handleIcon = 'left';
    } else {
      this.collapse = true;
      this.handleIcon = 'right';
    }
  }

}
