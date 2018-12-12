# Switch 开关

## 使用

json

```json
{
  "usingComponents": {
    "v-switch": "/dist/switch/index"
  }
}
```

wxml

```html
<v-switch
  disabled="{{ disabled }}"
  checked="{{ checked }}"
  loading="{{ loading }}"
  bind:change="handleChange"
></v-switch>
```

js

```js
Page({
  data: {
    disabled: false,
    checked: false,
    loading: false
  },

  methods: {
    handleChange(event, data) {
      console.log(event, data);
    }
  }
});
```

## API

properties
| 属性 | 说明 | 类型 | 默认值 | 必须 |
| :------- | :------------------ | :------ | :----- | :--- |
| loading | 是否是 loading 状态 | Boolean | false | - |
| disabled | 是否不可用 | Boolean | false | - |
| checked | 是否打开状态 | Boolean | false | 必须 |

events
| 事件名 | 说明 | 返回值 |
| :--- | :--- | :--- |
|change|绑定的值变化时触发，返回当前状态|{value}|
