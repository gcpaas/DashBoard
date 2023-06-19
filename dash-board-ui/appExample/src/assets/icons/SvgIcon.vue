<!--
 * @Descripttion:
 * @Author: liu.shiyi
 * @Date: 2022-10-14 14:20:28
 * @LastEditTime: 2023-06-05 16:15:14
-->
<template>
    <svg :class="svgClass" aria-hidden="true">
      <use :xlink:href="iconName" />
    </svg>
  </template>
  
  <script>
  export default {
    name: 'SvgIcon',
    props: {
      name: {
        type: String,
        required: true
      },
      className: {
        type: String,
        default: ''
      }
    },
    computed: {
      iconName() {
        return `#icon-${this.name}`
      },
      svgClass() {
        if (this.className) {
          return 'svg-icon ' + this.className
        } else {
          return 'svg-icon'
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  </style>
  