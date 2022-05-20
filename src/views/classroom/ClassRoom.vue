<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.roomName" placeholder="请输入自习室名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getClassroom">查询</el-button>
				</el-form-item>

			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="classrooms" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column  width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
      <el-table-column prop="roomName" label="自习室名称" width="120" sortable>
      </el-table-column>
			<el-table-column prop="seatName" label="座位名称" width="100" sortable>
			</el-table-column>
      <el-table-column prop="positionRow" label="行" width="100" sortable>
      </el-table-column>
      <el-table-column prop="positionColumn" label="列" width="100" sortable>
      </el-table-column>
      <el-table-column prop="isNearWindow" label="是否靠窗" width="100" sortable>
        <template scope="scope">
          <span style="color:red"  v-if="scope.row.isNearWindow == 1">靠窗</span>
          <span v-else-if="scope.row.isNearWindow == 0">不靠窗</span>
        </template>
      </el-table-column>

      <el-table-column prop="hasPower" label="电源" width="100" sortable>
        <template scope="scope">
          <span style="color:red"  v-if="scope.row.hasPower == 1">有电源</span>
          <span v-else-if="scope.row.hasPower == 0">无电源</span>
        </template>
      </el-table-column>
			<el-table-column prop="status" label="座位状态" width="120" sortable>
				<template scope="scope">
					<span style="color:red"  v-if="scope.row.status == 2">1-已预约</span>
					<span style="color:green" v-else-if="scope.row.status == 1">1-可用</span>
          <span style="color:yellow" v-else-if="scope.row.status == 2">3-已签到</span>
				</template>

			</el-table-column>
<!--			<el-table-column prop="user.username" width="120" label="预约人"  sortable>-->
<!--			</el-table-column>-->
<!--			<el-table-column prop="beginTime" :formatter="formatBeginTime"  width="180" label="开始预约时间"  sortable>-->
<!--			</el-table-column>-->
<!--			<el-table-column prop="endTime" :formatter="formatEndTime" width="180" label="结束预约时间"  sortable>-->
<!--			</el-table-column>-->

			<el-table-column label="操作" width="150">
				<template scope="scope">
					<span style="color:red"  v-if="scope.row.status == 2">
<!--						<el-button style="width:100px"  :disabled=" scope.row.user.id != loginUser.id ? true:false" type="warning" size="small" @click="handleCancelEdit(scope.$index, scope.row)">取消预约</el-button>-->
            <el-button style="width:100px"  :disabled="scope.row.id != loginUser.id ? true:false" type="warning" size="small" @click="handleCancelEdit(scope.$index, scope.row)">取消预约</el-button>
					</span>
					<span v-else-if="scope.row.status == 1">
						<el-button style="width:100px"  type="warning" size="small" @click="handleEdit(scope.$index, scope.row)">预约</el-button>
					</span>
				</template>
			</el-table-column>

		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="预约" center :visible.sync="editFormVisible"   :close-on-click-modal="false">
			<el-form :model="editForm" label-width="width:300px" :rules="editFormRules" ref="editForm">
				<el-form-item label="座位名称" prop="roomName">
					<el-input disabled v-model="editForm.roomName" style="width:300px"  auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="座位ID" prop="id">
          <el-input disabled v-model="editForm.id" style="width:300px"  auto-complete="off"></el-input>
        </el-form-item>

<!--				<el-form-item label="开始时间" prop="beginTime">-->
<!--					<el-date-picker-->
<!--							v-model="editForm.beginTime"-->
<!--							type="datetime"-->
<!--							format="yyyy-MM-dd HH:mm:ss"-->
<!--							value-format="yyyy-MM-dd HH:mm:ss"-->
<!--							placeholder="选择日期时间"-->
<!--							style="width:300px">-->
<!--					</el-date-picker>-->

<!--				</el-form-item>-->
<!--				<el-form-item label="结束时间" prop="endTime">-->
<!--					<el-date-picker-->
<!--							v-model="editForm.endTime"-->
<!--							type="datetime"-->
<!--							format="yyyy-MM-dd HH:mm:ss"-->
<!--							value-format="yyyy-MM-dd HH:mm:ss"-->
<!--							placeholder="选择日期时间"-->
<!--							style="width:300px">-->
<!--					</el-date-picker>-->

<!--				</el-form-item>-->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">预约</el-button>
			</div>
		</el-dialog>


	</section>
</template>

<script>
    import moment from 'moment'
	import util from '../../common/js/util'
	import {getseatlistPageByRoomName, getClassRoomlistPage,getClassRoomlistPageByID, scheduleClassRoom, cancelClassRoom} from '../../api/api';

	export default {
		data() {
      // console.log(sessionStorage);
			return {

			    loginUser:JSON.parse(sessionStorage.getItem("user")),
        userType:0,
        userId:0,
				filters: {
					roomName: ''
				},
				classrooms: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					roomName: [
						{ required: true, message: '请输入座位名称', trigger: 'blur' }
					]
					// beginTime: [
          //               { required: true, message: '请选择开始时间!', trigger: 'blur' }
          //           ],
          //           endTime: [
          //               { required: true, message: '请选择结束时间!', trigger: 'blur' }
          //           ]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					roomName: '',
                    // beginTime: '',
                    // endTime: ''

				}



			}
		},
		methods: {
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
			//获取列表

			getClassroom() {
        let user = JSON.parse(sessionStorage.getItem("user"));
        this.userType = user.role;
        this.userId = user.id;
				let para = {
					page: this.page,
					roomName:this.filters.roomName,

				};
				this.listLoading = true;
				//分页
        console.log('教室参数');
        console.log(para);
        if(para.roomName==""){
          para.roomName='一区二楼202'; //暂时随便整一个,后面换掉
          //list
          // console.log('教室参数');
          // console.log(para);

          getseatlistPageByRoomName(para).then((res) => {

            console.log('教室返回');
            console.log(res);
            if(res.detail=="查无seat数据！"){
              this.total = 0;
              this.classrooms = null;
              this.listLoading = false;
            }
            else{
              this.total = res.data.length;
              this.classrooms = res.data;
              this.listLoading = false;
            }

          });
        }else{
          //byID
          getseatlistPageByRoomName(para).then((res) => {
            console.log('教室返回byname');
            console.log(res);

            this.total = res.data.length;

            this.classrooms = res.data;
            this.listLoading = false;
          });
        }

			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},

			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;

							let para = Object.assign({}, this.editForm);
							//预约人
							let user = JSON.parse(sessionStorage.getItem("user"));
							let params = {
							    userid: user.id,
                  seatid: para.id
							}

                            scheduleClassRoom(params).then((res) => {
                              console.log('okokok');
                              console.log(res);
								this.editLoading = false;
								let {msg,success}=res;
								if(success) {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
                                    this.getClassroom();
                                }else{
                                    this.$message({
                                        message: '操作失败',
                                        type: 'error'
                                    });
								}
							});
						});
					}
				});
			},
            handleCancelEdit(index, row){

                this.$confirm('确认取消预约吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;

                    let para = { id: row.id };
                    cancelClassRoom(para).then((res) => {
                        this.listLoading = false;
                        let {msg,success}=res;
                        if(success) {
                            this.$message({
                                message: '取消成功',
                                type: 'success'
                            });
                            this.getClassroom();
                        }else{
                            this.$message({
                                message: '取消失败',
                                type: 'error'
                            });
                        }
                    });
                }).catch(() => {

                });


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