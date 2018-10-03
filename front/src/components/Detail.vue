<template>
    <div>
        <div class="ui segment" v-if="loading">
            <div class="ui active inverted dimmer">
                <div class="ui huge text loader">
                    <p v-show="!processing">Обработка запроса</p>
                    <p v-show="processing">
                        Обработка запроса.<br>
                        <nobr>Сохранение страницы <a :href="url">{{url}}</a></nobr>
                        <transition name="slide-fade">
                            <span v-if="processing_png"> в <b>png</b> формате</span>
                        </transition>
                        <transition name="slide-fade">
                            <span v-if="processing_pdf">, <b>pdf</b> формате</span>
                        </transition>
                        <transition name="slide-fade">
                            <span v-if="processing_zip">, <b>zip</b> формате</span>
                        </transition>
                    </p>
                </div>
            </div>
            <div>
                Anxiety prepares an organism for dealing with threats by recruiting cognitive resources to process
                information about the threat, and by engaging physiological systems to prepare a response. Heightened
                trait anxiety is associated with biases in both these processes: high trait-anxious individuals tend to report
                heightened risk perceptions, and inappropriate engagement in danger mitigation behavior. However, no
                research has addressed whether the calibration between risk perception and danger mitigation behavior
                is affected by anxiety, though it is well recognized that this calibration is crucial for adaptive functioning.
                The current study aimed to examine whether anxiety is characterized by better or worse calibration of
                danger mitigation behavior to variations in risk magnitude. Low and high trait-anxious participants were
                presented with information about the likelihood and severity of a danger (loud noise burst) on each trial.
                Participants could decide to mitigate this danger by investing a virtual coin, at the cost of losing danger
                mitigation ability on subsequent trials. Importantly, level of risk likelihood and severity were varied
                independently, and the multiplicative relationship between the 2 defined total danger. Multilevel
                modeling showed that the magnitude of total danger predicted the probability of coin investments, over
                and above the effects of risk likelihood and severity, suggesting that participants calibrated their danger
                mitigation behavior to integrated risk information. Crucially, this calibration was affected by trait anxiety,
                indicating better calibration in high trait-anxious individuals. These results are discussed in light of
                existing knowledge and models of the effect of anxiety on risk perception and decision-making.
                <br>
                <a target="_blank" href="https://www.apa.org/pubs/journals/features/xlm-0000210.pdf">https://www.apa.org/pubs/journals/features/xlm-0000210.pdf</a>
            </div>
        </div>
        <div class="ui segment" v-if="not_found">
            <h1>Скриншот не найден :(</h1>
        </div>
        <div class="ui segment" v-if="!loading && !not_found">

            <h1>Скриншот №{{hash}}</h1>

            <div class="ui one column centered grid">
                <div class="row">
                    <div class="ui red message">
                        Не закрывайте окно, пока не сохраните ссылку!&nbsp;
                    </div>
                </div>
                <div class="row">
                    <button class="ui red small basic button" data-tooltip="LegalScreen сообщит вам если сканируемая страница изменится. Функция будет доступна позже">
                        <i class="mail icon"></i>
                        Подписаться на изменения
                    </button>
                </div>
            </div>

            <div class="ui grid">
                <div class="row">
                    <div class="twelve wide column">
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
                    </div>
                    <div class="four wide column">
                        <a v-if="pdf_hash" :href="'/download/pdf/' + hash" target="_blank" class="ui primary button">
                            <i class="download icon"></i>
                            PDF
                        </a>
                        <a v-if="archive_hash" :href="'/download/zip/' + hash" target="_blank" class="ui primary button">
                            <i class="download icon"></i>
                            Archive
                        </a>
                    </div>
                </div>

            </div>

            <div class="ui centered one column grid">
                <b>Url:&nbsp;</b>
                <a :href="url">
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
                processing: false,
                processing_png: false,
                processing_pdf: false,
                processing_zip: false,
                url: '',
                creator_ip: '',
                creation_date: '',
                hash: this.$route.params.id,
                transaction_id: '',
                blockchain_id: 0,
                image_path: '',
                image_hash: '',
                pdf_path: '',
                pdf_hash: '',
                archive_path: '',
                archive_hash: ''
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

                        if(res.data.data['status'] === 0) {
                            this.processing = true;
                            this.loading = true;
                            setTimeout(() => {
                                this.processing_png = true;
                            }, 3000);
                            setTimeout(() => {
                                this.processing_pdf = true;
                            }, 9000);
                            setTimeout(() => {
                                this.processing_zip = true;
                            }, 15000);
                            setTimeout(() => {
                                location.reload();
                            }, 19000);
                        }

                        this.creator_ip = res.data.data['creator_ip'];
                        this.creation_date = res.data.data['creation_date'];
                        this.hash = res.data.data['hash'];
                        this.url = res.data.data['url'];
                        this.image_path = res.data.data['image_path'];
                        this.pdf_path = res.data.data['pdf_path'];
                        this.archive_path = res.data.data['archive_path'];
                        this.image_hash = res.data.data['image_hash'];
                        this.pdf_hash = res.data.data['pdf_hash'];
                        this.archive_hash = res.data.data['archive_hash'];
//                        this.blockchain_id = 34;
                        this.transaction_id = res.data.data['transaction_id'];
                    })
                    .catch(() => {
                        this.loading = false;
                        this.not_found = true;
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

    .slide-fade-enter-active {
        transition: all 1.3s ease;
    }
    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateX(10px);
        opacity: 0;
    }
</style>
