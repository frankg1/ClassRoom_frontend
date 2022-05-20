<template>
    <section class="chart-container">
        <el-row>
            <el-col :span="24">
                <!--<div id="chartColumn" style="width:100%; height:600px;">-->
                    <!--<img :src="bgImg" width="1500px" height="700px"/>-->
                <!--</div>-->
                <div class="el-row--flex is-justify-center is-align-middle"
                     style="margin-top:2px;font-size:80px;color:#a4ccb2">
                    <img :src='imgUrl' alt=''>
                </div>
            </el-col>

        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'

    export default {
        data() {
            return {
                bgImg:'',
                imgUrl:require('../../static/img/lctree.png')
            }
        },

        methods: {

        },

        mounted: function () {
            //this.bgImg =  require('../assets/bg2.jpg');
        },
        updated: function () {

        }
    }
</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 30px 20px;
    }
</style>
