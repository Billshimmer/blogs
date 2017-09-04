'use strict';

import { positions, durations } from './ToastContainer';

export default {
  show(message, options) {
    return this._toastLayer && this._toastLayer.show(message, options);
  },

  hide(id) {
    this._toastLayer && this._toastLayer.hide(id);
  },

  Position: positions,
  Duration: durations,
};
