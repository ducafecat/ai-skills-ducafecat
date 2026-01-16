# Flutter创建页面组手

Flutter 项目中创建页面的 Node.js 脚本工具。

## 使用方法

```bash
node create-page.js <保存目录> <业务名称>
```

或使用 npm 命令：

```bash
npm run create-page -- <保存目录> <业务名称>
```

## 参数说明

- `保存目录`: Flutter 项目根目录路径
- `业务名称`: 页面业务名称（支持中文自动翻译，如：我的页面 -> My Page）

## 示例

```bash
node create-page.js /path/to/flutter/project "我的页面"
```

## 生成结构

脚本会在 `lib/pages/<业务代码>/` 目录下创建：

- `widget/` - 业务组件目录
- `view.dart` - 视图代码
- `controller.dart` - 控制器代码
- `index.dart` - 导出文件

同时会自动更新 `lib/pages/index.dart` 文件。

## 命名规则

- 中文自动翻译成英文
- 文件名: `my_page` (snake_case)
- 类名: `MyPage` (PascalCase)
- 变量名: `myPage` (camelCase)
- 接口名: `IMyPage` (I + PascalCase)
