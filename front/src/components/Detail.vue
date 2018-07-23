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

            <h1>{{hash}}</h1>
            <div class="ui one column grid">
                <table>
                    <thead>
                        <tr>
                            <th>адрес страницы</th>
                            <th>дата создания</th>
                            <th>кем создан</th>
                            <th>номер транзакции</th>
                            <th>номер в блокчейн архиве</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{url}}</td>
                            <td>{{creation_date}}</td>
                            <td>{{creator_ip}}</td>
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
                    <img src="BFFdzUtb6goV.png">
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import axios from 'axios';

    export default {
        name: 'Detail',
        data: function() {
            return {
                loading: true,
                url: '',
                creator_ip: '',
                creation_date: '',
                hash: '',
                transaction_id: '',
                blockchain_id: 0,
            };
        },
        methods: {
            load: function() {
                this.creator_ip = '127.0.0.1';
                this.creation_date = Date.now();
                this.hash = '837GF3HF918HE97G2';
                this.blockchain_id = 34;
                this.transaction_id = '90837wrfhwu4f87w3rghjwn37gfhj3wf8huwwf83hf83f83f';
                this.url = 'www.google.com';
                axios.get('/api/screen', {id: '123'})
                    .then(res => {
                        console.log(res);
                    });
            }
        },
        created: function() {
            this.load();
        }
    }
</script>

<style scoped>
</style>
