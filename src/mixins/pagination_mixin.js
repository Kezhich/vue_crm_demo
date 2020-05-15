export default {
    data() {
        return {
            page: +this.$route.query.page || 1,
            pageSize: 5,
            pageCount: 0,
            allItems: [],
            items: []
        }
    },
    methods: {
        pageChangeHandler(page) {
            this.$router.push(`${this.$route.path}?page=${page}`)
            this.items = this.allItems[page - 1] || this.allItems[0]
        },
        setupPagination(allItems) {
            this.allItems = allItems.reduce((arr, item, idx) => {
                return idx % this.pageSize === 0
                    ? [...arr, [item]]
                    : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]]
            }, [])

            this.pageCount = Object.keys(this.allItems).length

            this.items = this.allItems[this.page - 1] || this.allItems[0]
        }
    }
}
