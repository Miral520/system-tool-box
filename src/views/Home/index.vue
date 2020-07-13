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
      <div class="home_statistic" v-if="sysInfo">
        <p class="home_title">系统状况</p>
        <a-row :gutter="5" type="flex">
          <a-col :span="12">
            <a-page-header title="CPU" :sub-title="`${sysInfo.cpus.core.length}核心`">
              <template slot="tags">
                <a-tag color="blue">{{ sysInfo.cpus.arch }}</a-tag>
              </template>
              <div class="model">
                <a-timeline>
                  <a-timeline-item v-for="(item, i) in sysInfo.cpus.core" :key="i">
                    <div class="cpu_layout">
                      <p class="cpu_name">
                        <a-icon type="wallet" theme="filled" />
                        <span>{{ item.name }}</span>
                      </p>
                      <p class="cpu_desc">主频: {{ item.speed }}</p>
                    </div>
                  </a-timeline-item>
                </a-timeline>
              </div>
            </a-page-header>
          </a-col>
          <a-col :span="12">
            <a-page-header title="内存和屏幕">
              <ul class="model no-top">
                <li class="list">
                  <div class="list_text">
                    <span class="list_name">内存</span>
                    <span class="list_value">{{ sysInfo.memery.free }} / {{ sysInfo.memery.total }}</span>
                  </div>
                  <a-progress :percent="100 - sysInfo.memery.percent" status="active" />
                </li>
                <li class="list">
                  <div class="list_text">
                    <span class="list_name">屏幕</span>
                  </div>
                  <ul class="list_desc">
                    <li class="list_desc-list">
                      <span class="list_desc-list_name">屏幕分辨率</span>
                      <span class="list_desc-list_value">{{ sysInfo.screen.width }} * {{ sysInfo.screen.height }}px</span>
                    </li>
                    <li class="list_desc-list">
                      <span class="list_desc-list_name">色彩深度</span>
                      <span class="list_desc-list_value">{{ sysInfo.screen.colorDepth }}bit</span>
                    </li>
                    <li class="list_desc-list">
                      <span class="list_desc-list_name">色彩空间</span>
                      <span class="list_desc-list_value">{{ sysInfo.screen.colorSpace.primaries }} / {{ sysInfo.screen.colorSpace.range }} {{ sysInfo.screen.colorSpace.matrix }} / {{ sysInfo.screen.colorSpace.transfer }}</span>
                    </li>
                    <li class="list_desc-list">
                      <span class="list_desc-list_name">触控</span>
                      <span class="list_desc-list_value">{{ sysInfo.screen.touch.label }}</span>
                    </li>
                    <li class="list_desc-list">
                      <span class="list_desc-list_name">加速器</span>
                      <span class="list_desc-list_value">{{ sysInfo.screen.accelerometer.label }}</span>
                    </li>
                  </ul>
                </li>
              </ul>
            </a-page-header>
          </a-col>
          <a-col :span="12">
            <a-page-header title="网络">
              <template slot="tags">
                <a-tag color="blue">{{ sysInfo.networks.length }}个网络适配器</a-tag>
              </template>
              <ul class="model no-top">
                <li class="list">
                  <div class="list_networks" v-for="(item, key) in sysInfo.networks" :key="key">
                    <p class="list_networks-name">{{ item.name }}</p>
                    <a-statistic v-for="(net, i) in item.interface" :key="i" :title="net.family" :value="net.address" />
                  </div>
                </li>
              </ul>
            </a-page-header>
          </a-col>
          <a-col :span="12">
            <a-page-header title="其他" :sub-title="`${sysInfo.os.type} ${sysInfo.os.version}`">
              <template slot="tags">
                <a-tag color="blue">{{ sysInfo.os.platform }}</a-tag>
              </template>
              <ul class="model no-top">
                <li class="list">
                  <div class="list_text">
                    <span class="list_name">主机名</span>
                  </div>
                  <p class="list_desc">{{ sysInfo.hostname }}</p>
                </li>
                <li class="list">
                  <div class="list_text">
                    <span class="list_name">用户</span>
                  </div>
                  <p class="list_desc">{{ sysInfo.user.username }}</p>
                </li>
                <li class="list">
                  <div class="list_text">
                    <span class="list_name">用户目录</span>
                  </div>
                  <p class="list_desc">{{ sysInfo.user.homedir }}</p>
                </li>
                <li class="list">
                  <div class="list_text">
                    <span class="list_name">临时目录</span>
                  </div>
                  <p class="list_desc">{{ sysInfo.user.tmpdir }}</p>
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