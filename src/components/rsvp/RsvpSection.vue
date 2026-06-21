<template>

<section class="section">

<v-container>

<div class="section-header">

<div class="sub-title">

RSVP

</div>

<h2>

Xác Nhận Tham Dự

</h2>

</div>

<v-form>

<v-text-field
label="Họ tên"
/>

<v-text-field
label="Số điện thoại"
/>

<v-select

label="Số lượng"

:items="[1,2,3,4,5]"

/>

<v-textarea
label="Lời chúc"
/>

<v-btn
color="pink"
size="large"
block
>

Xác Nhận

</v-btn>

</v-form>

</v-container>

</section>

</template>

<style scoped>
.section{
padding:100px 0;
background:#fff7f7;
}
.section-header{
text-align:center;
margin-bottom:60px;
}
.sub-title{
color:#d88a9c;
letter-spacing:4px;
}
</style>