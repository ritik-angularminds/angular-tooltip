import { Directive, ElementRef, HostListener, Input, Renderer2, inject } from '@angular/core';

type Position = 'top' | 'right' | 'bottom' | 'left';

@Directive({
  selector: '[tooltip]',
  standalone: true
})
export class TooltipDirective {
  @Input('tooltip') tooltipTitle!: string;
  @Input('position') position!: Position;

  tooltipEl!: HTMLElement | null;
  offset = 10;
  transitionTime = 300;

  elRef: ElementRef = inject(ElementRef);
  renderer: Renderer2 = inject(Renderer2);

  @HostListener('mouseenter') onMouseEnter() {
    this.displayTooltip();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hideTooltip();
  }

  displayTooltip(): void {
    if(!this.tooltipEl) {
      this.create();
      this.setPosition();
      
      //Changing opacity to 1
      this.renderer.addClass(this.tooltipEl, 'tooltip-show');
    }
  }

  create(): void {
    this.tooltipEl = this.renderer.createElement('span');
    this.renderer.appendChild(this.tooltipEl, this.renderer.createText(this.tooltipTitle));

    this.renderer.appendChild(document.body, this.tooltipEl);

    this.renderer.addClass(this.tooltipEl, 'tooltip');
    this.renderer.addClass(this.tooltipEl, `tooltip-${this.position}`);

    this.renderer.setStyle(this.tooltipEl, '-webkit-transition', `opacity ${this.transitionTime}ms`);
    this.renderer.setStyle(this.tooltipEl, '-moz-transition', `opacity ${this.transitionTime}ms`);
    this.renderer.setStyle(this.tooltipEl, '-o-transition', `opacity ${this.transitionTime}ms`);
    this.renderer.setStyle(this.tooltipEl, 'transition', `opacity ${this.transitionTime}ms`);
  }

  setPosition(): void {
    if (this.tooltipEl) {
      const hostElPosition = this.elRef.nativeElement.getBoundingClientRect();
      const tooltipElPosition = this.tooltipEl.getBoundingClientRect();
      const scrollPos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

      let top, left;

      switch (this.position) {
        case 'top': {
          top = hostElPosition.top - tooltipElPosition.height - this.offset;
          left = hostElPosition.left + (hostElPosition.width - tooltipElPosition.width) / 2;
          break;
        }
        case 'bottom': {
          top = hostElPosition.bottom + this.offset;
          left = hostElPosition.left + (hostElPosition.width - tooltipElPosition.width) / 2;
          break;
        }
        case 'left': {
          top = hostElPosition.top + (hostElPosition.height - tooltipElPosition.height) / 2;
          left = hostElPosition.left - tooltipElPosition.width - this.offset;
          break;
        }
        case 'right': {
          top = hostElPosition.top + (hostElPosition.height - tooltipElPosition.height) / 2;
          left = hostElPosition.right + this.offset;
          break;
        }
        default: {
          top = hostElPosition.top - tooltipElPosition.height - this.offset;
          left = hostElPosition.left + ((hostElPosition.width - tooltipElPosition.width) / 2);
          break;
        }
      }


      this.renderer.setStyle(this.tooltipEl, 'top', `${top + scrollPos}px`);
      this.renderer.setStyle(this.tooltipEl, 'left', `${left}px`);
    }
  }

  hideTooltip(): void {
    this.renderer.removeClass(this.tooltipEl, 'tooltip-show');
    window.setTimeout(() => {
      this.renderer.removeChild(document.body, this.tooltipEl);
      this.tooltipEl = null;
    }, this.transitionTime);
  }

}
