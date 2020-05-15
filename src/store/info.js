import firebase from 'firebase/app'

export default {
    state: {
        info: {}
    },
    mutations: {
        setInfo(state, info) {
            state.info = info
        },
        clearInfo(state) {
            state.info = {}
        }
    },
    actions: {
        async updateInfo({ dispatch, commit, getters }, toUpdate) {
            try {
                const uid = await dispatch('getUid')
                const updateData = { ...getters.info, ...toUpdate }
                await firebase
                    .database()
                    .ref(`users/${uid}/info`)
                    .update(updateData)
                commit('setInfo', updateData)
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async fetchInfo({ dispatch, commit }) {
            try {
                const uid = await dispatch('getUid')
                const info = (await firebase
                    .database()
                    .ref(`users/${uid}/info`)
                    .once('value')).val()
                commit('setInfo', info)
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async fetchCurrency() {
            const key = process.env.VUE_APP_FIXER
            const res = await fetch(
                `http://data.fixer.io/api/latest?access_key=${key}&symbols=USD,EUR,RUB`
            )
            return await res.json()
        }
    },
    getters: {
        info: s => s.info
    }
}
