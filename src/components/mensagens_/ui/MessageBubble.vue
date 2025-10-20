<template>
  <div class="message-wrapper" :class="isOutgoing ? 'outgoing' : 'incoming'">
    <div class="message-bubble" :class="bubbleClass">
      <div v-html="message.body"></div>
      <p class="message-timestamp" :class="isOutgoing ? 'text-right' : 'text-left'">
        {{ formatDate(message.date_created) }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { formatDate } from '../utils/helpers';

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  isOutgoing: {
    type: Boolean,
    default: false
  }
});

const bubbleClass = computed(() => props.isOutgoing ? 'outgoing-bubble' : 'incoming-bubble');
</script>

<style scoped>
.message-wrapper {
  display: flex;
  margin-bottom: 1rem;
}

.message-wrapper.outgoing {
  justify-content: flex-end;
}

.message-wrapper.incoming {
  justify-content: flex-start;
}

.message-bubble {
  border-radius: 12px;
  padding: 0.8rem 1rem;
  max-width: 70%;
  word-break: break-word;
}

.outgoing-bubble {
  background-color: #e6f7ff;
  color: #0d1f3f;
}

.incoming-bubble {
  background-color: #f0f2f5;
  color: #242424;
}

.message-timestamp {
  margin-top: 0.25rem;
  font-size: 0.7rem;
  color: #999;
}

.text-right {
  text-align: right;
}

.text-left {
  text-align: left;
}
</style>
