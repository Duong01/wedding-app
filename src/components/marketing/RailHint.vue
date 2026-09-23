<template>
  <p class="mk-rail-hint">
    {{ text }}
    <span aria-hidden="true">→</span>
  </p>
</template>

<script setup>
/*
 * Nhắc rằng dải thẻ bên dưới còn nội dung phía sau.
 *
 * Trên điện thoại, các danh sách 3–4 thẻ được duỗi thành dải
 * trượt ngang (xem .mk-rail trong marketing.css). Thẻ kế tiếp
 * ló ra ở mép phải là gợi ý trực quan, nhưng không phải ai cũng
 * nhận ra — thêm một dòng chữ nhỏ cho chắc.
 *
 * Trên tablet/desktop dải trở về lưới nhiều cột nên dòng này
 * tự ẩn (CSS quyết định, không cần JS).
 */
defineProps({
  text: {
    type: String,
    default: "Vuốt ngang để xem thêm",
  },
});
</script>
