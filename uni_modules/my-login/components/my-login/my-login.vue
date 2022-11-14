<template>
	<view class="login-container">
		<!-- 提示登录的图标 -->
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<!-- 登录按钮 -->
		<button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
		<!-- 登录提示 -->
		<view class="tips-text">登录后尽享更多权益</view>
	</view>
</template>
<script>
	import {
		mapMutations,
		mapState
	} from 'vuex'
	export default {
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
			// 获取微信用户的基本信息
			getUserProfile(e) {
				uni.getUserProfile({
					desc: '你的授权信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res) => {
						console.log(res, 'xxxxxxxxxxxxxxxxx');
						// 3. 将用户的基本信息存储到 vuex 中
						this.updateUserInfo(res.userInfo)

						// 获取登录成功后的 Token 字符串
						this.getToken(res)
					},
					fail: () => uni.$showMsg('您取消了登录授权')

				})
				// 判断是否获取用户信息成功
				// if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权！')

				// 获取用户信息成功， e.detail.userInfo 就是用户的基本信息
				// console.log(e.detail.userInfo)
			},

			// 调用登录接口，换取永久的 token
			async getToken(info) {
				// 调用微信登录接口
				const [err, res] = await uni.login().catch(err => err)
				// 判断是否 uni.login() 调用失败
				if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')

				// 准备参数对象
				const query = {
					code: res.code,
					encryptedData: info.encryptedData,
					iv: info.iv,
					rawData: info.rawData,
					signature: info.signature
				}

				console.log(query);

				// 换取 token
				const
					data
				// } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
				= await uni.request({
					method: 'POST',
					url: 'https://www.fastmock.site/mock/1479b8ee7fbb761269662b23b8f933fa/ssy/login',
					data: query,
				})

				const {
					data: loginResult
				} = data[1]
				console.log(loginResult);

				if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
				uni.$showMsg('登录成功')

				console.log(loginResult.message.token);

				//////////////////////
				// // 400意味有效
				// const msg = loginResult.message || {};
				// if (loginResult.meta.status === 400 || loginResult.meta.status === 200) {
				// 	// 模拟 token
				// 	for (let i = 1; i <= 32; i++) {
				// 		const n = Math.floor(Math.random() * 16.0).toString(16)
				// 		msg.token += n
				// 	}
				// }
				/////////////////////
				// 2. 更新 vuex 中的 token
				this.updateToken(loginResult.message.token)
				// this.updateToken(msg.token)
				// this.updateToken(
				// 	'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
				// 	)

				// 判断 vuex 中的 redirectInfo 是否为 null
				// 如果不为 null，则登录成功之后，需要重新导航到对应的页面
				this.navigateBack()
			},
			// 返回登录之前的页面
			navigateBack() {
				// redirectInfo 不为 null，并且导航方式为 switchTab
				if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
					// 调用小程序提供的 uni.switchTab() API 进行页面的导航
					uni.switchTab({
						// 要导航到的页面地址
						url: this.redirectInfo.from,
						// 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
						complete: () => {
							this.updateRedirectInfo(null)
						}
					})
				}
			}
		},
		computed: {
			// 调用 mapState 辅助方法，把 m_user 模块中的数据映射到当前用组件中使用
			...mapState('m_user', ['redirectInfo']),
		}
	}
</script>
<style lang="scss">
	.login-container {
		// 登录盒子的样式
		height: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #f8f8f8;
		position: relative;
		overflow: hidden;

		// 绘制登录盒子底部的半椭圆造型
		&::after {
			content: ' ';
			display: block;
			position: absolute;
			width: 100%;
			height: 40px;
			left: 0;
			bottom: 0;
			background-color: white;
			border-radius: 100%;
			transform: translateY(50%);
		}

		// 登录按钮的样式
		.btn-login {
			width: 90%;
			border-radius: 100px;
			margin: 15px 0;
			background-color: #c00000;
		}

		// 按钮下方提示消息的样式
		.tips-text {
			font-size: 12px;
			color: gray;
		}
	}
</style>
