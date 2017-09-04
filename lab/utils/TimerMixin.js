'use strict';

import TimerMixin from 'react-timer-mixin';

let mixin = Object.assign({}, TimerMixin);
mixin._clearTimers = mixin.componentWillUnmount;
delete mixin.componentWillUnmount;
export default mixin;
