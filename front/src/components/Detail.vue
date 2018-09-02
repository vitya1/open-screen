<template>
    <div>
        <div class="ui segment" v-if="loading">
            <div class="ui active inverted dimmer">
                <div class="ui huge text loader">Обработка запроса</div>
            </div>
            <p>Confront chaos</p>
            <p>Establish and revivify order</p>
            <p>Constrain malevolence</p>
        </div>
        <div class="ui segment" v-if="not_found">
            <h1>Скриншот не найден :(</h1>
        </div>
        <div class="ui segment" v-if="!loading && !not_found">

            <h1>Скриншот №{{hash}}</h1>
            <br>
            <div class="ui one column centered grid">
                <div class="ui red message">
                    Не закрывайте окно, пока не сохраните ссылку!&nbsp;
                </div>
            </div>

            <div class="ui one column grid">
                <table>
                    <thead>
                        <tr>
                            <th>дата создания</th>
                            <th>кем создан</th>
                            <th>хеш картинки</th>
                            <th>номер транзакции</th>
                            <!--<th>номер в блокчейн архиве</th>-->
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{date()}}</td>
                            <td>{{creator_ip}}</td>
                            <td>{{image_hash}}</td>
                            <td v-if="transaction_id">
                                <a target="_blank" :href="`https://rinkeby.etherscan.io/tx/${transaction_id}`">
                                    {{transaction_id.substr(0, 10)}}...
                                </a>
                            </td>
                            <td v-show="!transaction_id">в процессе...</td>
                            <!--<td>{{blockchain_id}}</td>-->
                        </tr>
                    </tbody>
                </table>
                <div class="column">
                </div>
            </div>

            <div class="ui centered one column grid">
                <b>Url:&nbsp;</b>
                <a :href="url" target="_blank">
                    {{url.substr(0, 70)}}{{url.length > 70 ? '...' : ''}}
                </a>
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
                not_found: false,
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
                        if(!res.data.data) {
                            this.not_found = true;
                            return;
                        }

                        this.creator_ip = res.data.data['creator_ip'];
                        this.creation_date = res.data.data['creation_date'];
                        this.hash = res.data.data['hash'];
                        this.url = res.data.data['url'];
                        this.image_path = res.data.data['image_path'];
                        this.image_hash = res.data.data['image_hash'];
//                        this.blockchain_id = 34;
                        this.transaction_id = res.data.data['transaction_id'];
                    });
            },
            date: function() {
                return moment(this.creation_date)
                    .locale('ru')
                    .format('Do MMMM YYYY, hh:mm:ss');
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
