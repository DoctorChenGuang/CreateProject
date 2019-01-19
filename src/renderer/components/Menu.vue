<template>
  <div class="menu">
    <Card>
      <p slot="title">创建一个新的项目</p>
      <Tabs value="create_new_project" @on-click="tabChanged">
        <TabPane label="创建一个Cordova插件" name="create_cordova_plugin">
          <Collapse>
            <Panel>目录配置
              <div slot="content">
                <Form ref="cordovaPluginFolderConfigs" :model="cordovaPluginFolderConfigs">
                  <FormItem>
                    <Row>
                      <Col span="4">
                        <Tooltip content="请选择awp/Awp.SS/Runtime.Cordova目录" placement="top-start">
                          <Button @click="chooseCordovaPluginFolderWithCSharp">选择目录</Button>
                        </Tooltip>
                      </Col>
                      <Col span="20">
                        <p>{{cordovaPluginFolderConfigs.cSharpPath}}</p>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem>
                    <Checkbox
                      v-model="cordovaPluginFolderConfigs.isCreateCordovaPluginFoldeWithJs"
                    >同时创建jssdk下的对应项目</Checkbox>
                  </FormItem>
                  <FormItem v-show="cordovaPluginFolderConfigs.isCreateCordovaPluginFoldeWithJs">
                    <Row>
                      <Col span="4">
                        <Tooltip content="请选择awpjssdk/src目录" placement="top-start">
                          <Button @click="chooseCordovaPluginFolderWithJs">选择目录</Button>
                        </Tooltip>
                      </Col>
                      <Col span="20">
                        <p>{{cordovaPluginFolderConfigs.jsPath}}</p>
                      </Col>
                    </Row>
                  </FormItem>
                </Form>
              </div>
            </Panel>
            <Panel>项目配置(C#)
              <div slot="content" class="split-content">
                <Split v-model="cordovaPluginSplitConfig">
                  <div slot="left" class="demo-split-pane">
                    <Form ref="cordovaPluginProjectConfigs" :model="cordovaPluginProjectConfigs">
                      <FormItem label="插件名">
                        <Row>
                          <Col span="10">
                            <Input v-model="cordovaPluginProjectConfigs.prefixPluginName"/>
                          </Col>
                          <Col span="1">
                            <div class="point">.</div>
                          </Col>
                          <Col span="8">
                            <Input v-model="cordovaPluginProjectConfigs.suffixPluginName"/>
                          </Col>
                        </Row>
                      </FormItem>
                      <FormItem label="是否加载日志模块">
                        <Row>
                          <Col span="1">
                            <Checkbox v-model="cordovaPluginProjectConfigs.isLoadLogger"></Checkbox>
                          </Col>
                        </Row>
                      </FormItem>
                      <FormItem label="公共的CordovaPlugin方法：">
                        <Row>
                          <Col span="10">
                            <Input
                              v-for="(methods, index) in cordovaPluginProjectConfigs.methodsList"
                              :key="index"
                              v-model="methods.methodsName"
                            />
                          </Col>
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
            <Panel v-show="cordovaPluginFolderConfigs.isCreateCordovaPluginFoldeWithJs">项目配置(JS)</Panel>
          </Collapse>
        </TabPane>
        <TabPane label="创建一个Aui-ss组件" name="create_auiss_component">
          <Alert type="success" v-if="isNetworkAlive">内网连接状态正常，可以在Git服务器直接创建Aui组件项目</Alert>
          <Alert type="error" v-else>内网连接状态异常，只可在本地创建Aui项目</Alert>
          <Input v-model="networkTestTimeout">
            <span slot="prepend">超时时间</span>
            <Button slot="append" @click="checkNetwork">重新检测</Button>
          </Input>
        </TabPane>
        <TabPane label="创建一个jssdk插件" name="create__jssdk_plugin">{{cordovaPluginMainFileName}}</TabPane>
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
      isNetworkAlive: false,
      networkTestTimeout: "3",
      cordovaPluginSplitConfig: 0.5,
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
      buttonProps: {
        type: "default",
        size: "small"
      },
      cordovaPluginMainFileName: ""
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
    checkNetwork() {
      if (this.networkTestTimeout * 1 < 3) {
        this.$Notice.error({
          title: "超时时间小于3秒无法检测",
        });
        return;
      }
      this.$Spin.show({
        render: h => {
          return h("div", [h("div", `正在检查网络...(反应慢，多试几次)`)]);
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
    },
    ensureCordovaPluginFolderWithJs() {
      this.cordovaPluginFolderConfigs.jsPath = this.currentFilePath;
      this.chooseCordovaPluginFolderWithJsDialog = false;
      this.isAbletoEnsureCordovaPluginFolder = true;
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
