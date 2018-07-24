<template>
    <div>
        <div class="ui segment" v-if="loading">
            <div class="ui active inverted dimmer">
                <div class="ui huge text loader">Обработка запроса</div>
            </div>
            <p>asdasd</p>
            <p>123123</p>
            <p>123</p>
        </div>
        <div class="ui segment" v-if="!loading">

            <h1>Скриншот №{{hash}}</h1>
            <div class="ui one column grid">
                <table>
                    <thead>
                        <tr>
                            <th>адрес страницы</th>
                            <th>дата создания</th>
                            <th>кем создан</th>
                            <th>хеш картинки</th>
                            <th>номер транзакции</th>
                            <th>номер в блокчейн архиве</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><a :href="url" target="_blank">{{url}}</a></td>
                            <td>{{this.date()}}</td>
                            <td>{{creator_ip}}</td>
                            <td>{{image_hash}}</td>
                            <td>{{transaction_id}}</td>
                            <td>{{blockchain_id}}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="column">
                </div>
            </div>
            <div class="ui one column grid">
                <div class="column">
                    <img :src="image_path">
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import axios from 'axios';
    import moment from 'moment';

    export default {
        name: 'Detail',
        data: function() {
            return {
                loading: true,
                url: '',
                creator_ip: '',
                creation_date: '',
                hash: this.$route.params.id,
                transaction_id: '',
                blockchain_id: 0,
                image_path: '',
                image_hash: ''
            };
        },
        methods: {
            load: function() {
                console.log(this.$route);
                axios.get('/api/screen/' + this.hash)
                    .then(res => {
                        console.log(res.data.data);
                        this.loading = false;

                        this.creator_ip = res.data.data['creator_ip'];
                        this.creation_date = res.data.data['creation_date'];
                        this.hash = res.data.data['hash'];
                        this.url = res.data.data['url'];
                        this.image_path = res.data.data['image_path'];
                        this.image_hash = res.data.data['image_hash'];
//                        this.blockchain_id = 34;
//                        this.transaction_id = '90837wrfhwu4f87w3rghjwn37gfhj3wf8huwwf83hf83f83f';
                    });
            },
            date: function() {
                return moment(this.creation_date)
                    .locale('ru')
                    .format('MMMM Do YYYY, hh:mm:ss');
            }
        },
        created: function() {
            this.load();
        }
    }
</script>

<style scoped>
    img {
        height: auto;
        max-width: 100%;
        vertical-align: middle;
        border: 0;
    }
</style>
