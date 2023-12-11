<template>
    <div class="sidebar">
      <h2>Sidebar</h2>
      <ul>
        <li v-for="(item, index) in sidebarItems" :key="index">{{ item }}</li>
      </ul>
      <button>Fixed Button</button>
    </div>
  </template>
  
  <script>
  name: "Sidevar";
  export default {
    data() {
      return {
        sidebarItems: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6']
      };
    }
  };
  </script>
  
  <style scoped>
    .sidebar {
      height: 100vh;
      width: 250px;
      background-color: #333;
      position: fixed;
      top: 0;
      left: 0;
      color: white;
      padding: 20px;
      box-sizing: border-box;
    }
  
    .sidebar h2 {
      margin-top: 0;
    }
  
    .sidebar ul {
      list-style-type: none;
      padding: 0;
    }
  
    .sidebar li {
      margin-bottom: 10px;
    }
  
    .sidebar button {
      width: 100%;
      background-color: #f44336;
      color: white;
      padding: 10px;
      border: none;
      cursor: pointer;
      font-size: 16px;
      position: absolute;
      bottom: 0;
    }
  </style>
  