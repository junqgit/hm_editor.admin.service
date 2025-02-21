import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

/**
 * 加载状态
 */
@Injectable()
export class LoadingService {
    private loadingSubject = new Subject<boolean>();
    constructor() { }

    /**
     * 获得加载多路推送对象
     */
    getLoading(): Subject<boolean> {
        return this.loadingSubject;
    }

    /**
     * 切换加载状态
     * @param showLoading 是否处于加载状态
     */
    loading(showLoading: boolean): void {
        this.loadingSubject.next(showLoading);
    }
}
