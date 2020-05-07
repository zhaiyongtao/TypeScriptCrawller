import superagent from "superagent";
import zytAnalyzer from './zytAnalyzer';
import path from "path";
import fs from 'fs';

export interface Analyzer {
    analyze: (html: string, filePath: string) => string;
  }
  
class Crowller {
    private filePath = path.resolve(__dirname, '../data/course.json');
    async getRawHtml() {
        const result: superagent.Response = await superagent.get(this.url);
        return result.text
    }
    writeFile(content: string) {
        fs.writeFileSync(this.filePath,content);
      }
    
    async initSpiderProcess () {
        const html = await this.getRawHtml()
        const fileContent =  this.analyzer.analyze(html, this.filePath);
            this.writeFile(fileContent)
    }
    // private analyzer;
    // constructor (analyzer) {
    //     this.analyzer = analyzer
    // }
    constructor(private analyzer:any,private url:string) {
        this.initSpiderProcess();
    }
}

// 方法类实例化，使用实例化对象中的方法
const secret = "secretKey";
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
const analyzer = zytAnalyzer.getInstance (); 
new Crowller(analyzer,url);

console.log(1)