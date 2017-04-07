/* 
 * status=> oneOf "pending", "resolved", "rejected"
 *
 */

const STATUS = {
    PENDING: 'pending',
    RESOLVED: 'resolved',
    REJECTED: 'rejected',
};

function MyPromise(executor) {
    if (typeof executor !== 'function') {
        console.warn('initlization could not be null!');
        throw new Error('not vaild Promise Object!');
    }

    if (this.constructor !== MyPromise) {
        return new MyPromise(executor);
    }

    var self = this;
    self.status = STATUS.PENDING;
    self.data = undefined;
    self.onResolvedCallback = [];
    self.onRejectedCallback = [];

    function resolve(data) {
        if (self.status === STATUS.PENDING) {
            self.status = STATUS.RESOLVED;
            self.data = data;

            //异步执行
            process.nextTick(function() {
                for (var i = 0; i < self.onResolvedCallback.length; i++) {
                    self.onResolvedCallback[i](data);
                }
            });
        }
    }

    function reject(data) {
        if (self.status === STATUS.PENDING) {
            self.status = STATUS.REJECTED;
            self.data = data;

            process.nextTick(function() {
                for (var i = 0; i < self.onRejectedCallback.length; i++) {
                    self.onRejectedCallback[i](data);
                }
            });
        }
    }

    try {
        executor(resolve, reject);
    } catch (e) {
        reject(e);
    }
}

MyPromise.prototype.then = function(onResolved, onRejected) {
    var self = this, promise2;

    typeof onResolved == 'function'
        ? onResolved
        : (function(value) {
              return value;
          });
    typeof onRejected == 'function'
        ? onRejected
        : (function(error) {
              throw error;
          });

    if (self.status === STATUS.PENDING) {
        return promise2 = new MyPromise(function(resolve, reject) {
            self.onResolvedCallback.push(function() {
                var x = onResolved(self.data);
                if (x instanceof MyPromise) {
                    x.then(resolve, reject);
                }
                resolve(x);
            });

            self.onRejectedCallback.push(function() {
                var x = onRejected(self.data);
                if (x instanceof MyPromise) {
                    x.then(resolve, reject);
                }
                reject(x);
            });
        });
    }

    if (self.status === STATUS.RESOLVED) {
        return promise2 = new MyPromise(function(resolve, reject) {
            process.nextTick(function() {
                try {
                    var x = onResolved(self.data);
                    if (x instanceof MyPromise) {
                        x.then(resolve, reject);
                    }
                    resolve(x);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    if (self.status === STATUS.REJECTED) {
        return promise2 = new MyPromise(function(resolve, reject) {
            process.nextTick(function() {
                try {
                    var x = onRejected(self.data);
                    if (x instanceof MyPromise) {
                        x.then(resolve, reject);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
};

MyPromise.prototype.catch = function(reject) {
    this.then(null, reject);
};

module.exports = MyPromise;
