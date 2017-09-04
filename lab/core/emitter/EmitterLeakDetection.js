'use strict';

let EmitterLeakDetection;
if (__DEV__) {
  EmitterLeakDetection = {
    emitters: [],
    add(emitter, tag) {
      emitter.__TAG__ = tag;
      this.emitters.push(emitter);
    },

    remove(emitter) {
      const index = this.emitters.indexOf(emitter);
      if (index >= 0) {
        this.emitters.splice(index, 1);
      }
    },
  };

  setInterval(() => {
    let count = 0;
    EmitterLeakDetection.emitters.forEach((emitter) => {
      if (count > 5) {
        return;
      }
      emitter.debugTraverseAll((evt) => {
        const ctx = evt.context || evt.tag;
        // 目前只检查Component
        if (ctx && ctx.updater && !ctx.updater.isMounted(ctx)) {
          // 目前React采用同步setState所以这里一个isMounted为false 的只可能是已经unmount的组件而不会是正在mounting的
          console.warn(emitter.__TAG__ + ': 内存泄漏!!!', __BROWSER__ && evt);
          ++count;
        }
      }, 99999);
    });
  }, 60000);
} else {
  EmitterLeakDetection = {
    add() {},
    remove() {},
  };
}

export default EmitterLeakDetection;