'use strict';

import config from 'lab-config/config';
import setupErrorGuard from './setupErrorGuard';

if (!__DEV__) {
  setupErrorGuard(config.buildType === 'release' ? 'release' : 'beta');
}
