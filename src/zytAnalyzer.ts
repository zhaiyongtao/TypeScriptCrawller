import fs from "fs";
import cheerio from "cheerio";
import { Analyzer } from './crowller';
interface Course {
  title: string;
  count: number;
}

interface CourseResult {
  time: number;
  data: Course[];
}

interface Content {
  [propName: number]: Course[];
}

export default class zytAnalyzer implements Analyzer {

private static instance: zytAnalyzer;
static getInstance () {
    if(!zytAnalyzer.instance) {
        zytAnalyzer.instance = new zytAnalyzer();
    }
    return  zytAnalyzer.instance;
}
 private generateJsonContent(courseInfo: CourseResult,filePath:string) {
    let fileContent: Content = {};
    // 如果已经存在这个文件了 我们就读取这个文件
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    console.info(fileContent)
    }
    fileContent[courseInfo.time] = courseInfo.data;
    return fileContent;
    
  }

 private getCourseInfo(html: string) {
    const $ = cheerio.load(html);
    const courseItems = $(".course-item");
    const courseInfos: Course[] = [];
    console.log(courseItems.length);
    courseItems.map((index, element) => {
      const descs = $(element).find(".course-desc");
      const title = descs.eq(0).text();
      const count = parseInt(descs.eq(1).text())
        ? parseInt(descs.eq(1).text())
        : 0;
      courseInfos.push({ title, count });
    });
    return {
      time: new Date().getTime(),
      data: courseInfos,
    };
  }

  public analyze(html: string, filePath: string) {
    const courseInfo = this.getCourseInfo(html);
    const fileContent = this.generateJsonContent(courseInfo, filePath);
    return JSON.stringify(fileContent);
  }

  private constructor () {

  }
}
