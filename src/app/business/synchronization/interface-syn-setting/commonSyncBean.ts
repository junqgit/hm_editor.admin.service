export class CommonSyncBean {
  _id: string = uuidGenerate();
  jobGroup: string = "dataSync";
  jobName: string = "BasPatientInfo";
  areaCode: string = "guangdong_jy";
  areaName:string = "";
  jobChineseName = "";
  targetContextPath: string = "";
  syncIntervalMinute: number = 0;
  leavingTimeOffset: number = 0;
  switch = 'off';
  saveSwitch = 'off';
  filterParam ?: '';
}

function uuidGenerate(len?: number, radix?: number) {
  var secureChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  var uuid = [];
  var i;
  var radix = radix || secureChars.length;
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = secureChars[0 | Math.random() * radix];
  } else {
    var r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = secureChars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}
