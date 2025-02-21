import { Directive, ElementRef, HostListener, Renderer2, OnDestroy, Input, OnInit } from '@angular/core';
import { DomHandler } from 'primeng/primeng';

@Directive({
    selector: '[kyeeValidate]',
    providers: [DomHandler]
})
export class ValidateDirective implements OnDestroy {
    // 用于应对model绑定发生变化的情况检测控件内容改变，
    oldValue: string;
    isFoucus = false;
    valid: boolean;
    type: string;
    modelValue: string;
    preventModelCheck = true;
    //#region Tip 属性
    @Input() tipPos = 'right';

    @Input() tipAppendTo: any = 'body';

    @Input() positionStyle: string;

    @Input() tipStyleClass: string;

    @Input() tipZIndex = 'auto';

    @Input() tipDisabled: boolean;

    @Input() escape = true;

    container: any;

    styleClass: string;

    tipText: any;

    documentResizeListener: Function;

    active: boolean;

    public _text: string;

    public _pattern;

    public _maxLength;

    public _minLength;

    public _min;

    public _max;

    public _step;

    public _requried: boolean;

    @Input() set kRequried(value: boolean) {
        this._requried = value;
        let target = this.el.nativeElement;
        let content = target.value;
        this.validate(content);
    }
    get kPattern(): string {
        return this._pattern;
    }
    @Input() set kPattern(pattern: string) {
        this._pattern = pattern;
        let target = this.el.nativeElement;
        let content = target.value;
        this.validate(content);
    }

    get kMaxLength(): number {
        return this._maxLength;
    }
    @Input() set kMaxLength(maxLength: number) {
        this._maxLength = maxLength;
        let target = this.el.nativeElement;
        let content = target.value;
        this.validate(content);
    }

    get kMinLength(): number {
        return this._minLength;
    }
    @Input() set kMinLength(minLength: number) {
        this._minLength = minLength;
        let target = this.el.nativeElement;
        let content = target.value;
        this.validate(content);
    }

    get kMin(): number {
        return this._min;
    }
    @Input() set kMin(min: number) {
        this._min = min;
        let target = this.el.nativeElement;
        let content = target.value;
        this.validate(content);
    }

    get kMax(): number {
        return this._max;
    }
    @Input() set kMax(max: number) {
        this._max = max;
        let target = this.el.nativeElement;
        let content = target.value;
        this.validate(content);
    }

    get kStep(): number {
        return this._step;
    }
    @Input() set kStep(step: number) {
        this._step = step;
        let target = this.el.nativeElement;
        let content = target.value;
        this.validate(content);
    }

    get kType(): string {
        return this.type;
    }
    @Input() set kType(type: string) {
        this.type = type;
        let target = this.el.nativeElement;
        let content = target.value;
        this.validate(content);
    }

