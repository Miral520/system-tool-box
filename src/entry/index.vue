<template>
  <div id="app">
    <transition name="custom-classes-transition" :duration="{ enter: 2000, leave: 2000 }" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
      <div class="ml_loading" v-if="loadingWin.show" key="loading">
        <img class="ml_loading-bg" :src="require('assets/start_main.png')" />
        <div class="ml_loading-progress">
          <a-progress :percent="loadingWin.percent" :strokeWidth="12" :strokeColor="loadingWin.strokeColor" status="active" />
        </div>
      </div>
      <div class="ml_frame" :class="isFullscreen ? '' : 'hasShadow'" key="main" v-else>
        <a-modal v-model="float.vsisible" :closable="false" title="确认关闭" okText="确定" cancelText="取消" @ok="closeHandle" @cancel="cancelHandle" centered>
          <p class="ml_float-text">是否要关闭应用程序？</p>
          <div class="ml_float-checkbox">
            <a-checkbox :checked="!float.show" @change="nextBoxHandle">不再显示</a-checkbox>
          </div>
        </a-modal>
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
              <a-button shape="circle" icon="setting" size="small" />
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
