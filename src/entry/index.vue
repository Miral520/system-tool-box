<template>
  <div id="app">
    <a-layout class="ml_layout">
      <a-layout-header class="ml_header">
        <ul class="ml_header-left">
          <li class="ml_header-ctrl">
            <a class="ml_header-ctrl-btn close" href="javascript:void(0)">
              <a-icon type="close" />
            </a>
          </li>
          <li class="ml_header-ctrl">
            <a class="ml_header-ctrl-btn minus" href="javascript:void(0)">
              <a-icon type="minus" />
            </a>
          </li>
          <li class="ml_header-ctrl">
            <a class="ml_header-ctrl-btn fullscreen" href="javascript:void(0)">
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
              <a-breadcrumb-item v-for="item in breadcrumb.dataList" :key="item.name">{{ item.label }}</a-breadcrumb-item>
            </a-breadcrumb>
          </a-layout-header>
          <a-layout-content class="ml_content">
            <div class="ml_content-card">
              <vue-scroll>
                <div class="ml_content-main">
                  <router-view/>
                </div>
              </vue-scroll>
            </div>
          </a-layout-content>
          <a-layout-footer class="ml_footer" v-show="footer.show">{{ footer.text }}</a-layout-footer>
        </a-layout>
      </a-layout>
    </a-layout>
  </div>
</template>

<script src="./index.ts"></script>

<style lang="scss">
  @import './index.scss';
</style>
