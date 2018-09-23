<template>
    <div>
        <div class="masthead">
            <h1 class="ui header">legalscreen.org</h1>
            <h4>
                Юридически правильные скриншоты
            </h4>
            <div class="ui text container">
                <div class="ui one column grid">
                    <div class="column">
                        <div class="ui fluid big input">
                            <input v-model="url" type="text" placeholder="http://example.com/copyright.html">

                            <button v-on:click="saveScreen" :class="buttonClass">
                                <i class="camera retro icon"></i>&nbsp;Сделать скрин
                            </button>
                        </div>
                    </div>
                    <div class="column">
                        <div class="ui checkbox">
                            <input disabled type="checkbox" v-model="isBlockchain" id="isBlockchain">
                            <label for="isBlockchain">
                                Сохранить в блокчейне <s>(всего 9 руб.)</s>
                            </label>
                            <span class="ui red label">FREE!</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="one column center aligned ui grid strip-top">
            <h2>Как работает legalscreen</h2>
        </div>
        <div class="three column center aligned ui grid strip-bottom">
            <div class="column step">
                <p>
                    1. Наш сервис сохраняет
                    выбранную web страницу.
                </p><br>
                <img src="@/assets/images/step1.png" alt="">
            </div>
            <div class="column step">
                <p>
                    2. Уникальный хеш сохраненных
                    данных сохраняется также в блокчейне.
                    Там он в безопасности.
                </p>
                <img src="@/assets/images/step2.png" alt="">
            </div>
            <div class="column step">
                <p>
                    3. У вас есть подтверждение
                    того как выглядела страница.
                </p>
                <img src="@/assets/images/step3.png" alt="">
            </div>
        </div>
<!--

        <div class="one column center aligned ui grid">
            <div class="column">
                Здесь должен быть великолепный текст
            </div>
        </div>

        <div class="one column center aligned ui grid strip-top">
            <h2>Больше чем просто скриншот</h2>
        </div>
        <div class="three column center aligned ui grid strip-bottom">
            <div class="column">
                <div class="ui icon header">
                    <i class="ethereum icon"></i>
                    С использованием технологии блокчейн.
                </div>
            </div>
            <div class="column">
                <div class="ui icon header">
                    <i class="heart icon"></i>
                    Сделанно с заботой о Ваших правах
                </div>
            </div>
            <div class="column">
                <div class="ui icon header">
                    <i class="github icon"></i>
                    Open source
                </div>
            </div>
        </div>
-->

        <div class="one column center aligned">
            <div class="column">
                Класс восприятия судом: <b>A</b><small>&nbsp;B&nbsp;C&nbsp;D&nbsp;E&nbsp;F</small>
            </div>
        </div>
    </div>

</template>

<script>
    import axios from 'axios';

    export default {
        name: 'Main',
        data: function() {
            return {
                url: '',
                isBlockchain: true,
                buttonClass: 'ui primary icon big button'
            };
        },
        methods: {
            saveScreen() {
                this.buttonClass += ' loading disabled';
                let data = {
                    url: this.url,
                    isBlockchain: this.isBlockchain
                };
                axios.post('/api/screen/add', data)
                    .then(response =>  {
                        if(!response.error) {
                            this.$router.push('/v/' + response.data.id);
                        }
                    }).catch(() => {
                        console.warn('Error saving data');
                    });
            },
        }
    }
</script>

<style scoped>
    .masthead h1.ui.header {
        margin-top: 2em;
        margin-bottom: 0em;
        font-size: 4em;
        font-weight: bold;
    }
    .strip-bottom {
        padding-bottom: 7em;
    }
    .strip-top {
        padding-top: 6em;
    }
    .step img {
        max-height: 128px;
    }
</style>
