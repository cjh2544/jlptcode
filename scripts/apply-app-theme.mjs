import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "src");
const replacements = [
  ["relative md:ml-64 bg-blue-gray-100", "relative md:ml-64 app-page-bg"],
  ["relative md:ml-64 bg-blueGray-100", "relative md:ml-64 app-page-bg"],
  [
    "relative flex flex-col min-w-0 wrap-break-word w-full mb-6 shadow-lg rounded-lg bg-blue-gray-100 border-0",
    "app-panel w-full mb-6",
  ],
  [
    "relative flex flex-col min-w-0 wrap-break-word w-full shadow-lg rounded-lg bg-blue-gray-100 border-0",
    "app-panel w-full",
  ],
  [
    "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0",
    "app-panel w-full mb-6",
  ],
  [
    "relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-lg bg-blueGray-100 border-0",
    "app-panel w-full",
  ],
  ["rounded-t bg-white mb-0 px-6 py-6", "app-panel-header"],
  ["text-center flex justify-between", "flex justify-between items-center gap-4"],
  ["text-blue-gray-700 text-xl font-bold", "text-lg font-bold"],
  ["text-blueGray-700 text-xl font-bold", "text-lg font-bold"],
  ["className='text-red-700'", "className='app-panel-tip'"],
  ['className="text-red-700"', 'className="app-panel-tip"'],
  ["flex-auto lg:px-10 p-4", "app-panel-body"],
  [
    "bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150",
    "app-btn-primary mr-1",
  ],
  [
    "bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 w-full",
    "app-btn-primary w-full",
  ],
  [
    "bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 w-full",
    "app-btn-primary w-full",
  ],
  [
    "border-0 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150",
    "app-select py-2",
  ],
  [
    "border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150",
    "app-select",
  ],
  [
    "uppercase border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150",
    "app-select uppercase",
  ],
  [
    "disabled:bg-gray-300 border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150",
    "app-select disabled:opacity-50 disabled:cursor-not-allowed",
  ],
  [
    "border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded shadow focus:outline-none focus:ring ease-linear transition-all duration-150",
    "app-select",
  ],
  ["className='bg-blueGray-100'", "className='bg-blue-gray-100'"],
  ["flex-auto mt-3 lg:px-10 py-10 pt-0", "app-panel-body"],
  ["block uppercase text-blueGray-600 mb-1", "app-label"],
  ["block uppercase text-blue-gray-600 mb-1", "app-label"],
];

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (/\.(tsx|ts|jsx|js)$/.test(ent.name)) {
      let content = fs.readFileSync(p, "utf8");
      const original = content;
      for (const [from, to] of replacements) {
        content = content.split(from).join(to);
      }
      if (content !== original) {
        fs.writeFileSync(p, content, "utf8");
        console.log("updated", path.relative(process.cwd(), p));
      }
    }
  }
}

walk(root);
