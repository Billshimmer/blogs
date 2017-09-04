'use strict';

const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

const qsStringify = require('qs/lib/stringify');

console.log(qsStringify({shop_id: 375, cookies: {xxx: '"ss;'}}));
