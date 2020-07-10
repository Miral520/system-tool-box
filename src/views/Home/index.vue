<template>
  <div class="home">
    <vue-scroll :ops="ops">
      <div class="home_statistic">
        <p class="home_title">统计数据</p>
        <a-row :gutter="5">
          <a-col :span="6" v-for="(item, index) in statistic" :key="index">
            <a-card :bordered="false" hoverable>
              <a-statistic :title="item.title" :value="item.value">
                <template v-if="item.suffix.value" #suffix>
                  <a-icon :type="item.suffix.value" v-if="item.suffix.type === 'icon'" />
                  <span v-else>{{ item.suffix.value }}</span>
                </template>
              </a-statistic>
            </a-card>
          </a-col>
        </a-row>
      </div>
      <div class="home_statistic" v-if="JSON.stringify(sysInfo) !== '{}'">
        <p class="home_title">系统状况</p>
        <a-row :gutter="5">
          <a-col :span="12">
            <a-page-header title="CPU" :sub-title="`${sysInfo.cpus.length}核心`">
              <template slot="tags">
                <a-tag color="blue">{{ sysInfo.arch }}</a-tag>
              </template>
              <div class="model">
                <a-timeline>
                  <a-timeline-item v-for="(item, i) in sysInfo.cpus" :key="i">
                    <div class="cpu_layout">
                      <p class="cpu_name">
                        <a-icon type="wallet" theme="filled" />
                        <span>{{ item.model }}</span>
                      </p>
                      <p class="cpu_desc">主频: {{ (item.speed / 1024).toFixed(2) }}GHz</p>
                    </div>
                  </a-timeline-item>
                </a-timeline>
              </div>
            </a-page-header>
          </a-col>
          <a-col :span="12">
            <a-page-header title="其他" :sub-title="`${sysInfo.type} ${sysInfo.release}`">
              <template slot="tags">
                <a-tag color="blue">{{ sysInfo.platform }}</a-tag>
              </template>
              <ul class="model no-top">
                <li class="list">
                  <div class="list_text">
                    <span class="list_name">内存</span>
                    <span class="list_value">{{  (sysInfo.freemem / 1024 / 1024 / 1024).toFixed(2) }} / {{ (sysInfo.totalmem / 1024 / 1024 / 1024).toFixed(2) }} GB</span>
                  </div>
                  <a-progress :percent="parseInt(sysInfo.freemem / sysInfo.totalmem * 100)" status="active" />
                </li>
                <li class="list">
                  <div class="list_text">
                    <span class="list_name">屏幕</span>
                    <span class="list_value">{{ sysInfo.screen.size.width }} * {{ sysInfo.screen.size.height }}px ({{ sysInfo.screen.colorDepth }}bit色位深度)</span>
                  </div>
                  <p class="list_desc">{{ sysInfo.screen.colorSpace }}</p>
                </li>
                <li class="list">
                  <div class="list_text">
                    <span class="list_name">网络</span>
                  </div>
                  <div class="list_networks" v-for="(item, key) in sysInfo.networkInterfaces" :key="key">
                    <p class="list_networks-name">{{ key }}</p>
                    <a-statistic v-for="(net, i) in item" :key="i" :title="net.family" :value="net.address" v-show="net.family === 'IPv4'" />
                  </div>
                </li>
              </ul>
            </a-page-header>
          </a-col>
        </a-row>
      </div>
    </vue-scroll>
  </div>
</template>

<script src="./index.ts"></script>

<style lang="scss">
  @import './index.scss';
</style>