    @Input() set kyeeValidate(value: string) {
        if (this.preventModelCheck) {
            this.preventModelCheck = false;
        } else {
            this.valid = true;
            this.validate(value);
        }

    }
    //#endregion
    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer2: Renderer2) { }

    @HostListener('input', ['$event'])
    onInput(e: Event) {
        this.validateOnInput();
    }

    @HostListener('blur', ['$event'])
    onBlur(e: Event) {
        this.isFoucus = false;
        this.deactivate(true);

    }

    @HostListener('focus', ['$event'])
    onFocus(e: Event) {
        let target = this.el.nativeElement;
        let content = target.value;
        this.isFoucus = true;
        this.changeStyle();
    }

    public validate(content: string) {


        this.changeStyle();
        // 如果上一次检测的内容和旧值相同，则不再检测
        if (content === null || content === undefined || this.oldValue === content) {
            return;
        }
        this.oldValue = content;
        this.valid = true;
        if (this._pattern) {
            this.checkPattern(content);
        }

        if (this._minLength) {
            this.checkMinLength(content);
        }

        if (this._maxLength) {
            this.checkMaxLength(content);
        }
        let isMinMax = this._min || this._max || this._step;
        let contentNum = Number(content);
        if (!Number.isNaN(contentNum) && isMinMax) {
            if (this._max) {
                this.checkMax(contentNum);
            }

            if (this._min) {
                this.checkMin(contentNum);
            }

            // step 验证仅当min，max存在时
            if (this._step && (this._max || this._min)) {
                this.checkStep(contentNum);
            }
        }
        this.changeStyle();
    }

    public changeStyle() {
        if (!this.valid) {
            if (this.isFoucus && !this.container) {
                this.activate();
            }
            this.renderer2.addClass(this.el.nativeElement, 'invalid');
        } else if (this.valid) {
            this.hide();
            this.renderer2.removeClass(this.el.nativeElement, 'invalid');
        }
    }

    public checkPattern(content: string) {
        let reg = new RegExp(this._pattern);
        this.valid = this.valid && reg.test(content);
    }

    public getContentByte(_content: string): number {
        let content = _content.toString();
        let regSingle = new RegExp('[\x00-\xff]', 'g');
        let doubleString = content.replace(regSingle, '');
        let singleMatches = content.match(regSingle);
        let length = doubleString.length * 2;

        if (singleMatches) {
            singleMatches.forEach(match => {
                length += match.length;
            });
        }
        return length;
    }

    public checkMinLength(content: string) {
        let length = this.getContentByte(content);
        this.valid = this.valid && length >= this._minLength;
    }

    public checkMaxLength(content: string) {
        let length = this.getContentByte(content);
        this.valid = this.valid && length <= this._maxLength;
    }

    public checkMax(content: number) {
        this.valid = this.valid && Number(content) <= Number(this._max);
    }

    public checkMin(content: number) {
        this.valid = this.valid && Number(content) >= Number(this._min);
    }

    public checkStep(content: number) {
        // 不存在最小值和最大值时直接返回
        if (!this._min && !this._max) {
            return;
        }
        let baseLine = this._min ? this._min : this._max;
        let gap = content - baseLine;
        this.valid = this.valid && Number.isInteger(gap / this._step);
    }

    public validateOnInput() {
        let target = this.el.nativeElement;
        let content = target.value;
        this.preventModelCheck = true;
        // 首先进行非空校验，如果允许空则移除invalid

        this.validate(content);
        if (!content || content === '') {
            this.valid = !this._requried;
            this.oldValue = content;
            this.changeStyle();
            return;
        }
    }
    //#region tip action
    activate() {
        this.active = true;
        this.show();

    }

    deactivate(useDelay) {
        this.active = false;
        this.hide();


    }

    get text(): string {
        return this._text;
    }

    @Input('tip') set text(text: string) {
        this._text = text;
        if (this.active) {
            if (this._text) {
                if (this.container && this.container.offsetParent) {
                    this.updateText();
                } else {
                    this.show();
                }
            } else {
                this.hide();
            }
        }
    }

    create() {
        this.container = document.createElement('div');

        let tipArrow = document.createElement('div');
        tipArrow.className = 'ui-tip-arrow';
        this.container.appendChild(tipArrow);

        this.tipText = document.createElement('div');
        this.tipText.className = 'ui-tip-text ui-shadow ui-corner-all';

        this.updateText();

        if (this.positionStyle) {
            this.container.style.position = this.positionStyle;
        }

        this.container.appendChild(this.tipText);

        if (this.tipAppendTo === 'body') {
            document.body.appendChild(this.container);
        } else if (this.tipAppendTo === 'target') {
            this.domHandler.appendChild(this.container, this.el.nativeElement);
        } else {
            this.domHandler.appendChild(this.container, this.tipAppendTo);
        }
        this.container.style.display = 'inline-block';
    }

    show() {
        if (!this.text || this.tipDisabled) {
            return;
        }

        this.create();
        this.align();
        if (this.tipStyleClass) {
            this.renderer2.addClass(this.container, this.tipStyleClass);
            // this.container.className = this.container.className + ' ' + this.tooltipStyleClass;
        }
        this.domHandler.fadeIn(this.container, 250);
        if (this.tipZIndex === 'auto') {
            this.container.style.zIndex = ++DomHandler.zindex;
        } else {
            this.container.style.zIndex = this.tipZIndex;

        }

        this.bindDocumentResizeListener();
    }

    hide() {
        this.destroy();
    }

    updateText() {
        if (this.escape) {
            this.tipText.innerHTML = '';
            this.tipText.appendChild(document.createTextNode(this._text));
        } else {
            this.tipText.innerHTML = this._text;
        }
    }

    align() {
        let position = this.tipPos;

        switch (position) {
            case 'top':
                this.alignTop();
                if (this.isOutOfBounds()) {
                    this.alignBottom();
                }
                break;

            case 'bottom':
                this.alignBottom();
                if (this.isOutOfBounds()) {
                    this.alignTop();
                }
                break;

            case 'left':
                this.alignLeft();
                if (this.isOutOfBounds()) {
                    this.alignRight();

                    if (this.isOutOfBounds()) {
                        this.alignTop();

                        if (this.isOutOfBounds()) {
                            this.alignBottom();
                        }
                    }
                }
                break;

            case 'right':
                this.alignRight();
                if (this.isOutOfBounds()) {
                    this.alignLeft();

                    if (this.isOutOfBounds()) {
                        this.alignTop();

                        if (this.isOutOfBounds()) {
                            this.alignBottom();
                        }
                    }
                }
                break;
        }
    }

    getHostOffset() {
        let offset = this.el.nativeElement.getBoundingClientRect();
        let targetLeft = offset.left + this.domHandler.getWindowScrollLeft();
        let targetTop = offset.top + this.domHandler.getWindowScrollTop();

        return { left: targetLeft, top: targetTop };
    }

    alignRight() {
        this.preAlign();
        this.container.className = 'ui-tip ui-widget ui-tip-right';
        let hostOffset = this.getHostOffset();
        let left = hostOffset.left + this.domHandler.getOuterWidth(this.el.nativeElement);
        let top = hostOffset.top + (this.domHandler.getOuterHeight(this.el.nativeElement) - this.domHandler.getOuterHeight(this.container)) / 2;
        this.container.style.left = left + 'px';
        this.container.style.top = top + 'px';
    }

    alignLeft() {
        this.preAlign();
        this.container.className = 'ui-tip ui-widget ui-tip-left';
        let hostOffset = this.getHostOffset();
        let left = hostOffset.left - this.domHandler.getOuterWidth(this.container);
        let top = hostOffset.top + (this.domHandler.getOuterHeight(this.el.nativeElement) - this.domHandler.getOuterHeight(this.container)) / 2;
        this.container.style.left = left + 'px';
        this.container.style.top = top + 'px';
    }

    alignTop() {
        this.preAlign();
        this.container.className = 'ui-tip ui-widget ui-tip-top';
        let hostOffset = this.getHostOffset();
        let left = hostOffset.left + (this.domHandler.getOuterWidth(this.el.nativeElement) - this.domHandler.getOuterWidth(this.container)) / 2;
        let top = hostOffset.top - this.domHandler.getOuterHeight(this.container);
        this.container.style.left = left + 'px';
        this.container.style.top = top + 'px';
    }

    alignBottom() {
        this.preAlign();
        this.container.className = 'ui-tip ui-widget ui-tip-bottom';
        let hostOffset = this.getHostOffset();
        let left = hostOffset.left + (this.domHandler.getOuterWidth(this.el.nativeElement) - this.domHandler.getOuterWidth(this.container)) / 2;
        let top = hostOffset.top + this.domHandler.getOuterHeight(this.el.nativeElement);
        this.container.style.left = left + 'px';
        this.container.style.top = top + 'px';
    }

    preAlign() {
        this.container.style.left = -999 + 'px';
        this.container.style.top = -999 + 'px';
    }

    isOutOfBounds(): boolean {
        let offset = this.container.getBoundingClientRect();
        let targetTop = offset.top;
        let targetLeft = offset.left;
        let width = this.domHandler.getOuterWidth(this.container);
        let height = this.domHandler.getOuterHeight(this.container);
        let viewport = this.domHandler.getViewport();

        return (targetLeft + width > viewport.width) || (targetLeft < 0) || (targetTop < 0) || (targetTop + height > viewport.height);
    }

    bindDocumentResizeListener() {
        this.documentResizeListener = this.renderer2.listen('window', 'resize', (event) => {
            this.hide();
        });
    }

    unbindDocumentResizeListener() {
        if (this.documentResizeListener) {
            this.documentResizeListener();
            this.documentResizeListener = null;
        }
    }

    destroy() {
        this.unbindDocumentResizeListener();


        if (this.container && this.container.parentElement) {
            if (this.tipAppendTo === 'body') {
                document.body.removeChild(this.container);
            } else if (this.tipAppendTo === 'target') {
                this.el.nativeElement.removeChild(this.container);
            } else {
                this.domHandler.removeChild(this.container, this.tipAppendTo);
            }
        }
        this.container = null;
    }

    ngOnDestroy() {
        this.destroy();
    }
    //#endregion
}
