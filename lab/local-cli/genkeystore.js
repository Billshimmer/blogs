'use strict';

const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');

function genPwd(len) {
  let pwd = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < len; ++i) {
    pwd += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return pwd;
}

function genKey() {
  const keystoreFile = 'keystore.jks';
  const keystoreInfoFile = 'keystore.info.txt';
  if (fs.existsSync(keystoreFile)) {
    console.error('keystore已存在!!!');
    process.exit(1);
  }
  const storepass = genPwd(10);
  const keypass = genPwd(10);
  const alias = 'backustech';

  execSync(`keytool -genkey -v -keystore ${keystoreFile} -keyalg RSA -keysize 2048 -validity 10000 -alias ${alias} -dname "CN=backustech, OU=backustech, O=backustech, L=backustech, ST=backustech, C=cn" -storepass ${storepass} -keypass ${keypass}`, {
    stdio: [process.stdin, process.stdout, process.stderr],
  });

  let keystoreInfo = execSync(`keytool -list -v -keystore ${keystoreFile} -storepass ${storepass}`, {
    //stdio: [process.stdin, process.stdout, process.stderr],
  });
  keystoreInfo = String(keystoreInfo);

  fs.writeFileSync(keystoreInfoFile, keystoreInfo, {
    encoding: 'UTF-8',
  });

  let gradleProperties = fs.readFileSync('gradle.properties', {
    encoding: 'UTF-8',
  });
  gradleProperties = gradleProperties.replace(/RELEASE_STORE_FILE=.*/, 'RELEASE_STORE_FILE=../' + keystoreFile)
    .replace(/RELEASE_STORE_PASSWORD=.*/, 'RELEASE_STORE_PASSWORD=' + storepass)
    .replace(/RELEASE_KEY_ALIAS=.*/, 'RELEASE_KEY_ALIAS=' + alias)
    .replace(/RELEASE_KEY_PASSWORD=.*/, 'RELEASE_KEY_PASSWORD=' + keypass);

  fs.writeFileSync('gradle.properties', gradleProperties, {
    encoding: 'UTF-8',
  });
  console.log('gen keystore success');
  console.log('storepass:', storepass);
  console.log('keypass:', keypass);
}

genKey();
