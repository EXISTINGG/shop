// 注意：除了要在 cart.vue 页面中设置购物车的数字徽标，还需要在其它 3 个 tabBar 页面中，为购物车设置数字徽标。
// 此时可以使用 Vue 提供的 mixins 特性，提高代码的可维护性

import {
	mapGetters
} from 'vuex'

// 导出一个 mixin 对象
export default {
	computed: {
		...mapGetters('m_cart', ['total'])
	},
	onShow() {
		// 在页面刚展示的时候，设置数字徽标
		this.setBadge()
	},
	watch: {
		// 监听 total 值的变化
		total() {
			// 调用 methods 中的 setBadge 方法，重新为 tabBar 的数字徽章赋值
			this.setBadge()
		},
	},
	methods: {
		setBadge() {
			// 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
			uni.setTabBarBadge({
				index: 2,
				text: this.total + '', // 注意：text 的值必须是字符串，不能是数字
			})
		}
	},
}
