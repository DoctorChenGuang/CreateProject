<template>
  <div class="menu">
    <Card>
      <p slot="title">创建一个新的项目</p>
      <Tabs value="create_new_project" @on-click="tabChanged">
        <TabPane label="创建一个Cordova插件" name="create_cordova_plugin">
          <Collapse v-model="panelIndex" accordion>
            <Panel name="1">目录配置
              <div slot="content">
                <Form ref="cordovaPluginFolderConfigs" :model="cordovaPluginFolderConfigs">
                  <FormItem>
                    <Row>
                      <i-col span="4">
                        <Tooltip content="请选择awp/Awp.SS/Runtime.Cordova目录" placement="top-start">
                          <Button @click="chooseCordovaPluginFolderWithCSharp">选择目录</Button>
                        </Tooltip>
                      </i-col>
                      <i-col span="20">
                        <p>{{cordovaPluginFolderConfigs.cSharpPath}}</p>
                      </i-col>
                    </Row>
                  </FormItem>
                  <FormItem>
                    <Checkbox
                      v-model="cordovaPluginFolderConfigs.isCreateCordovaPluginFoldeWithJs"
                    >同时创建jssdk下的对应项目</Checkbox>
                  </FormItem>
                  <FormItem v-show="cordovaPluginFolderConfigs.isCreateCordovaPluginFoldeWithJs">
                    <Row>
                      <i-col span="4">
                        <Tooltip content="请选择awpjssdk/src目录" placement="top-start">
                          <Button @click="chooseCordovaPluginFolderWithJs">选择目录</Button>
                        </Tooltip>
                      </i-col>
                      <i-col span="20">
                        <p>{{cordovaPluginFolderConfigs.jsPath}}</p>
                      </i-col>
                    </Row>
                  </FormItem>
                </Form>
              </div>
            </Panel>
            <Panel name="2">项目配置(C#)
              <div slot="content" class="split-content">
                <Split v-model="cordovaPluginCsharpSplitConfig">
                  <div slot="left" class="demo-split-pane">
                    <Form ref="cordovaPluginProjectConfigs" :model="cordovaPluginProjectConfigs">
                      <FormItem label="插件名">
                        <Row>
                          <i-col span="10">
                            <Input v-model="cordovaPluginProjectConfigs.prefixPluginName"/>
                          </i-col>
                          <i-col span="1">
                            <div class="point">.</div>
                          </i-col>
                          <i-col span="8">
                            <Input
                              v-model="cordovaPluginProjectConfigs.suffixPluginName"
                              @on-blur="cordovaPluginCsharpNameBlurHandler"
                            />
                          </i-col>
                        </Row>
                      </FormItem>
                      <FormItem label="是否加载日志模块">
                        <Row>
                          <i-col span="1">
                            <Checkbox v-model="cordovaPluginProjectConfigs.isLoadLogger"></Checkbox>
                          </i-col>
                        </Row>
                      </FormItem>
                      <FormItem label="公共的CordovaPlugin方法：">
                        <Row>
                          <i-col span="10">
                            <Input
                              v-for="(methods, index) in cordovaPluginProjectConfigs.methodsList"
                              :key="index"
                              v-model="methods.methodsName"
                            />
                          </i-col>
                        </Row>
                      </FormItem>
                    </Form>
                  </div>
                  <div slot="right" class="demo-split-pane">
                    <p class="preview">预览</p>
                    <Tree :data="cordovaPluginPreviewTreeData"></Tree>
                  </div>
                </Split>
              </div>
            </Panel>
            <Panel
              v-show="cordovaPluginFolderConfigs.isCreateCordovaPluginFoldeWithJs"
              name="3"
            >项目配置(Js/Ts)
              <div slot="content">
                <Alert>Js/Ts的部分项目配置根据
                  <Button
                    type="text"
                    ghost
                    style="i-color: #3a5c79"
                    size="small"
                    @click="panelIndex = '2'"
                  >项目配置(C#)</Button>生成，若无法修改，请修改
                  <Button
                    type="text"
                    ghost
                    style="i-color: #3a5c79"
                    size="small"
                    @click="panelIndex = '2'"
                  >项目配置(C#)</Button>,Js/Ts的部分项目配置会自动修改
                </Alert>
                <div class="split-content">
                  <Split v-model="cordovaPluginJsSplitConfig">
                    <div slot="left" class="demo-split-pane">
                      <Form
                        ref="cordovaPluginJsConfig"
                        :model="cordovaPluginJsConfig"
                        :label-width="100"
                      >
                        <FormItem label="所选语言">
                          <Row>
                            <i-col span="10">
                              <RadioGroup v-model="cordovaPluginJsConfig.language" type="button">
                                <Radio label="javascript">
                                  <Icon type="logo-javascript"/>
                                </Radio>
                                <Radio label="typescript">
                                  <i class="iconfont icon-typescript"></i>
                                </Radio>
                              </RadioGroup>
                            </i-col>
                          </Row>
                        </FormItem>
                        <FormItem label="插件名">
                          <Row>
                            <i-col span="10">
                              <Input v-model="cordovaPluginJsConfig.prefixPluginName"/>
                            </i-col>
                            <i-col span="1">
                              <div class="point">-</div>
                            </i-col>
                            <i-col span="8">
                              <Input
                                v-model="cordovaPluginJsConfig.suffixPluginName"
                                @on-blur="cordovaPluginJsNameBlurHandler"
                              />
                            </i-col>
                          </Row>
                        </FormItem>
                        <FormItem label="版本">
                          <Row>
                            <i-col span="10">
                              <Input v-model="cordovaPluginJsConfig.version"/>
                            </i-col>
                          </Row>
                        </FormItem>
                      </Form>
                    </div>
                    <div slot="right" class="demo-split-pane">
                      <p class="preview">预览</p>
                    </div>
                  </Split>
                </div>
              </div>
            </Panel>
          </Collapse>
          <div style="width: 100%; height: 100%; margin-top: 15px;">
          <Button type="primary" :loading="isCreating" @click="createCordovaPluginProject">
            <span v-if="!isCreating">创建</span>
            <span v-else>Loading...</span>
          </Button>
          </div>
        </TabPane>
        <TabPane label="创建一个Aui-ss组件" name="create_auiss_component">
          <Row>
            <i-col span="18">
              <Alert type="success" v-if="isNetworkAlive" show-icon>内网连接状态正常，可以在Git服务器直接创建Aui组件项目</Alert>
              <Alert type="error" v-else show-icon>内网连接状态异常，只可在本地创建Aui项目</Alert>
            </i-col>
            <i-col span="4" offset="1">
              <Tooltip content="超时时间" placement="top-end">
                <i-input v-model="networkTestTimeout">
                  <Button slot="append" @click="checkNetwork">重新检测</Button>
                </i-input>
              </Tooltip>
            </i-col>
          </Row>
        </TabPane>
        <TabPane label="创建一个jssdk插件" name="create__jssdk_plugin">{{cordovaPluginJsConfig}}</TabPane>
      </Tabs>
    </Card>

    <Modal
      v-model="chooseCordovaPluginFolderWithCSharpDialog"
      title="拖入目录:awp/Awp.SS/Runtime.Cordova"
      width="800"
      height="400"
    >
      <div class="currentFilePath">{{currentFilePath}}</div>
      <div slot="footer">
        <Button type="text" @click="unsureCordovaPluginFolderWithCSharp">取消</Button>
        <Button
          type="success"
          @click="ensureCordovaPluginFolderWithCSharp "
          :disabled="isAbletoEnsureCordovaPluginFolder"
        >确认</Button>
      </div>
    </Modal>
    <Modal
      v-model="chooseCordovaPluginFolderWithJsDialog"
      title="拖入目录:awpjssdk/src"
      width="800"
      height="400"
    >
      <div class="currentFilePath">{{currentFilePath}}</div>
      <div slot="footer">
        <Button type="text" @click="unsureCordovaPluginFolderWithJs">取消</Button>
        <Button
          type="success"
          @click="ensureCordovaPluginFolderWithJs"
          :disabled="isAbletoEnsureCordovaPluginFolder"
        >确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      panelIndex: ["1"],
      isNetworkAlive: false,
      networkTestTimeout: "3",
      cordovaPluginCsharpSplitConfig: 0.5,
      cordovaPluginJsSplitConfig: 0.5,
      chooseCordovaPluginFolderWithCSharpDialog: false,
      chooseCordovaPluginFolderWithJsDialog: false,
      currentFilePath: "",
      cordovaPluginFolderConfigs: {
        isCreateCordovaPluginFoldeWithJs: false,
        cSharpPath: "",
        jsPath: ""
      },
      isAbletoEnsureCordovaPluginFolder: true,
      cordovaPluginProjectConfigs: {
        prefixPluginName: "Awp.SS.Cordova.Plugin",
        suffixPluginName: "",
        isLoadLogger: true,
        methodsList: [
          {
            methodsName: ""
          }
        ]
      },
      cordovaPluginJsConfig: {
        prefixPluginName: "awp-plugin",
        suffixPluginName: "",
        language: "javascript",
        version: "1.0.0"
      },
      buttonProps: {
        type: "default",
        size: "small"
      },
      cordovaPluginMainFileName: "",
      isCreating: false
    };
  },
  watch: {
    cordovaPluginProjectConfigs: {
      deep: true,
      handler: function(newValue, oldValue) {
        this.cordovaPluginMainFileName = newValue.suffixPluginName;
      }
    }
  },
  computed: {
    cordovaPluginFullName() {
      return `${this.cordovaPluginProjectConfigs.prefixPluginName}.${
        this.cordovaPluginProjectConfigs.suffixPluginName
      }`;
    },
    cordovaPluginJsFullName() {
      return `${this.cordovaPluginJsConfig.prefixPluginName}-${
        this.cordovaPluginJsConfig.suffixPluginName
      }`;
    },
    cordovaPluginPreviewTreeData() {
      return [
        {
          title: "ast",
          expand: true,
          render: (h, { root, node, data }) => {
            return h(
              "span",
              {
                style: {
                  display: "inline-block",
                  width: "100%"
                }
              },
              [
                h("span", [
                  h("Icon", {
                    props: {
                      type: "ios-folder"
                    },
                    style: {
                      marginRight: "8px"
                    }
                  }),
                  h("span", data.title)
                ]),
                h("span", {
                  style: {
                    display: "inline-block",
                    float: "right",
                    marginRight: "32px"
                  }
                })
              ]
            );
          },
          children: [
            {
              title: "Awp.SS",
              expand: true,
              render: (h, { root, node, data }) => {
                return h(
                  "span",
                  {
                    style: {
                      display: "inline-block",
                      width: "100%"
                    }
                  },
                  [
                    h("span", [
                      h("Icon", {
                        props: {
                          type: "ios-folder"
                        },
                        style: {
                          marginRight: "8px"
                        }
                      }),
                      h("span", data.title)
                    ]),
                    h("span", {
                      style: {
                        display: "inline-block",
                        float: "right",
                        marginRight: "32px"
                      }
                    })
                  ]
                );
              },
              children: [
                {
                  title: "Runtime.Cordova",
                  expand: true,
                  render: (h, { root, node, data }) => {
                    return h(
                      "span",
                      {
                        style: {
                          display: "inline-block",
                          width: "100%"
                        }
                      },
                      [
                        h("span", [
                          h("Icon", {
                            props: {
                              type: "ios-folder"
                            },
                            style: {
                              marginRight: "8px"
                            }
                          }),
                          h("span", data.title)
                        ]),
                        h("span", {
                          style: {
                            display: "inline-block",
                            float: "right",
                            marginRight: "32px"
                          }
                        })
                      ]
                    );
                  },
                  children: [
                    {
                      title: this.cordovaPluginFullName,
                      expand: true,
                      render: (h, { root, node, data }) => {
                        return h(
                          "span",
                          {
                            style: {
                              display: "inline-block",
                              width: "100%"
                            }
                          },
                          [
                            h("span", [
                              h("Icon", {
                                props: {
                                  type: "ios-folder"
                                },
                                style: {
                                  marginRight: "8px"
                                }
                              }),
                              h("span", data.title)
                            ]),
                            h("span", {
                              style: {
                                display: "inline-block",
                                float: "right",
                                marginRight: "32px"
                              }
                            })
                          ]
                        );
                      },
                      children: [
                        {
                          title: "Properties",
                          expand: false,
                          render: (h, { root, node, data }) => {
                            return h(
                              "span",
                              {
                                style: {
                                  display: "inline-block",
                                  width: "100%"
                                }
                              },
                              [
                                h("span", [
                                  h("Icon", {
                                    props: {
                                      type: "ios-folder"
                                    },
                                    style: {
                                      marginRight: "8px"
                                    }
                                  }),
                                  h("span", data.title)
                                ]),
                                h("span", {
                                  style: {
                                    display: "inline-block",
                                    float: "right",
                                    marginRight: "32px"
                                  }
                                })
                              ]
                            );
                          },
                          children: [
                            {
                              title: "AssemblyInfo.cs",
                              expand: true,
                              render: (h, { root, node, data }) => {
                                return h(
                                  "span",
                                  {
                                    style: {
                                      display: "inline-block",
                                      width: "100%"
                                    }
                                  },
                                  [
                                    h("span", [
                                      h("i", {
                                        class: "iconfont icon-csharp",
                                        style: {
                                          marginRight: "8px"
                                        }
                                      }),
                                      h("span", data.title)
                                    ]),
                                    h("span", {
                                      style: {
                                        display: "inline-block",
                                        float: "right",
                                        marginRight: "32px"
                                      }
                                    })
                                  ]
                                );
                              }
                            }
                          ]
                        },
                        {
                          title: `${this.cordovaPluginFullName}.csproj`,
                          expand: false,
                          render: (h, { root, node, data }) => {
                            return h(
                              "span",
                              {
                                style: {
                                  display: "inline-block",
                                  width: "100%"
                                }
                              },
                              [
                                h("span", [
                                  h("i", {
                                    class: "iconfont icon-file_type_csproj",
                                    style: {
                                      marginRight: "8px"
                                    }
                                  }),
                                  h("span", data.title)
                                ]),
                                h("span", {
                                  style: {
                                    display: "inline-block",
                                    float: "right",
                                    marginRight: "32px"
                                  }
                                })
                              ]
                            );
                          }
                        },
                        {
                          title: `${this.cordovaPluginMainFileName}.cs`,
                          expand: true,
                          render: (h, { root, node, data }) => {
                            var self = this;
                            return h(
                              "span",
                              {
                                style: {
                                  display: "inline-block",
                                  width: "100%"
                                }
                              },
                              [
                                h("span", [
                                  h("i", {
                                    class: "iconfont icon-csharp",
                                    style: {
                                      marginRight: "8px"
                                    }
                                  }),
                                  h("span", data.title)
                                ]),
                                h("span", {
                                  style: {
                                    display: "inline-block",
                                    float: "right",
                                    marginRight: "32px"
                                  }
                                }),
                                h(
                                  "Poptip",
                                  {
                                    props: {
                                      placement: "top",
                                      width: "200"
                                    }
                                  },
                                  [
                                    h("input", {
                                      domProps: {
                                        value: self.cordovaPluginMainFileName
                                      },
                                      on: {
                                        input: function(event) {
                                          self.$emit(
                                            "input",
                                            event.target.value
                                          );
                                          self.cordovaPluginMainFileName =
                                            event.target.value;
                                        }
                                      },
                                      slot: "content"
                                    }),
                                    h("Button", {
                                      domProps: {
                                        innerHTML: "重命名"
                                      },
                                      props: {
                                        size: "small"
                                      },
                                      style: {
                                        marginLeft: "8px"
                                      }
                                    })
                                  ]
                                )
                              ]
                            );
                          },
                          children: [
                            {
                              title: "m_Logger",
                              expand: false,
                              render: (h, { root, node, data }) => {
                                if (
                                  this.cordovaPluginProjectConfigs.isLoadLogger
                                ) {
                                  return h(
                                    "span",
                                    {
                                      style: {
                                        display: "inline-block",
                                        width: "100%"
                                      }
                                    },
                                    [
                                      h("span", [
                                        h("i", {
                                          class: "iconfont icon-shuxing",
                                          style: {
                                            marginRight: "8px"
                                          }
                                        }),
                                        h("span", data.title)
                                      ]),
                                      h("span", {
                                        style: {
                                          display: "inline-block",
                                          float: "right",
                                          marginRight: "32px"
                                        }
                                      })
                                    ]
                                  );
                                }
                              }
                            },
                            {
                              title: `${
                                this.cordovaPluginProjectConfigs.methodsList[0]
                                  .methodsName
                              }()`,
                              expand: false,
                              render: (h, { root, node, data }) => {
                                return h(
                                  "span",
                                  {
                                    style: {
                                      display: "inline-block",
                                      width: "100%"
                                    }
                                  },
                                  [
                                    h("span", [
                                      h("i", {
                                        class: "iconfont icon-function",
                                        style: {
                                          marginRight: "8px"
                                        }
                                      }),
                                      h("span", data.title)
                                    ]),
                                    h("span", {
                                      style: {
                                        display: "inline-block",
                                        float: "right",
                                        marginRight: "32px"
                                      }
                                    })
                                  ]
                                );
                              }
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];
    }
  },
  mounted() {
    this.addFileDropEventListener();
  },
  methods: {
    createCordovaPluginProject() {
      this.isCreating = true;
      setTimeout(() => {
        this.isCreating = false;
      }, 3000);
    },
    cordovaPluginCsharpNameBlurHandler() {
      const fullPath = require("path").join(
        this.cordovaPluginFolderConfigs.cSharpPath,
        this.cordovaPluginFullName
      );
      if (require("fs").existsSync(fullPath)) {
        this.$Notice.error({
          title: "异常",
          desc: `项目${fullPath}已经存在，请重新配置`
        });
      }
    },
    cordovaPluginJsNameBlurHandler() {
      const fullPath = require("path").join(
        this.cordovaPluginFolderConfigs.jsPath,
        this.cordovaPluginJsFullName
      );
      if (require("fs").existsSync(fullPath)) {
        this.$Notice.error({
          title: "异常",
          desc: `项目${fullPath}已经存在，请重新配置`
        });
      }
    },
    checkNetwork() {
      if (this.networkTestTimeout * 1 < 3) {
        this.$Notice.error({
          title: "超时时间小于3秒无法检测"
        });
        return;
      }
      this.$Spin.show({
        render: h => {
          return h("div", [h("div", `正在检查网络...`)]);
        }
      });
      require("ping").sys.probe(
        "192.168.180.113",
        isAlive => {
          this.isNetworkAlive = isAlive;
          this.$Spin.hide();
        },
        {
          timeout: this.networkTestTimeout
        }
      );
    },
    tabChanged(tabName) {
      if (tabName === "create_auiss_component") {
        this.checkNetwork();
      }
    },
    openChooseFileDialog(dialog) {
      eval(`this.${dialog} = true`);
    },
    addFileDropEventListener() {
      document.addEventListener("drop", e => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files.length > 1) {
          this.$Notice.error({
            title: "请拖入单个的目录文件"
          });
          this.isAbletoEnsureCordovaPluginFolder = true;
          return;
        }
        for (let f of e.dataTransfer.files) {
          this.currentFilePath = f.path;
          this.isAbletoEnsureCordovaPluginFolder = false;
        }
        if (
          require("fs")
            .statSync(this.currentFilePath)
            .isFile()
        ) {
          this.$Notice.error({
            title: "请拖入目录而非文件"
          });
          this.isAbletoEnsureCordovaPluginFolder = true;
          return;
        }
      });
      document.addEventListener("dragover", function(e) {
        e.preventDefault();
        e.stopPropagation();
      });
    },
    //#region 创建cordova插件
    unsureCordovaPluginFolderWithJs() {
      this.chooseCordovaPluginFolderWithJsDialog = false;
      this.currentFilePath = "";
      this.isAbletoEnsureCordovaPluginFolder = true;
    },
    unsureCordovaPluginFolderWithCSharp() {
      this.chooseCordovaPluginFolderWithCSharpDialog = false;
      this.currentFilePath = "";
      this.isAbletoEnsureCordovaPluginFolder = true;
    },
    ensureCordovaPluginFolderWithCSharp() {
      this.cordovaPluginFolderConfigs.cSharpPath = this.currentFilePath;
      this.chooseCordovaPluginFolderWithCSharpDialog = false;
      this.isAbletoEnsureCordovaPluginFolder = true;
      this.currentFilePath = "";
    },
    ensureCordovaPluginFolderWithJs() {
      this.cordovaPluginFolderConfigs.jsPath = this.currentFilePath;
      this.chooseCordovaPluginFolderWithJsDialog = false;
      this.isAbletoEnsureCordovaPluginFolder = true;
      this.currentFilePath = "";
    },
    chooseCordovaPluginFolderWithCSharp() {
      this.openChooseFileDialog("chooseCordovaPluginFolderWithCSharpDialog");
    },
    chooseCordovaPluginFolderWithJs() {
      this.openChooseFileDialog("chooseCordovaPluginFolderWithJsDialog");
    }
    //#endregion
  }
};
</script>

<style>
@font-face {
  font-family: "iconfont";
  src: url("//at.alicdn.com/t/font_1023802_uyn7uqnxf7.eot?t=1547918781264"); /* IE9 */
  src: url("//at.alicdn.com/t/font_1023802_uyn7uqnxf7.eot?t=1547918781264#iefix")
      format("embedded-opentype"),
    /* IE6-IE8 */
      url("data:application/x-font-woff2;charset=utf-8;base64,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")
      format("woff2"),
    url("//at.alicdn.com/t/font_1023802_uyn7uqnxf7.woff?t=1547918781264")
      format("woff"),
    url("//at.alicdn.com/t/font_1023802_uyn7uqnxf7.ttf?t=1547918781264")
      format("truetype"),
    /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
      url("//at.alicdn.com/t/font_1023802_uyn7uqnxf7.svg?t=1547918781264#iconfont")
      format("svg"); /* iOS 4.1- */
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-typescript:before {
  content: "\e608";
}

.icon-csharp:before {
  content: "\e750";
}

.icon-javascript:before {
  content: "\e600";
}

.icon-file_type_csproj:before {
  content: "\e752";
}

.icon-JSON:before {
  content: "\e763";
}

.icon-function:before {
  content: "\e6c2";
}

.icon-shuxing:before {
  content: "\e73d";
}

.menu {
  padding: 20px;
  background-color: rgb(235, 235, 235);
  width: 100%;
  height: 100%;
}

.currentFilePath {
  font-size: 20px;
  color: darkgrey;
}

.point {
  width: 100%;
  font-size: 20px;
  text-align: center;
}

.split-content {
  height: 400px;
  border: 4px groove #dcdee2;
  padding: 20px;
}

.demo-split-pane {
  height: 100%;
  width: 100%;
  padding-left: 20px;
  text-align: center;
}

.preview {
  font-size: 20px;
  color: darkgrey;
}

.ivu-tree {
  text-align: left;
}
</style>
