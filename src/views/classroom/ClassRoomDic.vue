<template>
	<section>
		<!-- 座位列表-->
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.roomName" placeholder="自习室名称,暂无查询接口"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  v-on:click="getClassroom">查询</el-button>
				</el-form-item>
				<el-form-item v-if="userType==1">
					<el-button type="primary" v-on:click="addClassroom">新增</el-button>
				</el-form-item>

			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="classrooms" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
      <el-table-column prop="id" label="自习室ID" width="120" sortable>
      </el-table-column>
      <el-table-column prop="roomName" label="自习室名称" width="120" sortable>
      </el-table-column>
      <el-table-column prop="openTime" label="开放时间" width="120" sortable>
      </el-table-column>
			<el-table-column prop="closeTime" label="关闭时间" width="120" sortable>
			</el-table-column>
			<el-table-column prop="roomRow" label="roomRow" width="300" sortable>
			</el-table-column>




			<el-table-column label="操作" width="150" v-if="userType==1">
				<template scope="scope">

					<el-button size="small" @click="handleEditRoom(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDelRoom(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="新增座位" center :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="自习室名" prop="roomName">
					<el-input v-model="addForm.roomName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="开放时间" prop="openTime">
					<el-input v-model="addForm.openTime" auto-complete="off"></el-input>

				</el-form-item>
        <el-form-item label="关闭时间" prop="closeTime">
          <el-input v-model="addForm.closeTime" auto-complete="off"></el-input>
        </el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addRoomSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="编辑自习室" :visible.sync="editFormVisible"  :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="自习室名" prop="roomName">
					<el-input v-model="editForm.roomName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="开放时间" prop="openTime">
					<el-input v-model="editForm.openTime" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="关闭时间" prop="closeTime">
          <el-input v-model="editForm.closeTime" auto-complete="off"></el-input>
        </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editRoomSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>


	</section>
</template>

<script>
    import moment from 'moment'
	import util from '../../common/js/util'
	import { getClassRoomlistPage, getClassRoomlistPageByname,addRoom,editRoom,removeRoom} from '../../api/api';

	export default {
		data() {
			return {
			    userType:0,
				filters: {
					roomName: ''
				},
				classrooms: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    roomName: [
                        { required: true, message: '请输入座位名称', trigger: 'blur' }
                    ],
                    openTime: [
                        { required: true, message: '请输入开放时间', trigger: 'blur' }
                    ],
                  closeTime: [
                    { required: true, message: '请输入关闭时间', trigger: 'blur' }
                  ]
                },
                //新增界面数据
                addForm: {
                    roomName: '',
                    openTime:'',
                  closeTime:''

                },


                editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					roomName: [
						{ required: true, message: '请输入座位名称', trigger: 'blur' }
					],
					sopenTime: [
            { required: true, message: '请输入开放时间', trigger: 'blur' }
          ],
          closeTime: [
            { required: true, message: '请输入关闭时间', trigger: 'blur' }
          ]
				},
				//编辑界面数据
				editForm: {
					id: 0,
          roomName: '',
          openTime:'',
          closeTime:''
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
			//获取自习室列表
			getClassroom() {

                let user = JSON.parse(sessionStorage.getItem("user"));
                this.userType = user.role;
				let para = {
					page: this.page,
					roomName:this.filters.roomName
				};
				this.listLoading = true;
				//分页
        // console.log('自习室参数');
        // console.log(para);
        if(para.roomName==""){
          //调用List
          getClassRoomlistPage(para).then((res) => {
            console.log('教室返回');
            console.log(res);

            this.total = res.data.length;
            this.classrooms = res.data;
            this.listLoading = false;
          });
        }else{
          //调用byname
          getClassRoomlistPageByname(para).then((res) => {
            console.log('教室返回');
            console.log(res);

            this.total = res.data.length;
            this.classrooms = res.data;
            this.listLoading = false;
          });
        }

			},
			//新增座位
            addClassroom(){
                this.addFormVisible = true;
			},
			//显示编辑界面
            handleEditRoom: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
            addRoomSubmit:function(){
                    this.$refs.addForm.validate((valid) => {
                        //校验表单成功后才做一下操作
                        if (valid) {
                            this.$confirm('确认新增座位吗？', '提示', {}).then(() => {
                                //拷贝后面对象的值到新对象,防止后面代码改动引起模型变化
                                let para = Object.assign({}, this.addForm);
                                console.log('新增自习室操作');
                                console.log(para);
                                addRoom(para).then(data => {
                                  console.log("add back");
                                  console.log(data);
                                    this.addFormVisible =false;
                                    // let { msg, success } = data;
                                    let msg=data.detail;
                                    let success= msg=="插入成功"?true:false;
                                    if(success){
                                        this.$message({
                                            message: '新增成功!',
                                            type: 'success'
                                        });
                                        //重置表单
                                        this.$refs['addForm'].resetFields();
                                       this.getClassroom();
                                    }
                                    else{
                                        this.$message({
                                            message: msg,
                                            type: 'error'
                                        });
                                    }
                                });
                            });
                        }
                    })

			},
			//编辑
            editRoomSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;

							let para = Object.assign({}, this.editForm);

                            editRoom(para).then((res) => {
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

            //删除
            handleDelRoom: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { id: row.id };
                    removeRoom(para).then((res) => {
                        this.listLoading = false;
                        let {msg,success}=res;
                        msg="不可删除！";
                      success=false;
                        if(success) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getClassroom();
                        }else{
                            this.$message({
                                message: '不可删除',
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