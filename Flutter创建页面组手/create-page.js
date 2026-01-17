#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const https = require("https");

// 检测输入中是否包含中文字符
function hasChinese(str) {
  return /[\u4e00-\u9fa5]/.test(str);
}

// 使用 Google 翻译将中文转换为英文，失败时返回原文
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

// 转为 snake_case，适用于文件/目录命名
function toSnakeCase(str) {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "")
    .replace(/[^\w]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

// 转为 PascalCase，适用于类名
function toPascalCase(str) {
  const snake = toSnakeCase(str);
  return snake
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

// 转为 camelCase，适用于变量名
function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

// 生成模板中使用的命名形式
function generateCode(businessName) {
  const fileCode = toSnakeCase(businessName);
  const classCode = toPascalCase(businessName);
  const varCode = toCamelCase(businessName);
  const interfaceCode = "I" + classCode;

  return { fileCode, classCode, varCode, interfaceCode };
}

// 写文件前确保目录存在
function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 写文件并自动创建父级目录
function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  createDirectory(dir);
  fs.writeFileSync(filePath, content, "utf8");
}

// 生成 index.dart 的导出内容
function generateIndexCode(fileCode) {
  return `library;

export './controller.dart';
export './view.dart';
`;
}

// 生成 controller 模板
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

// 生成 view 模板
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

// 追加导出到 lib/pages/index.dart，便于统一引用
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

// CLI 入口：创建页面文件并更新导出
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
