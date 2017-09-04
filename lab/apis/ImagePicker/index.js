'use strict';

import ImagePicker from 'lab-image-picker';

export default {
  showImagePicker(options, callback) {
    return ImagePicker.showImagePicker(options, (error, res) => {
      if (error) {
        res = res || {};
        if (error.code === 'cancel') {
          res.didCancel = true;
        } else {
          res.error = error;
        }
      }
      callback(res);
    });
  },
};


