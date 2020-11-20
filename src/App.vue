<template>
  <div id="app">
    <Card style="margin-bottom: 20px">
      <Row :gutter="16" type="flex" justify="start">
        <Col span="6">
          当前TOKEN
          <b style="color: #2d8cf0">
            {{ nowToken }}
          </b>
        </Col>
        <Col span="6">
          <Input v-model="token" placeholder="设置token" />
        </Col>
        <Col span="6">
          <Button type="primary" long @click="setToken">保存</Button>
        </Col>
        <Col span="6">
          <Button type="success" long @click="addPersonModal = true">添加人员</Button>
        </Col>
      </Row>
    </Card>
    <Card style="margin-bottom: 20px">
      <Row :gutter="16" type="flex" justify="space-between">
        <Col span="6">
          <!-- <Input v-model="bugForm.submit" placeholder="提交者" /> -->
          <Select filterable v-model="bugForm.submit" placeholder="提交者" clearable>
            <Option v-for="(item, index) in personList" :value="item.name" :key="index">{{ item.name }}</Option>
          </Select>
        </Col>
        <Col span="6">
          <Select filterable v-model="bugForm.receive" placeholder="接收者" clearable>
            <Option v-for="(item, index) in personList" :value="item.name" :key="index">{{ item.name }}</Option>
          </Select>
          <!-- <Input v-model="bugForm.receive" placeholder="接收者" /> -->
        </Col>
        <Col span="6">
          <Input v-model="bugForm.content" placeholder="提交内容" />
        </Col>

        <Col span="6">
          <Button type="primary" long @click="postBug">提交</Button>
        </Col>
      </Row>
    </Card>
    <Card>
      <Row style="margin-bottom: 20px" :gutter="16" type="flex" justify="start">
        <Col span="6">
          <!-- <Input v-model="query.submit" placeholder="提交者" /> -->
          <Select filterable v-model="query.submit" placeholder="提交者" clearable>
            <Option v-for="(item, index) in personList" :value="item.name" :key="index">{{ item.name }}</Option>
          </Select>
        </Col>
        <Col span="6">
          <!-- <Input v-model="query.receive" placeholder="接收者" /> -->
          <Select filterable v-model="query.receive" placeholder="接收者" clearable>
            <Option v-for="(item, index) in personList" :value="item.name" :key="index">{{ item.name }}</Option>
          </Select>
        </Col>
        <Col span="6">
          <Select v-model="query.status" clearable @on-change="getBugList">
            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.text }}</Option>
          </Select>
        </Col>
        <Col span="6">
          <Button type="info" long @click="getBugList">搜索</Button>
        </Col>
      </Row>
      <Table border :columns="tableColumns" :data="bugList">
        <template slot-scope="{ row, index }" slot="status">
          <Tag :color="row.status | statusColorFilter">{{ row.status | statusTextFilter }}</Tag>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button
            v-for="item in statusList"
            :key="item.value"
            :type="item.color"
            ghost
            size="small"
            style="margin-right: 5px"
            @click="changeStatusClick(row, item.value)"
            >{{ item.text }}</Button
          >
        </template>
      </Table>
    </Card>
    <Modal title="添加人员" v-model="addPersonModal" width="360" @on-ok="addPersonOkClick" @on-cancel="addPersonCancelClick">
      <Row :gutter="16" type="flex" justify="space-between">
        <Col span="24">
          <Input v-model="personForm.abbreviation" placeholder="缩写" />
        </Col>
      </Row>
      <br />
      <Row :gutter="16" type="flex" justify="space-between">
        <Col span="24">
          <Input v-model="personForm.name" placeholder="名字" />
        </Col>
      </Row>
      <br />
    </Modal>
  </div>
</template>

<script>
import { getBugList, postBug, putBug } from '@/api/bug.js';
import { getPersonList, postPerson } from '@/api/person.js';

const statusMap = {
  1: {
    value: '1',
    text: '未修改',
    color: 'warning',
  },
  2: {
    value: '2',
    text: '已修改',
    color: 'primary',
  },
  3: {
    value: '3',
    text: '确认完成',
    color: 'success',
  },
  4: {
    value: '4',
    text: '驳回',
    color: 'error',
  },
};

export default {
  name: 'app',
  filters: {
    statusTextFilter(key) {
      return statusMap[key].text;
    },
    statusColorFilter(key) {
      return statusMap[key].color;
    },
  },
  data() {
    return {
      query: {
        submit: undefined,
        receive: undefined,
      },
      bugForm: {
        submit: undefined,
        receive: undefined,
        content: undefined,
      },
      personForm: {
        abbreviation: undefined,
        name: undefined,
      },
      nowToken: '',
      token: '',
      addPersonModal: false,
      bug: {},
      bugList: [],
      personList: [],
      statusList: Object.values(statusMap),
      tableColumns: [
        {
          title: '提交者',
          key: 'submit',
          width: 80,
          align: 'center',
        },
        {
          title: '接收者',
          key: 'receive',
          width: 80,
          align: 'center',
        },
        {
          title: '提交内容',
          key: 'content',
          align: 'center',
          minWidth: 400,
        },
        {
          title: '操作者',
          key: 'token',
          width: 80,
          align: 'center',
        },
        {
          title: '提交时间',
          key: 'createTime',
          width: 170,
          align: 'center',
        },
        {
          title: '更新时间',
          key: 'updateTime',
          width: 170,
          align: 'center',
        },
        {
          title: '状态',
          slot: 'status',
          width: 120,
          align: 'center',
        },
        {
          title: '操作',
          slot: 'action',
          width: Object.values(statusMap).length * 80,
          align: 'center',
        },
      ],
    };
  },
  methods: {
    setToken() {
      localStorage.setItem('token', this.token);
      this.nowToken = this.token;
    },
    getBugList() {
      const params = {
        ...this.query,
        token: this.token,
      };
      getBugList(params).then((res) => {
        const data = res.data;
        this.bugList = data.list;
      });
    },
    getPersonList() {
      const params = {
        ...this.query,
        token: this.token,
      };
      getPersonList(params).then((res) => {
        const data = res.data;
        this.personList = data.list;
      });
    },
    postBug() {
      const params = {
        ...this.bugForm,
        token: this.token,
      };
      postBug(params).then((res) => {
        const data = res.data;
        this.getBugList();
        this.bugForm.content = undefined;
        this.$Message.success('提交成功');
      });
    },
    postPerson() {
      const params = {
        ...this.personForm,
        token: this.token,
      };
      postPerson(params).then((res) => {
        const data = res.data;
        this.getPersonList();
        this.addPersonCancelClick();
      });
    },
    putBug() {
      const params = {
        ...this.bug,
        token: this.token,
      };
      putBug(params).then((res) => {
        const data = res.data;
        this.getBugList();
        this.addPersonCancelClick();
        this.$Message.success('修改成功');
      });
    },
    changeStatusClick(row, status) {
      row.status = status;
      this.bug = row;
      this.putBug();
    },
    addPersonOkClick() {
      this.postPerson();
    },
    addPersonCancelClick() {
      this.personForm = {
        abbreviation: undefined,
        name: undefined,
      };
    },
  },
  created() {
    this.nowToken = localStorage.getItem('token');
    this.token = localStorage.getItem('token');
    this.getBugList();
    this.getPersonList();
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 20px;
}
</style>
