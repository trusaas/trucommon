import { FormGroup } from '@angular/forms';
export class TruNzOptions {
  form!: FormGroup;
  loading:boolean=false;
  visible: boolean = false;
  closable: boolean = true;
  constructor(){ }
}
