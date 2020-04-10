import { Component, OnInit, Input, Output, EventEmitter, DoCheck, AfterViewInit, NgZone } from '@angular/core';
import { CorouselService } from './corousel.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, DoCheck, AfterViewInit  {

  title = 'carousel';
  imageT ="https://github.com/victorcmarinho/carouselSlide/blob/master/src/assets/produto.png?raw=true"
  images: string[] = [
    "https://github.com/victorcmarinho/carouselSlide/blob/master/src/assets/produto.png?raw=true",
    "https://github.com/victorcmarinho/carouselSlide/blob/master/src/assets/gamer.jpg?raw=true",
    "https://github.com/victorcmarinho/carouselSlide/blob/master/src/assets/tree.jpg?raw=true",
    "https://github.com/victorcmarinho/carouselSlide/blob/master/src/assets/venom.jpeg?raw=true",
    "https://github.com/victorcmarinho/carouselSlide/blob/master/src/assets/wolf.jpg?raw=true"
  ];
  private _autoplayIntervalId: any;
  @Input() autoPlay: boolean = true;
  @Input() autoPlayInterval: number = 5000;
  @Input() showLineBars: boolean = true;
  @Input() lazyLoad: boolean = true;
  @Input('goToSlide') set goToSlide(index: number){
    this.protectAutoPlay();
    this.activeSlide = index;
  };

  @Output() onSlideIndex = new EventEmitter<number>();
  @Output() nextSlideIndex = new EventEmitter<number>();
  @Output() previousSlideIndex = new EventEmitter<number>();

  public activeSlide: number = 0;

  constructor(
    private _corouselService : CorouselService,
    private _ngZone: NgZone
  ) {}
  ngOnInit(){}
  ngDoCheck(){
    this.onSlideIndex.emit(this.activeSlide);
    this.getNextSlide();
    this.getPreviousSlide();
    this.handleAutoPlay();
  }
  ngAfterViewInit(){}

  trackByFn(index: number, image): any {
    return index;
  }

  getNextSlide(): number {
    let next = (this.activeSlide + 1) % this.images.length;
    this.nextSlideIndex.emit(next);
    return next;
  }

  getPreviousSlide(): number {
    let previous;
    if(this.activeSlide === 0) {
      previous = (this.images.length - 2) - (this.activeSlide - 1 % this.images.length)
    } else {
      previous = this.activeSlide - 1 % this.images.length;
    }
    this.previousSlideIndex.emit(previous);
    return previous;
  }

  onClickNext() {
    this.protectAutoPlay();
    this.nextImage();
  }

  onClickLast() {
    this.protectAutoPlay();
    this.lastImage();
  }

  private nextImage(){
    this.activeSlide = (this.activeSlide + 1) % this.images.length;
  }
  private lastImage(){
    if(this.activeSlide === 0) {
      this.activeSlide = (this.images.length - 2) - (this.activeSlide - 1 % this.images.length)
    } else {
      this.activeSlide = this.activeSlide - 1 % this.images.length;
    }
  }

  private handleAutoPlay():void {
    if(this.autoPlay === false){
      if (this._autoplayIntervalId) {
        this._ngZone.runOutsideAngular(() => clearInterval(this._autoplayIntervalId));
      }
    } else if(!this._autoplayIntervalId){
      this._ngZone.runOutsideAngular(() => {
        this._autoplayIntervalId = setInterval(() => {
          this._ngZone.run(() => this.nextImage());
        }, this.autoPlayInterval);
      });
    };
  };

  private protectAutoPlay(){
    this._ngZone.runOutsideAngular(() => clearInterval(this._autoplayIntervalId));
    this._autoplayIntervalId = null;
    this.handleAutoPlay();
  }

}
