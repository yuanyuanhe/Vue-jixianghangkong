<template>
    <div class="carousel" v-cloak>
        <div class="title">尊享头等舱礼遇</div>
        <swiper :options="swiperOption">
            <swiper-slide v-for="(str, index) in listImg" :key="index"><img :src="str.url" alt=""></swiper-slide>
            <div class="swiper-pagination"  slot="pagination"></div>
        </swiper>
    </div>  
</template>

<script>
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import 'swiper/dist/css/swiper.css' //这里注意具体看使用的版本是否需要引入样式，以及具体位置。

    export default {
        props: ['listImg'],
        data() {
            return {
                swiperOption: {
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'fraction',
                        paginationClickable: true,
                    },
                    loop: true,
                    speed: 600,
                    onTouchEnd: function() {
                        swiper.startAutoplay()
                    }
                }
            }
        },
        components: {
            swiper,
            swiperSlide
        }
    }
</script>

<style lang="scss">
    @import '~common/styles/common/function.scss';
    .carousel {
        .title{
            height: rem(138);
            line-height: rem(138);
            font-size: rem(42);
            font-weight: bold;
            color: #25292F;
            text-align: center;
        }
    }
    .carousel {
        overflow: hidden;
        .swiper-container {
            width: 100%;
            height: rem(440);
            overflow: visible;
            .swiper-wrapper {
                width: 100%;
                height: 100%;
            }
            .swiper-slide {
                background-position: center;
                background-size: cover;
                width: 100%;
                height: 100%;
                padding: 0 rem(20);
                box-sizing: border-box;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .swiper-pagination-fraction {
                color: #CFD2DA;
                font-size: rem(24);
                width: auto;
                right: rem(30);
                left: auto;
                bottom: auto;
                top: rem(-66);
                .swiper-pagination-current {
                    color: #25292F;
                    font-size: rem(32);
                }
            }
        }
    }
</style>
