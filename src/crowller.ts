import superagent from "superagent";
import cheerio from "cheerio"
import  fs from 'fs';
import  path from 'path';

interface Course {
    title:string;
    count:number
}

interface CourseResult {
    time: number;
    data: Course[];
}
interface Content {
    [propName: number] : Course[];
}

class Crowller {
    private secret = "secretKey";
    private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;
    private rawHtml = '';

    async getRawHtml() {
        const result: superagent.Response = await superagent.get(this.url);
        return result.text

    }
    getCourseInfo(html:string) {
        const $ = cheerio.load(html)
        const courseItems = $('.course-item');
        const courseInfos: Course[] = [];
        console.log(courseItems.length)
        courseItems.map((index, element) => {
            const descs = $(element).find('.course-desc');
            const title = descs.eq(0).text();
            const count = parseInt(descs.eq(1).text()) ?parseInt(descs.eq(1).text()):0;
            courseInfos.push({title, count})
        })
        return {
            time: new Date().getTime(),
            data:courseInfos
        }
    }
    generateJsonContent(courseInfo:CourseResult) {
        const filePath = path.resolve(__dirname,'../data/course.json');
        let fileContent:Content = {};
        if (fs.existsSync(filePath)) {
            fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"))
        }
        fileContent[courseInfo.time] = courseInfo.data;
        fs.writeFileSync(filePath,JSON.stringify(fileContent))
    }

    async initSpiderProcess () {
        const html = await this.getRawHtml()
        const courseInfo = this.getCourseInfo(html);
        this.generateJsonContent(courseInfo)
    }

    constructor() {
        this.initSpiderProcess();
    }
}

const crowller = new Crowller();
