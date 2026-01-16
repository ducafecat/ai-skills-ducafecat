#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const targetDir = process.cwd();

// 创建目录
function mkdirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 写入文件
function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  mkdirSync(dir);
  fs.writeFileSync(filePath, content.trim() + "\n");
  console.log(`✓ ${filePath}`);
}

// 安装依赖
function installDeps() {
  console.log("📦 安装依赖包...");
  execSync("flutter pub add get", { cwd: targetDir, stdio: "inherit" });
  execSync("flutter pub add ducafe_ui_core", {
    cwd: targetDir,
    stdio: "inherit",
  });
}

// 创建 index 页面
function createIndexPage() {
  const pagesDir = path.join(targetDir, "lib/pages");

  writeFile(
    path.join(pagesDir, "index/controller.dart"),
    `
import 'package:get/get.dart';

class IndexController extends GetxController {}
`
  );

  writeFile(
    path.join(pagesDir, "index/view.dart"),
    `
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'controller.dart';

class IndexPage extends GetView<IndexController> {
  const IndexPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: Text('Index')),
    );
  }
}
`
  );

  writeFile(
    path.join(pagesDir, "index/index.dart"),
    `
library;

export 'controller.dart';
export 'view.dart';
`
  );

  writeFile(
    path.join(pagesDir, "index.dart"),
    `
library;

export 'index/index.dart';
`
  );
}

// 创建 Global
function createGlobal() {
  writeFile(
    path.join(targetDir, "lib/global.dart"),
    `
import 'package:flutter/material.dart';

class Global {
  static Future<void> init() async {
    // 插件初始化
    // WidgetsFlutterBinding.ensureInitialized();

    // // 工具类
    // await Storage().init();

    // // 提示框
    // Loading();

    // // 加载服务
    // Get.put<ConfigService>(ConfigService()); // 配置
    // Get.put<WPHttpService>(WPHttpService()); // 网络请求
    // Get.put<UserService>(UserService()); // 用户
    // Get.put<CartService>(CartService()); // 购物车

    // // 初始化配置
    // await ConfigService.to.init();
  }
}
`
  );
}

// 创建 common 模块
function createCommon() {
  const commonDir = path.join(targetDir, "lib/common");

  // routers
  writeFile(
    path.join(commonDir, "routers/names.dart"),
    `
class RouteNames {
  static const main = '/';
}
`
  );

  writeFile(
    path.join(commonDir, "routers/pages.dart"),
    `
class RoutePages {
  // 列表
  // static List<GetPage> list = [];
}
`
  );

  writeFile(
    path.join(commonDir, "routers/index.dart"),
    `
library;

export 'names.dart';
export 'pages.dart';
`
  );

  // values
  writeFile(
    path.join(commonDir, "values/constants.dart"),
    `
/// 常量
class Constants {
  // 服务 api
  static const apiUrl = 'https://api.example.com';
}
`
  );

  writeFile(
    path.join(commonDir, "values/images.dart"),
    `
/// 图片 assets
class AssetsImages {
}
`
  );

  writeFile(
    path.join(commonDir, "values/svgs.dart"),
    `
/// svgs assets
class AssetsSvgs {
}
`
  );

  writeFile(
    path.join(commonDir, "values/index.dart"),
    `
library;

export 'constants.dart';
export 'images.dart';
export 'svgs.dart';
`
  );

  // 其他模块
  const modules = [
    "api",
    "components",
    "extension",
    "i18n",
    "models",
    "services",
    "style",
    "utils",
    "widgets",
  ];
  modules.forEach((mod) => {
    writeFile(
      path.join(commonDir, `${mod}/index.dart`),
      `
library;

// export './xxxx.dart';
`
    );
  });

  // common/index.dart
  writeFile(
    path.join(commonDir, "index.dart"),
    `
library;

export 'api/index.dart';
export 'components/index.dart';
export 'extension/index.dart';
export 'i18n/index.dart';
export 'models/index.dart';
export 'routers/index.dart';
export 'services/index.dart';
export 'style/index.dart';
export 'utils/index.dart';
export 'values/index.dart';
export 'widgets/index.dart';
`
  );
}

// 重写 main.dart
function createMain() {
  writeFile(
    path.join(targetDir, "lib/main.dart"),
    `
import 'package:ducafe_ui_core/ducafe_ui_core.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'pages/index.dart';
import 'global.dart';

void main() async {
  await Global.init();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: const Size(414, 896), // 设计稿中设备的尺寸(单位随意,建议dp,但在使用过程中必须保持一致)
      // splitScreenMode: false, // 支持分屏尺寸
      // minTextAdapt: false, // 是否根据宽度/高度中的最小值适配文字
      builder: (context, child) {
        return GetMaterialApp(
          title: 'Flutter Demo',
          theme: ThemeData(primarySwatch: Colors.blue),
          home: const IndexPage(),
        );
      },
    );
  }
}
`
  );
}

// 主函数
function main() {
  console.log("🚀 Flutter 项目初始化开始...\n");

  installDeps();
  createIndexPage();
  createGlobal();
  createCommon();
  createMain();

  console.log("\n✅ 初始化完成!");
}

main();
