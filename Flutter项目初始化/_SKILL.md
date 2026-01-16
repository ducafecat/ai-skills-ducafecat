---
name: Flutter项目初始化
description: 用猫哥的 ducafe_ui_core + getx 初始化一个规范的 flutter 项目。
---

# Flutter项目初始化

## 安装依赖包

```shell
flutter pub add get
flutter pub add ducafe_ui_core
```

## 1 创建业务 index 页面

- 使用 skill 在 lib/pages 目录下创建业务 首页，业务代码 index。

- 没有 lib/pages 目录自动创建。

## 2 创建全局 Global 模块

文件位置 lib/global.dart

```dart
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
```

## 3 创建 common 通用模块

文件位置 lib/common/

### 目录结构

```text
lib/common/
├── api/              # API 接口
│   └── index.dart
├── components/       # 通用组件
│   └── index.dart
├── extension/        # 扩展方法
│   └── index.dart
├── i18n/             # 国际化
│   └── index.dart
├── models/           # 数据模型
│   └── index.dart
├── routers/          # 路由配置
│   ├── index.dart
│   ├── names.dart
│   └── pages.dart
├── services/         # 服务层
│   └── index.dart
├── style/            # 样式
│   └── index.dart
├── utils/            # 工具类
│   └── index.dart
├── values/           # 常量值
│   ├── index.dart
│   ├── constants.dart
│   ├── images.dart
│   └── svgs.dart
├── widgets/          # 通用小部件
│   └── index.dart
└── index.dart        # 统一导出
```

### 文件规则

#### lib/common/index.dart

```dart
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
```

#### lib/common/routers/names.dart

```dart
class RouteNames {
  static const main = '/';
}
```

#### lib/common/routers/pages.dart

```dart
class RoutePages {
  // 列表
  // static List<GetPage> list = [];
}
```

#### lib/common/routers/index.dart

```dart
library;

export 'names.dart';
export 'pages.dart';
```

#### lib/common/values/constants.dart

```dart
/// 常量
class Constants {
  // 服务 api
  static const apiUrl = 'https://api.example.com';
}
```

#### lib/common/values/images.dart

```dart
/// 图片 assets
class AssetsImages {
}
```

#### lib/common/values/svgs.dart

```dart
/// svgs assets
class AssetsSvgs {
}
```

#### lib/common/values/index.dart

```dart
library;

export 'constants.dart';
export 'images.dart';
export 'svgs.dart';
```

#### 其他模块 index.dart 模板

- api
- components
- extension
- i18n/
- models
- services
- style
- utils
- widgets

这些目录下的 index.dart 统一使用：

```dart
library;

// export './xxxx.dart';
```

## 重写 main.dart

lib/main.dart

```dart
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
```
