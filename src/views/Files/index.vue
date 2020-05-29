<template>
  <div class="files">
    <div class="files_ctrl">
      <div class="files_ctrl-left">
        <a-input ref="userNameInput" v-model="inputURL" placeholder="地址" @pressEnter="setUrl">
          <a-icon slot="prefix" type="folder" />
        </a-input>
      </div>
      <div class="files_ctrl-right">
        <a-button-group>
          <a-tooltip title="刷新">
            <a-button icon="reload" @click="refresh" />
          </a-tooltip>
          <a-tooltip title="向上">
            <a-button icon="rollback" @click="rollback" />
          </a-tooltip>
          <a-tooltip title="隐藏文件">
            <a-button :icon="hidden ? 'border-inner' : 'border-outer'" @click="handleHide" />
          </a-tooltip>
          <a-tooltip :title="isThumb ? '列表' : '缩略图'">
            <a-button :icon="isThumb ? 'unordered-list' : 'appstore'" @click="handleThumb" />
          </a-tooltip>
        </a-button-group>
      </div>
    </div>
    <div class="files_layout">
      <a-tabs class="files_tabs" type="editable-card" v-model="activeURL" size="small" @change="tabChange" hideAdd>
        <a-tab-pane class="files_tab" v-for="item in tabs" :key="item.url" :tab="item.label" :closable="item.closable">
          <div class="files_tab_main">
            <vue-scroll v-if="item.data.lists.length">
              <a-list :item-layout="isThumb ? 'horizontal' : 'vertical'" :grid="isThumb ? grid.thumb : grid.list" :data-source="item.data.lists">
                <a-list-item slot="renderItem" slot-scope="file, i" v-show="!(file.hide && hidden)">
                  <!-- 缩略图 -->
                  <a-card class="files_list" v-if="isThumb" :bordered="false" :bodyStyle="{padding: 0}" hoverable>
                    <a href="javascript:void(0)" class="files_link" :fid="i" @dblclick="openFile(file)">
                      <a-icon :type="file.type" theme="twoTone" class="files_icon" />
                      <p class="files_name" :title="file.name">{{ file.name }}</p>
                      <p class="files_desc">{{ file.desc }}</p>
                    </a>
                  </a-card>

                  <!-- 列表 -->
                  <div class="files_col" v-else>
                    <a-list-item-meta :description="file.desc" @dblclick="openFile(file)">
                      <a slot="title" href="javascript:void(0)" :fid="i" :title="file.name">{{ file.name }}</a>
                      <a-avatar slot="avatar" size="large" :icon="file.type"  style="color: #1890ff; backgroundColor: #e6f7ff" />
                    </a-list-item-meta>
                  </div>
                </a-list-item>
              </a-list>
            </vue-scroll>
            <a-empty description="没有文件" v-else />
          </div>
          <p class="files_tab_footer">共{{ item.data.desc.total }}个文件, 文件夹{{ item.data.desc.folders }}个, 文件{{ item.data.desc.files }}个, 包含隐藏文件夹{{ item.data.desc.hideFolders }}个, 隐藏文件{{ item.data.desc.hideFiles }}个</p>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script src="./index.ts"></script>

<style lang="scss">
  @import './index.scss';
</style>
