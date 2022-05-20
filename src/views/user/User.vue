<template>
	<section>
		<!--工具条-->
<!--		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">-->
<!--			<el-form :inline="true" :model="filters">-->
<!--				<el-form-item label="姓名">-->
<!--					<el-input v-model="filters.username" placeholder="姓名"></el-input>-->
<!--				</el-form-item>-->
<!--				<el-form-item>-->
<!--					<el-button type="primary" v-on:click="getUsersByname">查询</el-button>-->
<!--				</el-form-item>-->
<!--				<el-form-item>-->
<!--					<el-button v-if="loginUser.role == 1" type="primary" v-on:click="deleteBatch">批量删除</el-button>-->
<!--				</el-form-item>-->

<!--			</el-form>-->
<!--		</el-col>-->

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="50">
			</el-table-column>
			<el-table-column prop="username" label="姓名" width="120" sortable>
			</el-table-column>
			<el-table-column prop="email" label="邮箱" width="260" sortable>
			</el-table-column>
			<el-table-column prop="phoneNum" label="电话" width="220" sortable>
			</el-table-column>
			<el-table-column prop="stuNo" label="学号" width="220" sortable>
			</el-table-column>

<!--      <el-table-column prop="createTime"  :formatter="formatCreateTime" label="创建时间" width="220" sortable>-->
<!--			</el-table-column>-->

			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button v-if="loginUser.role == 1 && scope.row.username != 'admin'" type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">

			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible"  :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
<!--				<el-form-item label="用户名" prop="username">-->
<!--					<el-input v-model="editForm.username" auto-complete="off"></el-input>-->
<!--				</el-form-item>-->
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editForm.email" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="tel">
					<el-input v-model="editForm.phoneNum" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>


	</section>
</template>

<script>
    import moment from 'moment'
	import util from '../../common/js/util'
	import { getUserListPage,getUserListPageByID, removeUser, batchRemoveUser, editUser, addUser,getUserBynamelist } from '../../api/api';

	export default {
		data() {
      // console.log('login user');
      // console.log(JSON.parse(sessionStorage.getItem("user")));
      // let user=JSON.parse(sessionStorage.getItem("user"));

			return {
			    loginUser:JSON.parse(sessionStorage.getItem("user")),
				filters: {
					username: '',
          minStunum:'',
          maxStunum:''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					username: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					stunum:'',
					username: '',
          email: '',
          tel: ''

				}



			}
		},
		methods: {
		    //批量删除
            deleteBatch:function(){
                var ids = this.sels.map(item => item.id).toString();

                if(this.sels.length == 0){
                    this.$message({
                        message: '请选择记录删除',
                        type: 'error'
                    });
				}else{
                    this.$confirm('确认删除选中记录吗？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        this.listLoading = true;
                         let para= {ids:ids}
                        batchRemoveUser(para).then((res) => {
                            this.listLoading = false;
                            let {msg,success}=res;
                            if(success) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                this.getUsers();
                            }else{
                                this.$message({
                                    message: '删除失败',
                                    type: 'error'
                                });
                            }
                        });
                    }).catch(() => {

                    });
				}


			},
            formatCreateTime:function(row,column){
                if(row.createTime == undefined){return ''};
                return moment(row.createTime).format("YYYY-MM-DD HH:mm:ss")

			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
      //先看用户类型

			getUsers() {
        let user=JSON.parse(sessionStorage.getItem("user"));
        // console.log(user);
        let role=user.role;
        let userId=user.id;
        let userName=user.username;
				let para = {
					username:userName,
          userId:userId
				};
				this.listLoading = true;
        console.log('传入参数');
        console.log(para);
        if(role==1){
          //管理员
          getUserListPage(null).then((res) => {
            console.log('getuserlistpage: ')
            console.log(res);
            this.total = res.data.total;
            this.users = res.data.records;
            this.listLoading = false;
          });
        }else{
          //只查自己
          getUserListPageByID(para).then((res) => {
            console.log('getuserlistpage name: ')
            console.log(res);
            this.total = 1;
            this.users = [res.data];
            this.listLoading = false;
          });
        }
				//分页

			},

      // //获取用户列表
      // getUsersByname() {
      //   let para = {
      //     username:this.filters.username
      //   };
      //   this.listLoading = true;
      //   console.log('传入参数');
      //   console.log(para);
      //   //分页
      //   getUserBynamelist(para).then((res) => {
      //     console.log('查询返回数据: ')
      //     console.log(res);
      //     this.total = 10;
      //     this.users = [res.data.records];
      //     this.listLoading = false;
      //   });
      // },
            selsChange: function (sels) {
              // console.log(selsc);
                this.sels = sels;
            },
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
            console.log('删除用户');
            console.log(res);
            let msg=res.detail;
            let success= msg=='删除成功'?true: false;


						this.listLoading = false;

                        if(success) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getUsers();
                        }else{
                            this.$message({
                                message: '删除失败',
                                type: 'error'
                            });
						}
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
        // console.log(scope);
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},

			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							editUser(para).then((res) => {
                console.log(res);
								this.editLoading = false;
                let msg=res.detail;
                let success;
                if(msg=='更新成功'){
                  success=true;
                }else{
                  success=false;
                }


								if(success) {
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
                                    this.getUsers();
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

			selsChange: function (sels) {
				this.sels = sels;
			}
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>