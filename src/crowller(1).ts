// ts 直接引入js文件会报错
// 我们需要使用翻译文件 .d.ts 来配合Ts 调用js
import superagent from 'superagent';

class Crowller {
  private secret = 'secretKey'; //这是一个类的属性，使用this.secret
  private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;
  private rawHtml = '';
  async getRawHtml() {
    const result: superagent.Response = await superagent.get(this.url);
    this.rawHtml = result.text;
    console.log(result.text);
  }
  constructor() {
    this.getRawHtml();
    console.info('constructor');
  }
}

const crowller = new Crowller();
