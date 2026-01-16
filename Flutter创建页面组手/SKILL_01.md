---
name: "Flutter创建页面组手"
description: "Flutter 项目中创建页面"
---

# Flutter创建页面组手

按规则生成空页面脚手架代码。

## 读取变量

- 读取 [保存目录]
- 读取 [业务名称]
- 通过 [业务名称] 生成 [业务代码] (我的页面 -> my_page)
- [业务代码] 使用规则举例如下:
  - 文件名 my_page
  - 类名 MyPage
  - 变量名 myPage
  - 接口名 IMyPage

## 约束规则

页面必须包含在 lib/pages 目录下面

## 页面目录

如果 [业务代码] 时 my_page，目录结构如下:

- [保存目录]
  - my_page             // 业务目录
    - widget            // 业务组建
    - view.dart         // 视图代码
    - controller.dart   // 控制器代码
    - index.dart        // index 导包代码

## 页面代码

如果 [业务代码] 时 my_page，代码如下:

- index.dart        // index 导包代码

```dart
library;

export './controller.dart';
export './view.dart';
```

- controller.dart   // 控制器代码

```dart
import 'package:get/get.dart';

class MyPageController extends GetxController {
  MyPageController();

  _initData() {
    update(["my_page"]);
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
```

- view.dart         // 视图代码

```dart
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'index.dart';

class MyPagePage extends GetView<MyPageController> {
  const MyPagePage({super.key});

  // 主视图
  Widget _buildView() {
    return const Center(
      child: Text("MyPagePage"),
    );
  }

  @override
  Widget build(BuildContext context) {
    return GetBuilder<MyPageController>(
      init: MyPageController(),
      id: "my_page",
      builder: (_) {
        return Scaffold(
          appBar: AppBar(title: const Text("my_page")),
          body: SafeArea(
            child: _buildView(),
          ),
        );
      },
    );
  }
}
```

## 保存总导包 index

文件 lib/pages/index.dart

追加在这个文件中即可
