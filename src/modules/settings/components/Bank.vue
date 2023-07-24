<template>
  <li v-for="bank in banks" :key="bank.id">
    <div class="flex items-center">
      <div class="flex-1 w-64">
        <b>Bank Name</b>: {{ bank.bank_name }}<br />
        <b>Last4 Digits</b>: {{ bank.last4 }}<br />
        <div v-if="bank.account_holder_name">
          <b>Account Holder</b>: {{ bank.account_holder_name }}
        </div>
        <p v-if="loading">Checkinng...</p>
        <p v-if="loading"><b>Status </b>: {{ status }}</p>
        <br />
      </div>
      <p @click="handDelete" class="text-info cursor-pointer text-red text-lg">
        Delete
      </p>
    </div>
  </li>
</template>
<script setup>
const  props = defineProps(["banks","loading","status"]);

</script>