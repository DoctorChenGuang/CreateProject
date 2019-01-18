<template>
  <div class="menu">
    <Card>
      <p slot="title">创建一个新的功能</p>
      <Collapse accordion v-model="value3">
        <Panel name="1">cordova插件
          <div slot="content">
            <Collapse accordion v-model="value4">
              <Panel name="1-1">c#
                <Form v-model="cordovaPlugins_csharp" slot="content">
                  <FormItem>
                    <Button @click="startChooseFile">{{chooseFileValue}}</Button>
                  </FormItem>
                  <FormItem label="插件名">
                    <Input/>
                  </FormItem>
                </Form>
              </Panel>
              <Panel name="1-2">javascript
                <p
                  slot="content"
                >iPad是由苹果公司于2010年开始发布的平板电脑系列，定位介于苹果的智能手机iPhone和笔记本电脑产品之间，（屏幕中有4个虚拟程序固定栏）与iPhone布局一样，提供浏览网站、收发电子邮件、观看电子书、播放音频或视频、玩游戏等功能。由英国出生的设计主管乔纳森·伊夫（Jonathan Ive）（有些翻译为 乔纳森·艾维）领导的团队设计的，这个圆滑、超薄的产品反映出了伊夫对德国天才设计师Dieter Rams的崇敬之情。</p>
              </Panel>
            </Collapse>
          </div>
        </Panel>
        <Panel name="2">aui组件
          <p
            slot="content"
          >斯蒂夫·盖瑞·沃兹尼亚克（Stephen Gary Wozniak），美国电脑工程师，曾与史蒂夫·乔布斯合伙创立苹果电脑（今之苹果公司）。斯蒂夫·盖瑞·沃兹尼亚克曾就读于美国科罗拉多大学，后转学入美国著名高等学府加州大学伯克利分校（UC Berkeley）并获得电机工程及计算机（EECS）本科学位（1987年）。</p>
        </Panel>
      </Collapse>
    </Card>
    <Modal v-model="chooseFile" title="拖入目录" width="800" height="400" @on-cancel="unensureFile">
      <div class="chooseFile">{{filePath}}</div>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value3: "1",
      value4: "1-1",
      cordovaPlugins_csharp: {},
      chooseFile: false,
      filePath: ""
    };
  },
  computed: {
    chooseFileValue() {
      return this.filePath === ""
        ? "选择awp.Awp.SS.Runtime.Cordova目录"
        : this.filePath;
    }
  },
  mounted() {},
  methods: {
    unensureFile() {
      this.filePath = "";
    },
    startChooseFile() {
      this.chooseFile = true;
      document.addEventListener("drop", e => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files.length > 1) {
          this.$Notice.error({
            title: "请拖入单个的目录文件"
          });
          return;
        }
        for (let f of e.dataTransfer.files) {
          this.filePath = f.path;
        }
        if (
          require("fs")
            .statSync(this.filePath)
            .isFile()
        ) {
          this.$Notice.error({
            title: "请拖入目录而非文件"
          });
          return;
        }
      });
      document.addEventListener("dragover", function(e) {
        e.preventDefault();
        e.stopPropagation();
      });
    }
  }
};
</script>

<style>
.menu {
  padding: 20px;
  background-color: rgb(235, 235, 235);
  width: 100%;
  height: 100%;
}

.chooseFile {
  opacity: 0.6;
  display: flex;
  font-size: 40px;
  justify-content: center;
  align-items: center;
}

.filePath {
  font-size: 20px;
  color: darkgrey;
}
</style>
