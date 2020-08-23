<template>
  <div class="home">
    <vue-scroll :ops="ops">
      <div class="home_statistic">
        <p class="home_title">
          <span>天气预报</span>
          <span class="run">累计运行 <b>{{ runTime }}</b> 次</span>
        </p>
        <div class="home_main">
          <a-collapse class="home_weather" :bordered="false" expandIconPosition="right" v-model="weather.show" accordion>
            <a-collapse-panel class="home_weather-item" key="next">
              <div slot="header" class="weather_header">
                <div class="weather_header-top">
                  <p class="weather_header-city">{{ position.city }} · {{ position.province }} · {{ position.nation }}</p>
                  <p class="weather_header-handle">{{ weather.show ? '收起详情' : '五日预报' }}</p>
                </div>
                <div class="weather_header-today">
                  <div class="weather_header-today-info">
                    <p class="weather_header-today-deg">{{ weather.today.temp }}</p>
                    <img class="weather_header-today-icon" :src="require(`assets/img/weather/${weather.today.type}${weather.today.point}.png`)" :alt="weather.today.type">
                    <span class="weather_header-today-label">{{ weather.today.type }}</span>
                  </div>
                  <div class="weather_header-today-other">
                    <a-tag color="blue">{{ today }}</a-tag>
                    <div class="weather_header-today-wind">
                      <span>风力</span>
                      <span>{{ weather.today.wind }}</span>
                    </div>
                    <p class="weather_header-today-yes">昨日 {{ weather.yest.type }} {{ weather.yest.temp }}</p>
                  </div>
                </div>
                <p class="weather_header-tip">{{ weather.today.tip }}</p>
              </div>
              <div class="weather_next">
                <a-table :showHeader="false" :pagination="false" :columns="weather.next.columns" :data-source="weather.next.data">
                  <div class="weather_next-type" slot="type" slot-scope="type">
                    <img :src="require(`assets/img/weather/${type}.png`)" :alt="type">
                    <span>{{ type }}</span>
                  </div>
                </a-table>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </div>
      <div class="home_statistic" v-if="sysInfo">
        <p class="home_title">系统状况</p>
        <a-row :gutter="5" type="flex">
          <a-col :span="24">
            <a-page-header title="存储" :sub-title="diskDrive.show ? `${diskDrive.data.length}个物理磁盘` : ''">
              <template slot="tags">
                <a-tag color="blue">{{ logicDrive.length }}个逻辑分区</a-tag>
              </template>
              <ul class="model">
                <li class="list">
                  <div class="list_text">
                    <span class="list_name">内存</span>
                    <span class="list_value">{{ sysInfo.memery.free }} / {{ sysInfo.memery.total }}</span>
                  </div>
                  <a-progress :percent="100 - sysInfo.memery.percent" status="active" />
                </li>
                <li class="list" v-if="diskDrive.show">
                  <div class="list_text">
                    <span class="list_name">硬盘</span>
                  </div>
                  <ul class="list_desc">
                    <li class="list_desc-list" v-for="(item, i) in diskDrive.data" :key="i">
                      <span class="list_desc-list_name">{{ item.name }} / {{ item.interface }}</span>
                      <span class="list_desc-list_value">{{ item.size }}</span>
                    </li>
                  </ul>
                </li>
                <li class="list">
                  <div class="list_text">
                    <span class="list_name">分区</span>
                  </div>
                  <div class="list_desc">
                    <a-row :gutter="15" type="flex">
                      <a-col :span="8" v-for="(item, i) in logicDrive" :key="i">
                        <a-card style="width: 100%; border-radius: 5px; margin-bottom: 15px;" hoverable>
                          <div class="disk_layout">
                            <div class="disk-text" :title="item.name">
                              <p class="disk_name">{{ item.name }}</p>
                              <a-tag color="blue" class="disk_filesystem" v-if="item.fileSystem !== '未知'">{{ item.fileSystem }}</a-tag>
                              <p class="disk_space">{{ item.free }} / {{ item.total }}</p>
                            </div>
                            <div class="disk-chart">
                              <a-progress type="circle" :percent="100 - item.percent" :width="100" :strokeWidth="7" />
                            </div>
                          </div>
                        </a-card>
                      </a-col>
                    </a-row>
                  </div>
                </li>
              </ul>
            </a-page-header>
          </a-col>
          <a-col :span="12">
            <a-page-header title="系统和用户" :sub-title="`${ sysInfo.os.type } ${ sysInfo.os.version }`">
              <template slot="tags">
                <a-tag color="blue">{{ sysInfo.os.platform }}</a-tag>
              </template>
              <ul class="model">
                <li class="list">
                  <div class="list_text">
                    <span class="list_name">系统正常运行时间</span>
                  </div>
                  <p class="list_desc">{{ sysInfo.user.uptime }}</p>
                </li>
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
          <a-col :span="12">
            <a-page-header title="屏幕">
              <ul class="model">
                <li class="list">
                  <div class="list_text">
                    <span class="list_name">屏幕分辨率</span>
                  </div>
                  <p class="list_desc">{{ sysInfo.screen.width }} * {{ sysInfo.screen.height }}px</p>
                </li>
                <li class="list">
                  <div class="list_text">
                    <span class="list_name">色彩深度</span>
                  </div>
                  <p class="list_desc">{{ sysInfo.screen.colorDepth }}bit</p>
                </li>
                <li class="list">
                  <div class="list_text">
                    <span class="list_name">色彩空间</span>
                  </div>
                  <p class="list_desc">{{ sysInfo.screen.colorSpace.primaries }} / {{ sysInfo.screen.colorSpace.range }} {{ sysInfo.screen.colorSpace.matrix }} / {{ sysInfo.screen.colorSpace.transfer }}</p>
                </li>
                <li class="list">
                  <div class="list_text">
                    <span class="list_name">触控</span>
                  </div>
                  <p class="list_desc">{{ sysInfo.screen.touch.label }}</p>
                </li>
                <li class="list">
                  <div class="list_text">
                    <span class="list_name">加速器</span>
                  </div>
                  <p class="list_desc">{{ sysInfo.screen.accelerometer.label }}</p>
                </li>
              </ul>
            </a-page-header>
          </a-col>
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
            <a-page-header title="网络">
              <template slot="tags">
                <a-tag color="blue">{{ sysInfo.networks.length }}个网络适配器</a-tag>
              </template>
              <ul class="model">
                <li class="list less_margin">
                  <div class="list_networks">
                    <a-statistic title="IP" :value="ip" />
                  </div>
                </li>
                <li class="list">
                  <div class="list_networks" v-for="(item, key) in sysInfo.networks" :key="key">
                    <p class="list_networks-name">{{ item.name }}</p>
                    <a-statistic v-for="(net, i) in item.interface" :key="i" :title="net.family" :value="net.address" />
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