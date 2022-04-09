<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i> 文章管理
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<!-- <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button> -->
				<el-input v-model="query.title" placeholder="标题" class="handle-input mr10"></el-input>
				<el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
				<!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
				<el-table-column prop="title" label="标题" width="280" align="center"></el-table-column>
				<el-table-column prop="username" label="作者" width="180" align="center"></el-table-column>
				<el-table-column label="标签" align="center"><template #default="scope"><el-tag  v-for="(tag,index) in scope.row.tag" :key='index' style="margin:5px 10px;">{{tag}}</el-tag></template></el-table-column>
				<el-table-column prop="createTIME" label="创建时间" align="center"></el-table-column>
				<el-table-column prop="updateTIME" label="更新时间" align="center"></el-table-column>
				<el-table-column label="操作" width="180" align="center">
					<template #default="scope">
						<!-- <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
						<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex" :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" v-model="editVisible" width="30%">
			<el-form ref="form" :model="form" label-width="70px">
				<el-form-item label="手机号">
					<el-input v-model="form.phone"></el-input>
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input v-model="form.email"></el-input>
				</el-form-item>
				<el-form-item label="头像">
					<el-image style="width: 100px; height: 100px" :src="form.avatar" >
					</el-image>
					<el-button size="mini" type="danger" plain round  v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="插入中,请稍候">选择头像</el-button>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
	import {
		getart,
		delart
	} from "../api/index";
	export default {
		name: "basetable1",
		data() {
			return {
				query: {
					title: "",
					pageIndex: 1,
					pageSize: 500
				},
				tableData: [],
				multipleSelection: [],
				delList: [],
				editVisible: false,
				pageTotal: 0,
				form: {},
				idx: -1,
				id: -1
			};
		},
		created() {
			this.getData();
		},
		methods: {
			getData() {
				// fetchData(this.query).then(res => {
				getart(this.query).then(res => {
					console.log(res);
					this.tableData = res.list;
					this.pageTotal = res.count;
				});
			},
			// 触发搜索按钮
			handleSearch() {
				// this.$set(this.query, "pageIndex", 1);
				this.getData();
			},
			// 删除操作
			handleDelete(index, row) {
				console.log(index)
				console.log(row)
				// 二次确认删除
				this.$confirm("确定要删除吗？", "提示", {
						type: "warning"
					})
					.then(() => {
						delart({
							ID: row.ID
						}).then(res => {
							console.log(res)
							console.log(row.ID)
						})
						this.$message.success("删除成功");
						this.tableData.splice(index, 1);
					})
					.catch(() => {});
			},
			// 多选操作
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			delAllSelection() {
				const length = this.multipleSelection.length;
				let str = "";
				this.delList = this.delList.concat(this.multipleSelection);
				for (let i = 0; i < length; i++) {
					str += this.multipleSelection[i].username + " ";
				}
				this.$message.error(`删除了${str}`);
				this.multipleSelection = [];
			},
			// 编辑操作
			handleEdit(index, row) {
				this.idx = index;
				this.form.email = row.email;
				this.form.phone = row.phone;
				this.form.avatar = row.avatar;
				this.editVisible = true;
			},
			// 保存编辑
			saveEdit() {
				this.editVisible = false;
				this.$message.success(`修改第 ${this.idx + 1} 行成功`);
				this.$set(this.tableData, this.idx, this.form);
			},
			// 分页导航
			handlePageChange(val) {
				this.$set(this.query, "pageIndex", val);
				this.getData();
			}
		}
	};
</script>

<style scoped>
	
	.handle-box {
		margin-bottom: 20px;
	}

	.handle-select {
		width: 120px;
	}

	.handle-input {
		width: 300px;
		display: inline-block;
	}

	.table {
		width: 100%;
		font-size: 14px;
	}

	.red {
		color: #ff0000;
	}

	.mr10 {
		margin-right: 10px;
	}

	.table-td-thumb {
		display: block;
		margin: auto;
		width: 40px;
		height: 40px;
	}
	
</style>
