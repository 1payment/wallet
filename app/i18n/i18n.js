// import ReactNative from 'react-native';
// import I18n from 'react-native-i18n';

// I18n.fallbacks = false;

// I18n.translations = {
//     'en': require('./en.json'),
//     'vi': require('./vi.json')
// }
// export default I18n;
import I18n, { getLanguages } from 'react-native-i18n';
import { setData, getData } from '../services/data.service'
// Enable fallbacks if you want `en-US` and `en-GB` to fallback to `en`
I18n.fallbacks = true;

// I18n.defaultLocale = 'en-US',

I18n.translations = {
    en: require('./en.json'),
    vi: require('./vi.json'),
    ko: require('./ko.json'),
    zh: require('./zh.json'), // trung quoc
    pt: require('./pt.json'), // bo dao nha
    es: require('./es.json') // tay ban nha
};

// I18n.locale = 'en';



export const ListLanguage = [
    { View: 'English', type: 'en' },
    { View: 'Tiếng Việt', type: 'vi' },
    { View: '한국어', type: 'ko' },
    { View: '简体中文', type: 'zh' },
    { View: 'Português', type: 'pt' },
    { View: 'Español', type: 'es' }
]
export function DeviceLanguage() {
    return new Promise((resolve, reject) => {
        getLanguages().then(lang => {
            var languages = lang[0].substr(0, 2);
            var indexLanguages = ListLanguage.findIndex(x => x.type == languages);
            if (indexLanguages > -1) {
                I18n.locale = languages;
                setData('languages', languages)
                resolve(languages)
            }
            else {
                I18n.locale = 'en';
                setData('languages', 'en');
            }

        }).catch(err => {
            console.log(err)
        })
    })
}
export function selectLang() {
    try {
        getData('languages').then(data => {
            I18n.locale = data
        })
    } catch (error) {

    }
}



export default I18n;