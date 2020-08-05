<template>
  <div class="railway">
    <div class="filter">
      <a-form-model :model="filter" layout="inline">
        <a-form-model-item label="出发地">
          <a-input v-model="filter.from" placeholder="请选择出发地" />
        </a-form-model-item>
        <a-form-model-item label="到达地">
          <a-input v-model="filter.to" placeholder="请选择到达地" />
        </a-form-model-item>
        <a-form-model-item label="出发时间">
          <a-date-picker
            v-model="filter.date"
            :disabledDate="disabledDate"
            :locale="locale"
            :allowClear="false"
            format="YYYY-MM-DD"
            placeholder="请选择出发时间"
          />
        </a-form-model-item>
      </a-form-model>
    </div>
    <!-- <vue-scroll>
      
    </vue-scroll> -->
  </div>
</template>

<script src="./index.ts"></script>

<style lang="scss">
  @import './index.scss';
</style>