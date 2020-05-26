<template>
  <div id="app">
    <transition name="custom-classes-transition" :duration="{ enter: 2000, leave: 2000 }" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
      <!-- loading -->
      <div class="ml_loading" v-if="loadingWin.show" key="loading">
        <img class="ml_loading-bg" :src="require('assets/start_main.png')" />
        <div class="ml_loading-progress">
          <a-progress :percent="loadingWin.percent" :strokeWidth="12" :strokeColor="loadingWin.strokeColor" status="active" />
        </div>
      </div>

      <!-- 主内容 -->
      <div class="ml_frame" :class="isFullscreen ? '' : 'hasShadow'" key="main" v-else>
        <!-- 关闭提示 -->
        <a-modal v-model="float.vsisible" :closable="false" title="确认关闭" okText="确定" cancelText="取消" @ok="closeHandle" @cancel="cancelHandle" centered>
          <p class="ml_float-text">是否要关闭应用程序？</p>
          <div class="ml_float-checkbox">
            <a-checkbox :checked="!float.show" @change="nextBoxHandle">不再显示</a-checkbox>
          </div>
        </a-modal>

        <!-- 关于 -->
        <a-modal v-model="about.visible" :closable="false" title="关于" destroyOnClose centered>
          <div class="about_layout">
            <div class="about_pic">
              <a-icon type="github" />
            </div>
            <ul class="about_text">
              <li class="about_text-list" v-for="(item, key) in about.data" :key="key">
                <span class="title">{{ item.title }}</span>
                <span class="value">{{ item.value }}</span>
              </li>
            </ul>
          </div>
          <div class="about_btn" slot="footer">
            <a-button type="primary" shape="round" @click="handleAbout">知道了</a-button>
          </div>
        </a-modal>

        <!-- 主内容 -->
        <a-layout class="ml_layout">
          <a-layout-header class="ml_header">
            <ul class="ml_header-left">
              <li class="ml_header-ctrl">
                <a class="ml_header-ctrl-btn close" href="javascript:void(0)" @mousedown="(e) => {e.preventDefault()}" @click="closeFloatHandle">
                  <a-icon type="close" />
                </a>
              </li>
              <li class="ml_header-ctrl">
                <a class="ml_header-ctrl-btn minus" href="javascript:void(0)" @mousedown="(e) => {e.preventDefault()}" @click="minimizeHandle">
                  <a-icon type="minus" />
                </a>
              </li>
              <li class="ml_header-ctrl">
                <a class="ml_header-ctrl-btn fullscreen" href="javascript:void(0)" @mousedown="(e) => {e.preventDefault()}" @click="fullscreenHandle">
                  <a-icon type="plus" />
                </a>
              </li>
            </ul>
            <div class="ml_header-right">
              <a-dropdown overlayClassName="setting_menu">
                <a-badge :dot="settingData.hasMsg">
                  <a class="ml_header-right_setting" @click="e => e.preventDefault()">
                    <a-icon type="appstore" />
                  </a>
                </a-badge>
                <a-card class="setting_menu-layout" slot="overlay">
                  <!-- 已登录 -->
                  <div class="login" v-if="settingData.userName">
                    <div class="setting_menu-main">
                      <a-card-meta :title="settingData.userName" :description="settingData.userDesc">
                        <a-avatar
                          slot="avatar"
                          :size="48"
                          :src="settingData.icon"
                        >
                          <span v-if="settingData.userName && !settingData.icon">{{ settingData.userName.substring(0, 1) }}</span>
                          <a-icon slot="icon" type="user" v-if="!settingData.userName && !settingData.icon" />
                        </a-avatar>
                      </a-card-meta>
                    </div>
                    <ul class="setting_menu-actions">
                      <li class="setting_menu-actions-list" v-for="(item, index) in settingData.publicMenu" :key="`public_${index}`">
                        <a href="javascript:void(0)" class="setting_menu-actions-link" @click="runFn(item.fn)">
                          <a-tooltip>
                            <template slot="title">{{ item.label }}</template>
                            <a-badge :dot="item.hasMsg">
                              <a-icon :key="item.icon" :type="item.icon" />
                            </a-badge>
                          </a-tooltip>
                        </a>
                      </li>
                      <li class="setting_menu-actions-list" v-for="(item, index) in settingData.loginMenu" :key="`login_${index}`">
                        <a href="javascript:void(0)" class="setting_menu-actions-link" @click="runFn(item.fn)">
                          <a-tooltip>
                            <template slot="title">{{ item.label }}</template>
                            <a-badge :dot="item.hasMsg">
                              <a-icon :key="item.icon" :type="item.icon" />
                            </a-badge>
                          </a-tooltip>
                        </a>
                      </li>
                    </ul>
                  </div>

                  <!-- 未登录 -->
                  <div class="logout" v-else>
                    <a-menu>
                      <a-menu-item v-for="(item, index) in settingData.publicMenu" :key="`public_${index}`">
                        <a href="javascript:void(0)" @click="runFn(item.fn)">
                          <a-badge :dot="item.hasMsg">
                            <a-icon :type="item.icon" />
                            <span>{{ item.label }}</span>
                          </a-badge>
                        </a>
                      </a-menu-item>
                      <a-menu-item v-for="(item, index) in settingData.logoutMenu" :key="`logout_${index}`">
                        <a href="javascript:void(0)" @click="runFn(item.fn)">
                          <a-badge :dot="item.hasMsg">
                            <a-icon :type="item.icon" />
                            <span>{{ item.label }}</span>
                          </a-badge>
                        </a>
                      </a-menu-item>
                    </a-menu>
                  </div>
                </a-card>
              </a-dropdown>
            </div>
          </a-layout-header>
          <a-layout>
            <a-layout-sider class="ml_menu" theme="light" v-model="menu.collapsed" :collapsedWidth="menu.collapsedWidth" collapsible defaultCollapsed>
              <div class="ml_menu-trigger" slot="trigger">
                <a-button :icon="menu.collapsed ? 'export' : 'import'" size="small" title="收起">{{ menu.collapsed ? '' : '收起' }}</a-button>
              </div>
              <a-menu class="ml_menu-main" :default-selected-keys="menu.defaultSelectedKeys" forceSubMenuRender>
                <a-menu-item class="ml_menu-main-list" v-for="item in $router.options.routes" :key="item.name">
                  <router-link :to="item.path">
                    <a-icon :type="item.icon" :theme="$router.currentRoute.name === item.name ? 'filled' : 'outlined'" />
                    <span>{{ item.name }}</span>
                  </router-link>
                </a-menu-item>
              </a-menu>
            </a-layout-sider>
            <a-layout class="ml_main">
              <a-layout-header class="ml_breadcrumb" v-show="breadcrumb.show">
                <span class="ml_breadcrumb-title">当前位置: </span>
                <a-breadcrumb separator=">">
                  <a-breadcrumb-item>{{ $store.state.breadcrumb }}</a-breadcrumb-item>
                </a-breadcrumb>
              </a-layout-header>
              <a-layout-content class="ml_content">
                <div class="ml_content-card">
                  <vue-scroll>
                    <div class="ml_content-main">
                      <keep-alive>
                        <router-view/>
                      </keep-alive>
                    </div>
                  </vue-scroll>
                </div>
              </a-layout-content>
              <a-layout-footer class="ml_footer" v-show="footer.show">{{ footer.text }}</a-layout-footer>
            </a-layout>
          </a-layout>
        </a-layout>
      </div>
    </transition>
  </div>
</template>

<script src="./index.ts"></script>

<style lang="scss">
  @import './index.scss';
</style>
