<template>
    <div>
        <div class="page-title">
            <h3>Новая запись</h3>
        </div>
        <Loader v-if="loading" />

        <p v-else-if="!categories.length" class="center">
            Категорий пока нет.
            <router-link to="/categories"
                >Добавить новую категорию.</router-link
            >
        </p>

        <form v-else class="form" @submit.prevent="submitHandler">
            <div class="input-field">
                <select ref="select" v-model="category">
                    <option v-for="c in categories" :key="c.id" :value="c.id">{{
                        c.title
                    }}</option>
                </select>
                <label>Выберите категорию</label>
            </div>

            <p>
                <label>
                    <input
                        class="with-gap"
                        name="type"
                        type="radio"
                        value="income"
                        v-model="type"
                    />
                    <span>Доход</span>
                </label>
            </p>

            <p>
                <label>
                    <input
                        class="with-gap"
                        name="type"
                        type="radio"
                        value="outcome"
                        v-model="type"
                    />
                    <span>Расход</span>
                </label>
            </p>

            <div class="input-field">
                <input
                    id="amount"
                    type="number"
                    v-model.number="amount"
                    :class="{ invalid: isAmountInvalid }"
                />
                <label for="amount">Сумма</label>
                <span v-if="isAmountInvalid" class="helper-text invalid"
                    >Минимальное значение:
                    {{ $v.amount.$params.minValue.min }}</span
                >
            </div>

            <div class="input-field">
                <input
                    id="description"
                    type="text"
                    v-model="description"
                    :class="{ invalid: isDescriptionInvalid }"
                />
                <label for="description">Описание</label>
                <span v-if="isDescriptionInvalid" class="helper-text invalid"
                    >Обязательное поле.</span
                >
            </div>

            <button class="btn waves-effect waves-light" type="submit">
                Создать
                <i class="material-icons right">send</i>
            </button>
        </form>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { required, minValue } from 'vuelidate/lib/validators'
export default {
    name: 'record',
    data: () => ({
        loading: true,
        categories: [],
        select: null,
        category: null,
        type: 'outcome',
        amount: 1,
        description: '',
    }),
    metaInfo() {
        return {
            title: this.$title('Menu_NewRecord'),
        }
    },
    validations: {
        amount: { minValue: minValue(1) },
        description: { required },
    },
    computed: {
        ...mapGetters(['info']),
        isAmountInvalid() {
            return this.$v.amount.$dirty && !this.$v.amount.minValue
        },
        isDescriptionInvalid() {
            return this.$v.description.$dirty && !this.$v.description.required
        },
        canCreateRecord() {
            if (this.type === 'income') {
                return true
            }
            return this.info.bill >= this.amount
        },
    },
    methods: {
        async submitHandler() {
            if (this.$v.$invalid) {
                this.$v.$touch()
                return
            }
            if (this.canCreateRecord) {
                try {
                    await this.$store.dispatch('createRecord', {
                        categoryId: this.category,
                        amount: this.amount,
                        descroption: this.description,
                        type: this.type,
                        date: new Date().toJSON(),
                    })
                    const bill =
                        this.type === 'income'
                            ? this.info.bill + this.amount
                            : this.info.bill - this.amount

                    await this.$store.dispatch('updateInfo', { bill })
                    this.$message('Запись успешно создана.')
                    this.$v.$reset()
                    this.amount = 1
                    this.description = ''
                } catch (e) {}
            } else {
                this.$message(
                    `Недостаточно средств на счете. (${this.amount -
                        this.info.bill})`
                )
            }
        },
    },
    async mounted() {
        this.categories = await this.$store.dispatch('fetchCategories')
        this.loading = false

        if (this.categories.length) {
            this.category = this.categories[0].id
        }

        this.$nextTick(() => {
            this.select = M.FormSelect.init(this.$refs.select)
            M.updateTextFields()
        })
    },
    destroyed() {
        if (this.select && this.select.destroy) {
            this.select.destroy()
        }
    },
}
</script>

<style></style>
