<template>
  <div class="menu">
    <Card>
      <p slot="title">创建一个新的项目</p>
      <Tabs value="create_new_project">
        <TabPane label="创建一个Cordova插件" name="create_cordova_plugin">
          <Collapse>
            <Panel>目录配置
              <div slot="content">
                <Form ref="cordovaPluginFolderConfigs" :model="cordovaPluginFolderConfigs" inline>
                  <Row justify="center">
                    <Col span="8">
                      <FormItem>
                        <Tooltip content="请选择awp/Awp.SS/Runtime.Cordova目录" placement="top-start">
                          <Button @click="chooseCordovaPluginFolderWithCSharp">选择目录</Button>
                        </Tooltip>
                      </FormItem>
                    </Col>
                    <Col span="5">
                      <FormItem>
                        <Checkbox
                          v-model="cordovaPluginFolderConfigs.isCreateCordovaPluginFoldeWithJs"
                        >同时创建jssdk下的对应项目</Checkbox>
                      </FormItem>
                    </Col>
                    <Col span="8">
                      <FormItem>
                        <Tooltip content="请选择awpjssdk/src目录" placement="top-start">
                          <Button
                            @click="chooseCordovaPluginFolderWithJs"
                            v-show="cordovaPluginFolderConfigs.isCreateCordovaPluginFoldeWithJs"
                          >选择目录</Button>
                        </Tooltip>
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
                <Form :model="cordovaPluginFolderConfigs" inline>
                  <Row justify="center">
                    <Col span="8">
                      <FormItem>
                        <p>{{cordovaPluginFolderConfigs.cSharpPath}}</p>
                      </FormItem>
                    </Col>
                    <Col span="8" offset="5">
                      <FormItem>
                        <p>{{cordovaPluginFolderConfigs.jsPath}}</p>
                      </FormItem>
                    </Col>
                  </Row>
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
        <TabPane label="创建一个Aui-ss组件" name="create_auiss_component">{{cordovaPluginProjectConfigs}}</TabPane>
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
      cordovaPluginSplitConfig: 0.5,
      chooseCordovaPluginFolderWithCSharpDialog: false,
      chooseCordovaPluginFolderWithJsDialog: false,
      currentFilePath: "",
      cordovaPluginFolderConfigs: {
        isCreateCordovaPluginFoldeWithJs: true,
        cSharpPath: "",
        jsPath: ""
      },
      isAbletoEnsureCordovaPluginFolder: true,
      cordovaPluginProjectConfigs: {
        prefixPluginName: "Awp.SS.Cordova.Plugin",
        suffixPluginName: ""
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
      handler: function (newValue, oldValue) {
        this.cordovaPluginMainFileName = newValue.suffixPluginName
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
                          title: `${
                            this.cordovaPluginMainFileName
                          }.cs`,
                          expand: false,
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
                                          self.$emit('input', event.target.value)
                                          self.cordovaPluginMainFileName = event.target.value;
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
      ];
    }
  },
  mounted() {
    this.addFileDropEventListener();
  },
  methods: {
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
  src: url("//at.alicdn.com/t/font_1023802_0tomadfwcfw.eot?t=1547909600123"); /* IE9 */
  src: url("//at.alicdn.com/t/font_1023802_0tomadfwcfw.eot?t=1547909600123#iefix")
      format("embedded-opentype"),
    /* IE6-IE8 */
      url("data:application/x-font-woff2;charset=utf-8;base64,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")
      format("woff2"),
    url("//at.alicdn.com/t/font_1023802_0tomadfwcfw.woff?t=1547909600123")
      format("woff"),
    url("//at.alicdn.com/t/font_1023802_0tomadfwcfw.ttf?t=1547909600123")
      format("truetype"),
    /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
      url("//at.alicdn.com/t/font_1023802_0tomadfwcfw.svg?t=1547909600123#iconfont")
      format("svg"); /* iOS 4.1- */
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 14px;
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
