import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';

@Directive({
  selector: '[appGravatar]'
})
export class GravatarDirective implements OnInit {

  private emailValue:string='';
  private sizeValue:number=0;

  @Input() set size(value: number) {
    this.sizeValue=value;
    this.update();
  }
  @Input() set email(value: string) {
    this.emailValue=value;
    this.update();
  }
  fallback = 'wavatar'; //Default Image Path or 'wavatar' Randor

  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  update(): void {
    if (!this.el.nativeElement) {
      return;
    }

    if(this.emailValue && this.emailValue.trim()!=''){
      this.el.nativeElement.src =
      '//www.gravatar.com/avatar/'+Md5.hashStr(this.emailValue.trim().toLowerCase())+
      '?'+(this.sizeValue>0?('s='+this.sizeValue+'&'):'')+'d='+this.fallback;
    }else{
      this.el.nativeElement.src = `//www.gravatar.com/avatar/`;
    }
  }
}
