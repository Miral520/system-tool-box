<template>
  <div class="home">
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
  </div>
</template>

<script src="./index.ts"></script>

<style lang="scss">
  @import './index.scss';
</style>