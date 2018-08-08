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
        <div class="three column divided stackable center aligned ui grid strip">
            <div class="column">
                <div class="ui icon header">
                    <i class="ethereum icon"></i>
                    Сохраняется в блокчейне. <small>Лучше чем высеченно на камне</small>
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
                    <i class="mars double icon"></i>
                    Подойдет даже пидорам
                </div>
            </div>
        </div>
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
    .strip {
        padding: 8em 0em;
    }
</style>
