import { isServer } from '@/utils/isServer';
import { AxiosRequestConfig } from 'axios';

interface RetryQueueItem {
  config: AxiosRequestConfig;
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}

/**
 * 토큰 재발급 API를 호출하는 동안 발생했던 요청을 저장하고, 토큰 재발급 후 다시 요청하는 큐
 * (Browser Only)
 */
export class RetryQueue {
  private static queue: RetryQueueItem[] = [];
  private static _isRefreshing = false;

  static reset = () => {
    if (isServer()) return;
    this.queue = [];
    this._isRefreshing = false;
  };

  static add = (retryQueueItem: RetryQueueItem) => {
    if (isServer()) return;
    this.queue.push(retryQueueItem);
  };

  static shift = () => {
    if (isServer()) return;
    return this.queue.shift();
  };

  static isEmpty = () => {
    if (isServer()) return;
    return this.queue.length === 0;
  };

  static set isRefreshing(value: boolean) {
    if (isServer()) return;
    this._isRefreshing = value;
  }

  static get isRefreshing() {
    return this._isRefreshing;
  }
}
