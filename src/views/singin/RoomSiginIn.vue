<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
<!--				<el-form-item>-->
<!--					<el-input v-model="filters.roomName" placeholder="座位名称"></el-input>-->
<!--				</el-form-item>-->
<!--				<el-form-item>-->
<!--					<el-button type="primary" v-on:click="getClassroom">查询</el-button>-->
<!--				</el-form-item>-->
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="classrooms" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column  width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
<!--			<el-table-column prop="roomName" label="自习室名称" width="120" sortable>-->
<!--			</el-table-column>-->
      <el-table-column prop="userId"  label="预定人ID" width="120"  sortable>
      </el-table-column>
			<el-table-column prop="seatId" label="座位ID" width="200" sortable>
			</el-table-column>
      <el-table-column prop="preserveTime" label="预定时间" width="200" sortable>
      </el-table-column>
			<el-table-column prop="alive" label="预定状态" width="120" sortable>
        <template scope="scope">
          <span style="color:red"  v-if="scope.row.alive == 1">1-可签到</span>
          <span style="color:green" v-else="scope.row.alive == 2">2-不可签到</span>

        </template>
			</el-table-column>


			<!--<el-table-column prop="createTime" :formatter="formatCreateTime" label="创建时间"  sortable>-->
			<!--</el-table-column>-->

			<el-table-column label="操作" width="260">
				<template scope="scope">
					<el-button type="danger" size="small" @click="signInRoom(scope.$index, scope.row)">签到</el-button>
					<el-button type="success" size="small" @click="signOutRoom(scope.$index, scope.row,'签退')">签退</el-button>
          <el-button type="success" size="small" @click="signOutRoom(scope.$index, scope.row,'取消预约')">取消预约</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
<!--		<el-col :span="24">
			<span style="font-weight: bold">签到记录表</span>
		</el-col>-->
		<!-- 签到记录表-->
		<!--列表-->
<!--		<el-table title="签到记录表" :data="signInDatas" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">-->
<!--			<el-table-column  width="55">-->
<!--			</el-table-column>-->
<!--			<el-table-column type="index" width="60">-->
<!--			</el-table-column>-->
<!--			<el-table-column prop="classRoom.roomName" label="座位名称" width="320" sortable>-->
<!--			</el-table-column>-->


<!--			<el-table-column prop="user.username"  label="签到人"  sortable>-->
<!--			</el-table-column>-->
<!--			<el-table-column prop="signInTime" :formatter="formatSignInTime" label="签到时间"  sortable>-->
<!--			</el-table-column>-->

<!--		</el-table>-->
		<!--工具条-->
<!--		<el-col :span="24" class="toolbar">-->
<!--			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="recordTotal" style="float:right;">-->
<!--			</el-pagination>-->
<!--		</el-col>-->




	</section>
</template>

<script>
    import moment from 'moment'
	import { getSignInRoomlistPage, findRecordsListPage,hasRecordsByUseridAndRoomId} from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					roomName: ''
				},
                signInDatas:[],
                recordTotal:0,
				recordPage:1,
				classrooms: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: []
			}
		},
		methods: {
            formatSignInTime:function(row,column){
                if(row.signInTime == undefined){return ''};
                return moment(row.signInTime).format("YYYY-MM-DD HH:mm:ss")
			},
            formatBeginTime:function(row,column){
                if(row.beginTime == undefined){return ''};
                return moment(row.beginTime).format("YYYY-MM-DD HH:mm:ss")

            },
			formatEndTime:function(row,column){
                if(row.endTime == undefined){return ''};
                return moment(row.endTime).format("YYYY-MM-DD HH:mm:ss")

            },
            formatCreateTime:function(row,column){
                if(row.createTime == undefined){return ''};
                return moment(row.createTime).format("YYYY-MM-DD HH:mm:ss")

			},
			handleCurrentChange(val) {
				this.page = val;
				this.getClassroom();
			},
      //获取历史

			getClassroom() {
                let user = JSON.parse(sessionStorage.getItem("user"));
                console.log('看看user');
                console.log(user);
				let para = {
					page: this.page,
                    userid: user.id, //这个地方需要改回去
					roomName:this.filters.roomName
				};

				this.listLoading = true;
				//分页
        console.log('history');
        console.log(para);
        getSignInRoomlistPage(para).then((res) => {
          console.log(res);
          if(res.detail=="数据查询成功！"){
            this.total = res.data.length;
            this.classrooms = res.data;
            this.listLoading = false;
          }
          else{
            this.total =0;
            this.classrooms = null;
            this.listLoading = false;
          }

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
            //查看签到记录
			findRecords: function (index, row) {
				//    signInDatas:[],
               // recordTotal:0,
                //    recordPage:1,
                let para = {
                    page: this.recordPage,
                    roomId:row.id
                };
                this.listLoading = true;
                //分页
                findRecordsListPage(para).then((res) => {

                    this.recordTotal = res.total;
                    this.signInDatas = res.rows;
                    this.listLoading = false;
                });
            },
			//打卡
            signInRoom: function (index, row) {

              if(row.alive==2){
                this.$message({
                  message: '没预约，不可签到',
                  type: 'error'
                });
                return ;
              }
                let user = JSON.parse(sessionStorage.getItem("user"));
                let para = {
                    // userId: user.id,
                    id: row.id,
                  alive: 1
                };
                this.listLoading = true;
                // console.log(para);
                hasRecordsByUseridAndRoomId(para).then((res) => {
                  console.log('签到之后');
                  console.log(res);
                    this.listLoading = false;
                    // let {msg,success}=res;
                    let msg=res.detail;
                    let success=msg=="更新成功"?true:false;

                    // console.log(success);
                    if(!success) {
                        this.$message({
                            message: '已经签过到',
                            type: 'error'
                        });

                    }else{
                       //完成签到
                        this.$message({
                            message: '签过成功',
                            type: 'success'
                        });
                    }
                });
              this.getClassroom();


			},
      signOutRoom: function (index, row,str) {
        if(row.alive==2){
          this.$message({
            message: '没预约，不可'+str,
            type: 'error'
          });
          return ;
        }

        let user = JSON.parse(sessionStorage.getItem("user"));
        let para = {
          // userId: user.id,
          id: row.id,
          alive: 2
        };
        this.listLoading = true;
        console.log(para);
        hasRecordsByUseridAndRoomId(para).then((res) => {
          this.listLoading = false;

          let msg=res.detail;
          let success=msg=="更新成功"?true:false;
          if(!success) {
            this.$message({
              message: str+'失败',
              type: 'error'
            });

          }else{
            //完成签到
            this.$message({
              message: str+'成功',
              type: 'success'
            });
          }
        });
        this.getClassroom();


      },
            handleCancelEdit(index, row){

			},

			selsChange: function (sels) {
				this.sels = sels;
			}
		},
		mounted() {
			this.getClassroom();
		}
	}

</script>

<style>

	.el-dialog{
		display: flex;
		flex-direction: column;
		margin:0 !important;
		position:absolute;
		width: 500px;
		top:50%;
		left:50%;
		transform:translate(-50%,-50%);
		/*height:600px;*/
		max-height:calc(100% - 30px);
		max-width:calc(100% - 30px);
	}
	.el-dialog .el-dialog__body{
		flex:1;
		overflow: auto;
	}

</style>