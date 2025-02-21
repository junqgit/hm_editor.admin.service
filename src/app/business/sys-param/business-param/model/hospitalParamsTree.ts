import { toUnicode } from 'punycode';
export const paramsTree = [
    {
        label: '系统参数',
        data: 'sysParam',
        expanded: true,
        children: [
            {
                label: '系统名称LOGO配置',
                model: '系统名称以及LOGO',
                type: 'input',
                visible: false
            }, {
                label: '签名设置',
                model: '签名设置',
                type: 'switch-input',
                visible: false
            }, {
                label: '住院号病案号显示映射设置',
                model: '住院号病案号显示映射',
                type: 'select',
                options: [
                    { label: '默认设置', value: 'N' },
                    { label: '住院号显示为病案号', value: 'Y' },
                    { label: '病案号显示为住院号', value: 'YY' }
                ],
                visible: false
            }, {
                label: '患者住院天数计算方式设置',
                model: '患者住院天数计算方式',
                type: 'select',
                options: [
                    { label: '入院时间', value: '入院' },
                    { label: '入科时间', value: '入科' }
                ],
                visible: false
            }, {
                label: '是否实时计算年龄',
                model: '是否实时计算年龄',
                type: 'switch',
                visible: false
            }, {
                label: '消息提醒是否启用按主治医生提醒',
                model: '消息提醒是否启用按主治医生提醒',
                type: 'switch',
                visible: false
            }, {
                label: '登陆立即进行质控提示',
                model: '登陆立即进行质控提示',
                type: 'switch',
                visible: false
            }, {
                label: '第三方目录集成',
                model: '第三方目录集成',
                type: 'switch-input',
                visible: false
            }, {
                label: 'cdss对接设置',
                model: 'cdss对接设置',
                type: 'switch-input',
                visible: false
            }, {
                label: '小助手检查是否对接心电图',
                model: '小助手检查是否对接心电图',
                type: 'switch-input',
                visible: false
            }, {
                label: '小助手体征是否对接移动护理',
                model: '小助手体征',
                type: 'switch-input',
                visible: false
            }, {
                label: '小助手是否显示输血项',
                model: '小助手是否显示输血项',
                type: 'switch',
                visible: false
            }, {
                label: '小助手是否显示抗菌药物',
                model: '小助手是否显示抗菌药物',
                type: 'switch',
                visible: false
            }, {
                label: '水印设置',
                model: '水印设置',
                type: 'switch-input',
                visible: false
            }
        ]
    },
    {
        label: '病历模板',
        data: 'template',
        expanded: true,
        children: [
            {
                label: '病历模板排序规则',
                model: '病历模板排序规则',
                type: 'select',
                options: [
                    { label: '默认排序', value: '默认' },
                    { label: '模板名称排序', value: '模板名称' },
                    { label: '模板别名排序', value: '模板别名' },
                    { label: '版本号排序', value: '版本号' }
                ],
                visible: false
            }, {
                label: '电子病历历史版本是否显示过期',
                model: '电子病历历史版本是否显示过期',
                type: 'switch',
                visible: false
            }, {
                label: '过期模板是否可新建病历',
                model: '过期模板是否可新建病历',
                type: 'switch',
                visible: true
            }, {
                label: '过期模板不能收藏',
                model: '过期模板不能收藏',
                type: 'switch',
                visible: true
            }, {
                label: '是否启用病历模板套餐收藏',
                model: '病历模板套餐收藏',
                type: 'switch',
                visible: false
            }, {
                label: '新建病历默认范围',
                model: '新建病历默认范围',
                type: 'select',
                options: [
                    { label: '区域', value: 'area' },
                    { label: '医院', value: 'hospital' },
                    { label: '科室', value: 'deptment' },
                    { label: '个人', value: 'individual' }
                ],
                visible: false
            }, {
                label: '是否显示区域模板',
                model: '是否显示区域模板',
                type: 'switch',
                visible: false
            }, {
                label: '医生是否启用收藏科室模板',
                model: '医生是否启用收藏科室模板',
                type: 'switch',
                visible: false
            }, {
                label: '护士是否启用收藏科室模板',
                model: '护士是否启用收藏科室模板',
                type: 'switch',
                visible: false
            }, {
                label: '科室查询参数绑定',
                model: '科室查询参数绑定',
                visible: false
            }, {
                label: '个人收藏模板是否允许跨科室查询',
                model: '个人收藏模板是否允许跨科室查询',
                type: 'switch',
                visible: false
            },{
                label: '是否显示个人收藏模板',
                model: '是否显示个人收藏模板',
                type: 'switch',
                visible: false
            },{
                label: '病历模板需要清空的数据元',
                model: '病历模板需要清空的数据元',
                type: 'input',
                visible: false
            }
        ]
    },
    {
        label: '病历书写',
        data: 'emrWrite',
        expanded: true,
        children: [
            {
                label: '另页打印设置',
                model: '另页打印设置',
                type: 'check-multiselect',
                visible: false
            }, {
                label: '是否禁止复制其他患者病历',
                model: '禁止复制其他患者病历',
                type: 'select',
                options: [
                    { label: '不禁止', value: 'N' },
                    { label: '禁止复制非本人病历', value: 'Y' },
                    { label: '禁止复制所有病历', value: 'YY' }
                ],
                visible: false
            }, {
                label: '病历打印前是否自动保存',
                model: '病历打印前是否自动保存',
                type: 'switch',
                visible: true
            }, {
                label: '实时编辑分页',
                model: '实时编辑分页',
                type: 'switch-input',
                visible: false
            }, {
                label: '分页模式打印是否生成pdf',
                model: '分页模式打印是否生成pdf',
                type: 'switch',
                visible: false
            }, {
                label: '病历显示尺寸',
                model: '病历显示尺寸',
                type: 'select',
                options: [
                    { label: '1', value: '1' },
                    { label: '1.1', value: '1.1' },
                    { label: '1.2', value: '1.2' },
                    { label: '1.3', value: '1.3' },
                    { label: '1.4', value: '1.4' },
                    { label: '1.5', value: '1.5' }
                ],
                visible: false
            }, {
                label: '是否启用书写自动保存',
                model: '书写自动保存',
                type: 'switch-input',
                visible: false
            }, {
                label: '是否启用修订',
                model: '是否启用修订',
                type: 'switch',
                visible: false
            }, {
                label: '不使用修订功能的病历',
                model: '不使用修订功能的病历',
                type: 'input',
                visible: false
            },{
                label: '分页模式下留痕是否打印',
                model: '分页模式下留痕是否打印',
                type: 'switch',
                visible: false
            }, {
                label: '是否启用书写编辑权限',
                model: '书写编辑权限',
                type: 'switch',
                visible: false
            }, {
                label: '病历公共编辑权限',
                model: '病历公共编辑权限',
                type: 'input',
                visible: false
            }, {
                label: '聚合病历子病历编辑锁定设置',
                model: '聚合病历子病历编辑锁定设置',
                type: 'switch',
                visible: false
            }, {
                label: '是否根据职称设置上级医师',
                model: '是否根据职称设置上级医师',
                type: 'switch',
                visible: false
            }, {
                label: '医学表达式末次月经默认值设置',
                model: '医学表达式末次月经默认值设置',
                type: 'switch-input',
                visible: false
            }, {
                label: '右键解锁与锁定',
                model: '右键解锁与锁定',
                type: 'switch',
                visible: false
            }, {
                label: '签名锁定',
                model: '签名锁定',
                type: 'switch',
                visible: false
            }, {
                label: '基础病历数据源配置',
                model: '基础病历数据源配置',
                type: 'input',
                visible: false
            }, {
                label: '住院病案首页是否使用快捷输入页面',
                model: '住院病案首页是否使用快捷输入页面',
                type: 'switch',
                visible: false
            }, {
                label: '是否启用三级检诊',
                model: '是否启用三级检诊',
                type: 'switch',
                visible: false
            }, {
                label: '是否强制限制医生填写三级检诊',
                model: '是否强制限制医生填写三级检诊',
                type: 'switch-input',
                visible: false
            }, {
                label: '病案首页默认值设置',
                model: '病案首页默认值设置',
                type: 'input',
                visible: false
            }, {
                label: '病历书写患者列表是否显示模板别名',
                model: '病历书写患者列表是否显示模板别名',
                type: 'switch',
                visible: false
            }, {
                label: '入院记录是否聚合显示病历',
                model: '入院记录是否聚合显示病历',
                type: 'switch',
                visible: false
            },
            {
                label: '出院患者是否倒序排序',
                model: '出院患者是否倒序排序',
                type: 'switch',
                visible: false
            },
            {
                label: '病历书写粘贴数据格式',
                model: '病历书写粘贴数据格式',
                type: 'select',
                options: [
                    { label: '带格式粘贴', value: '带格式粘贴' },
                    { label: '纯文本粘贴', value: '纯文本粘贴' },
                    { label: '带格式、纯文本均支持', value: '带格式、纯文本均支持' },
                ],
                visible: false
            }, {
                label: '中药引入格式',
                model: '中药引入格式',
                type: 'select',
                options: [
                    { label: '每行 3 味药', value: '3' },
                    { label: '每行 4 味药', value: '4' }
                ],
                visible: false
            }, {
                label: '病案首页是否启用验证功能',
                model: '病案首页是否启用验证功能',
                type: 'switch',
                visible: false
            }, {
                label: '病案首页是否同步手术信息',
                model: '病案首页是否同步手术信息',
                type: 'switch',
                visible: false
            }, {
                label: '病历书写界面点击患者姓名展示病历设置',
                model: '病历书写界面点击患者姓名展示病历设置',
                type: 'select',
                options: [
                    { label: '病历细则', value: 'emr' },
                    { label: '病历上级目录', value: 'dir' }
                ],
                visible: false
            }, {
                label: '病历排序方式',
                model: '病历排序方式',
                type: 'select',
                options: [
                    { label: '按病历名称排序', value: '按病历名称排序' },
                    { label: '按记录时间排序', value: '按记录时间排序' },
                    { label: '按创建时间排序', value: '按创建时间排序' }
                ],
                visible: false
            }, {
                label: '自动新建病历设置',
                model: '自动新建病历设置',
                type: 'switch-input',
                visible: false
            }, {
                label: '成组病历设置',
                model: '成组病历设置',
                type: 'switch-input',
                visible: false
            }, {
                label: '是否显示患者列表',
                model: '是否显示患者列表',
                type: 'switch',
                visible: false
            }, {
                label: '是否记录病历书写日志',
                model: '是否记录病历书写日志',
                type: 'switch',
                visible: false
            }, {
                label: '病程记录超过设置个数时按需加载',
                model: '病程记录超过设置个数时按需加载',
                type: 'input',
                visible: false
            }, {
                label: '经治医生可以编辑患者所有病历',
                model: '经治医生可以编辑患者所有病历',
                type: 'switch',
                visible: false
            }, {
                label: '出院患者在病历书写页面不能打印病案首页',
                model: '出院患者在病历书写页面不能打印病案首页',
                type: 'switch',
                visible: false
            }, {
                label: '新建病历使用文字按钮',
                model: '新建病历使用文字按钮',
                type: 'switch',
                visible: false
            }, {
                label: '是否开启病历重命名',
                model: '是否开启病历重命名',
                type: 'switch',
                visible: false
            }, {
                label: '病案首页DRG配置',
                model: '病案首页DRG配置',
                type: 'input',
                visible: false
          }
        ]
    }, {
        label: '护理文书',
        data: 'emrWrite',
        expanded: true,
        children: [
           {
                label: '护理表单保存是否同步生成病历',
                model: '护理表单保存是否同步生成病历',
                type: 'switch',
                visible: true
            }, {
                label: '护理表单生成病历是否弹出打印界面',
                model: '护理表单生成病历是否弹出打印界面',
                type: 'switch',
                visible: false
            }, {
                label: '护理表单签名及修改权限设置',
                model: '护理表单签名及修改权限设置',
                type: 'switch-select',
                options: [
                    { label: '是', value: 'Y' },
                    { label: '否', value: 'N' }
                ],
                visible: false
            }, {
                label: '是否使用httpPrinter打印',
                model: '是否使用httpPrinter打印',
                type: 'switch-input',
                visible: false
            }, {
                label: '表单录入同步新版体温单字段映射',
                model: '表单录入同步新版体温单字段映射',
                type: 'input',
                visible: false
            }, {
                label: '是否开启护士批量删除护理记录权限',
                model: '护士批量删除护理记录权限',
                type: 'switch',
                visible: false
            }, {
                label: '是否开启生成产程图',
                model: '生成产程图',
                type: 'switch',
                visible: false
            }, {
                label: '护理表单数据是否允许复制',
                model: '护理表单数据是否允许复制',
                type: 'switch',
                visible: false
            }, {
                label: '护理表单是否顺序排序',
                model: '护理表单是否顺序排序',
                type: 'switch',
                visible: false
            }, {
                label: '护理表单签名是否倒序排序',
                model: '护理表单签名是否倒序排序',
                type: 'switch',
                visible: false
            }, {
                label: '待办提醒事项设置',
                model: '待办提醒事项设置',
                type: 'input',
                visible: true
            }, {
                label: '护理表单数据分页数量',
                model: '护理表单数据分页数量',
                type: 'input',
                visible: true
            }, {
                label: '护理文书显示已提交病案患者',
                model: '护理文书显示已提交病案患者',
                type: 'switch',
                visible: true
            }]
    }, {
        label: '体温单',
        data: 'temperature',
        expanded: true,
        children: [
            {
                label: '体温单配置',
                model: '体温单配置',
                type: 'input',
                visible: false
            }, {
                label: '新生儿体温单配置',
                model: '新生儿体温单配置',
                type: 'input',
                visible: false
            }, {
                label: '新生婴儿是否使用成人体温单',
                model: '新生婴儿是否使用成人体温单',
                type: 'switch',
                visible: false
            }, {
                label: '体温单显示版本配置',
                model: '体温单显示版本配置',
                type: 'select',
                options: [
                    { label: '标准版', value: 'BZB' },
                    { label: '无疼痛强度', value: 'WTTQD' },
                    { label: '绘制呼吸无疼痛', value: 'HZHXWTT' },
                    { label: '绘制呼吸有疼痛', value: 'HZHXYTT' },
                    { label: '山东省无疼痛体温单', value: 'SDSTWD' },
                    { label: '湖南省体温单', value: 'HNSTWD' },
                    { label: '广东省体温单', value: 'GDSTWD' }
                ],
                visible: false
            }, {
                label: '体温单显示房颤阴影',
                model: '体温单显示房颤阴影',
                type: 'select',
                options: [
                    { label: '否', value: 'N' },
                    { label: '是', value: 'Y' }
                ],
                visible: false
            }, {
                label: '体温单显示心率脉搏连线',
                model: '体温单显示心率脉搏连线',
                type: 'select',
                options: [
                    { label: '否', value: 'N' },
                    { label: '是', value: 'Y' }
                ],
                visible: false
            }, {
                label: '体温单是否绘制体温上升下降标记',
                model: '体温单是否绘制体温上升下降标记',
                type: 'select',
                options: [
                    { label: '是', value: 'Y' },
                    { label: '否', value: 'N' }
                ],
                visible: false
            }, {
                label: '体温单显示在前一天的一日一测体征CODE配置',
                model: '体温单显示在前一天的一日一测体征CODE配置',
                type: 'multiSelect',
                visible: false
            }, {
                label: '体温单住院天数从入院第二天算起',
                model: '体温单住院天数从入院第二天算起',
                type: 'switch',
                visible: false
            }, {
                label: '体温单手术天数是否显示0天',
                model: '体温单手术天数是否显示0天',
                type: 'switch',
                visible: false
            }, {
                label: '体温单手术后天数计算规则',
                model: '手术后天数计算规则',
                type: 'select',
                options: [
                    { label: '默认模式', value: 'normal' },
                    { label: '标准模式', value: 'standard' },
                    { label: '简易模式', value: 'easy' },
                    { label: '山东模式', value: 'shandong' },
                    { label: '环球耒阳模式', value: 'hqleiyang' },
                    { label: '随州模式', value: 'suizhou' },
                    { label: '湖南模式', value: 'hunan' }
                ],
                visible: false
            }, {
                label: '新版体温单同步表单录入字段映射',
                model: '新版体温单同步表单录入字段映射',
                type: 'input',
                visible: false
            }, {
                label: '心率超过180绘制箭头标识',
                model: '心率超过180绘制箭头标识',
                type: 'switch',
                visible: false
            }, {
                label: '体温单手术后面显示手术次数',
                model: '体温单手术后面显示手术次数',
                type: 'switch',
                visible: false
            }
        ]
    }, {
        label: '病历质控',
        data: 'merProcess',
        expanded: true,
        children: [{
            label: '是否启用新质控规则配置',
            model: '是否启用新质控规则配置',
            type: 'switch',
            visible: false
        }, {
            label: '质控时是否可修改病历',
            model: '质控时是否可修改病历',
            type: 'switch-many',
            visible: false
        }, {
            label: '质控规则不合格能否提交病历',
            model: '质控规则不合格能否提交病历',
            type: 'switch',
            visible: false
        }, {
            label: '质控定时器开关设置',
            model: '质控定时器',
            type: 'switch-input',
            visible: false
        }, {
            label: '自动质控设置',
            model: '自动质控设置',
            type: 'switch-input',
            visible: false
        }, {
            label: '新生儿是否走质控流程设置',
            model: '新生儿是否走质控流程',
            type: 'switch',
            visible: false
        }, {
            label: '病案质控是否显示空病历患者',
            model: '病案质控是否显示空病历患者',
            type: 'switch',
            visible: false
        }, {
            label: '逾期锁定病历设置',
            model: '逾期锁定病历设置',
            type: 'switch-input',
            visible: false
        }, {
            label: '状态项目设置',
            model: '状态项目设置',
            type: 'switch-input',
            visible: false
        }, {
            label: '质控流程配置',
            model: '质控流程配置',
            type: 'switch-input',
            visible: false
        }, {
            label: '出院后未提交质控提醒天数设置',
            model: '出院后未提交质控提醒天数设置',
            type: 'input',
            visible: false
        }, {
            label: '整改通知书描述',
            model: '整改通知书描述',
            type: 'input',
            visible: false
        }, {
          label: '护理文书未提交能否提交病历',
          model: '护理文书未提交能否提交病历',
          type: 'switch',
          visible: false
        }
        ]
    }, {
        label: '病案借阅',
        data: 'medicalRecordBorrow',
        expanded: true,
        children: [
            {
                label: '病案借阅是否需要审批',
                model: '病案借阅审批',
                type: 'switch',
                visible: false
            }, {
                label: '病案借阅自动归还时限',
                model: '借阅归还时限',
                type: 'switch-input',
                visible: false
            }, {
                label: '是否可以查阅全院病人病历',
                model: '是否可以查阅全院病人病历',
                type: 'switch',
                visible: false
            }
        ]
    },
    {
        label: '病案管理',
        data: 'medicalRecordManagement',
        expanded: true,
        children: [
            {
                label: '纸质版病案收回登记功能',
                model: '纸质版归档',
                type: 'switch-input',
                visible: false
            }, {
                label: '病案管理可编辑的用户',
                model: '病案管理可编辑的用户',
                type: 'input',
                visible: false
            }, {
                label: '病案管理员设置可编辑病历',
                model: '病案管理员设置可编辑病历',
                type: 'multiSelect',
                visible: false
            }, {
                label: '病案管理导出EXCEL时间字段格式化形式',
                model: '病案管理导出EXCEL时间字段格式化形式',
                type: 'input',
                visible: false
            }, {
                label: '病案归档是否需要维护档案号',
                model: '病案归档是否需要维护档案号',
                type: 'switch',
                visible: true
            }, {
                label: '就诊历史信息查看配置',
                model: '就诊历史信息查看配置',
                type: 'input',
                visible: false
            }, {
                label: '首页诊断',
                model: '首页诊断',
                type: 'input',
                visible: false
            }, {
              label: '逾期天数设置',
              model: '逾期天数设置',
              type: 'input',
              visible: false
            }, {
              label: '病案归档回写归档状态',
              model: '病案归档回写归档状态',
              type: 'input',
              visible: false
            }
        ]
    },
    {
        label: '病历查询',
        data: 'medicalRecordSearch',
        expanded: true,
        children: [
            {
                label: '病历查询树形界面是否显示为医生列表',
                model: '病历查询树形界面是否显示为医生列表',
                type: 'switch',
                visible: true
            }, {
                label: '是否可以查看已归档病历',
                model: '是否可以查看已归档病历',
                type: 'switch',
                visible: true
            },
        ]
    },
    {
        label: 'PDA设置',
        data: 'pda',
        expanded: true,
        children: [
            {
                label: '全局设置',
                model: 'pda全局设置',
                type: 'input',
                visible: true
            }, {
                label: '输血流程设置',
                model: 'pda输血流程设置',
                type: 'input',
                visible: true
            }]
    },
    {
      label: '全文检索',
      data: 'fulltextRetrieval',
      expanded: true,
      children: [
         {
          label: '全文检索跳转患者360页面设置',
          model: '全文检索跳转患者360页面设置',
          type: 'input',
          visible: true
        }
      ]
  }, {
    label: '门诊病历书写',
    data: 'clcEmrWrite',
    expanded: true,
    children: [{
      label: '门诊病历排序方式',
      model: '门诊病历排序方式',
      type: 'select',
      options: [
        { label: '按病历名称排序', value: '按病历名称排序' },
        { label: '按记录时间排序', value: '按记录时间排序' },
        { label: '按创建时间正序排序', value: '按创建时间正序排序' },
        { label: '按创建时间倒序排序', value: '按创建时间倒序排序' }
      ],
      visible: false
    }]
  }
];
