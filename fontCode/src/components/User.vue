<template>
	<div class="user" @click="onClick" :class="{ selected: selected }">
		<div style="display: flex;justify-content: space-between;">
			<div class="description">
				<el-avatar shape="square" :size="35" :src="user.img"></el-avatar>
				<div style="margin-left: 10px;">
					<div class="name">
						{{ user.username }} {{ user.self ? "( 你 )" : "" }}
					</div>
					<div class="status">
						<status-icon :connected="user.connected" />{{ status }}
					</div>
				</div>
			</div>
			<div v-if="user.hasNewMessages" class="new-messages">!</div>
		</div>
	</div>
</template>

<script>
	import StatusIcon from "./StatusIcon";
	export default {
		name: "User",
		components: {
			StatusIcon
		},
		props: {
			user: Object,
			selected: Boolean,
		},
		methods: {
			onClick() {
				this.$emit("select");
			},
		},
		computed: {
			status() {
				return this.user.connected ? "在线" : "离线";
			},
		},
	};
</script>

<style scoped>
	.selected {
		background-color: #1164a3;
	}

	.user {
		padding: 10px;
		border-bottom: 1px solid #767575;
	}

	.name {
		color: white;
	}

	.description {
		display: flex;
	}

	.status {
		font-size: 12px;
		color: #92959e;
	}

	.new-messages {
		color: white;
		background-color: red;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		text-align: center;
		margin-top: 10px;
		align-self: flex-end;
	}
</style>
