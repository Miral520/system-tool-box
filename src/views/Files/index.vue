<template>
  <div class="files">
    <div class="files_ctrl">
      <div class="files_ctrl-left">
        <a-input ref="userNameInput" v-model="activeURL" placeholder="目标地址">
          <a-icon slot="prefix" type="folder" />
        </a-input>
      </div>
      <div class="files_ctrl-right">
        <a-button-group>
          <a-tooltip title="刷新">
            <a-button icon="reload" />
          </a-tooltip>
          <a-tooltip title="向上">
            <a-button icon="rollback" />
          </a-tooltip>
          <a-tooltip title="缩略图">
            <a-button icon="appstore" v-show="isThumb" @click="handleThumb" />
          </a-tooltip>
          <a-tooltip title="列表">
            <a-button icon="unordered-list" v-show="!isThumb" @click="handleThumb" />
          </a-tooltip>
        </a-button-group>
      </div>
    </div>
    <div class="files_layout">
      <a-tabs class="files_tabs" type="editable-card" v-model="activeURL" size="small" hideAdd>
        <a-tab-pane class="files_tab" v-for="item in tabs" :key="item.url" :tab="item.label" :closable="item.closable">
          <vue-scroll>
            <div class="files_tab-warp">
              <ul class="files_main">
                <li class="files_list" v-for="(file, fileIndex) in item.data" :key="fileIndex">
                    <a href="javascript:void(0)" class="files_link">

                    </a>
                </li>
              </ul>
            </div>
          </vue-scroll>
        </a-tab-pane>
      </a-tabs>
    </div>
    <p class="files_footer">共{{ activeStatus.total }}个文件, 文件夹{{ activeStatus.folders }}个 , 文件{{ activeStatus.files }}个</p>
  </div>
</template>

<script src="./index.ts"></script>

<style lang="scss">
  @import './index.scss';
</style>
