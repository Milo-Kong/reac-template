// translate.config.js
import { Lang } from 'language-translate/types';
import { defineConfig } from 'language-translate/utils';

export default defineConfig({
  proxy: {
    host: '127.0.0.1',
    port: 7890,
  },
  fromLang: Lang['zh-CN'],
  fromPath: 'public/diff/zh.json',
  translate: [
    {
      label: '将结果翻译到public/diff文件夹下',
      targetConfig: [
        {
          targetLang: Lang.de,
          outPath: 'public/diff/de.json',
        },
        {
          targetLang: Lang['zh-TW'],
          outPath: 'public/diff/zh-TW.json',
        },
        {
          targetLang: Lang.ko,
          outPath: 'public/diff/ko.json',
        },
      ]
    }
  ]
})