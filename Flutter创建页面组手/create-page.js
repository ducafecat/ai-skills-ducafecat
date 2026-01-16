#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const https = require("https");

function hasChinese(str) {
  return /[\u4e00-\u9fa5]/.test(str);
}

async function translateToEnglish(text) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "translate.googleapis.com",
      path: `/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=${encodeURIComponent(
        text
      )}`,
      method: "GET",
      timeout: 5000,
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          const translated = json[0][0][0];
          resolve(translated);
        } catch (e) {
          resolve(text);
        }
      });
    });

    req.on("error", () => resolve(text));
    req.on("timeout", () => {
      req.destroy();
      resolve(text);
    });
    req.end();
  });
}

function toSnakeCase(str) {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "")
    .replace(/[^\w]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

function toPascalCase(str) {
  const snake = toSnakeCase(str);
  return snake
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function generateCode(businessName) {
  const fileCode = toSnakeCase(businessName);
  const classCode = toPascalCase(businessName);
  const varCode = toCamelCase(businessName);
  const interfaceCode = "I" + classCode;

  return { fileCode, classCode, varCode, interfaceCode };
}

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  createDirectory(dir);
  fs.writeFileSync(filePath, content, "utf8");
}

function generateIndexCode(fileCode) {
  return `library;

export './controller.dart';
export './view.dart';
`;
}

function generateControllerCode(classCode, fileCode) {
  return `import 'package:get/get.dart';

class ${classCode}Controller extends GetxController {
  ${classCode}Controller();

  _initData() {
    update(["${fileCode}"]);
  }

  void onTap() {}

  // @override
  // void onInit() {
  //   super.onInit();
  // }

  @override
  void onReady() {
    super.onReady();
    _initData();
  }

  // @override
  // void onClose() {
  //   super.onClose();
  // }
}
`;
}

function generateViewCode(classCode, fileCode) {
  return `import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'index.dart';

class ${classCode}Page extends GetView<${classCode}Controller> {
  const ${classCode}Page({super.key});

  // 主视图
  Widget _buildView() {
    return const Center(
      child: Text("${classCode}Page"),
    );
  }

  @override
  Widget build(BuildContext context) {
    return GetBuilder<${classCode}Controller>(
      init: ${classCode}Controller(),
      id: "${fileCode}",
      builder: (_) {
        return Scaffold(
          appBar: AppBar(title: const Text("${fileCode}")),
          body: SafeArea(
            child: _buildView(),
          ),
        );
      },
    );
  }
}
`;
}

function updatePagesIndex(saveDir, fileCode, classCode) {
  const indexPath = path.join(process.cwd(), "lib/pages/index.dart");
  const pagesDir = path.join(process.cwd(), "lib/pages");
  const relativePath = path.relative(pagesDir, saveDir);
  const exportPath = relativePath ? `${relativePath}/${fileCode}` : fileCode;
  const exportLine = `export '${exportPath}/index.dart';\n`;

  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, "utf8");
    if (!content.includes(exportLine.trim())) {
      fs.appendFileSync(indexPath, exportLine, "utf8");
    }
  } else {
    writeFile(indexPath, exportLine);
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error("用法: node create-page.js <保存目录> <业务名称>");
    process.exit(1);
  }

  const saveDir = path.resolve(args[0]);
  let businessName = args[1];

  console.log(`saveDir: ${saveDir}`);
  console.log(`businessName: ${businessName}`);

  if (hasChinese(businessName)) {
    console.log(`检测到中文，正在翻译: ${businessName}`);
    businessName = await translateToEnglish(businessName);
    console.log(`翻译结果: ${businessName}`);
  }

  const { fileCode, classCode } = generateCode(businessName);
  const pageDir = path.join(saveDir, fileCode);
  const widgetDir = path.join(pageDir, "widget");

  createDirectory(widgetDir);

  writeFile(path.join(pageDir, "index.dart"), generateIndexCode(fileCode));

  writeFile(
    path.join(pageDir, "controller.dart"),
    generateControllerCode(classCode, fileCode)
  );

  writeFile(
    path.join(pageDir, "view.dart"),
    generateViewCode(classCode, fileCode)
  );

  updatePagesIndex(saveDir, fileCode, classCode);

  console.log(`页面创建成功: ${fileCode}`);
}

main();
