<template>
  <div class="database">
    <div class="database_login">
      <div class="database_login-head">
        <a-icon :type="login.title.icon" :theme="login.title.theme" />
        <span>{{ login.title.label }}</span>
      </div>
      <div class="database_login-main">
        <vue-scroll>
          <div class="database_login-layout">
            <a-form-model :model="login.value" v-bind="login.props">
              <a-form-model-item v-for="(item, key) in login.value" :key="key" :label="login.label[key].label">
                <component :is="`a-${login.label[key].type}`" v-model="login.value[key]" v-bind="login.label[key].props">
                  <template v-if="login.label[key].type === 'select'">
                    <a-select-option v-for="(opt, i) in login.label[key].options" :key="i" :value="opt.value">{{ opt.label }}</a-select-option>
                  </template>
                  <template v-if="login.label[key].type === 'radio-group'">
                    <a-radio-button v-for="(opt, i) in login.label[key].options" :key="i" :value="opt.value">{{ opt.label }}</a-radio-button>
                  </template>
                </component>
              </a-form-model-item>
            </a-form-model>
          </div>
        </vue-scroll>
      </div>
      <div class="database_login-btn">
        <a-button icon="arrow-right" size="large" type="primary" block>登录</a-button>
      </div>
    </div>
  </div>
</template>

<script src="./index.ts"></script>

<style lang="scss">
  @import './index.scss';
</style>