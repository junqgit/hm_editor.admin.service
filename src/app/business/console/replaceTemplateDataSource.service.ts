import { Injectable } from "@angular/core";

declare let $: any;


@Injectable()
export class ReplaceTemplateDataSourceService {

  replaceUpdateRecordByEmrInfo($body, emrInfoMap, param) {
    var data = emrInfoMap;
    for (var key in data) {
      var nodeType = data[key]['类型'];
      var name = key;
      /**
       * 手写医师签名后续单独处理
       */
      var val = "";
      var bindVal = data[key]['值'];
      if (!bindVal || bindVal == "—") {
        continue;
      }
      var _id = data[key]['id'] || '';
      if (_id && key.indexOf(_id) > -1) {
        name = name.replace('_' + _id, "");
      }
      if (typeof (bindVal) == 'object') {
        if (!bindVal.length) {
          val += this.getContentStrByType(bindVal);
        } else {
          for (var j = 0; j < bindVal.length; j++) {
            if (typeof (bindVal[j]) == 'object' && bindVal[j]['类型']) {
              val += this.getContentStrByType(bindVal[j]);
            } else {
              val += bindVal[j];
            }
          }
        }
        bindVal = val;
      }
      try {
        var datasourceNodes = null;

        datasourceNodes = $body.find('[data-kyee-name="' + name + '"]');
        for (var i = 0; i < datasourceNodes.length; i++) {
          var datasourceNode = $(datasourceNodes[i]);
          var curNodeType = datasourceNode.attr('data-kyee-node');
          switch (curNodeType) {
            case 'newtextbox':
              var newtextboxcontent = datasourceNode.find("span.new-textbox-content");
              if (newtextboxcontent.length > 0) {
                newtextboxcontent.removeAttr('_placeholdertext');
                val = bindVal.replace(/↵/g, '<br/>').replace(/&para;/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                newtextboxcontent.html(val);
              }
              break;
            case 'dropbox':
              var values = datasourceNode.attr('data-kyee-items') || '';

              var code = data[key]['编码'];
              if (code) {

                if (values.indexOf(code) > -1 && values.indexOf(bindVal) > -1) {
                  datasourceNode.text(code);
                }
              } else if (values.indexOf(bindVal) > -1) {
                datasourceNode.text(bindVal);
              }

              break;
            case 'timebox':
            case 'cellbox':
            case 'textboxwidget':
              datasourceNode.text(bindVal);
              break;
            case 'searchbox':
              var _reamrk = data[key]['remark'];
              var searchOption = datasourceNode.attr('_searchoption');
              var searchpair = (datasourceNode.attr('_searchpair') || '').replace(/\u200B/g, '');
              var searchpairVal = this.genericDataConvert(data, searchpair, param);
              if (typeof (searchpairVal) == "object") {
                searchpairVal = searchpairVal["值"];
              }
              datasourceNode.text(bindVal);
              if (searchOption.indexOf('码') >= 0) {
                datasourceNode.attr('_code', bindVal);
              } else {
                datasourceNode.attr('_name', bindVal);
                if (_reamrk) { // 仅针对诊断名称
                  datasourceNode.text(bindVal + '(' + _reamrk + ')');
                  datasourceNode.attr("_remark", _reamrk);
                }
              }
              if (searchpair && searchpair.indexOf('码') >= 0) {
                datasourceNode.attr('_code', searchpairVal);
              }
              if (searchpair && searchpair.indexOf('码') < 0) {
                datasourceNode.attr('_name', searchpairVal);
              }
              break;
            case 'labelbox':
              var bindable = datasourceNode.attr('_bindable');
              if (bindable) {
                datasourceNode.text(bindVal);
              }
              break;
            case 'expressionbox':
              break;
            case 'checkbox':
              var valArr = bindVal.split(',');
              for (var j = 0; j < valArr.length; j++) {
                if (datasourceNode.attr("data-kyee-itemname") == valArr[j].replace(/\s+/g, '')) {
                  datasourceNode.removeClass('fa-square-o').addClass('fa-check-square-o');
                  datasourceNode.attr('_selected', 'true');
                }
              }
              break;
            case 'radiobox':
              break;
          }
        }
      } catch (error) {

      }
    }
  }

  getContentStrByType(bindVal) {
    if (bindVal.length) {
      return bindVal.join("");
    }
    var valStr = '';
    switch (bindVal['类型']) {
      case 'expressionbox':
        var _expressionoption = this.getExpressionoption(bindVal);
        var datasourceEle = $('<span contenteditable="false" data-kyee-node="' + bindVal['类型'] + '" _expressionvalue="' + bindVal['值'] + '" >\u200B</span>');
        datasourceEle.attr("style", bindVal['_style'] || "");
        datasourceEle.attr("_expressionoption", _expressionoption);
        valStr = datasourceEle.prop('outerHTML');
        break;
      case 'img':
        var datasourceEle = $('<img id="' + bindVal['id'] + '"/>');
        datasourceEle.attr("src", bindVal['src'] || bindVal['值']);
        datasourceEle.attr("style", bindVal['style'] || "");
        valStr = datasourceEle.prop('outerHTML');
        break;
      case 'searchbox':
        var datasourceEle = $('<span contenteditable="false" data-kyee-node="' + bindVal['类型'] + '"  _code="' + bindVal['编码'] + '" _name="' + bindVal['编码名称'] + '">&#8203;</span>');
        if (bindVal['id']) {
          datasourceEle.attr("data-kyee-id", bindVal['id']);
        }
        if (bindVal['名称']) {
          datasourceEle.attr("data-kyee-name", bindVal['名称']);
        }
        if (bindVal['_searchoption']) {
          datasourceEle.attr("_searchoption", bindVal['_searchoption']);
        }
        var val = bindVal['值'];
        if (typeof (val) == 'object') {
          val = this.getContentStrByType(val);
        }
        datasourceEle.html(val + '&#8203;');
        valStr = datasourceEle.prop('outerHTML');
        break;
      case 'dropbox':
        var datasourceEle = $('<span contenteditable="false" data-kyee-node="' + bindVal['类型'] + '">&#8203;</span>');
        if (bindVal['id']) {
          datasourceEle.attr("data-kyee-id", bindVal['id']);
        }
        if (bindVal['名称']) {
          datasourceEle.attr("data-kyee-name", bindVal['名称']);
        }
        datasourceEle.attr("data-kyee-items", bindVal['值域']);
        if (bindVal['编码']) {
          datasourceEle.html(bindVal['编码']);
        } else {
          datasourceEle.html(bindVal['值']);
        }
        valStr = datasourceEle.prop('outerHTML');
        break;
    }
    return valStr;
  }

  genericDataConvert(data, name, param) {
    if (!data) return "";
    var retObj = data;
    if (data['转科换床'] && data['转科换床'].length > 0) {
      //retObj = Object.assign(retObj, data['转科换床'][data['转科换床'].length-1]);
      var transferObj = data['转科换床'][data['转科换床'].length - 1];
      for (var key in transferObj) {
        //开启住院号病案号映射时，防止转科换床记录中的住院号将外层已经从后台返回并映射为病案号的住院号再次覆盖为住院号
        if (param && param['住院号病案号显示映射'] != 'N' && (key == '住院号' || key == '病案号')) {
          continue;
        }
        retObj[key] = transferObj[key];
      }
    }
  }

  getExpressionoption(valObj) {
    if (valObj['_expressionoption']) {
      return valObj.expressionoption;
    }
    if (!valObj['值'] || valObj['值'].indexOf('-') > -1) {
      return '月经';
    }
    if ((/^[a-zA-Z\d]+$/).test(valObj['值'])) {
      return '胎心';
    }
    return '牙位';
  }
}